<?php

namespace App\Services;

use App\Events\OrderCreated;
use App\Events\OrderPaid;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\StoreContentSetting;
use App\Notifications\StockConfirmationNeededNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderService
{
    public function __construct(
        private readonly CartService $carts,
        private readonly BiteshipService $biteship,
        private readonly CartPricingService $pricing,
        private readonly InventoryReservationService $inventory,
    ) {}

    public function createFromCart(Request $request, array $data): Order
    {
        $this->assertPaymentAvailable($data);

        return DB::transaction(function () use ($request, $data) {
            $cartItems = $this->carts->query($request)
                ->with(['product', 'variant'])
                ->lockForUpdate()
                ->get();

            if ($cartItems->isEmpty()) {
                throw ValidationException::withMessages(['cart' => 'Your cart is empty.']);
            }

            $locked = $cartItems->map(function ($cartItem) {
                $product = Product::lockForUpdate()->findOrFail($cartItem->product_id);
                $variant = $cartItem->product_variant_id
                    ? ProductVariant::lockForUpdate()->find($cartItem->product_variant_id)
                    : null;
                $available = max(0, ($variant?->stock ?? $product->stock) - ($variant?->stock_reserved ?? $product->stock_reserved ?? 0));

                if ($available < $cartItem->quantity) {
                    throw ValidationException::withMessages([
                        'cart' => "Insufficient stock for {$product->name}.",
                    ]);
                }

                return compact('cartItem', 'product', 'variant');
            });

            $this->inventory->reserve($locked);

            $pricingRows = $locked->values()->map(fn ($row) => (object) [
                'product' => $row['product'],
                'quantity' => (int) $row['cartItem']->quantity,
            ]);
            $quote = $this->pricing->quote($pricingRows);
            $subtotal = $quote['subtotal'];
            $discountAmount = $quote['discount_amount'];
            $payable = $quote['payable'];

            $rateItems = $locked->map(function ($row) {
                $row['cartItem']->setRelation('product', $row['product']);

                return $row['cartItem'];
            });
            $shippingRate = $this->biteship->selectedRateForCart(
                $rateItems,
                $data['postal_code'],
                $data['shipping_courier'] ?? null,
                $data['shipping_service'] ?? null,
                $payable,
            );
            $shippingCost = $shippingRate['price'];
            $isMidtrans = $data['payment_method'] === Order::PAYMENT_METHOD_MIDTRANS;

            $guestToken = $request->user() ? null : Str::random(40);
            $order = Order::create([
                'user_id' => $request->user()?->id,
                'guest_token' => $guestToken ? hash('sha256', $guestToken) : null,
                'customer_email' => strtolower($data['email']),
                'customer_phone' => $data['phone'],
                'order_number' => 'ORD-'.now()->format('YmdHis').'-'.Str::upper(Str::random(6)),
                'subtotal' => $subtotal,
                'discount_amount' => $discountAmount,
                'shipping_cost' => $shippingCost,
                'total_amount' => $payable + $shippingCost,
                'status' => Order::STATUS_PENDING,
                'shipping_address' => [
                    'name' => $data['name'],
                    'email' => strtolower($data['email']),
                    'phone' => $data['phone'],
                    'address' => $data['address'],
                    'province' => $data['province'],
                    'city' => $data['city'],
                    'district' => $data['district'],
                    'postal_code' => $data['postal_code'],
                    'courier' => $shippingRate,
                ],
                'payment_method' => $data['payment_method'],
                'payment_channel' => $isMidtrans
                    ? ($data['midtrans_channel'] ?? null)
                    : null,
                'payment_status' => Order::PAYMENT_UNPAID,
                'payment_expires_at' => $isMidtrans ? now()->addHour() : now()->addHours(3),
                'notes' => $data['notes'] ?? null,
            ]);

            foreach ($locked->values() as $index => $row) {
                $cartItem = $row['cartItem'];
                $product = $row['product'];
                $variant = $row['variant'];

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_variant_id' => $variant?->id,
                    'product_name' => $product->name,
                    'sku' => $variant?->sku ?? $product->sku,
                    'price' => $quote['unit_prices'][$index],
                    'quantity' => $cartItem->quantity,
                    'size' => $variant?->size ?? $cartItem->size,
                    'color' => $variant?->color ?? $cartItem->color,
                ]);

            }

            $this->carts->query($request)->delete();

            $order->guestAccessToken = $guestToken;
            $orderUrl = $order->customerOrderUrl($guestToken);
            $paymentHint = $isMidtrans
                ? 'Please complete your Midtrans payment before the deadline.'
                : 'Please transfer to our bank account and upload payment proof on the order page.';

            DB::afterCommit(function () use ($order, $guestToken) {
                OrderCreated::dispatch($order->fresh(['items']), $guestToken);
            });

            return $order->load('items');
        });
    }

    private function assertPaymentAvailable(array $data): void
    {
        $settings = StoreContentSetting::paymentSettings();
        $method = $data['payment_method'] ?? null;

        if (! $settings['enabled'] || ! in_array($method, $settings['methods'], true)) {
            throw ValidationException::withMessages([
                'payment_method' => 'This payment method is currently unavailable.',
            ]);
        }

        if ($method === Order::PAYMENT_METHOD_MIDTRANS
            && ! in_array($data['midtrans_channel'] ?? null, $settings['midtrans_channels'], true)) {
            throw ValidationException::withMessages([
                'midtrans_channel' => 'This Midtrans channel is currently unavailable.',
            ]);
        }
    }

    public function markPaid(Order $order): Order
    {
        return DB::transaction(function () use ($order) {
            $locked = Order::with('items')->lockForUpdate()->findOrFail($order->id);

            if ($locked->payment_status === Order::PAYMENT_PAID) {
                return $locked;
            }

            // Skip owner email when admin just approved a transfer proof (they already know).
            $notifyAdminPaid = $locked->payment_status !== Order::PAYMENT_PENDING_VERIFICATION;

            $shortages = [];

            foreach ($locked->items as $item) {
                $product = Product::whereKey($item->product_id)->lockForUpdate()->first();
                $variant = $item->product_variant_id
                    ? ProductVariant::whereKey($item->product_variant_id)->lockForUpdate()->first()
                    : null;
                $available = (int) ($variant?->stock ?? $product?->stock ?? 0);

                if ($available < $item->quantity) {
                    $shortages[] = $item->product_name;
                }
            }

            $locked->forceFill([
                'payment_status' => Order::PAYMENT_PAID,
                'payment_verified_at' => now(),
                'status' => $shortages === [] ? Order::STATUS_READY_TO_SHIP : Order::STATUS_STOCK_CONFIRMATION,
            ])->save();

            if ($shortages === []) {
                $this->inventory->finalizePaid($locked->items);

                DB::afterCommit(fn () => OrderPaid::dispatch($locked->fresh(['items']), $notifyAdminPaid));
            } else {
                DB::afterCommit(fn () => OrderPaid::dispatch($locked->fresh(['items']), $notifyAdminPaid));
            }

            return $locked;
        });
    }

    public function releaseStock(Order $order, string $paymentStatus = Order::PAYMENT_EXPIRED): Order
    {
        return DB::transaction(function () use ($order, $paymentStatus) {
            $locked = Order::with('items')->lockForUpdate()->findOrFail($order->id);

            if ($locked->stock_released_at || $locked->payment_status === Order::PAYMENT_PAID) {
                return $locked;
            }

            $locked->forceFill([
                'stock_released_at' => now(),
                'payment_status' => $paymentStatus,
                'status' => Order::STATUS_CANCELLED,
            ])->save();

            $this->inventory->releaseForOrderItems($locked->items);

            $reason = match ($paymentStatus) {
                Order::PAYMENT_EXPIRED => 'The payment deadline has passed, so the order was cancelled.',
                Order::PAYMENT_FAILED => 'Payment failed, so the order was cancelled.',
                default => 'Your order has been cancelled.',
            };

            DB::afterCommit(fn () => $locked->fresh()?->notifyCustomer(
                'Order Cancelled — '.$locked->order_number,
                [
                    'Order '.$locked->order_number.' has been cancelled.',
                    $reason,
                ],
                $locked->customerOrderUrl(),
            ));

            return $locked;
        });
    }
}
