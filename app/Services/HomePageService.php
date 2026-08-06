<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Product;
use App\Models\StoreContentSetting;

class HomePageService
{
    /** @return list<array{key: string, label: string, categories: list<array{name: string, slug: string}>, products: list<array<string, mixed>>, productsByCategory: array<string, list<array<string, mixed>>>}> */
    public function sections(): array
    {
        $config = StoreContentSetting::value('home_sections', $this->defaultSections());
        $sections = [];

        foreach ($config as $section) {
            $categorySlugs = $section['category_slugs'] ?? [];
            $categories = Category::query()
                ->whereIn('slug', $categorySlugs)
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get(['name', 'slug'])
                ->map(fn (Category $category) => [
                    'name' => $category->name,
                    'slug' => $category->slug,
                ])
                ->values()
                ->all();

            $productsByCategory = [];
            foreach ($categories as $category) {
                $productsByCategory[$category['slug']] = $this->productsForCategorySlug($category['slug']);
            }

            $firstSlug = $categories[0]['slug'] ?? null;

            $sections[] = [
                'key' => (string) ($section['key'] ?? 'section'),
                'label' => (string) ($section['label'] ?? 'Collection'),
                'categories' => $categories,
                'products' => $firstSlug ? ($productsByCategory[$firstSlug] ?? []) : [],
                'productsByCategory' => $productsByCategory,
            ];
        }

        return $sections;
    }

    /** @return array{enabled: bool, text: string, link: ?string} */
    public function announcementBar(): array
    {
        $settings = StoreContentSetting::value('announcement_bar', []);

        return [
            'enabled' => (bool) ($settings['enabled'] ?? true),
            'text' => (string) ($settings['text'] ?? "Don't wait — shop now"),
            'link' => $settings['link'] ?? null,
        ];
    }

    /** @return list<array<string, mixed>> */
    public function productsForCategorySlug(string $slug, int $limit = 4): array
    {
        $category = Category::query()->where('slug', $slug)->first();
        if (! $category) {
            return [];
        }

        return Product::query()
            ->with(['images', 'publishedVariants'])
            ->where('is_active', true)
            ->where('category_id', $category->id)
            ->latest()
            ->limit($limit)
            ->get()
            ->map(fn (Product $product) => $this->productCard($product))
            ->values()
            ->all();
    }

    /** @return array<string, mixed> */
    public function productCard(Product $product): array
    {
        $images = $product->images;

        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'price' => (float) $product->price,
            'discount_percent' => (float) ($product->discount_percent ?? 0),
            'effective_price' => $product->effectiveUnitPrice(),
            'image' => $images->first()?->image_path,
            'hover_image' => $images->skip(1)->first()?->image_path,
            'is_new' => $product->created_at?->gt(now()->subDays(30)) ?? false,
            'stock' => $product->publishedVariants->isNotEmpty()
                ? $product->publishedVariants->sum(fn ($variant) => max(0, $variant->stock - $variant->stock_reserved))
                : max(0, $product->stock - $product->stock_reserved),
        ];
    }

    /** @return list<array<string, mixed>> */
    private function defaultSections(): array
    {
        return [
            [
                'key' => 'apparels',
                'label' => 'Apparels',
                'category_slugs' => ['blouse', 'dress', 'skirt', 'pants', 'koko'],
            ],
            [
                'key' => 'essentials',
                'label' => 'Essentials',
                'category_slugs' => ['scarves', 'shoes', 'bag', 'accessories', 'prayer-set'],
            ],
        ];
    }
}
