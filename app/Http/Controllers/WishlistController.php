<?php

namespace App\Http\Controllers;

use App\Models\WishlistItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WishlistController extends Controller
{
    public function index()
    {
        $wishlistItems = WishlistItem::with('product.category', 'product.images')
            ->where('user_id', auth()->id())
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Wishlist', [
            'wishlistItems' => $wishlistItems,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        WishlistItem::firstOrCreate([
            'user_id' => auth()->id(),
            'product_id' => $validated['product_id'],
        ]);

        return back()->with('success', 'Product added to wishlist');
    }

    public function destroy(WishlistItem $wishlistItem)
    {
        if ($wishlistItem->user_id !== auth()->id()) {
            abort(403);
        }

        $wishlistItem->delete();

        return back()->with('success', 'Product removed from wishlist');
    }
}
