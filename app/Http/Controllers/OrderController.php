<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\StoreContentSetting;
use App\Services\MidtransService;
use App\Services\OrderAccessService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Orders/Index', [
            'orders' => Order::with('items.product.images')
                ->where('user_id', $request->user()->id)
                ->latest()
                ->paginate(10)
                ->withQueryString(),
        ]);
    }

    public function show(Request $request, Order $order, OrderAccessService $access, MidtransService $midtrans)
    {
        $token = $access->authorize($request, $order);
        $order = $this->syncMidtransQuietly($midtrans, $order);
        $order->load('items.product.images');

        return Inertia::render('Orders/Show', [
            'order' => $order,
            'accessToken' => $token,
            'bankTransfer' => StoreContentSetting::bankTransferSettings(),
            'midtransInstructions' => $midtrans->pendingPaymentInstructions($order),
            'testimonialUrl' => $order->status === Order::STATUS_DELIVERED && $order->testimonial_token && ! $order->testimonial_submitted_at
                ? route('testimonials.create', $order->testimonialAccessToken())
                : null,
        ]);
    }

    public function success(Request $request, Order $order, OrderAccessService $access, MidtransService $midtrans)
    {
        $token = $access->authorize($request, $order);
        $order = $this->syncMidtransQuietly($midtrans, $order);
        $order->load('items.product.images');
        $midtransPayment = $request->session()->pull('midtransPayment');

        return Inertia::render('Orders/Success', [
            'order' => $order,
            'accessToken' => $token,
            'claimUrl' => $token ? route('register', ['claim' => $token]) : null,
            'bankTransfer' => StoreContentSetting::bankTransferSettings(),
            'midtransPayment' => is_array($midtransPayment) ? $midtransPayment : null,
            'midtransInstructions' => $midtrans->pendingPaymentInstructions($order),
        ]);
    }

    private function syncMidtransQuietly(MidtransService $midtrans, Order $order): Order
    {
        try {
            return $midtrans->syncStatus($order);
        } catch (\Throwable $exception) {
            report($exception);

            return $order->fresh() ?? $order;
        }
    }
}
