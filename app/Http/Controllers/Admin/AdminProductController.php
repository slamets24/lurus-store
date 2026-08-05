<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Support\Html;
use App\Support\WebpImage;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AdminProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category', 'images', 'variants');

        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhereHas('variants', fn ($variantQuery) => $variantQuery->where('sku', 'like', "%{$search}%"));
            });
        }

        if ($category = $request->category) {
            $query->where('category_id', $category);
        }

        $products = $query->latest()->paginate(10)->withQueryString();

        $products->getCollection()->transform(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => (float) $product->price,
                'discount_percent' => (float) ($product->discount_percent ?? 0),
                'effective_price' => $product->effectiveUnitPrice(),
                'stock' => $product->stock,
                'sku' => $product->sku,
                'description' => $product->description,
                'sizes' => $product->sizes,
                'colors' => $product->colors,
                'color_hexes' => $product->color_hexes,
                'material' => $product->material,
                'status' => $product->is_active ? 'published' : 'draft',
                'is_active' => $product->is_active,
                'is_featured' => $product->is_featured,
                'category' => $product->category ? ['id' => $product->category->id, 'name' => $product->category->name] : null,
                'images' => $product->images->map(fn ($img) => [
                    'id' => $img->id,
                    'image_path' => $img->image_path,
                    'is_primary' => $img->is_primary,
                ]),
                'variants' => $product->variants->map(fn ($variant) => [
                    'id' => $variant->id,
                    'sku' => $variant->sku,
                    'color' => $variant->color,
                    'size' => $variant->size,
                    'stock' => $variant->stock,
                    'status' => $variant->status,
                ])->values(),
                'created_at' => $product->created_at->toISOString(),
            ];
        });

        $categories = Category::where('is_active', true)->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'filters' => $request->only(['search', 'category', 'page']),
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        $categories = Category::where('is_active', true)->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Products/Form', [
            'product' => null,
            'categories' => $categories,
            'fitProductOptions' => $this->fitProductOptions(),
            'variantOptions' => $this->variantOptions(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|max:255',
            'description' => 'nullable',
            'price' => 'required|numeric|min:0',
            'discount_percent' => 'nullable|numeric|min:0|max:100',
            'sku' => 'nullable|max:100|unique:products,sku',
            'category_id' => 'nullable|exists:categories,id',
            'category_name' => 'required|string|max:255',
            'sizes' => 'nullable|array',
            'sizes.*' => 'string',
            'colors' => 'nullable|array',
            'colors.*' => 'string',
            'color_hexes' => 'nullable|array',
            'color_hexes.*' => ['nullable', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'variants' => 'required|array|min:1',
            'variants.*.color' => 'required|string|max:255',
            'variants.*.size' => 'required|string|max:255',
            'variants.*.stock' => 'required|integer|min:0',
            'material' => 'nullable|max:255',
            'shopee_url' => 'nullable|url:http,https|max:500',
            'tokopedia_url' => 'nullable|url:http,https|max:500',
            'tiktok_url' => 'nullable|url:http,https|max:500',
            'related_fit_product_id' => 'nullable|exists:products,id',
            'is_featured' => 'boolean',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048',
            'image_colors' => 'nullable|array',
            'image_colors.*' => 'nullable|string|max:255',
        ]);

        $this->prepareProductPayload($validated);
        $this->validateImageColors($validated);
        $category = $this->resolveCategory($validated['category_name'] ?? null, $validated['category_id'] ?? null);
        $validated['category_id'] = $category?->id;
        $validated['slug'] = $this->makeProductSlug($validated['name'], $category?->name);
        $validated['sku'] = ($validated['sku'] ?? null) ?: $this->makeArticleCode($validated['name']);
        $validated['is_active'] = true;

        $product = Product::create($this->productPayload($validated));
        $this->syncVariants($product, $validated);
        $this->syncRelatedFit($product, $validated['related_fit_product_id'] ?? null);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $i => $image) {
                $path = $this->storeProductImageAsWebp($image);
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $path,
                    'color' => $this->normalizeImageColor($validated['image_colors'][$i] ?? null),
                    'is_primary' => $i === 0,
                ]);
            }
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function edit(Product $product)
    {
        $product->load('category', 'images', 'variants');
        $categories = Category::where('is_active', true)->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Products/Form', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'price' => (float) $product->price,
                'discount_percent' => (float) ($product->discount_percent ?? 0),
                'stock' => $product->stock,
                'sku' => $product->sku,
                'category_name' => $product->category?->name,
                'sizes' => $product->sizes,
                'colors' => $product->colors,
                'color_hexes' => $product->color_hexes,
                'variants' => $product->variants->map(fn ($variant) => [
                    'color' => $variant->color,
                    'size' => $variant->size,
                    'stock' => $variant->stock,
                ])->values(),
                'material' => $product->material,
                'shopee_url' => $product->shopee_url,
                'tokopedia_url' => $product->tokopedia_url,
                'tiktok_url' => $product->tiktok_url,
                'related_fit_product_id' => $product->related_fit_product_id,
                'status' => $product->is_active ? 'published' : 'draft',
                'is_active' => $product->is_active,
                'is_featured' => $product->is_featured,
                'category_id' => $product->category_id,
                'images' => $product->images->map(fn ($img) => [
                    'id' => $img->id,
                    'image_path' => $img->image_path,
                    'color' => $img->color,
                    'is_primary' => $img->is_primary,
                ]),
            ],
            'categories' => $categories,
            'fitProductOptions' => $this->fitProductOptions($product->id),
            'variantOptions' => $this->variantOptions(),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|max:255',
            'description' => 'nullable',
            'price' => 'required|numeric|min:0',
            'discount_percent' => 'nullable|numeric|min:0|max:100',
            'sku' => 'nullable|max:100|unique:products,sku,'.$product->id,
            'category_id' => 'nullable|exists:categories,id',
            'category_name' => 'required|string|max:255',
            'sizes' => 'nullable|array',
            'sizes.*' => 'string',
            'colors' => 'nullable|array',
            'colors.*' => 'string',
            'color_hexes' => 'nullable|array',
            'color_hexes.*' => ['nullable', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'variants' => 'required|array|min:1',
            'variants.*.color' => 'required|string|max:255',
            'variants.*.size' => 'required|string|max:255',
            'variants.*.stock' => 'required|integer|min:0',
            'material' => 'nullable|max:255',
            'shopee_url' => 'nullable|url:http,https|max:500',
            'tokopedia_url' => 'nullable|url:http,https|max:500',
            'tiktok_url' => 'nullable|url:http,https|max:500',
            'related_fit_product_id' => 'nullable|exists:products,id',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048',
            'image_colors' => 'nullable|array',
            'image_colors.*' => 'nullable|string|max:255',
            'existing_image_colors' => 'nullable|array',
            'existing_image_colors.*' => 'nullable|string|max:255',
        ]);

        $this->prepareProductPayload($validated);
        $this->validateImageColors($validated, $product);
        $category = $this->resolveCategory($validated['category_name'] ?? null, $validated['category_id'] ?? null);
        $validated['category_id'] = $category?->id;
        $validated['slug'] = $this->makeProductSlug($validated['name'], $category?->name, $product->id);
        $validated['sku'] = ($validated['sku'] ?? null) ?: $product->sku ?: $this->makeArticleCode($validated['name'], $product->id);

        $product->update($this->productPayload($validated));
        $this->syncVariants($product, $validated);
        $this->syncExistingImageColors($product, $validated['existing_image_colors'] ?? []);
        $this->syncRelatedFit($product, $validated['related_fit_product_id'] ?? null);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $i => $image) {
                $path = $this->storeProductImageAsWebp($image);
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $path,
                    'color' => $this->normalizeImageColor($validated['image_colors'][$i] ?? null),
                    'is_primary' => $i === 0 && $product->images()->count() === 0,
                ]);
            }
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product moved to restore data.');
    }

    private function syncVariants(Product $product, array $validated): void
    {
        $rows = collect($validated['variants'] ?? []);
        $keys = $rows->map(fn ($row) => trim($row['color']).'|'.trim($row['size']))->all();
        $keptIds = [];

        $product->variants()->get()->each(function (ProductVariant $variant) use ($keys) {
            if (! in_array(($variant->color ?? '').'|'.($variant->size ?? ''), $keys, true)) {
                $variant->delete();
            }
        });

        foreach ($rows as $row) {
            $color = trim($row['color']);
            $size = trim($row['size']);
            $variant = ProductVariant::updateOrCreate(
                ['product_id' => $product->id, 'color' => $color, 'size' => $size],
                [
                    'sku' => $this->makeVariantSku($product, $color, $size),
                    'stock' => (int) $row['stock'],
                    'status' => $product->is_active ? 'published' : 'draft',
                ]
            );

            $keptIds[] = $variant->id;
        }

        $product->variants()->whereNotIn('id', $keptIds)->delete();
    }

    private function prepareProductPayload(array &$validated): void
    {
        $validated['description'] = Html::sanitize($validated['description'] ?? null);

        $variants = collect($validated['variants'] ?? []);
        $validated['colors'] = $variants->pluck('color')->map(fn ($value) => trim((string) $value))->filter()->unique()->values()->all();
        $validated['color_hexes'] = $this->normalizeColorHexes($validated['color_hexes'] ?? [], $validated['colors']);
        $validated['sizes'] = $variants->pluck('size')->map(fn ($value) => trim((string) $value))->filter()->unique()->values()->all();
        $validated['stock'] = $variants->sum(fn ($row) => (int) $row['stock']);
    }

    private function productPayload(array $validated): array
    {
        $payload = collect($validated)->except([
            'category_name',
            'variants',
            'images',
            'image_colors',
            'existing_image_colors',
            'related_fit_product_id',
        ])->all();
        $payload['discount_percent'] = (float) ($payload['discount_percent'] ?? 0);

        return $payload;
    }

    private function fitProductOptions(?int $ignoreProductId = null): array
    {
        return Product::query()
            ->when($ignoreProductId, fn ($query) => $query->whereKeyNot($ignoreProductId))
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
            ])
            ->values()
            ->all();
    }

    private function syncRelatedFit(Product $product, mixed $relatedId): void
    {
        $relatedId = $relatedId !== null && $relatedId !== '' ? (int) $relatedId : null;

        if ($relatedId === $product->id) {
            $relatedId = null;
        }

        $previousId = $product->related_fit_product_id;

        if ($previousId && $previousId !== $relatedId) {
            Product::whereKey($previousId)
                ->where('related_fit_product_id', $product->id)
                ->update(['related_fit_product_id' => null]);
        }

        if ($relatedId) {
            $partner = Product::find($relatedId);

            if ($partner?->related_fit_product_id && $partner->related_fit_product_id !== $product->id) {
                Product::whereKey($partner->related_fit_product_id)
                    ->where('related_fit_product_id', $relatedId)
                    ->update(['related_fit_product_id' => null]);
            }

            $product->forceFill(['related_fit_product_id' => $relatedId])->save();
            Product::whereKey($relatedId)->update(['related_fit_product_id' => $product->id]);

            return;
        }

        $product->forceFill(['related_fit_product_id' => null])->save();
    }

    private function validateImageColors(array $validated, ?Product $product = null): void
    {
        $newColors = collect($validated['image_colors'] ?? [])
            ->take(count($validated['images'] ?? []))
            ->map(fn ($color) => $this->normalizeImageColor($color));
        $submittedExistingColors = collect($validated['existing_image_colors'] ?? [])
            ->mapWithKeys(fn ($color, $id) => [(int) $id => $this->normalizeImageColor($color)]);
        $currentImageColors = $product?->images()
            ->pluck('color', 'id')
            ->map(fn ($color) => $this->normalizeImageColor($color)) ?? collect();

        if ($submittedExistingColors->keys()->diff($currentImageColors->keys())->isNotEmpty()) {
            throw ValidationException::withMessages([
                'existing_image_colors' => 'Pilihan gambar tidak valid.',
            ]);
        }

        $existingColors = $currentImageColors->replace($submittedExistingColors);
        $assignedColors = $newColors->concat($existingColors)->filter()->values();
        $invalidColors = $assignedColors->diff($validated['colors'] ?? []);

        if ($invalidColors->isNotEmpty()) {
            throw ValidationException::withMessages([
                'image_colors' => 'Warna gambar harus sesuai dengan warna produk.',
            ]);
        }

        if ($assignedColors->unique()->count() !== $assignedColors->count()) {
            throw ValidationException::withMessages([
                'image_colors' => 'Setiap warna hanya dapat ditandai pada satu gambar.',
            ]);
        }
    }

    private function syncExistingImageColors(Product $product, array $assignments): void
    {
        $assignments = collect($assignments)
            ->mapWithKeys(fn ($color, $id) => [(int) $id => $this->normalizeImageColor($color)]);

        if ($assignments->isEmpty()) {
            return;
        }

        $product->images()->whereKey($assignments->keys())->update(['color' => null]);

        $assignments->each(
            fn ($color, $id) => $product->images()->whereKey($id)->update(['color' => $color])
        );
    }

    private function normalizeImageColor(mixed $color): ?string
    {
        $color = trim((string) $color);

        return $color === '' ? null : $color;
    }

    private function resolveCategory(?string $name, ?int $categoryId): ?Category
    {
        $name = trim((string) $name);

        if ($name !== '') {
            return Category::firstOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name, 'is_active' => true]
            );
        }

        return $categoryId ? Category::find($categoryId) : null;
    }

    private function makeProductSlug(string $name, ?string $categoryName, ?int $ignoreProductId = null): string
    {
        $base = Str::slug(trim($name.' '.($categoryName ?? ''))) ?: Str::slug($name);
        $slug = $base;
        $counter = 2;

        while (Product::withTrashed()->where('slug', $slug)
            ->when($ignoreProductId, fn ($query) => $query->whereKeyNot($ignoreProductId))
            ->exists()) {
            $slug = $base.'-'.$counter++;
        }

        return $slug;
    }

    private function variantOptions(): array
    {
        $products = Product::query()->get(['colors', 'color_hexes', 'sizes']);

        return [
            'colors' => $products->flatMap(fn ($product) => $product->colors ?? [])->unique()->values()->all(),
            'colorHexes' => $products
                ->pluck('color_hexes')
                ->filter()
                ->reduce(fn ($carry, $colorHexes) => array_merge($carry, $colorHexes), []),
            'sizes' => $products->flatMap(fn ($product) => $product->sizes ?? [])->unique()->values()->all(),
        ];
    }

    private function normalizeColorHexes(?array $colorHexes, array $colors): array
    {
        return collect($colors)
            ->mapWithKeys(function ($color) use ($colorHexes) {
                $hex = $colorHexes[$color] ?? null;

                return $hex ? [$color => Str::upper($hex)] : [];
            })
            ->all();
    }

    private function normalizeOptions(?array $values): array
    {
        return collect($values ?? [])
            ->map(fn ($value) => trim((string) $value))
            ->filter()
            ->unique()
            ->values()
            ->all();
    }

    private function makeArticleCode(string $name, ?int $ignoreProductId = null): string
    {
        $base = Str::upper(Str::slug($name, '')) ?: 'ART';
        $base = Str::limit($base, 32, '');
        $code = $base;
        $counter = 2;

        while (Product::withTrashed()->where('sku', $code)
            ->when($ignoreProductId, fn ($query) => $query->whereKeyNot($ignoreProductId))
            ->exists()) {
            $code = $base.'-'.$counter++;
        }

        return $code;
    }

    private function makeVariantSku(Product $product, ?string $color, ?string $size): string
    {
        $suffix = collect([$color, $size])
            ->filter()
            ->map(fn ($value) => Str::upper(Str::slug($value, '')))
            ->implode('-');

        return $suffix ? $product->sku.'-'.$suffix : $product->sku;
    }

    private function storeProductImageAsWebp(UploadedFile $image): string
    {
        if (! function_exists('imagewebp')) {
            throw ValidationException::withMessages([
                'images' => 'Server does not support WebP conversion.',
            ]);
        }

        $source = match ($image->getMimeType()) {
            'image/jpeg' => function_exists('imagecreatefromjpeg')
                ? imagecreatefromjpeg($image->getRealPath())
                : false,
            'image/png' => function_exists('imagecreatefrompng')
                ? imagecreatefrompng($image->getRealPath())
                : false,
            'image/webp' => function_exists('imagecreatefromwebp')
                ? imagecreatefromwebp($image->getRealPath())
                : false,
            default => false,
        };

        if (! $source) {
            throw ValidationException::withMessages([
                'images' => 'Unsupported image format.',
            ]);
        }

        imagepalettetotruecolor($source);
        imagealphablending($source, false);
        imagesavealpha($source, true);
        $source = WebpImage::constrain($source);

        Storage::disk('public')->makeDirectory('products');

        $uuid = (string) Str::uuid();
        $path = 'products/'.$uuid.'.webp';
        $absolute = Storage::disk('public')->path($path);
        $stored = imagewebp($source, $absolute, 82);

        imagedestroy($source);

        if (! $stored) {
            throw ValidationException::withMessages([
                'images' => 'Failed to convert image to WebP.',
            ]);
        }

        $thumbRel = 'products/thumbs/'.$uuid.'_e'.WebpImage::THUMB_EDGE.'.webp';
        WebpImage::writeThumb($absolute, Storage::disk('public')->path($thumbRel));

        return $path;
    }

    public function deleteImage(ProductImage $image)
    {
        $raw = $image->getRawOriginal('image_path');
        Storage::disk('public')->delete($raw);
        if (is_string($raw) && $raw !== '') {
            Storage::disk('public')->delete(
                'products/thumbs/'.pathinfo($raw, PATHINFO_FILENAME).'_e'.WebpImage::THUMB_EDGE.'.webp',
            );
        }
        $image->delete();

        return back()->with('success', 'Image deleted successfully.');
    }
}
