<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckoutRequest;
use App\Models\Order;
use App\Models\StoreContentSetting;
use App\Services\BiteshipService;
use App\Services\CartPricingService;
use App\Services\CartService;
use App\Services\MidtransService;
use App\Services\OrderService;
use App\Services\WilayahService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function index(Request $request, CartService $carts, CartPricingService $pricing, WilayahService $wilayah)
    {
        $carts->refreshGuestCookie($request);

        $cartItems = $carts->query($request)->with('product.images', 'variant')->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index');
        }

        $quote = $pricing->quote($cartItems->map(fn ($item) => (object) [
            'product' => $item->product,
            'quantity' => (int) $item->quantity,
        ]));
        $shippingSettings = StoreContentSetting::shippingSettings();

        return Inertia::render('Checkout', [
            'cartItems' => $cartItems->values()->map(function ($item, $index) use ($quote) {
                $item->setAttribute('unit_price', $quote['unit_prices'][$index] ?? $item->product->effectiveUnitPrice());

                return $item;
            }),
            'pricing' => [
                'subtotal' => $quote['subtotal'],
                'discount_amount' => $quote['discount_amount'],
                'payable' => $quote['payable'],
            ],
            'shippingAddress' => $this->latestShippingAddress($request),
            'provinces' => $wilayah->provinces(),
            'defaultShippingCost' => $shippingSettings['flat_shipping_cost'],
            'freeShippingThreshold' => $shippingSettings['free_shipping_threshold'],
            'freeShippingEnabled' => $shippingSettings['free_shipping_enabled']
                && StoreContentSetting::freeShippingWindowOpen(null, $shippingSettings),
            'biteshipEnabled' => $shippingSettings['biteship_enabled'],
            'bankTransfer' => StoreContentSetting::bankTransferSettings(),
            'paymentSettings' => StoreContentSetting::paymentSettings(),
        ]);
    }

    public function shippingRates(Request $request, CartService $carts, BiteshipService $biteship, CartPricingService $pricing)
    {
        $validated = $request->validate([
            'postal_code' => ['required', 'string', 'regex:/^\d{5}$/'],
        ]);

        $cartItems = $carts->query($request)->with('product')->get();

        if ($cartItems->isEmpty()) {
            throw ValidationException::withMessages(['cart' => 'Your cart is empty.']);
        }

        $quote = $pricing->quote($cartItems->map(fn ($item) => (object) [
            'product' => $item->product,
            'quantity' => (int) $item->quantity,
        ]));

        return response()->json([
            'rates' => $biteship->ratesForCart($cartItems, $validated['postal_code'], $quote['payable']),
        ]);
    }

    public function searchAreas(Request $request, BiteshipService $biteship)
    {
        $validated = $request->validate([
            'q' => ['required', 'string', 'min:3', 'max:100'],
        ]);

        return response()->json([
            'areas' => $biteship->searchAreas($validated['q']),
        ]);
    }

    public function wilayahCities(Request $request, WilayahService $wilayah)
    {
        $validated = $request->validate([
            'province_id' => ['required', 'string', 'max:10'],
        ]);

        return response()->json([
            'cities' => $wilayah->cities($validated['province_id']),
        ]);
    }

    public function wilayahDistricts(Request $request, WilayahService $wilayah)
    {
        $validated = $request->validate([
            'city_id' => ['required', 'string', 'max:10'],
        ]);

        return response()->json([
            'districts' => $wilayah->districts($validated['city_id']),
        ]);
    }

    public function store(
        CheckoutRequest $request,
        OrderService $orders,
        MidtransService $midtrans,
    ) {
        $order = $orders->createFromCart($request, $request->validated());
        $route = ['order' => $order];
        $midtransPayment = null;
        $midtransError = null;

        if ($order->guestAccessToken) {
            $route['token'] = $order->guestAccessToken;
        }

        if ($order->payment_method === Order::PAYMENT_METHOD_MIDTRANS) {
            try {
                $midtransPayment = $midtrans->createPayment(
                    $order,
                    $request->validated('midtrans_channel'),
                );
            } catch (\Throwable $exception) {
                report($exception);
                $midtransError = 'Order created, but the Midtrans payment page could not be opened. Try again from the order details page.';
            }
        }

        $successUrl = route('orders.success', $route);

        // Checkout.vue opens Snap on the checkout page before visiting invoice.
        if ($request->expectsJson()) {
            return response()->json([
                'order_number' => $order->order_number,
                'success_url' => $successUrl,
                'midtransPayment' => $midtransPayment,
                'error' => $midtransError,
            ]);
        }

        $redirect = redirect()->route('orders.success', $route)
            ->with('midtransPayment', $midtransPayment)
            ->with('success', 'Order created successfully.');

        return $midtransError
            ? $redirect->with('error', $midtransError)
            : $redirect;
    }

    private function latestShippingAddress(Request $request): ?array
    {
        if (! $user = $request->user()) {
            return null;
        }

        return Order::where('user_id', $user->id)->latest()->first()?->shipping_address ?? [
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone ?? '',
            'address' => $user->address ?? '',
            'province' => '',
            'city' => $user->city ?? '',
            'district' => '',
            'postal_code' => $user->postal_code ?? '',
        ];
    }
}
