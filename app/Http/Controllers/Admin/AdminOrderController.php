<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\BiteshipService;
use App\Services\MidtransService;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AdminOrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['user', 'items']);

        if ($status = $request->status) {
            $query->where('status', $status);
        }

        if ($paymentStatus = $request->payment_status) {
            $query->where('payment_status', $paymentStatus);
        }

        $orders = $query->latest()->paginate(10)->withQueryString();
        $orders->getCollection()->transform(fn ($order) => [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'total_amount' => (float) $order->total_amount,
            'status' => $order->status,
            'payment_status' => $order->payment_status,
            'payment_method' => $order->payment_method,
            'created_at' => $order->created_at->toISOString(),
            'customer' => [
                'name' => $order->user?->name ?? $order->shipping_address['name'],
                'email' => $order->user?->email ?? $order->customer_email,
                'is_guest' => ! $order->user_id,
            ],
            'items_count' => $order->items->count(),
        ]);

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'payment_status', 'page']),
        ]);
    }

    public function show(Order $order, MidtransService $midtrans)
    {
        $order = $midtrans->syncStatus($order);
        $order->load(['user', 'items.product.images', 'items.testimonial']);

        return Inertia::render('Admin/Orders/Show', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'subtotal' => (float) $order->subtotal,
                'discount_amount' => (float) ($order->discount_amount ?? 0),
                'shipping_cost' => (float) $order->shipping_cost,
                'total_amount' => (float) $order->total_amount,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'payment_method' => $order->payment_method,
                'payment_channel' => $order->payment_channel,
                'payment_expires_at' => $order->payment_expires_at?->toISOString(),
                'payment_proof_url' => $order->payment_proof_path ? route('admin.orders.payment-proof', $order) : null,
                'shipping_address' => $order->shipping_address,
                'biteship_order_id' => $order->biteship_order_id,
                'waybill_id' => $order->waybill_id,
                'shipping_status' => $order->shipping_status,
                'shipping_history' => $order->shipping_history ?? [],
                'shipped_at' => $order->shipped_at?->toISOString(),
                'delivered_at' => $order->delivered_at?->toISOString(),
                'can_create_biteship_shipment' => $order->payment_status === Order::PAYMENT_PAID
                    && ! $order->biteship_order_id,
                'can_print_shipping_label' => (bool) $order->waybill_id,
                'notes' => $order->notes,
                'created_at' => $order->created_at->toISOString(),
                'updated_at' => $order->updated_at->toISOString(),
                'customer' => [
                    'name' => $order->user?->name ?? $order->shipping_address['name'],
                    'email' => $order->user?->email ?? $order->customer_email,
                    'phone' => $order->customer_phone,
                    'is_guest' => ! $order->user_id,
                ],
                'can_send_testimonial' => $order->status === Order::STATUS_DELIVERED
                    && $order->testimonial_token
                    && ! $order->testimonial_submitted_at,
                'items' => $order->items->map(fn ($item) => [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'product_name' => $item->product_name,
                    'sku' => $item->sku,
                    'quantity' => $item->quantity,
                    'price' => (float) $item->price,
                    'size' => $item->size,
                    'color' => $item->color,
                    'image' => $item->product?->images?->first()?->image_path,
                    'testimonial' => $item->testimonial ? [
                        'id' => $item->testimonial->id,
                        'rating' => $item->testimonial->rating,
                        'comment' => $item->testimonial->comment,
                        'approved_at' => $item->testimonial->approved_at?->toISOString(),
                    ] : null,
                ]),
            ],
        ]);
    }

    public function updateStatus(Request $request, Order $order, OrderService $orders)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,stock_confirmation,ready_to_ship,shipped,delivered,cancelled'],
        ]);
        $status = $validated['status'];

        if (in_array($status, [Order::STATUS_READY_TO_SHIP, Order::STATUS_SHIPPED, Order::STATUS_DELIVERED], true)
            && $order->payment_status !== Order::PAYMENT_PAID) {
            throw ValidationException::withMessages(['status' => 'This order has not been paid yet.']);
        }

        if ($status === Order::STATUS_CANCELLED && $order->payment_status !== Order::PAYMENT_PAID) {
            $orders->releaseStock($order, $order->payment_status);
        } else {
            $order->update(['status' => $status]);

            match ($status) {
                Order::STATUS_SHIPPED => $order->notifyCustomer(
                    'Order Shipped — '.$order->order_number,
                    array_values(array_filter([
                        'Order '.$order->order_number.' has been shipped.',
                        'Courier: '.($order->shipping_address['courier']['courier_name']
                            ?? $order->shipping_address['courier']['courier_code']
                            ?? 'being processed').'.',
                        $order->waybill_id ? 'Tracking number: '.$order->waybill_id : null,
                        'We will notify you again when the order is delivered.',
                    ])),
                    $order->customerOrderUrl(),
                ),
                Order::STATUS_DELIVERED => $order->notifyCustomer(
                    'Order Delivered — '.$order->order_number,
                    [
                        'Order '.$order->order_number.' has been delivered.',
                        'Thank you for shopping at '.config('app.name', 'Lurus Store').'.',
                    ],
                    $order->customerOrderUrl(),
                ),
                Order::STATUS_CANCELLED => $order->notifyCustomer(
                    'Order Cancelled — '.$order->order_number,
                    [
                        'Order '.$order->order_number.' has been cancelled by the store.',
                        'If payment was received, our team will process a refund.',
                    ],
                    $order->customerOrderUrl(),
                ),
                default => null,
            };
        }

        if ($status === Order::STATUS_DELIVERED && ! $order->testimonial_token) {
            $order->update(['testimonial_token' => hash('sha256', $order->testimonialAccessToken())]);
        }

        return back()->with('success', 'Order status updated successfully.');
    }

    public function proof(Order $order)
    {
        abort_unless($order->payment_proof_path, 404);

        return Storage::disk('local')->response($order->payment_proof_path);
    }

    public function approvePayment(Order $order, OrderService $orders)
    {
        abort_unless($order->payment_method === Order::PAYMENT_METHOD_BANK_TRANSFER, 404);
        abort_unless($order->payment_proof_path, 422);

        if ($order->payment_status !== Order::PAYMENT_PENDING_VERIFICATION) {
            throw ValidationException::withMessages(['payment' => 'Payment proof is not pending verification.']);
        }

        if ($order->stock_released_at || $order->payment_expires_at?->isPast()) {
            throw ValidationException::withMessages(['payment' => 'Stock for this order was released because payment expired.']);
        }

        $orders->markPaid($order);

        return back()->with('success', 'Payment approved and order is ready to ship.');
    }

    public function rejectPayment(Order $order)
    {
        abort_unless($order->payment_method === Order::PAYMENT_METHOD_BANK_TRANSFER, 404);

        if ($order->payment_status !== Order::PAYMENT_PENDING_VERIFICATION) {
            throw ValidationException::withMessages(['payment' => 'Payment proof is not pending verification.']);
        }

        $order->update(['payment_status' => Order::PAYMENT_FAILED]);

        $order->notifyCustomer(
            'Transfer Proof Rejected — '.$order->order_number,
            [
                'Transfer proof for order '.$order->order_number.' was rejected.',
                'Please re-upload a valid payment proof from the order page.',
            ],
            $order->customerOrderUrl(),
        );

        return back()->with('success', 'Payment proof rejected. The customer can re-upload.');
    }

    public function createBiteshipShipment(Request $request, Order $order, BiteshipService $biteship)
    {
        $validated = $request->validate([
            'courier_code' => ['nullable', 'string', 'max:50'],
            'courier_service_code' => ['nullable', 'string', 'max:50'],
            'collection_method' => ['nullable', 'in:pickup,drop_off'],
        ]);

        $biteship->createShipment($order, array_filter($validated, fn ($value) => $value !== null && $value !== ''));

        return back()->with('success', 'Biteship shipment created successfully.');
    }

    public function updateWaybill(Request $request, Order $order, BiteshipService $biteship)
    {
        $validated = $request->validate([
            'waybill_id' => ['required', 'string', 'max:100'],
        ]);

        $biteship->saveManualWaybill($order, $validated['waybill_id']);

        return back()->with('success', 'Tracking number saved.');
    }

    public function shippingLabel(Order $order)
    {
        abort_unless($order->waybill_id, 404);

        $order->loadMissing('items');
        $address = $order->shipping_address ?? [];
        $courier = is_array($address['courier'] ?? null) ? $address['courier'] : [];
        $qty = max(1, (int) $order->items->sum('quantity'));

        return response()->view('shipping.label', [
            'order' => $order,
            'waybill' => (string) $order->waybill_id,
            'courierName' => (string) ($courier['courier_name'] ?? $courier['courier_code'] ?? 'Courier'),
            'serviceName' => (string) ($courier['courier_service_name'] ?? $courier['courier_service_code'] ?? 'Standard'),
            'routingCode' => (string) ($courier['routing_code'] ?? ''),
            'senderName' => (string) config('services.biteship.origin_contact_name', config('app.name', 'Lurus Store')),
            'senderPhone' => (string) config('services.biteship.origin_contact_phone', ''),
            'senderAddress' => (string) config('services.biteship.origin_address', ''),
            'recipientName' => (string) ($address['name'] ?? ''),
            'recipientPhone' => (string) ($order->customer_phone ?: ($address['phone'] ?? '')),
            'recipientAddress' => (string) ($address['address'] ?? ''),
            'recipientCity' => (string) ($address['city'] ?? ''),
            'recipientPostal' => (string) ($address['postal_code'] ?? ''),
            'weightGrams' => max(1, (int) config('services.biteship.item_weight_grams')) * $qty,
            'lengthCm' => max(1, (int) config('services.biteship.item_length_cm')),
            'widthCm' => max(1, (int) config('services.biteship.item_width_cm')),
            'heightCm' => max(1, (int) config('services.biteship.item_height_cm')),
            'itemsSummary' => $order->items
                ->map(fn ($item) => $item->product_name.' ×'.$item->quantity)
                ->implode(', '),
            'notes' => (string) ($order->notes ?? ''),
        ]);
    }

    public function testimonialReminder(Order $order)
    {
        abort_unless($order->status === Order::STATUS_DELIVERED && $order->testimonial_token, 404);
        $phone = preg_replace('/\D+/', '', (string) $order->customer_phone);
        $phone = str_starts_with($phone, '0') ? '62'.substr($phone, 1) : $phone;
        $url = $order->user_id
            ? route('orders.show', $order)
            : route('testimonials.create', $order->testimonialAccessToken());
        $message = "Hi {$order->shipping_address['name']}, thank you for shopping at ".config('app.name', 'Lurus Store').". We would appreciate your review: {$url}";

        $order->update(['testimonial_requested_at' => now()]);

        return redirect()->away('https://wa.me/'.$phone.'?text='.rawurlencode($message));
    }

    public function destroy(Order $order): RedirectResponse
    {
        $order->delete();

        return redirect()->route('admin.orders.index')
            ->with('success', 'Order moved to restore data.');
    }
}
