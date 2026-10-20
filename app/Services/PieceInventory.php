<?php

namespace App\Services;

use App\Models\ProductVariant;
use Illuminate\Support\Collection;

class PieceInventory
{
    /**
     * Variant quantities consumed by one cart or order line.
     *
     * @return array<int, int>
     */
    public function expand(object $item): array
    {
        $quantity = (int) ($item->quantity ?? 0);
        if ($quantity < 1) {
            return [];
        }

        $selections = $item->selections ?? null;
        if (is_string($selections)) {
            $selections = json_decode($selections, true);
        }

        if (is_array($selections) && $selections !== []) {
            $need = [];
            foreach ($selections as $selection) {
                $id = (int) ($selection['product_variant_id'] ?? 0);
                if ($id < 1) {
                    continue;
                }
                $perUnit = max(1, (int) ($selection['quantity'] ?? 1));
                $need[$id] = ($need[$id] ?? 0) + ($quantity * $perUnit);
            }

            return $need;
        }

        if (! empty($item->product_variant_id)) {
            return [(int) $item->product_variant_id => $quantity];
        }

        return [];
    }

    public function productUnits(object $item): int
    {
        $expanded = $this->expand($item);

        if ($expanded === []) {
            return (int) ($item->quantity ?? 0);
        }

        return array_sum($expanded);
    }

    /**
     * How many of this offer still fit, after other cart lines have taken shared pieces.
     *
     * @param  list<int>  $variantIds
     */
    public function maxOfferQuantity(Collection $cartItems, array $variantIds, ?int $ignoreCartItemId = null): int
    {
        if ($variantIds === []) {
            return 0;
        }

        $used = [];
        foreach ($cartItems as $item) {
            if ($ignoreCartItemId !== null && (int) $item->id === $ignoreCartItemId) {
                continue;
            }

            foreach ($this->expand($item) as $variantId => $qty) {
                $used[$variantId] = ($used[$variantId] ?? 0) + $qty;
            }
        }

        $max = PHP_INT_MAX;
        foreach ($variantIds as $variantId) {
            $stock = (int) (ProductVariant::query()->whereKey($variantId)->value('stock') ?? 0);
            $max = min($max, $stock - ($used[$variantId] ?? 0));
        }

        return max(0, $max);
    }
}
