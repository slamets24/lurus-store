<?php

namespace App\Support;

use App\Models\HomeSection;
use App\Models\HomeSectionItem;
use App\Models\Product;
use App\Services\HomePageService;
use Illuminate\Support\Collection;

class HomeSections
{
    /**
     * @return array<string, string>
     */
    public static function types(): array
    {
        return [
            'announcement' => 'Pengumuman atas',
            'hero' => 'Hero layar penuh',
            'product_rail' => 'Produk geser',
            'category_tiles' => 'Panel kategori',
            'collection_tabs' => 'Koleksi bertab',
            'editorial' => 'Foto editorial',
            'faq' => 'Pertanyaan',
        ];
    }

    /**
     * @return array<int, string>
     */
    public static function announcements(): array
    {
        return HomeSection::query()
            ->where('type', 'announcement')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->flatMap(function (HomeSection $section) {
                $messages = $section->config_json['messages'] ?? [];

                return is_array($messages) ? $messages : [];
            })
            ->map(fn ($message) => trim((string) $message))
            ->filter()
            ->values()
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public static function forStorefront(): array
    {
        return HomeSection::query()
            ->where('is_active', true)
            ->whereNotIn('type', ['announcement', 'popup'])
            ->with(['items' => fn ($query) => $query
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->with([
                    'product.category',
                    'product.images',
                    'product.publishedVariants',
                    'category' => fn ($categories) => $categories->withCount('products'),
                ]),
            ])
            ->orderBy('sort_order')
            ->get()
            ->map(fn (HomeSection $section) => self::present($section))
            ->values()
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    private static function present(HomeSection $section): array
    {
        $config = $section->config_json ?? [];
        $payload = [
            'id' => $section->id,
            'type' => $section->type,
            'title' => $section->title,
            'subtitle' => $section->subtitle,
            'content' => $section->content,
            'image' => $section->image_path,
            'link' => $section->link_url,
            'button' => $section->button_label,
        ];

        return match ($section->type) {
            'hero' => $payload + [
                'slides' => $section->items->map(function (HomeSectionItem $item) use ($section) {
                    $config = $item->config_json ?? [];
                    $point = self::slidePoint($config);
                    $mobile = $config['mobile_image'] ?? null;

                    return [
                        'title' => filled($item->title) ? $item->title : null,
                        'subtitle' => $item->subtitle,
                        'image' => $item->image_path,
                        'mobileImage' => filled($mobile) ? $mobile : $item->image_path,
                        'link' => $item->link_url ?: ($section->link_url ?: '/products'),
                        'button' => filled($item->subtitle) ? $item->subtitle : null,
                        'x' => $point['x'],
                        'y' => $point['y'],
                    ];
                })->values()->all(),
            ],
            'product_rail' => $payload + [
                'products' => self::resolveProducts(
                    (string) ($config['source'] ?? 'latest'),
                    (int) ($config['limit'] ?? 8),
                    null,
                    $section->items->pluck('product_id')->filter()->map(fn ($id) => (int) $id)->all(),
                ),
            ],
            'category_tiles' => $payload + [
                'tiles' => $section->items->map(function (HomeSectionItem $item) {
                    $category = $item->category;

                    return [
                        'title' => $item->title ?: $category?->name,
                        'image' => $item->image_path ?: $category?->image,
                        'link' => $item->link_url ?: ($category ? '/categories/'.$category->slug : '/categories'),
                        'count' => $category?->products_count,
                    ];
                })->values()->all(),
            ],
            'collection_tabs' => $payload + [
                'tabs' => $section->items->map(function (HomeSectionItem $item) {
                    $config = $item->config_json ?? [];

                    return [
                        'title' => $item->title,
                        'link' => $item->link_url ?: '/products',
                        'products' => self::resolveProducts(
                            (string) ($config['source'] ?? 'latest'),
                            (int) ($config['limit'] ?? 8),
                            $item->category_id,
                            array_map('intval', $config['product_ids'] ?? []),
                        ),
                    ];
                })->values()->all(),
            ],
            'faq' => $payload + [
                'faqs' => collect($config['items'] ?? [])
                    ->filter(fn ($item) => is_array($item) && filled($item['question'] ?? null))
                    ->map(fn ($item) => [
                        'question' => (string) $item['question'],
                        'answer' => (string) ($item['answer'] ?? ''),
                    ])
                    ->values()
                    ->all(),
            ],
            default => $payload,
        };
    }

    /**
     * @param  array<string, mixed>  $config
     * @return array{x: float, y: float}
     */
    private static function slidePoint(array $config): array
    {
        if (is_numeric($config['x'] ?? null) && is_numeric($config['y'] ?? null)) {
            return [
                'x' => self::percent($config['x']),
                'y' => self::percent($config['y']),
            ];
        }

        return match ($config['align'] ?? 'center') {
            'top' => ['x' => 50.0, 'y' => 16.0],
            'bottom' => ['x' => 50.0, 'y' => 84.0],
            'left' => ['x' => 16.0, 'y' => 50.0],
            'right' => ['x' => 84.0, 'y' => 50.0],
            'bottom-left' => ['x' => 16.0, 'y' => 84.0],
            'bottom-right' => ['x' => 84.0, 'y' => 84.0],
            default => ['x' => 50.0, 'y' => 50.0],
        };
    }

    private static function percent(mixed $value): float
    {
        return round(min(100, max(0, (float) $value)), 1);
    }

    /**
     * @param  array<int, int>  $productIds
     * @return array<int, array<string, mixed>>
     */
    private static function resolveProducts(string $source, int $limit, ?int $categoryId, array $productIds): array
    {
        $limit = min(24, max(1, $limit ?: 8));
        $query = Product::query()->where('is_active', true)->with(['category', 'images', 'publishedVariants']);

        if ($source === 'manual') {
            $ids = array_values(array_filter($productIds));

            if ($ids === []) {
                return [];
            }

            $products = $query->whereIn('id', $ids)->get()
                ->sortBy(fn (Product $product) => array_search($product->id, $ids, true))
                ->values();

            return self::cards($products);
        }

        if ($source === 'featured') {
            $query->where('is_featured', true);
        }

        if ($source === 'category' && $categoryId) {
            $query->where('category_id', $categoryId);
        }

        return self::cards($query->latest()->limit($limit)->get());
    }

    /**
     * @param  Collection<int, Product>  $products
     * @return array<int, array<string, mixed>>
     */
    private static function cards(Collection $products): array
    {
        $home = app(HomePageService::class);

        return $products->map(fn (Product $product) => $home->productCard($product))->values()->all();
    }
}
