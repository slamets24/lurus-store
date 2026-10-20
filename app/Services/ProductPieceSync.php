<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ProductPieceSync
{
    public function validate(array $validated): void
    {
        $components = collect($validated['components'] ?? [])->values();
        if ($components->isEmpty()) {
            return;
        }

        $keys = $components->pluck('key')->map(fn ($key) => (string) $key);
        if ($keys->unique()->count() !== $keys->count()) {
            throw ValidationException::withMessages([
                'components' => 'Potongan duplikat.',
            ]);
        }

        $names = $components->map(fn ($row) => Str::lower(trim((string) ($row['name'] ?? ''))));
        if ($names->contains('') || $names->unique()->count() !== $names->count()) {
            throw ValidationException::withMessages([
                'components' => 'Setiap potongan perlu nama yang berbeda.',
            ]);
        }

        $offers = collect($validated['offers'] ?? [])->values();
        if ($offers->isEmpty()) {
            throw ValidationException::withMessages([
                'offers' => 'Tambahkan minimal satu opsi jual.',
            ]);
        }

        foreach ($offers as $index => $offer) {
            foreach ($offer['component_keys'] ?? [] as $key) {
                if (! $keys->contains((string) $key)) {
                    throw ValidationException::withMessages([
                        "offers.{$index}.component_keys" => 'Opsi memakai potongan yang tidak ada.',
                    ]);
                }
            }
        }

        $variantKeys = collect($validated['variants'] ?? [])
            ->pluck('component_key')
            ->map(fn ($key) => (string) $key);

        foreach ($components as $component) {
            if (! $variantKeys->contains((string) $component['key'])) {
                throw ValidationException::withMessages([
                    'variants' => 'Setiap potongan perlu stok warna dan ukuran.',
                ]);
            }
        }
    }

    public function sync(Product $product, array $validated): void
    {
        $components = collect($validated['components'] ?? [])
            ->map(function ($row) {
                $row['name'] = trim((string) ($row['name'] ?? ''));
                $row['key'] = (string) ($row['key'] ?? '');

                return $row;
            })
            ->filter(fn ($row) => $row['name'] !== '' && $row['key'] !== '')
            ->values();

        if ($components->isEmpty()) {
            $product->offers()->delete();
            $product->components()->delete();
            $this->syncPlainVariants($product, $validated['variants'] ?? []);

            return;
        }

        $keyToId = $this->syncComponents($product, $components);
        $this->syncOffers($product, collect($validated['offers'] ?? []), $keyToId);
        $product->variants()->whereNull('component_id')->delete();
        $this->syncComponentVariants($product, $validated['variants'] ?? [], $keyToId);
    }

    /**
     * @param  Collection<int, array<string, mixed>>  $components
     * @return array<string, int>
     */
    private function syncComponents(Product $product, $components): array
    {
        $keyToId = [];
        $kept = [];

        foreach ($components as $index => $row) {
            $id = isset($row['id']) && $row['id'] !== '' ? (int) $row['id'] : null;
            if ($id === null && ctype_digit((string) $row['key'])) {
                $id = (int) $row['key'];
            }

            $model = $id ? $product->components()->whereKey($id)->first() : null;
            $payload = [
                'name' => $row['name'],
                'sort_order' => $index,
            ];

            if ($model) {
                $model->update($payload);
            } else {
                $model = $product->components()->create($payload);
            }

            $kept[] = $model->id;
            $keyToId[(string) $row['key']] = $model->id;
        }

        $product->components()->whereNotIn('id', $kept)->delete();

        return $keyToId;
    }

    /**
     * @param  Collection<int, array<string, mixed>>  $offers
     * @param  array<string, int>  $keyToId
     */
    private function syncOffers(Product $product, $offers, array $keyToId): void
    {
        $kept = [];

        foreach ($offers->values() as $index => $row) {
            $id = isset($row['id']) && $row['id'] !== '' ? (int) $row['id'] : null;
            $model = $id ? $product->offers()->whereKey($id)->first() : null;
            $payload = [
                'name' => trim((string) ($row['name'] ?? '')),
                'price' => $row['price'],
                'sort_order' => $index,
            ];

            if ($model) {
                $model->update($payload);
            } else {
                $model = $product->offers()->create($payload);
            }

            $sync = [];
            foreach ($row['component_keys'] ?? [] as $key) {
                $componentId = $keyToId[(string) $key] ?? null;
                if ($componentId) {
                    $sync[$componentId] = ['quantity' => 1];
                }
            }

            $model->components()->sync($sync);
            $kept[] = $model->id;
        }

        $product->offers()->whereNotIn('id', $kept)->delete();
    }

    /**
     * @param  list<array<string, mixed>>  $rows
     */
    private function syncPlainVariants(Product $product, array $rows): void
    {
        $kept = [];

        foreach ($rows as $row) {
            $color = trim((string) ($row['color'] ?? ''));
            $size = trim((string) ($row['size'] ?? ''));
            $variant = ProductVariant::query()
                ->where('product_id', $product->id)
                ->whereNull('component_id')
                ->where('color', $color)
                ->where('size', $size)
                ->first();

            $payload = [
                'sku' => $this->sku($product, null, $color, $size, $variant?->id),
                'stock' => (int) $row['stock'],
                'price' => $this->rowPrice($row),
                'status' => $product->is_active ? 'published' : 'draft',
            ];

            if ($variant) {
                $variant->update($payload);
            } else {
                $variant = ProductVariant::query()->create([
                    'product_id' => $product->id,
                    'component_id' => null,
                    'color' => $color,
                    'size' => $size,
                    ...$payload,
                ]);
            }

            $kept[] = $variant->id;
        }

        $product->variants()->whereNotIn('id', $kept)->delete();
    }

    /**
     * @param  list<array<string, mixed>>  $rows
     * @param  array<string, int>  $keyToId
     */
    private function syncComponentVariants(Product $product, array $rows, array $keyToId): void
    {
        $kept = [];
        $names = $product->components()->pluck('name', 'id');

        foreach ($rows as $row) {
            $componentId = $keyToId[(string) ($row['component_key'] ?? '')] ?? null;
            if (! $componentId) {
                continue;
            }

            $color = trim((string) ($row['color'] ?? ''));
            $size = trim((string) ($row['size'] ?? ''));
            $variant = ProductVariant::query()
                ->where('product_id', $product->id)
                ->where('component_id', $componentId)
                ->where('color', $color)
                ->where('size', $size)
                ->first();

            $payload = [
                'sku' => $this->sku($product, (string) ($names[$componentId] ?? $componentId), $color, $size, $variant?->id),
                'stock' => (int) $row['stock'],
                'price' => $this->rowPrice($row),
                'status' => $product->is_active ? 'published' : 'draft',
            ];

            if ($variant) {
                $variant->update($payload);
            } else {
                $variant = ProductVariant::query()->create([
                    'product_id' => $product->id,
                    'component_id' => $componentId,
                    'color' => $color,
                    'size' => $size,
                    ...$payload,
                ]);
            }

            $kept[] = $variant->id;
        }

        $product->variants()->whereNotIn('id', $kept)->delete();
    }

    private function rowPrice(array $row): ?string
    {
        if (! array_key_exists('price', $row) || $row['price'] === null || $row['price'] === '') {
            return null;
        }

        return number_format((float) $row['price'], 2, '.', '');
    }

    private function sku(Product $product, ?string $component, string $color, string $size, ?int $ignoreId = null): string
    {
        $suffix = collect([$component, $color, $size])
            ->filter()
            ->map(fn ($value) => Str::upper(Str::slug($value, '')))
            ->implode('-');

        $sku = $suffix !== '' ? $product->sku.'-'.$suffix : (string) $product->sku;
        $base = $sku;
        $counter = 2;

        while (ProductVariant::query()
            ->where('sku', $sku)
            ->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))
            ->exists()) {
            $sku = $base.'-'.$counter++;
        }

        return $sku;
    }
}
