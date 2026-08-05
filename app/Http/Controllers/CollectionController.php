<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use App\Models\OrderItem;
use App\Models\Product;
use Inertia\Inertia;

class CollectionController extends Controller
{
    public function index()
    {
        $collections = Collection::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Collections/Index', [
            'collections' => $collections,
        ]);
    }

    public function show($slug)
    {
        if ($dynamicCollection = $this->dynamicCollection($slug)) {
            return Inertia::render('CollectionDetail', $dynamicCollection);
        }

        $collection = Collection::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $products = $collection->products()
            ->with(['category', 'images', 'publishedVariants'])
            ->where('is_active', true)
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('CollectionDetail', [
            'collection' => $collection->only([
                'id',
                'name',
                'slug',
                'description',
                'subtitle',
                'banner_image',
            ]),
            'products' => $products,
        ]);
    }

    private function dynamicCollection(string $slug): ?array
    {
        $definitions = [
            'new-collection' => [
                'name' => 'New Collection',
                'subtitle' => 'Fresh styles curated just for you',
                'description' => 'Latest arrivals for this season',
                'products' => fn () => Product::with(['category', 'images', 'publishedVariants'])
                    ->where('is_active', true)
                    ->latest()
                    ->paginate(12)
                    ->withQueryString(),
            ],
            'best-sellers' => [
                'name' => 'Best Sellers',
                'subtitle' => 'Loved by our customers',
                'description' => 'Most popular items',
                'products' => fn () => $this->bestSellerProducts(),
            ],
            'premium' => [
                'name' => 'Premium Line',
                'subtitle' => 'The finest craftsmanship',
                'description' => 'Exclusive premium quality',
                'products' => fn () => Product::with(['category', 'images', 'publishedVariants'])
                    ->where('is_active', true)
                    ->orderByDesc('price')
                    ->paginate(12)
                    ->withQueryString(),
            ],
            'premium-line' => [
                'name' => 'Premium Line',
                'subtitle' => 'The finest craftsmanship',
                'description' => 'Exclusive premium quality',
                'products' => fn () => Product::with(['category', 'images', 'publishedVariants'])
                    ->where('is_active', true)
                    ->orderByDesc('price')
                    ->paginate(12)
                    ->withQueryString(),
            ],
        ];

        if (! isset($definitions[$slug])) {
            return null;
        }

        $definition = $definitions[$slug];

        return [
            'collection' => [
                'id' => 0,
                'name' => $definition['name'],
                'slug' => $slug,
                'description' => $definition['description'],
                'subtitle' => $definition['subtitle'],
                'banner_image' => null,
            ],
            'products' => $definition['products'](),
        ];
    }

    private function bestSellerProducts()
    {
        $sold = OrderItem::selectRaw('product_id, SUM(quantity) as total_sold')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->whereNotNull('product_id')
            ->where('orders.payment_status', 'paid')
            ->whereNotIn('orders.status', ['cancelled'])
            ->groupBy('product_id');

        $products = Product::with(['category', 'images', 'publishedVariants'])
            ->leftJoinSub($sold, 'sold', fn ($join) => $join->on('products.id', '=', 'sold.product_id'))
            ->where('products.is_active', true)
            ->whereNotNull('sold.total_sold')
            ->select('products.*', 'sold.total_sold')
            ->orderByDesc('sold.total_sold')
            ->latest('products.created_at')
            ->paginate(12)
            ->withQueryString();

        if ($products->total() > 0) {
            return $products;
        }

        return Product::with(['category', 'images', 'publishedVariants'])
            ->where('is_active', true)
            ->latest()
            ->paginate(12)
            ->withQueryString();
    }
}
