<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use Inertia\Inertia;

class AdminCartController extends Controller
{
    public function index()
    {
        $carts = CartItem::with(['user', 'product.category', 'variant'])
            ->latest('updated_at')
            ->get()
            ->groupBy(fn ($item) => $item->user_id ? 'user-'.$item->user_id : 'guest-'.$item->session_id)
            ->map(function ($items) {
                $first = $items->first();

                return [
                    'owner_type' => $first->user_id ? 'customer' : 'guest',
                    'owner_name' => $first->user?->name ?? 'Guest',
                    'owner_email' => $first->user?->email,
                    'last_activity' => $items->max('updated_at')?->toISOString(),
                    'total_quantity' => $items->sum('quantity'),
                    'items' => $items->map(fn ($item) => [
                        'id' => $item->id,
                        'sku' => $item->variant?->sku ?? $item->product?->sku,
                        'quantity' => $item->quantity,
                        'size' => $item->variant?->size ?? $item->size,
                        'color' => $item->variant?->color ?? $item->color,
                        'product' => $item->product ? [
                            'name' => $item->product->name,
                            'slug' => $item->product->slug,
                            'category' => $item->product->category?->name ?? '-',
                        ] : null,
                    ])->values(),
                ];
            })
            ->values();

        return Inertia::render('Admin/Carts/Index', [
            'carts' => $carts,
            'totalQuantity' => $carts->sum('total_quantity'),
        ]);
    }

    public function destroy(CartItem $cartItem)
    {
        $cartItem->delete();

        return back()->with('success', 'Cart item removed successfully.');
    }
}
