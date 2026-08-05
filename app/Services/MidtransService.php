<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;

class MidtransService
{
    public function __construct(private readonly OrderService $orders) {}

    /** @var list<string> */
    public const CHANNELS = [
        'bca_va', 'echannel', 'bni_va', 'bri_va', 'permata_va',
        'gopay', 'shopeepay', 'other_qris', 'credit_card',
    ];

    /**
     * @return array{token: string, redirect_url: string}
     */
    public function createPayment(Order $order, ?string $channel = null): array
    {
        if ($order->payment_status === Order::PAYMENT_PAID) {
            throw ValidationException::withMessages(['payment' => 'This order has already been paid.']);
        }

        if ($order->stock_released_at || $order->payment_expires_at?->isPast()) {
            throw ValidationException::withMessages(['payment' => 'The payment deadline has passed.']);
        }

        if ($order->payment_url && $order->payment_reference && $order->payment_expires_at?->isFuture()) {
            return [
                'token' => $order->payment_reference,
                'redirect_url' => $order->payment_url,
            ];
        }

        $serverKey = (string) config('services.midtrans.server_key');

        if ($serverKey === '') {
            throw ValidationException::withMessages([
                'payment' => 'Midtrans has not been configured by the admin.',
            ]);
        }

        $order->loadMissing('items');
        $address = $order->shipping_address;
        $items = $order->items->map(fn ($item) => [
            'id' => $item->sku ?: (string) $item->id,
            'price' => (int) round((float) $item->price),
            'quantity' => $item->quantity,
            'name' => mb_substr($item->product_name, 0, 50),
        ])->values()->all();

        if ((float) $order->shipping_cost > 0) {
            $items[] = [
                'id' => 'SHIPPING',
                'price' => (int) round((float) $order->shipping_cost),
                'quantity' => 1,
                'name' => 'Shipping',
            ];
        }

        if ((float) $order->discount_amount > 0) {
            $items[] = [
                'id' => 'DISCOUNT',
                'price' => -1 * (int) round((float) $order->discount_amount),
                'quantity' => 1,
                'name' => 'Promo discount',
            ];
        }

        $payload = [
            'transaction_details' => [
                'order_id' => $order->order_number,
                'gross_amount' => (int) round((float) $order->total_amount),
            ],
            'item_details' => $items,
            'expiry' => [
                'start_time' => now()->format('Y-m-d H:i:s O'),
                'unit' => 'minute',
                'duration' => 60,
            ],
            'customer_details' => [
                'first_name' => $address['name'],
                'email' => $order->customer_email,
                'phone' => $order->customer_phone,
                'billing_address' => [
                    'first_name' => $address['name'],
                    'email' => $order->customer_email,
                    'phone' => $order->customer_phone,
                    'address' => $address['address'],
                    'city' => $address['city'],
                    'postal_code' => $address['postal_code'],
                    'country_code' => 'IDN',
                ],
            ],
        ];

        if ($channel && in_array($channel, self::CHANNELS, true)) {
            $payload['enabled_payments'] = [$channel];
        }

        $snapUrl = (string) config('services.midtrans.snap_url');

        if ($snapUrl === '') {
            throw ValidationException::withMessages([
                'payment' => 'Midtrans Snap URL is not configured.',
            ]);
        }

        $response = Http::withBasicAuth($serverKey, '')
            ->acceptJson()
            ->post($snapUrl, $payload);

        if ($response->failed()) {
            throw ValidationException::withMessages([
                'payment' => $response->json('error_messages.0')
                    ?? 'Midtrans rejected the payment request. Check that your keys match the production/sandbox environment.',
            ]);
        }

        $response = $response->json();

        $token = $response['token'] ?? null;
        $redirectUrl = $response['redirect_url'] ?? null;

        if (! is_string($token) || $token === '' || ! is_string($redirectUrl) || $redirectUrl === '') {
            throw ValidationException::withMessages(['payment' => 'Midtrans did not return a payment token.']);
        }

        $order->forceFill([
            'payment_reference' => $token,
            'payment_url' => $redirectUrl,
        ])->save();

        return [
            'token' => $token,
            'redirect_url' => $redirectUrl,
        ];
    }

    public function preferredChannel(Order $order): ?string
    {
        $channel = $order->payment_channel;

        return is_string($channel) && in_array($channel, self::CHANNELS, true)
            ? $channel
            : null;
    }

    /**
     * @return array{type: string, bank?: string, number?: string, bill_key?: string, biller_code?: string, url?: string}|null
     */
    public function pendingPaymentInstructions(Order $order): ?array
    {
        if ($order->payment_method !== Order::PAYMENT_METHOD_MIDTRANS
            || $order->payment_status !== Order::PAYMENT_UNPAID) {
            return null;
        }

        $payload = $this->fetchStatusPayload($order);

        if ($payload === null) {
            return null;
        }

        $status = $payload['transaction_status'] ?? '';

        if (! in_array($status, ['pending', 'capture'], true)) {
            return null;
        }

        return $this->paymentInstructionsFromPayload($payload);
    }

    public function syncStatus(Order $order): Order
    {
        if ($order->payment_method !== Order::PAYMENT_METHOD_MIDTRANS || $order->payment_status === Order::PAYMENT_PAID) {
            return $order;
        }

        $payload = $this->fetchStatusPayload($order);

        if ($payload === null) {
            return $order;
        }

        if (isset($payload['gross_amount']) && abs((float) $payload['gross_amount'] - (float) $order->total_amount) > 0.01) {
            return $order;
        }

        return $this->applyStatus($order, $payload);
    }

    /**
     * @return array<string, mixed>|null
     */
    private function fetchStatusPayload(Order $order): ?array
    {
        $serverKey = (string) config('services.midtrans.server_key');

        if ($serverKey === '' || ! $order->payment_url) {
            return null;
        }

        try {
            $payload = Http::withBasicAuth($serverKey, '')
                ->acceptJson()
                ->get(rtrim((string) config('services.midtrans.status_url'), '/').'/'.rawurlencode($order->order_number).'/status')
                ->throw()
                ->json();
        } catch (\Throwable $exception) {
            report($exception);

            return null;
        }

        return is_array($payload) ? $payload : null;
    }

    public function handleNotification(array $payload): Order
    {
        $serverKey = (string) config('services.midtrans.server_key');
        $signature = hash('sha512',
            ($payload['order_id'] ?? '').
            ($payload['status_code'] ?? '').
            ($payload['gross_amount'] ?? '').
            $serverKey
        );

        if ($serverKey === '' || ! hash_equals($signature, (string) ($payload['signature_key'] ?? ''))) {
            abort(403, 'Invalid Midtrans signature.');
        }

        $order = Order::where('order_number', $payload['order_id'] ?? null)->firstOrFail();

        abort_unless($order->payment_method === Order::PAYMENT_METHOD_MIDTRANS, 422, 'Invalid payment method.');

        if (abs((float) ($payload['gross_amount'] ?? 0) - (float) $order->total_amount) > 0.01) {
            abort(422, 'Invalid payment amount.');
        }

        return $this->applyStatus($order, $payload);
    }

    private function applyStatus(Order $order, array $payload): Order
    {
        if ($channel = $this->channelCodeFromPayload($payload)) {
            $order->forceFill(['payment_channel' => $channel])->save();
        }

        $status = $payload['transaction_status'] ?? '';
        $fraud = $payload['fraud_status'] ?? null;

        if ($status === 'settlement' || ($status === 'capture' && $fraud === 'accept')) {
            return $this->orders->markPaid($order->fresh() ?? $order);
        }

        if (in_array($status, ['expire', 'cancel'], true)) {
            return $this->orders->releaseStock($order);
        }

        if (in_array($status, ['deny', 'failure'], true)) {
            return DB::transaction(function () use ($order) {
                $locked = Order::lockForUpdate()->findOrFail($order->id);

                if (! in_array($locked->payment_status, [Order::PAYMENT_PAID, Order::PAYMENT_REFUNDED], true)) {
                    $locked->update(['payment_status' => Order::PAYMENT_FAILED]);
                    DB::afterCommit(fn () => $locked->fresh()?->notifyCustomer(
                        'Payment Failed — '.$locked->order_number,
                        [
                            'Payment for order '.$locked->order_number.' could not be processed.',
                            'You can still retry payment from the order page before the deadline.',
                        ],
                        $locked->customerOrderUrl(),
                    ));
                }

                return $locked;
            });
        }

        if (in_array($status, ['refund', 'partial_refund'], true)) {
            return DB::transaction(function () use ($order) {
                $locked = Order::lockForUpdate()->findOrFail($order->id);

                if ($locked->payment_status === Order::PAYMENT_PAID) {
                    $locked->update(['payment_status' => Order::PAYMENT_REFUNDED]);
                    DB::afterCommit(fn () => $locked->fresh()?->notifyCustomer(
                        'Payment Refunded — '.$locked->order_number,
                        [
                            'Payment for order '.$locked->order_number.' has been refunded.',
                            'Funds will be returned via your original payment method.',
                        ],
                        $locked->customerOrderUrl(),
                    ));
                }

                return $locked;
            });
        }

        return $order->fresh();
    }

    public static function channelPreferenceLabel(?string $channel): ?string
    {
        if (! is_string($channel) || $channel === '') {
            return null;
        }

        return match ($channel) {
            'gopay' => 'GoPay',
            'shopeepay' => 'ShopeePay',
            'other_qris', 'qris' => 'QRIS',
            'credit_card' => 'Credit/Debit Card',
            'echannel' => 'Mandiri Bill',
            'bca_va' => 'Transfer VA BCA',
            'bni_va' => 'Transfer VA BNI',
            'bri_va' => 'Transfer VA BRI',
            'permata_va' => 'Transfer VA Permata',
            default => null,
        };
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return array{type: string, bank?: string, number?: string, bill_key?: string, biller_code?: string, url?: string}|null
     */
    private function paymentInstructionsFromPayload(array $payload): ?array
    {
        if (! empty($payload['va_numbers'][0]['va_number'])) {
            $bank = $payload['va_numbers'][0]['bank'] ?? '';

            return [
                'type' => 'va',
                'bank' => is_string($bank) && $bank !== '' ? strtoupper($bank) : 'Bank',
                'number' => (string) $payload['va_numbers'][0]['va_number'],
            ];
        }

        if (! empty($payload['permata_va_number'])) {
            return [
                'type' => 'va',
                'bank' => 'Permata',
                'number' => (string) $payload['permata_va_number'],
            ];
        }

        if (! empty($payload['bill_key']) && ! empty($payload['biller_code'])) {
            return [
                'type' => 'echannel',
                'bill_key' => (string) $payload['bill_key'],
                'biller_code' => (string) $payload['biller_code'],
            ];
        }

        foreach ($payload['actions'] ?? [] as $action) {
            if (! is_array($action)) {
                continue;
            }

            $name = $action['name'] ?? '';
            $url = $action['url'] ?? '';

            if (in_array($name, ['generate-qr-code', 'deeplink-redirect'], true) && is_string($url) && $url !== '') {
                return [
                    'type' => $name === 'generate-qr-code' ? 'qris' : 'deeplink',
                    'url' => $url,
                ];
            }
        }

        return null;
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function channelCodeFromPayload(array $payload): ?string
    {
        $type = $payload['payment_type'] ?? null;

        if (! is_string($type) || $type === '') {
            return null;
        }

        if (in_array($type, self::CHANNELS, true)) {
            return $type;
        }

        if ($type === 'bank_transfer') {
            $bank = $payload['va_numbers'][0]['bank'] ?? null;

            return match (is_string($bank) ? strtolower($bank) : '') {
                'bca' => 'bca_va',
                'bni' => 'bni_va',
                'bri' => 'bri_va',
                'permata' => 'permata_va',
                default => null,
            };
        }

        if ($type === 'qris') {
            return 'other_qris';
        }

        return null;
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function channelLabel(array $payload): ?string
    {
        $type = $payload['payment_type'] ?? null;

        if (! is_string($type) || $type === '') {
            return null;
        }

        return self::channelPreferenceLabel($type) ?? match ($type) {
            'bank_transfer' => 'Transfer VA '.$this->vaBank($payload),
            'cstore' => strtoupper((string) ($payload['store'] ?? 'Convenience Store')),
            'akulaku' => 'Akulaku',
            'kredivo' => 'Kredivo',
            default => ucfirst(str_replace('_', ' ', $type)),
        };
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function vaBank(array $payload): string
    {
        if (! empty($payload['permata_va_number'])) {
            return 'Permata';
        }

        $bank = $payload['va_numbers'][0]['bank'] ?? null;

        return is_string($bank) && $bank !== '' ? strtoupper($bank) : 'Bank';
    }
}
