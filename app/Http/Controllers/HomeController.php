<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\StoreContentSetting;
use App\Models\Testimonial;
use App\Services\HomePageService;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function __construct(private readonly HomePageService $homePage) {}

    public function __invoke()
    {
        $featuredProductIds = StoreContentSetting::value('featured_product_ids', []);
        $categories = Category::withCount('products')
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get()
            ->map(fn ($category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'image' => $category->image,
                'products_count' => $category->products_count,
            ]);

        return Inertia::render('Home', [
            'categories' => $categories,
            'announcementBar' => $this->homePage->announcementBar(),
            'homeSections' => $this->homePage->sections(),
            'heroBanners' => collect(StoreContentSetting::heroBanners())
                ->filter(fn (array $banner) => ! empty($banner['desktop_image']) || ! empty($banner['mobile_image']))
                ->map(fn (array $banner) => [
                    'id' => $banner['id'],
                    'desktopImage' => ! empty($banner['desktop_image']) ? Storage::url($banner['desktop_image']) : null,
                    'mobileImage' => ! empty($banner['mobile_image']) ? Storage::url($banner['mobile_image']) : null,
                    'link' => $banner['link'] ?? null,
                ])
                ->values()
                ->all(),

            'featuredProducts' => $this->featuredProducts($featuredProductIds),
            'featuredCollectionCards' => $this->featuredCollectionCards(),
            'testimonials' => Testimonial::with('orderItem')
                ->whereNotNull('approved_at')
                ->latest('approved_at')
                ->limit(8)
                ->get()
                ->map(fn ($testimonial) => [
                    'id' => $testimonial->id,
                    'name' => $testimonial->customer_name,
                    'rating' => $testimonial->rating,
                    'comment' => $testimonial->comment,
                    'product_name' => $testimonial->orderItem?->product_name,
                ]),
        ]);
    }

    private function featuredProducts(array $ids)
    {
        if (empty($ids)) {
            return Product::with(['images', 'publishedVariants'])
                ->where('is_active', true)
                ->latest()
                ->limit(8)
                ->get()
                ->map(fn ($product) => $this->productCard($product));
        }

        $products = Product::with(['images', 'publishedVariants'])
            ->where('is_active', true)
            ->whereIn('id', $ids)
            ->get()
            ->keyBy('id');

        return collect($ids)
            ->map(fn ($id) => $products->get($id))
            ->filter()
            ->map(fn ($product) => $this->productCard($product))
            ->values();
    }

    private function featuredCollectionCards()
    {
        $latest = Product::with(['images', 'publishedVariants'])->where('is_active', true)->latest()->first();
        $bestSellerId = OrderItem::selectRaw('product_id, SUM(quantity) as total_sold')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->whereNotNull('product_id')
            ->where('orders.payment_status', 'paid')
            ->whereNotIn('orders.status', ['cancelled'])
            ->groupBy('product_id')
            ->orderByDesc('total_sold')
            ->value('product_id');
        $bestSeller = $bestSellerId
            ? Product::with(['images', 'publishedVariants'])->where('is_active', true)->find($bestSellerId)
            : Product::with(['images', 'publishedVariants'])->where('is_active', true)->latest()->skip(1)->first();
        $premium = Product::with(['images', 'publishedVariants'])->where('is_active', true)->orderByDesc('price')->first();

        return collect([
            ['title' => 'New Collection', 'slug' => 'new-collection', 'subtitle' => 'Latest arrivals for this season', 'product' => $latest],
            ['title' => 'Best Sellers', 'slug' => 'best-sellers', 'subtitle' => 'Most popular items', 'product' => $bestSeller],
            ['title' => 'Premium Line', 'slug' => 'premium', 'subtitle' => 'Exclusive premium quality', 'product' => $premium],
        ])->filter(fn ($card) => $card['product'])
            ->map(fn ($card) => [
                'title' => $card['title'],
                'slug' => $card['slug'],
                'subtitle' => $card['subtitle'],
                'product' => $this->productCard($card['product']),
            ])
            ->values();
    }

    private function productCard(Product $product): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'price' => (float) $product->price,
            'discount_percent' => (float) ($product->discount_percent ?? 0),
            'effective_price' => $product->effectiveUnitPrice(),
            'image' => $product->images->first()?->image_path,
            'stock' => $product->publishedVariants->isNotEmpty()
                ? $product->publishedVariants->sum('stock')
                : $product->stock,
        ];
    }
}
