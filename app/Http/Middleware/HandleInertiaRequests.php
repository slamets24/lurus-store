<?php

namespace App\Http\Middleware;

use App\Models\CartItem;
use App\Models\Category;
use App\Models\Collection;
use App\Models\StoreContentSetting;
use App\Models\WishlistItem;
use App\Services\CartPricingService;
use App\Services\CartService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'appUrl' => config('app.url'),
            'auth' => [
                'user' => $request->user()?->only([
                    'id',
                    'name',
                    'email',
                    'role',
                    'phone',
                    'address',
                    'city',
                    'postal_code',
                ]),
                'isAdmin' => $request->user()?->isAdmin() ?? false,
                'isSuperAdmin' => $request->user()?->isSuperAdmin() ?? false,
            ],
            'cartCount' => fn () => CartItem::where(
                $request->user() ? 'user_id' : 'session_id',
                $request->user()?->id
                    ?? $request->attributes->get(EnsureGuestCartToken::ATTRIBUTE)
                    ?? $request->cookie(EnsureGuestCartToken::COOKIE)
            )->sum('quantity'),
            'cartPreview' => Inertia::optional(fn () => app(CartService::class)->preview(
                $request,
                app(CartPricingService::class),
            )),
            'wishlistMap' => fn () => $request->user()
                ? WishlistItem::where('user_id', $request->user()->id)
                    ->pluck('id', 'product_id')
                : (object) [],
            'storeCategories' => fn () => Category::query()
                ->where('is_active', true)
                ->whereHas('products')
                ->withCount('products')
                ->orderByDesc('products_count')
                ->orderBy('name')
                ->limit(4)
                ->get(['name', 'slug']),
            'storeCollections' => fn () => Collection::where('is_active', true)
                ->orderBy('sort_order')
                ->get(['name', 'slug', 'description', 'subtitle']),
            'socialLinks' => fn () => StoreContentSetting::value('social_links', [
                ['name' => 'Instagram', 'url' => '#'],
                ['name' => 'Twitter', 'url' => '#'],
                ['name' => 'TikTok', 'url' => '#'],
            ]),
            'whatsapp_number' => fn () => StoreContentSetting::value('whatsapp_number', StoreContentSetting::DEFAULT_WHATSAPP_NUMBER),
            'promoPopup' => fn () => StoreContentSetting::promoPopup(),
            'commerce' => function () {
                $payments = StoreContentSetting::paymentSettings();
                $shipping = StoreContentSetting::shippingSettings();

                return [
                    'paymentsEnabled' => $payments['enabled'] && $payments['methods'] !== [],
                    'flatShippingCost' => $shipping['flat_shipping_cost'],
                ];
            },
            'midtrans' => fn () => $request->routeIs(
                'checkout.index',
                'checkout.store',
                'orders.show',
                'orders.success',
            ) ? [
                'clientKey' => config('services.midtrans.client_key'),
                'snapJsUrl' => config('services.midtrans.snap_js_url'),
            ] : null,
            'flash' => [
                'message' => $request->session()->get('message'),
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'midtransPayment' => $request->session()->get('midtransPayment'),
                'cart_item_created' => $request->session()->get('cart_item_created'),
            ],
        ];
    }
}
