<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class N8nProductController extends Controller
{
    /**
     * Ambil 1 produk fashion yang stoknya masih ada dan belum diposting dalam 30 hari terakhir.
     */
    public function getReadyToPost(Request $request): JsonResponse
    {
        $product = Product::with(['category', 'images'])
            ->where('is_active', true)
            ->where('stock', '>', 0)
            ->where(function ($query) {
                $query->whereNull('last_posted_to_fb_at')
                      ->orWhere('last_posted_to_fb_at', '<=', now()->subDays(30));
            })
            ->orderByRaw('last_posted_to_fb_at ASC NULLS FIRST')
            ->orderBy('id', 'asc')
            ->first();

        if (! $product) {
            return response()->json([
                'status' => 'empty',
                'message' => 'Tidak ada produk yang siap diposting saat ini (semua sudah diposting dalam 30 hari atau stok habis).',
                'data' => null,
            ]);
        }

        $primaryImage = $product->images->where('is_primary', true)->first() ?? $product->images->first();
        $imageUrl = $primaryImage ? $primaryImage->image_path : null;
        if ($imageUrl && ! str_starts_with($imageUrl, 'http://') && ! str_starts_with($imageUrl, 'https://')) {
            $imageUrl = url($imageUrl);
        }

        $effectivePrice = method_exists($product, 'effectiveUnitPrice')
            ? $product->effectiveUnitPrice()
            : (float) $product->price;

        return response()->json([
            'status' => 'success',
            'data' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'category' => $product->category?->name ?? 'Fashion',
                'price' => (float) $product->price,
                'discount_percent' => (float) ($product->discount_percent ?? 0),
                'effective_price' => $effectivePrice,
                'description' => trim(strip_tags($product->description ?? '')),
                'material' => $product->material,
                'sizes' => $product->sizes,
                'colors' => $product->colors,
                'stock' => $product->stock,
                'product_url' => url('/products/'.$product->slug),
                'image_url' => $imageUrl,
                'is_repost' => ! is_null($product->last_posted_to_fb_at),
                'fb_post_count' => (int) ($product->fb_post_count ?? 0),
                'last_posted_to_fb_at' => $product->last_posted_to_fb_at?->toIso8601String(),
            ],
        ]);
    }

    /**
     * Tandai produk telah berhasil diposting ke Facebook Fanspage.
     */
    public function markPosted(Request $request, int $id): JsonResponse
    {
        $product = Product::findOrFail($id);
        $product->last_posted_to_fb_at = now();
        $product->fb_post_count = ((int) $product->fb_post_count) + 1;
        $product->save();

        return response()->json([
            'status' => 'success',
            'message' => "Produk #{$product->id} berhasil ditandai telah diposting.",
            'data' => [
                'id' => $product->id,
                'last_posted_to_fb_at' => $product->last_posted_to_fb_at->toIso8601String(),
                'fb_post_count' => $product->fb_post_count,
            ],
        ]);
    }
}
