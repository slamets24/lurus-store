<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
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

        $products = $query->latest()->paginate(12)->withQueryString();

        $products->getCollection()->transform(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => (float) $product->price,
                'discount_percent' => (float) ($product->discount_percent ?? 0),
                'effective_price' => $product->effectiveUnitPrice(),
                'stock' => $product->publishedVariants->isNotEmpty()
                    ? $product->publishedVariants->sum('stock')
                    : $product->stock,
                'category' => $product->category
                    ? ['name' => $product->category->name, 'slug' => $product->category->slug]
                    : null,
                'image' => $product->images->first()?->image_path,
                'hover_image' => $product->images->skip(1)->first()?->image_path,
                'images' => $product->images->map(fn ($img) => [
                    'image_path' => $img->image_path,
                    'thumb_path' => $img->thumb_path,
                ])->values()->all(),
                'is_new' => $product->created_at && $product->created_at->diffInDays(now()) <= 30,
                'is_preorder' => (bool) $product->is_preorder,
                'preorder_estimate_days' => $product->preorder_estimate_days,
                'preorder_release_date' => $product->preorder_release_date?->format('d M Y'),
                'preorder_note' => $product->preorder_note,
            ];
        });

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
        $product = Product::with(['category', 'images', 'publishedVariants', 'relatedFitProduct', 'offers.components'])
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
            'is_preorder' => (bool) $item->is_preorder,
            'preorder_estimate_days' => $item->preorder_estimate_days,
            'preorder_release_date' => $item->preorder_release_date?->format('d M Y'),
            'preorder_note' => $item->preorder_note,
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
                'is_preorder' => (bool) $product->is_preorder,
                'preorder_estimate_days' => $product->preorder_estimate_days,
                'preorder_release_date' => $product->preorder_release_date?->format('d M Y'),
                'preorder_note' => $product->preorder_note,
                'sizes' => $product->sizes ?? [],
                'colors' => $product->colors ?? [],
                'color_hexes' => $product->color_hexes ?? [],
                'material' => $product->material,
                'care_instructions' => $product->care_instructions,
                'shopee_url' => $product->shopee_url,
                'tokopedia_url' => $product->tokopedia_url,
                'tiktok_url' => $product->tiktok_url,
                'size_chart_url' => $product->category?->sizeChartUrl(),
                'size_guide_images' => collect($product->size_guide_images ?? [])
                    ->filter(fn ($path) => is_string($path) && $path !== '')
                    ->map(fn (string $path) => Str::startsWith($path, ['http://', 'https://', '/']) ? $path : Storage::url($path))
                    ->values(),
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
                    'component_id' => $variant->component_id,
                    'color' => $variant->color,
                    'size' => $variant->size,
                    'stock' => $variant->stock,
                    'price' => $variant->price !== null ? (float) $variant->price : null,
                ])->values(),
                'offers' => $product->offers->map(fn ($offer) => [
                    'id' => $offer->id,
                    'name' => $offer->name,
                    'price' => (float) $offer->price,
                    'components' => $offer->components->map(fn ($component) => [
                        'id' => $component->id,
                        'name' => $component->name,
                    ])->values(),
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
