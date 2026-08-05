<?php

namespace App\Services;

use App\Http\Middleware\EnsureGuestCartToken;
use App\Models\CartItem;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;

class CartService
{
    public function query(Request $request): Builder
    {
        [$column, $identifier] = $this->owner($request);

        return CartItem::query()->where($column, $identifier);
    }

    /**
     * Slim cart payload for the storefront drawer (Inertia optional prop).
     *
     * @return array{items: list<array<string, mixed>>, subtotal: float, discount_amount: float, total: float}
     */
    public function preview(Request $request, CartPricingService $pricing): array
    {
        $cartItems = $this->query($request)->with(['product.images', 'variant'])->get();
        $quote = $pricing->quote($cartItems->map(fn ($item) => (object) [
            'product' => $item->product,
            'quantity' => (int) $item->quantity,
        ]));

        return [
            'items' => $cartItems->values()->map(function ($item, $index) use ($quote) {
                $image = $item->product->images->firstWhere('is_primary', true)
                    ?? $item->product->images->first();

                return [
                    'id' => $item->id,
                    'quantity' => (int) $item->quantity,
                    'size' => $item->size,
                    'color' => $item->color,
                    'unit_price' => $quote['unit_prices'][$index] ?? $item->product->effectiveUnitPrice(),
                    'stock' => $item->variant?->stock ?? $item->product->stock,
                    'product' => [
                        'id' => $item->product->id,
                        'name' => $item->product->name,
                        'slug' => $item->product->slug,
                        'image' => $image?->thumb_path ?? $image?->image_path,
                    ],
                ];
            })->all(),
            'subtotal' => $quote['subtotal'],
            'discount_amount' => $quote['discount_amount'],
            'total' => $quote['payable'],
        ];
    }

    public function owner(Request $request): array
    {
        if ($request->user()) {
            return ['user_id', $request->user()->id];
        }

        return ['session_id', $this->guestToken($request)];
    }

    public function guestToken(Request $request): ?string
    {
        return $request->attributes->get(EnsureGuestCartToken::ATTRIBUTE)
            ?? $request->cookie(EnsureGuestCartToken::COOKIE);
    }

    public function refreshGuestCookie(Request $request): void
    {
        if ($request->user() || ! $token = $this->guestToken($request)) {
            return;
        }

        $this->query($request)->touch();

        Cookie::queue(
            EnsureGuestCartToken::COOKIE,
            $token,
            EnsureGuestCartToken::COOKIE_MINUTES,
            '/',
            null,
            $request->isSecure(),
            true,
            false,
            'lax',
        );
    }

    public function mergeGuestCart(Request $request, User $user): bool
    {
        $token = $this->guestToken($request);

        if (! $token) {
            return false;
        }

        $adjusted = false;
        $guestItems = CartItem::with(['product', 'variant'])
            ->whereNull('user_id')
            ->where('session_id', $token)
            ->get();

        foreach ($guestItems as $guestItem) {
            $availableStock = $guestItem->variant?->stock ?? $guestItem->product?->stock ?? 0;
            $accountItem = CartItem::where('user_id', $user->id)
                ->where('product_id', $guestItem->product_id)
                ->where('product_variant_id', $guestItem->product_variant_id)
                ->where('size', $guestItem->size)
                ->where('color', $guestItem->color)
                ->first();

            $quantity = min($availableStock, $guestItem->quantity + ($accountItem?->quantity ?? 0));
            $adjusted = $adjusted || $quantity < $guestItem->quantity + ($accountItem?->quantity ?? 0);

            if ($quantity < 1) {
                $guestItem->delete();

                continue;
            }

            if ($accountItem) {
                $accountItem->update(['quantity' => $quantity]);
                $guestItem->delete();

                continue;
            }

            $guestItem->update([
                'user_id' => $user->id,
                'session_id' => null,
                'quantity' => $quantity,
            ]);
        }

        Cookie::queue(Cookie::forget(EnsureGuestCartToken::COOKIE));
        $request->attributes->remove(EnsureGuestCartToken::ATTRIBUTE);

        return $adjusted;
    }
}
