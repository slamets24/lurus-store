<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Services\CartPricingService;
use App\Services\CartService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index(Request $request, CartService $carts, CartPricingService $pricing)
    {
        $carts->refreshGuestCookie($request);
        $cartItems = $carts->query($request)->with('product.images', 'variant')->get();
        $quote = $pricing->quote($cartItems->map(fn ($item) => (object) [
            'product' => $item->product,
            'quantity' => (int) $item->quantity,
        ]));

        return Inertia::render('Cart/Index', [
            'cartItems' => $cartItems->values()->map(function ($item, $index) use ($quote) {
                $item->setAttribute('unit_price', $quote['unit_prices'][$index] ?? $item->product->effectiveUnitPrice());
                $item->setAttribute('list_price', (float) $item->product->price);
                $item->setAttribute('discount_percent', (float) ($item->product->discount_percent ?? 0));

                return $item;
            }),
            'subtotal' => $quote['subtotal'],
            'discount_amount' => $quote['discount_amount'],
            'total' => $quote['payable'],
        ]);
    }

    public function add(Request $request, CartService $carts)
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'size' => ['nullable', 'string'],
            'color' => ['nullable', 'string'],
        ]);

        $product = Product::with('variants')->findOrFail($validated['product_id']);
        $variant = ProductVariant::where('product_id', $product->id)
            ->where('color', $validated['color'] ?? null)
            ->where('size', $validated['size'] ?? null)
            ->where('status', 'published')
            ->first();

        if ($product->variants->isNotEmpty() && ! $variant) {
            return back()->with('error', 'Product variant not found.');
        }

        $cartItem = $carts->query($request)
            ->where('product_id', $product->id)
            ->where('product_variant_id', $variant?->id)
            ->where('size', $validated['size'] ?? null)
            ->where('color', $validated['color'] ?? null)
            ->first();
        $isNewCartItem = $cartItem === null;
        $quantity = $validated['quantity'] + ($cartItem?->quantity ?? 0);
        $availableStock = $variant?->stock ?? $product->stock;

        if ($availableStock < $quantity) {
            return back()->with('error', 'Insufficient stock.');
        }

        if ($cartItem) {
            $cartItem->update(['quantity' => $quantity]);
        } else {
            [$column, $identifier] = $carts->owner($request);
            CartItem::create([
                'user_id' => $column === 'user_id' ? $identifier : null,
                'session_id' => $column === 'session_id' ? $identifier : null,
                'product_id' => $product->id,
                'product_variant_id' => $variant?->id,
                'quantity' => $validated['quantity'],
                'size' => $validated['size'] ?? null,
                'color' => $validated['color'] ?? null,
            ]);
        }

        $carts->refreshGuestCookie($request);

        return back()->with([
            'success' => 'Product added to cart.',
            'cart_item_created' => $isNewCartItem,
        ]);
    }

    public function update(Request $request, CartItem $cartItem, CartService $carts)
    {
        $this->authorizeCartItem($request, $cartItem, $carts);
        $validated = $request->validate(['quantity' => ['required', 'integer', 'min:1']]);
        $cartItem->loadMissing('product', 'variant');

        if (($cartItem->variant?->stock ?? $cartItem->product->stock) < $validated['quantity']) {
            return back()->with('error', 'Insufficient stock.');
        }

        $cartItem->update($validated);
        $carts->refreshGuestCookie($request);

        return back()->with('success', 'Cart updated.');
    }

    public function remove(Request $request, CartItem $cartItem, CartService $carts)
    {
        $this->authorizeCartItem($request, $cartItem, $carts);
        $cartItem->delete();

        return back()->with('success', 'Product removed from cart.');
    }

    public function clear(Request $request, CartService $carts)
    {
        $carts->query($request)->delete();

        return back()->with('success', 'Cart cleared.');
    }

    private function authorizeCartItem(Request $request, CartItem $cartItem, CartService $carts): void
    {
        [$column, $identifier] = $carts->owner($request);

        abort_unless((string) $cartItem->{$column} === (string) $identifier, 403);
    }
}
