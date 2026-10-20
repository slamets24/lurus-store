<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Services\CartPricingService;
use App\Services\CartService;
use App\Services\PieceInventory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index(Request $request, CartService $carts, CartPricingService $pricing)
    {
        $carts->refreshGuestCookie($request);
        $cartItems = $carts->query($request)->with('product.images', 'variant', 'offer')->get();
        $quote = $pricing->quoteCart($cartItems);

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
            'offer_id' => ['nullable', 'integer'],
            'sizes' => ['nullable', 'array'],
            'sizes.*' => ['nullable', 'string'],
        ]);

        $product = Product::with(['variants', 'offers.components'])->findOrFail($validated['product_id']);

        if ($product->offers->isNotEmpty()) {
            return $this->addOffer($request, $product, $validated, $carts);
        }

        if (is_array($product->sizes) && $product->sizes !== [] && blank($validated['size'] ?? null)) {
            return back()->with('error', 'Please select a size.');
        }

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
            return back()->with('error', $product->is_preorder ? 'Kuota Pre-Order telah habis.' : 'Insufficient stock.');
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

        if (is_array($cartItem->selections) && $cartItem->selections !== []) {
            $pieceIds = collect($cartItem->selections)->pluck('product_variant_id')->map(fn ($id) => (int) $id)->all();
            $max = app(PieceInventory::class)->maxOfferQuantity($carts->query($request)->get(), $pieceIds, $cartItem->id);
            if ($validated['quantity'] > $max) {
                return back()->with('error', 'Insufficient stock.');
            }
        } elseif (($cartItem->variant?->stock ?? $cartItem->product->stock) < $validated['quantity']) {
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

    private function addOffer(Request $request, Product $product, array $validated, CartService $carts)
    {
        $offer = $product->offers->firstWhere('id', (int) ($validated['offer_id'] ?? 0));
        if (! $offer) {
            return back()->with('error', 'Pilih opsi produk.');
        }

        $color = $validated['color'] ?? null;
        $sizes = $validated['sizes'] ?? [];
        $selections = [];

        foreach ($offer->components as $component) {
            $size = $sizes[$component->id] ?? $sizes[(string) $component->id] ?? null;
            if (blank($size)) {
                return back()->with('error', 'Pilih ukuran '.$component->name.'.');
            }

            $variant = $product->variants->first(fn ($row) => $row->component_id === $component->id
                && $row->status === 'published'
                && $row->color === $color
                && $row->size === $size);

            if (! $variant) {
                return back()->with('error', 'Varian '.$component->name.' tidak ditemukan.');
            }

            $selections[] = [
                'component_id' => $component->id,
                'component_name' => $component->name,
                'product_variant_id' => $variant->id,
                'size' => $size,
                'color' => $color,
                'sku' => $variant->sku,
                'quantity' => (int) ($component->pivot->quantity ?? 1),
                'price' => $variant->price !== null ? (float) $variant->price : null,
            ];
        }

        $selectionKey = $offer->id.'|'.($color ?? '').'|'.collect($selections)
            ->sortBy('component_id')
            ->map(fn ($selection) => $selection['component_id'].':'.$selection['size'])
            ->implode('|');

        $cartItem = $carts->query($request)
            ->where('product_id', $product->id)
            ->where('product_offer_id', $offer->id)
            ->where('selection_key', $selectionKey)
            ->first();

        $desired = $validated['quantity'] + ($cartItem?->quantity ?? 0);
        $pieceIds = collect($selections)->pluck('product_variant_id')->map(fn ($id) => (int) $id)->all();
        $max = app(PieceInventory::class)->maxOfferQuantity(
            $carts->query($request)->get(),
            $pieceIds,
            $cartItem?->id,
        );

        if ($desired > $max) {
            return back()->with('error', $product->is_preorder ? 'Kuota Pre-Order telah habis.' : 'Insufficient stock.');
        }

        $sizeLabel = count($selections) === 1
            ? $selections[0]['size']
            : collect($selections)->map(fn ($selection) => $selection['component_name'].' '.$selection['size'])->implode(' · ');
        $isNewCartItem = $cartItem === null;

        if ($cartItem) {
            $cartItem->update(['quantity' => $desired]);
        } else {
            [$column, $identifier] = $carts->owner($request);
            CartItem::create([
                'user_id' => $column === 'user_id' ? $identifier : null,
                'session_id' => $column === 'session_id' ? $identifier : null,
                'product_id' => $product->id,
                'product_variant_id' => $selections[0]['product_variant_id'],
                'product_offer_id' => $offer->id,
                'quantity' => $validated['quantity'],
                'size' => $sizeLabel,
                'color' => $color,
                'selections' => $selections,
                'selection_key' => $selectionKey,
            ]);
        }

        $carts->refreshGuestCookie($request);

        return back()->with([
            'success' => 'Product added to cart.',
            'cart_item_created' => $isNewCartItem,
        ]);
    }

    private function authorizeCartItem(Request $request, CartItem $cartItem, CartService $carts): void
    {
        [$column, $identifier] = $carts->owner($request);

        abort_unless((string) $cartItem->{$column} === (string) $identifier, 403);
    }
}
