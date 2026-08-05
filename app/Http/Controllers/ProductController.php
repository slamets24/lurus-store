<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $query = Product::with(['category', 'images', 'publishedVariants'])
            ->where('is_active', true);

        $categorySlug = request('category');
        if ($categorySlug) {
            $category = Category::where('slug', $categorySlug)
                ->where('is_active', true)
                ->first();
            if ($category) {
                $query->where('category_id', $category->id);
            } else {
                $query->whereRaw('1 = 0');
            }
        }

        $products = $query->latest()->paginate(12);

        $categories = Category::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        return Inertia::render('Products', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function show($slug)
    {
        $product = Product::with(['category', 'images', 'publishedVariants', 'relatedFitProduct'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $relatedFit = $product->relatedFitProduct;
        if ($relatedFit && ! $relatedFit->is_active) {
            $relatedFit = null;
        }

        $card = fn (Product $item) => [
            'id' => $item->id,
            'name' => $item->name,
            'slug' => $item->slug,
            'price' => (float) $item->price,
            'discount_percent' => (float) ($item->discount_percent ?? 0),
            'stock' => $item->publishedVariants->isNotEmpty()
                ? $item->publishedVariants->sum('stock')
                : $item->stock,
            'category' => $item->category
                ? ['name' => $item->category->name, 'slug' => $item->category->slug]
                : null,
            'images' => $item->images->take(1)->map(fn (ProductImage $image) => [
                'image_path' => $image->image_path,
                'thumb_path' => $image->thumb_path,
            ])->values(),
            'published_variants' => $item->publishedVariants->map(fn ($variant) => [
                'stock' => $variant->stock,
            ])->values(),
        ];

        $recommendedProducts = Product::with(['category', 'images', 'publishedVariants'])
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->inRandomOrder()
            ->limit(8)
            ->get()
            ->map($card);

        $latestProducts = Product::with(['category', 'images', 'publishedVariants'])
            ->where('is_active', true)
            ->where('id', '!=', $product->id)
            ->latest()
            ->limit(4)
            ->get()
            ->map($card);

        return Inertia::render('ProductDetail', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => (float) $product->price,
                'discount_percent' => (float) ($product->discount_percent ?? 0),
                'description' => $product->description,
                'stock' => $product->stock,
                'sizes' => $product->sizes ?? [],
                'colors' => $product->colors ?? [],
                'color_hexes' => $product->color_hexes ?? [],
                'material' => $product->material,
                'care_instructions' => $product->care_instructions,
                'shopee_url' => $product->shopee_url,
                'tokopedia_url' => $product->tokopedia_url,
                'tiktok_url' => $product->tiktok_url,
                'size_chart_url' => $product->category?->sizeChartUrl(),
                'related_fit' => $relatedFit
                    ? [
                        'id' => $relatedFit->id,
                        'name' => $relatedFit->name,
                        'slug' => $relatedFit->slug,
                    ]
                    : null,
                'category' => $product->category
                    ? ['name' => $product->category->name, 'slug' => $product->category->slug]
                    : null,
                'images' => $product->images->map(fn (ProductImage $image) => [
                    'id' => $image->id,
                    'image_path' => $image->image_path,
                    'thumb_path' => $image->thumb_path,
                    'color' => $image->color,
                ])->values(),
                'published_variants' => $product->publishedVariants->map(fn ($variant) => [
                    'color' => $variant->color,
                    'size' => $variant->size,
                    'stock' => $variant->stock,
                ])->values(),
            ],
            'recommendedProducts' => $recommendedProducts,
            'latestProducts' => $latestProducts,
        ]);
    }

    public function featured()
    {
        $products = Product::with(['category', 'images', 'publishedVariants'])
            ->where('is_active', true)
            ->where('is_featured', true)
            ->latest()
            ->limit(8)
            ->get();

        return response()->json($products);
    }
}
