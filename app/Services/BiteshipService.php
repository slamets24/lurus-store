<?php

namespace App\Services;

use App\Models\Order;
use App\Models\StoreContentSetting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;

class BiteshipService
{
    /**
     * @return list<array{id: string, name: string, province: string, city: string, district: string, postal_code: string}>
     */
    public function searchAreas(string $input): array
    {
        $query = trim($input);

        if (mb_strlen($query) < 3 || ! StoreContentSetting::shippingSettings()['biteship_enabled']) {
            return [];
        }

        // ponytail: 1h cache to cut Maps API Bitepoints; shorten if stale areas become an issue
        return Cache::remember(
            'biteship.areas.'.md5(mb_strtolower($query)),
            now()->addHour(),
            fn () => $this->fetchAreas($query),
        );
    }

    public function ratesForCart(iterable $cartItems, string $destinationPostalCode, ?float $subtotal = null): array
    {
        $items = collect($cartItems)->values();
        $subtotal ??= $this->subtotal($items);
        $settings = StoreContentSetting::shippingSettings();

        if (! $settings['biteship_enabled']) {
            return $this->applyShippingSubsidy([$this->fallbackRate()], (float) $subtotal);
        }

        if ($settings['couriers'] === []) {
            return $this->applyShippingSubsidy([$this->fallbackRate()], (float) $subtotal);
        }

        if (config('services.biteship.fake_rates')) {
            return $this->applyShippingSubsidy($this->fakeRates($settings['couriers']), (float) $subtotal);
        }

        if (! $this->configured()) {
            return $this->applyShippingSubsidy([$this->fallbackRate()], (float) $subtotal);
        }

        $response = Http::withHeaders(['Authorization' => (string) config('services.biteship.api_key')])
            ->acceptJson()
            ->timeout(10)
            ->post(rtrim((string) config('services.biteship.base_url'), '/').'/v1/rates/couriers', [
                'origin_postal_code' => (int) config('services.biteship.origin_postal_code'),
                'destination_postal_code' => (int) $destinationPostalCode,
                'couriers' => implode(',', $settings['couriers']),
                'items' => $this->items($items),
            ]);

        if (! $response->successful()) {
            $detail = $response->json('error') ?? $response->json('message');
            throw ValidationException::withMessages([
                'shipping_courier' => is_string($detail) && $detail !== ''
                    ? $detail
                    : 'Failed to fetch Biteship shipping rates. Please check rates again.',
            ]);
        }

        $rates = collect($response->json('pricing', []))
            ->map(fn ($rate) => is_array($rate) ? $this->normalize($rate) : null)
            ->filter(fn (?array $rate) => $rate !== null
                && in_array($rate['courier_code'], $settings['couriers'], true))
            ->sortBy('price')
            ->values()
            ->all();

        if ($rates === []) {
            throw ValidationException::withMessages([
                'shipping_courier' => 'No couriers available for this postal code.',
            ]);
        }

        return $this->applyShippingSubsidy($rates, (float) $subtotal);
    }

    /**
     * Customer pays max(0, rate - subsidy). null subsidy = full cover.
     * Store still pays Biteship the real courier rate on shipment create.
     *
     * @param  list<array{courier_code: string, courier_name: string, courier_service_code: string, courier_service_name: string, duration: string, price: int}>  $rates
     * @return list<array{courier_code: string, courier_name: string, courier_service_code: string, courier_service_name: string, duration: string, price: int, original_price?: int}>
     */
    private function applyShippingSubsidy(array $rates, float $subtotal): array
    {
        if (! StoreContentSetting::qualifiesForFreeShipping($subtotal)) {
            return $rates;
        }

        $cap = StoreContentSetting::shippingSettings()['free_shipping_max_subsidy'];
        $subsidy = $cap === null ? PHP_INT_MAX : max(0, $cap);

        return array_map(function (array $rate) use ($subsidy) {
            $original = (int) $rate['price'];
            $rate['original_price'] = $original;
            $rate['price'] = max(0, $original - $subsidy);

            return $rate;
        }, $rates);
    }

    public function selectedRateForCart(
        iterable $cartItems,
        string $destinationPostalCode,
        ?string $courierCode,
        ?string $serviceCode,
        ?float $subtotal = null,
    ): array {
        $rates = $this->ratesForCart($cartItems, $destinationPostalCode, $subtotal);

        if ($courierCode && $serviceCode) {
            foreach ($rates as $rate) {
                if ($rate['courier_code'] === $courierCode && $rate['courier_service_code'] === $serviceCode) {
                    return $rate;
                }
            }

            throw ValidationException::withMessages([
                'shipping_courier' => 'Selected shipping option is unavailable. Please check rates again.',
            ]);
        }

        return $rates[0];
    }

    /**
     * @param  array{courier_code?: string, courier_service_code?: string, collection_method?: string}  $overrides
     */
    public function createShipment(Order $order, array $overrides = []): Order
    {
        if ($order->payment_status !== Order::PAYMENT_PAID) {
            throw ValidationException::withMessages(['shipping' => 'This order has not been paid yet.']);
        }

        if ($order->biteship_order_id) {
            throw ValidationException::withMessages(['shipping' => 'Biteship shipment has already been created.']);
        }

        $courier = $order->shipping_address['courier'] ?? [];
        $courierCode = (string) ($overrides['courier_code'] ?? $courier['courier_code'] ?? '');
        $serviceCode = (string) ($overrides['courier_service_code'] ?? $courier['courier_service_code'] ?? '');

        if ($courierCode === '' || $serviceCode === '' || in_array($courierCode, ['free', 'flat'], true)) {
            throw ValidationException::withMessages([
                'shipping' => 'Select a valid Biteship courier (not free/flat). Enter a courier override or add a tracking number manually.',
            ]);
        }

        // ponytail: local sandbox without Bitepoints — real create-order needs API balance
        if (config('services.biteship.fake_rates')) {
            return $this->createLocalShipment($order, $courierCode, $serviceCode, $overrides);
        }

        if (! $this->shipmentConfigured()) {
            throw ValidationException::withMessages([
                'shipping' => 'Biteship origin is incomplete (API key, postal code, phone, address).',
            ]);
        }

        $order->loadMissing('items');
        $address = $order->shipping_address;
        $payload = [
            'shipper_contact_name' => (string) config('services.biteship.origin_contact_name'),
            'shipper_contact_phone' => (string) config('services.biteship.origin_contact_phone'),
            'shipper_organization' => config('app.name', 'Lurus Store'),
            'origin_contact_name' => (string) config('services.biteship.origin_contact_name'),
            'origin_contact_phone' => (string) config('services.biteship.origin_contact_phone'),
            'origin_address' => (string) config('services.biteship.origin_address'),
            'origin_postal_code' => (int) config('services.biteship.origin_postal_code'),
            'origin_collection_method' => ($overrides['collection_method'] ?? 'pickup') === 'drop_off' ? 'drop_off' : 'pickup',
            'destination_contact_name' => (string) ($address['name'] ?? ''),
            'destination_contact_phone' => (string) ($order->customer_phone ?: ($address['phone'] ?? '')),
            'destination_contact_email' => (string) ($order->customer_email ?: ($address['email'] ?? '')),
            'destination_address' => trim(($address['address'] ?? '').', '.($address['city'] ?? '')),
            'destination_postal_code' => (int) ($address['postal_code'] ?? 0),
            'courier_company' => $courierCode,
            'courier_type' => $serviceCode,
            'delivery_type' => 'now',
            'reference_id' => $order->order_number,
            'order_note' => (string) ($order->notes ?? ''),
            'items' => $order->items->map(fn ($item) => [
                'name' => mb_substr((string) $item->product_name, 0, 50),
                'description' => trim(($item->size ? 'Size '.$item->size : '').($item->color ? ' '.$item->color : '')),
                'category' => 'fashion',
                'sku' => $item->sku,
                'value' => (int) round((float) $item->price),
                'quantity' => (int) $item->quantity,
                'weight' => max(1, (int) config('services.biteship.item_weight_grams')),
                'length' => max(1, (int) config('services.biteship.item_length_cm')),
                'width' => max(1, (int) config('services.biteship.item_width_cm')),
                'height' => max(1, (int) config('services.biteship.item_height_cm')),
            ])->values()->all(),
        ];

        $response = Http::withHeaders(['Authorization' => (string) config('services.biteship.api_key')])
            ->acceptJson()
            ->timeout(20)
            ->post(rtrim((string) config('services.biteship.base_url'), '/').'/v1/orders', $payload);

        if (! $response->successful()) {
            $message = $response->json('error')
                ?? $response->json('message')
                ?? 'Failed to create Biteship shipment.';

            throw ValidationException::withMessages(['shipping' => is_string($message) ? $message : 'Failed to create Biteship shipment.']);
        }

        $data = $response->json();
        $biteshipId = (string) ($data['id'] ?? '');
        $waybill = (string) ($data['courier']['waybill_id'] ?? '');
        $status = (string) ($data['status'] ?? 'confirmed');

        if ($biteshipId === '') {
            throw ValidationException::withMessages(['shipping' => 'Biteship did not return an order id.']);
        }

        $order->forceFill([
            'biteship_order_id' => $biteshipId,
            'waybill_id' => $waybill !== '' ? $waybill : $order->waybill_id,
            'shipping_status' => $status,
        ])->save();

        $this->appendShippingHistory($order, $status !== '' ? $status : 'confirmed');

        if ($waybill !== '' && $order->status !== Order::STATUS_SHIPPED && $order->status !== Order::STATUS_DELIVERED) {
            $this->markShipped($order, $waybill);
        }

        return $order->fresh();
    }

    public function saveManualWaybill(Order $order, string $waybillId): Order
    {
        if ($order->payment_status !== Order::PAYMENT_PAID) {
            throw ValidationException::withMessages(['shipping' => 'This order has not been paid yet.']);
        }

        $waybillId = trim($waybillId);
        if ($waybillId === '') {
            throw ValidationException::withMessages(['waybill_id' => 'Tracking number is required.']);
        }

        $order->forceFill([
            'waybill_id' => $waybillId,
            'shipping_status' => $order->shipping_status ?: 'manual',
        ])->save();

        $this->appendShippingHistory($order, $order->shipping_status ?: 'manual', 'Tracking number recorded manually by the store.');

        if (! in_array($order->status, [Order::STATUS_SHIPPED, Order::STATUS_DELIVERED], true)) {
            $this->markShipped($order, $waybillId);
        }

        return $order->fresh();
    }

    public function handleWebhook(array $payload): ?Order
    {
        $biteshipId = (string) ($payload['order_id'] ?? $payload['id'] ?? '');
        $referenceId = (string) ($payload['reference_id'] ?? '');
        $status = (string) ($payload['status'] ?? '');
        $waybill = (string) ($payload['courier']['waybill_id'] ?? $payload['waybill_id'] ?? '');

        $order = null;
        if ($biteshipId !== '') {
            $order = Order::where('biteship_order_id', $biteshipId)->first();
        }
        if (! $order && $referenceId !== '') {
            $order = Order::where('order_number', $referenceId)->first();
        }

        if (! $order) {
            return null;
        }

        $updates = [];
        if ($status !== '') {
            $updates['shipping_status'] = $status;
        }
        if ($waybill !== '') {
            $updates['waybill_id'] = $waybill;
        }
        if ($updates !== []) {
            $order->forceFill($updates)->save();
        }

        if ($status !== '') {
            $note = (string) ($payload['note'] ?? $payload['history'][0]['note'] ?? '');
            $this->appendShippingHistory($order, $status, $note !== '' ? $note : null);
        }

        $mapped = $this->mapBiteshipStatus($status);
        if ($mapped === Order::STATUS_SHIPPED && ! in_array($order->status, [Order::STATUS_SHIPPED, Order::STATUS_DELIVERED], true)) {
            $this->markShipped($order, $order->waybill_id);
        } elseif ($mapped === Order::STATUS_DELIVERED && $order->status !== Order::STATUS_DELIVERED) {
            $this->markDelivered($order);
        }

        return $order->fresh();
    }

    public function assertWebhookSecret(?string $headerValue): void
    {
        $secret = (string) config('services.biteship.webhook_secret');
        if ($secret === '') {
            abort(503, 'Webhook secret is not configured.');
        }

        if (! hash_equals($secret, (string) $headerValue)) {
            abort(401, 'Invalid webhook secret.');
        }
    }

    /**
     * @param  array{collection_method?: string}  $overrides
     */
    private function createLocalShipment(Order $order, string $courierCode, string $serviceCode, array $overrides = []): Order
    {
        $address = $order->shipping_address ?? [];
        $courier = is_array($address['courier'] ?? null) ? $address['courier'] : [];
        $waybill = 'LOCAL-'.preg_replace('/\W+/', '', $order->order_number);

        $address['courier'] = array_merge($courier, [
            'courier_code' => $courierCode,
            'courier_name' => strtoupper($courierCode),
            'courier_service_code' => $serviceCode,
            'courier_service_name' => strtoupper($serviceCode),
            'routing_code' => ($overrides['collection_method'] ?? 'pickup') === 'drop_off' ? 'DROP' : 'PICK',
        ]);

        $order->forceFill([
            'shipping_address' => $address,
            'biteship_order_id' => 'local-'.$order->id,
            'waybill_id' => $waybill,
            'shipping_status' => 'confirmed',
        ])->save();

        $this->appendShippingHistory($order, 'confirmed', 'Tracking number created. Awaiting pickup.');
        $this->markShipped($order, $waybill);

        return $order->fresh();
    }

    public function appendShippingHistory(Order $order, string $status, ?string $note = null): void
    {
        $history = collect($order->shipping_history ?? []);
        $last = $history->last();
        if (is_array($last) && ($last['status'] ?? '') === $status) {
            return;
        }

        $history->push([
            'status' => $status,
            'note' => $note ?: $this->customerFacingNote($status),
            'updated_at' => now()->toIso8601String(),
        ]);

        $order->forceFill([
            'shipping_history' => $history->values()->all(),
            'shipping_status' => $status,
        ])->save();
    }

    public function customerFacingNote(string $status): string
    {
        return match ($status) {
            'confirmed', 'scheduled' => 'Tracking number created. Awaiting pickup.',
            'allocated' => 'Courier assigned. Awaiting pickup.',
            'picking_up' => 'Courier is heading to the pickup location.',
            'picked' => 'Package picked up by courier.',
            'in_transit' => 'Package in transit to destination.',
            'dropping_off' => 'Courier is out for delivery.',
            'on_hold' => 'Shipment temporarily on hold.',
            'delivered' => 'Package delivered.',
            'cancelled' => 'Shipment cancelled.',
            'returned', 'return_in_transit' => 'Package is being returned.',
            'rejected', 'courier_not_found', 'disposed' => 'Shipment issue. Please contact the store.',
            'manual' => 'Tracking number recorded manually by the store.',
            default => 'Shipping status updated.',
        };
    }

    private function markShipped(Order $order, ?string $waybill): void
    {
        $order->forceFill([
            'status' => Order::STATUS_SHIPPED,
            'shipped_at' => $order->shipped_at ?? now(),
            'waybill_id' => $waybill ?: $order->waybill_id,
        ])->save();

        $courierName = $order->shipping_address['courier']['courier_name']
            ?? $order->shipping_address['courier']['courier_code']
            ?? 'courier';

        $lines = [
            'Order '.$order->order_number.' has been shipped.',
            'Courier: '.$courierName.'.',
        ];
        if ($order->waybill_id) {
            $lines[] = 'Tracking number: '.$order->waybill_id;
        }

        $order->notifyCustomer(
            'Order Shipped — '.$order->order_number,
            $lines,
            $order->customerOrderUrl(),
        );
    }

    private function markDelivered(Order $order): void
    {
        $order->forceFill([
            'status' => Order::STATUS_DELIVERED,
            'delivered_at' => $order->delivered_at ?? now(),
            'shipped_at' => $order->shipped_at ?? now(),
        ])->save();

        if (! $order->testimonial_token) {
            $order->update(['testimonial_token' => hash('sha256', $order->testimonialAccessToken())]);
        }

        $order->notifyCustomer(
            'Order Delivered — '.$order->order_number,
            [
                'Order '.$order->order_number.' has been delivered.',
                'Thank you for shopping at '.config('app.name', 'Lurus Store').'.',
            ],
            $order->customerOrderUrl(),
        );
    }

    private function mapBiteshipStatus(string $status): ?string
    {
        return match ($status) {
            'picked', 'in_transit', 'dropping_off', 'on_hold' => Order::STATUS_SHIPPED,
            'delivered' => Order::STATUS_DELIVERED,
            default => null,
        };
    }

    /**
     * @return list<array{id: string, name: string, province: string, city: string, district: string, postal_code: string}>
     */
    private function fetchAreas(string $query): array
    {
        if (config('services.biteship.fake_rates')) {
            return $this->fakeAreas($query);
        }

        if ((string) config('services.biteship.api_key') === '') {
            return [];
        }

        $response = Http::withHeaders(['Authorization' => (string) config('services.biteship.api_key')])
            ->acceptJson()
            ->timeout(10)
            ->get(rtrim((string) config('services.biteship.base_url'), '/').'/v1/maps/areas', [
                'countries' => 'ID',
                'input' => $query,
                'type' => 'single',
            ]);

        if (! $response->successful()) {
            return [];
        }

        return collect($response->json('areas', []))
            ->filter(fn ($area) => is_array($area))
            ->map(fn (array $area) => [
                'id' => (string) ($area['id'] ?? ''),
                'name' => (string) ($area['name'] ?? ''),
                'province' => (string) ($area['administrative_division_level_1_name'] ?? ''),
                'city' => (string) ($area['administrative_division_level_2_name'] ?? ''),
                'district' => (string) ($area['administrative_division_level_3_name'] ?? ''),
                'postal_code' => (string) ($area['postal_code'] ?? ''),
            ])
            ->filter(fn (array $area) => $area['postal_code'] !== '' && $area['city'] !== '')
            ->values()
            ->all();
    }

    /**
     * @return list<array{id: string, name: string, province: string, city: string, district: string, postal_code: string}>
     */
    private function fakeAreas(string $query): array
    {
        $needle = mb_strtolower($query);

        return collect([
            [
                'id' => 'fake-bandung-40123',
                'name' => 'Coblong, Bandung, Jawa Barat. 40123',
                'province' => 'Jawa Barat',
                'city' => 'Bandung',
                'district' => 'Coblong',
                'postal_code' => '40123',
            ],
            [
                'id' => 'fake-jakarta-12250',
                'name' => 'Pesanggrahan, Jakarta Selatan, DKI Jakarta. 12250',
                'province' => 'DKI Jakarta',
                'city' => 'Jakarta Selatan',
                'district' => 'Pesanggrahan',
                'postal_code' => '12250',
            ],
        ])
            ->filter(fn (array $area) => str_contains(mb_strtolower($area['name']), $needle))
            ->values()
            ->all();
    }

    private function configured(): bool
    {
        return (string) config('services.biteship.api_key') !== ''
            && (string) config('services.biteship.origin_postal_code') !== '';
    }

    private function shipmentConfigured(): bool
    {
        return $this->configured()
            && (string) config('services.biteship.origin_contact_phone') !== ''
            && (string) config('services.biteship.origin_address') !== '';
    }

    private function items(iterable $cartItems): array
    {
        return collect($cartItems)->map(fn ($cartItem) => [
            'name' => mb_substr($cartItem->product->name, 0, 50),
            'value' => (int) round((float) $cartItem->product->price),
            'quantity' => (int) $cartItem->quantity,
            'weight' => max(1, (int) config('services.biteship.item_weight_grams')),
            'length' => max(1, (int) config('services.biteship.item_length_cm')),
            'width' => max(1, (int) config('services.biteship.item_width_cm')),
            'height' => max(1, (int) config('services.biteship.item_height_cm')),
        ])->values()->all();
    }

    private function subtotal(iterable $cartItems): float
    {
        return collect($cartItems)->sum(fn ($cartItem) => $cartItem->product->effectiveUnitPrice() * $cartItem->quantity);
    }

    private function normalize(array $rate): ?array
    {
        $courierCode = (string) ($rate['courier_code'] ?? $rate['company'] ?? '');
        $serviceCode = (string) ($rate['courier_service_code'] ?? $rate['type'] ?? '');

        if ($courierCode === '' || $serviceCode === '' || ! isset($rate['price'])) {
            return null;
        }

        return [
            'courier_code' => $courierCode,
            'courier_name' => (string) ($rate['courier_name'] ?? strtoupper($courierCode)),
            'courier_service_code' => $serviceCode,
            'courier_service_name' => (string) ($rate['courier_service_name'] ?? strtoupper($serviceCode)),
            'duration' => (string) ($rate['duration'] ?? ''),
            'price' => (int) $rate['price'],
        ];
    }

    /**
     * @param  list<string>  $couriers
     */
    private function fakeRates(array $couriers): array
    {
        return collect($couriers)
            ->values()
            ->map(fn (string $courier, int $index) => [
                'courier_code' => $courier,
                'courier_name' => StoreContentSetting::COURIERS[$courier],
                'courier_service_code' => 'reg',
                'courier_service_name' => 'REG',
                'duration' => '2 - 3 days',
                'price' => 12000 + ($index * 1000),
            ])
            ->all();
    }

    private function fallbackRate(): array
    {
        $settings = StoreContentSetting::shippingSettings();

        return [
            'courier_code' => 'flat',
            'courier_name' => config('app.name', 'Lurus Store'),
            'courier_service_code' => 'standard',
            'courier_service_name' => 'Standard',
            'duration' => '2 - 5 days',
            'price' => $settings['flat_shipping_cost'],
        ];
    }
}
