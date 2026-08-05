<?php

namespace App\Support;

use App\Models\Category;
use App\Models\Collection;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\StoreContentSetting;
use App\Models\User;
use App\Services\EmbeddingService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DemoCatalogImporter
{
    private array $payload = [];

    /** @var array<string, int> */
    private array $categoryIds = [];

    /** @var array<string, int> */
    private array $collectionIds = [];

    /** @var array<string, int> */
    private array $productIds = [];

    public function __construct(
        private readonly EmbeddingService $embeddings,
    ) {}

    public function import(?string $fixturePath = null, bool $force = false): bool
    {
        if (! $force && Product::query()->exists()) {
            return false;
        }

        $path = $fixturePath ?? database_path('fixtures/demo-catalog.json');
        if (! is_file($path)) {
            throw new \RuntimeException("Demo catalog fixture not found: {$path}");
        }

        $this->payload = json_decode((string) file_get_contents($path), true, flags: JSON_THROW_ON_ERROR);

        $this->importUsers();
        $this->importCategories();
        $this->importCollections();
        $this->importProducts();
        $this->importStoreSettings();

        StoreContentSetting::putValue('demo_catalog_version', (int) ($this->payload['version'] ?? 1));

        return true;
    }

    private function importUsers(): void
    {
        $password = env('DEMO_ADMIN_PASSWORD', env('SEED_ADMIN_PASSWORD'));

        if (app()->isProduction() && blank($password)) {
            return;
        }

        $password ??= 'Admin123!';
        $userIds = [];

        foreach ($this->payload['users'] ?? [] as $row) {
            $user = User::query()->firstOrNew(['email' => $row['email']]);
            $user->fill([
                'name' => $row['name'],
                'password' => Hash::make($password),
            ]);
            $user->role = $row['role'];
            $user->email_verified_at = now();

            if (! empty($row['created_by']) && isset($userIds[$row['created_by']])) {
                $user->created_by_user_id = $userIds[$row['created_by']];
            }

            $user->save();
            $userIds[$row['email']] = $user->id;
        }
    }

    private function importCategories(): void
    {
        foreach ($this->payload['categories'] ?? [] as $row) {
            $category = Category::query()->updateOrCreate(
                ['slug' => $row['slug']],
                [
                    'name' => $row['name'],
                    'description' => $row['description'] ?? null,
                    'is_active' => true,
                    'sort_order' => $row['sort_order'] ?? 0,
                ],
            );

            $this->categoryIds[$row['slug']] = $category->id;
        }
    }

    private function importCollections(): void
    {
        foreach ($this->payload['collections'] ?? [] as $row) {
            $collection = Collection::query()->updateOrCreate(
                ['slug' => $row['slug']],
                [
                    'name' => $row['name'],
                    'description' => $row['description'] ?? null,
                    'subtitle' => $row['subtitle'] ?? null,
                    'is_active' => true,
                    'sort_order' => $row['sort_order'] ?? 0,
                ],
            );

            $this->collectionIds[$row['slug']] = $collection->id;
        }
    }

    private function importProducts(): void
    {
        foreach ($this->payload['products'] ?? [] as $row) {
            $existing = Product::query()->where('sku', $row['sku'])->first();
            if ($existing) {
                $this->productIds[$row['sku']] = $existing->id;
                $this->attachCollections($existing, $row['collection_slugs'] ?? []);

                continue;
            }

            $categoryId = $this->categoryIds[$row['category_slug']] ?? null;
            if (! $categoryId) {
                continue;
            }

            $text = implode('. ', array_filter([
                $row['name'],
                $row['description'] ?? null,
                isset($row['material']) ? 'Material: '.$row['material'] : null,
            ]));

            $product = Product::query()->create([
                'category_id' => $categoryId,
                'name' => $row['name'],
                'slug' => Str::slug($row['name']),
                'description' => $row['description'] ?? null,
                'price' => $row['price'],
                'discount_percent' => $row['discount_percent'] ?? 0,
                'stock' => $row['stock'] ?? 0,
                'sku' => $row['sku'],
                'colors' => $row['colors'] ?? [],
                'sizes' => $row['sizes'] ?? [],
                'color_hexes' => $this->colorHexes($row['colors'] ?? []),
                'material' => $row['material'] ?? null,
                'is_active' => true,
                'is_featured' => (bool) ($row['is_featured'] ?? false),
                'embedding' => $this->embeddings->fallbackEmbedding($text),
            ]);

            $this->productIds[$row['sku']] = $product->id;
            $this->createVariants($product, $row);
            $this->createImages($product);
            $this->attachCollections($product, $row['collection_slugs'] ?? []);
        }
    }

    private function createVariants(Product $product, array $row): void
    {
        $colors = $row['colors'] ?? ['Default'];
        $sizes = $row['sizes'] ?? ['One Size'];
        $totalStock = (int) ($row['stock'] ?? 0);
        $variantCount = max(1, count($colors) * count($sizes));
        $index = 0;

        foreach ($colors as $color) {
            foreach ($sizes as $size) {
                ProductVariant::query()->create([
                    'product_id' => $product->id,
                    'sku' => $this->variantSku($product->sku, $color, $size),
                    'color' => $color,
                    'size' => $size,
                    'stock' => $this->splitStock($totalStock, $index, $variantCount),
                    'status' => 'published',
                ]);
                $index++;
            }
        }
    }

    private function createImages(Product $product): void
    {
        $label = urlencode($product->name);
        $palette = ['efeee9', 'e9e8e3', 'dbdad5'];

        foreach ($palette as $i => $color) {
            ProductImage::query()->create([
                'product_id' => $product->id,
                'image_path' => "https://placehold.co/800x1000/{$color}/53433e?text={$label}",
                'is_primary' => $i === 0,
                'sort_order' => $i + 1,
            ]);
        }
    }

    /** @param  list<string>  $slugs */
    private function attachCollections(Product $product, array $slugs): void
    {
        $sync = [];
        foreach ($slugs as $order => $slug) {
            if (isset($this->collectionIds[$slug])) {
                $sync[$this->collectionIds[$slug]] = ['sort_order' => $order];
            }
        }

        if ($sync !== []) {
            $product->collections()->sync($sync);
        }
    }

    private function importStoreSettings(): void
    {
        $settings = $this->payload['store_settings'] ?? [];

        foreach ([
            'announcement_bar' => $settings['announcement_bar'] ?? null,
            'home_sections' => $settings['home_sections'] ?? null,
            'social_links' => $settings['social_links'] ?? null,
            'promo_popup' => $settings['promo_popup'] ?? null,
            'payment_settings' => $settings['payment_settings'] ?? null,
            'shipping_settings' => $settings['shipping_settings'] ?? null,
        ] as $key => $value) {
            if ($value !== null) {
                StoreContentSetting::putValue($key, $value);
            }
        }

        if (! empty($settings['whatsapp_number'])) {
            StoreContentSetting::putValue('whatsapp_number', $settings['whatsapp_number']);
        }

        $featuredIds = collect($settings['featured_product_skus'] ?? [])
            ->map(fn (string $sku) => $this->productIds[$sku] ?? null)
            ->filter()
            ->values()
            ->all();

        if ($featuredIds !== []) {
            StoreContentSetting::putValue('featured_product_ids', $featuredIds);
        }
    }

    private function variantSku(string $sku, string $color, string $size): string
    {
        return $sku.'-'.Str::upper(Str::slug($color.$size, ''));
    }

    private function splitStock(int $total, int $index, int $count): int
    {
        if ($total <= 0) {
            return 0;
        }

        $base = intdiv($total, $count);

        return $base + ($index < ($total % $count) ? 1 : 0);
    }

    /** @param  list<string>  $colors */
    private function colorHexes(array $colors): array
    {
        $map = [
            'Black' => '#1B1B1B',
            'Ivory' => '#F5F0E8',
            'Dusty Blue' => '#6B8FA3',
            'Sand' => '#C2B280',
            'Olive' => '#556B2F',
            'Mocha' => '#8B7355',
            'Rose' => '#C9848A',
            'Navy' => '#1B2A4A',
            'Taupe' => '#8B8580',
            'Grey' => '#9CA3AF',
            'Cream' => '#F5E6C8',
            'Khaki' => '#C3B091',
            'Beige' => '#D8C3A5',
            'Brown' => '#6B4F3A',
            'Blush' => '#E8B4B8',
            'Sage' => '#9CAF88',
            'Natural' => '#E8DCC8',
            'Gold' => '#C5A572',
            'Dusty Pink' => '#D4A5A5',
            'Grey Blue' => '#7B8FA1',
            'Nude' => '#E3BC9A',
        ];

        return collect($colors)
            ->mapWithKeys(fn (string $color) => [$color => $map[$color] ?? '#CCCCCC'])
            ->all();
    }
}
