<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Promo;
use Illuminate\Support\Collection;

class CartPricingService
{
    public function effectiveUnitPrice(Product $product): float
    {
        $percent = min(100.0, max(0.0, (float) ($product->discount_percent ?? 0)));

        return round((float) $product->price * (1 - ($percent / 100)), 2);
    }

    /**
     * @param  Collection<int, object{product: Product, quantity: int}>  $rows
     * @return array{subtotal: float, discount_amount: float, payable: float, unit_prices: array<int, float>}
     */
    public function quote(Collection $rows): array
    {
        $unitPrices = [];
        $subtotal = 0.0;

        foreach ($rows as $index => $row) {
            $unit = $this->effectiveUnitPrice($row->product);
            $unitPrices[$index] = $unit;
            $subtotal += $unit * (int) $row->quantity;
        }

        $subtotal = round($subtotal, 2);
        $remaining = $this->unitPool($rows, $unitPrices);
        $discount = 0.0;

        $promos = Promo::query()
            ->active()
            ->with(['targets', 'components'])
            ->orderBy('id')
            ->get();

        foreach ($promos->where('type', Promo::TYPE_BUNDLE) as $promo) {
            $discount += $this->applyBundle($promo, $remaining);
        }

        foreach ($promos->where('type', Promo::TYPE_BXGY) as $promo) {
            $discount += $this->applyBxgy($promo, $remaining, $rows);
        }

        $discount = min(round($discount, 2), $subtotal);

        return [
            'subtotal' => $subtotal,
            'discount_amount' => $discount,
            'payable' => round($subtotal - $discount, 2),
            'unit_prices' => $unitPrices,
        ];
    }

    /**
     * @param  Collection<int, object{product: Product, quantity: int}>  $rows
     * @param  array<int, float>  $unitPrices
     * @return array<int, list<float>>
     */
    private function unitPool(Collection $rows, array $unitPrices): array
    {
        $pool = [];

        foreach ($rows as $index => $row) {
            $productId = (int) $row->product->id;
            $unit = $unitPrices[$index];
            for ($i = 0; $i < (int) $row->quantity; $i++) {
                $pool[$productId][] = $unit;
            }
        }

        return $pool;
    }

    /**
     * @param  array<int, list<float>>  $remaining
     */
    private function applyBundle(Promo $promo, array &$remaining): float
    {
        $components = $promo->components;
        if ($components->isEmpty() || $promo->package_price === null) {
            return 0.0;
        }

        $discount = 0.0;
        $packagePrice = (float) $promo->package_price;

        while (true) {
            foreach ($components as $component) {
                $need = (int) $component->quantity;
                $have = count($remaining[(int) $component->product_id] ?? []);
                if ($have < $need) {
                    break 2;
                }
            }

            $componentTotal = 0.0;
            foreach ($components as $component) {
                $productId = (int) $component->product_id;
                $need = (int) $component->quantity;
                for ($i = 0; $i < $need; $i++) {
                    $componentTotal += array_shift($remaining[$productId]);
                }
            }

            $discount += max(0, $componentTotal - $packagePrice);
        }

        return $discount;
    }

    /**
     * @param  array<int, list<float>>  $remaining
     * @param  Collection<int, object{product: Product, quantity: int}>  $rows
     */
    private function applyBxgy(Promo $promo, array &$remaining, Collection $rows): float
    {
        $buy = max(1, (int) ($promo->buy_qty ?? 2));
        $free = max(1, (int) ($promo->free_qty ?? 1));
        $groupSize = $buy + $free;
        $minPrice = $promo->min_unit_price !== null ? (float) $promo->min_unit_price : null;

        if ($promo->free_pick === Promo::FREE_PICK_SAME_SKU) {
            return $this->applyBxgySameSku($promo, $remaining, $rows, $buy, $free, $groupSize, $minPrice);
        }

        $units = [];
        foreach ($remaining as $productId => $prices) {
            $product = $this->productFromRows($rows, (int) $productId);
            foreach ($prices as $price) {
                if (! $this->productMatchesPromo($promo, $product)) {
                    continue;
                }
                if ($minPrice !== null && $price < $minPrice) {
                    continue;
                }
                $units[] = ['product_id' => (int) $productId, 'price' => $price];
            }
        }

        if ($units === []) {
            return 0.0;
        }

        usort($units, fn ($a, $b) => $a['price'] <=> $b['price']);
        $freeCount = intdiv(count($units), $groupSize) * $free;
        $discount = 0.0;

        for ($i = 0; $i < $freeCount; $i++) {
            $unit = $units[$i];
            $discount += $unit['price'];
            $idx = array_search($unit['price'], $remaining[$unit['product_id']], true);
            if ($idx !== false) {
                array_splice($remaining[$unit['product_id']], $idx, 1);
            }
        }

        return $discount;
    }

    /**
     * @param  array<int, list<float>>  $remaining
     * @param  Collection<int, object{product: Product, quantity: int}>  $rows
     */
    private function applyBxgySameSku(
        Promo $promo,
        array &$remaining,
        Collection $rows,
        int $buy,
        int $free,
        int $groupSize,
        ?float $minPrice,
    ): float {
        $discount = 0.0;

        foreach ($remaining as $productId => $prices) {
            $product = $this->productFromRows($rows, (int) $productId);
            if (! $this->productMatchesPromo($promo, $product)) {
                continue;
            }

            $kept = [];
            $eligible = [];
            foreach ($prices as $price) {
                if ($minPrice !== null && $price < $minPrice) {
                    $kept[] = $price;
                } else {
                    $eligible[] = $price;
                }
            }

            sort($eligible);
            $freeCount = intdiv(count($eligible), $groupSize) * $free;
            for ($i = 0; $i < $freeCount; $i++) {
                $discount += $eligible[$i];
            }

            $remaining[(int) $productId] = array_merge($kept, array_slice($eligible, $freeCount));
        }

        return $discount;
    }

    private function productFromRows(Collection $rows, int $productId): ?Product
    {
        foreach ($rows as $row) {
            if ((int) $row->product->id === $productId) {
                return $row->product;
            }
        }

        return null;
    }

    private function productMatchesPromo(Promo $promo, ?Product $product): bool
    {
        if (! $product) {
            return false;
        }

        return match ($promo->scope) {
            Promo::SCOPE_ALL => true,
            Promo::SCOPE_CATEGORIES => $promo->targets
                ->where('target_type', 'category')
                ->contains(fn ($target) => (int) $target->target_id === (int) $product->category_id),
            default => $promo->targets
                ->where('target_type', 'product')
                ->contains(fn ($target) => (int) $target->target_id === (int) $product->id),
        };
    }
}
