<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class InventoryReservationService
{
    public function __construct(private readonly PieceInventory $pieces) {}

    /**
     * @param  Collection<int, mixed>  $cartItems
     */
    public function reserve(Collection $cartItems): void
    {
        [$variantNeed, $productNeed, $products] = $this->demand($cartItems);

        foreach ($variantNeed as $variantId => $qty) {
            $variant = ProductVariant::lockForUpdate()->find($variantId);
            $available = $variant ? max(0, (int) $variant->stock - (int) $variant->stock_reserved) : 0;
            if (! $variant || $available < $qty) {
                $name = $variant ? ($products[$variant->product_id]->name ?? 'produk') : 'produk';
                throw ValidationException::withMessages([
                    'cart' => "Insufficient stock for {$name}.",
                ]);
            }
        }

        foreach ($productNeed as $productId => $qty) {
            $product = $products[$productId];
            $available = max(0, (int) $product->stock - (int) ($product->stock_reserved ?? 0));
            if ($available < $qty) {
                throw ValidationException::withMessages([
                    'cart' => "Insufficient stock for {$product->name}.",
                ]);
            }
        }

        foreach ($variantNeed as $variantId => $qty) {
            ProductVariant::whereKey($variantId)->increment('stock_reserved', $qty);
        }

        foreach ($productNeed as $productId => $qty) {
            Product::whereKey($productId)->increment('stock_reserved', $qty);
        }
    }

    /**
     * @return list<string>
     */
    public function shortages(iterable $items): array
    {
        $variantNeed = [];
        $names = [];
        $short = [];

        foreach ($items as $item) {
            $expanded = $this->pieces->expand($item);
            if ($expanded === []) {
                $product = Product::whereKey($item->product_id)->lockForUpdate()->first();
                if ((int) ($product?->stock ?? 0) < (int) $item->quantity) {
                    $short[] = $item->product_name;
                }

                continue;
            }

            foreach ($expanded as $variantId => $qty) {
                $variantNeed[$variantId] = ($variantNeed[$variantId] ?? 0) + $qty;
                $names[$variantId] = $item->product_name;
            }
        }

        foreach ($variantNeed as $variantId => $qty) {
            $variant = ProductVariant::whereKey($variantId)->lockForUpdate()->first();
            if ((int) ($variant?->stock ?? 0) < $qty) {
                $short[] = $names[$variantId] ?? 'produk';
            }
        }

        return array_values(array_unique($short));
    }

    public function releaseForOrderItems(iterable $items): void
    {
        foreach ($items as $item) {
            foreach ($this->pieces->expand($item) as $variantId => $qty) {
                ProductVariant::whereKey($variantId)
                    ->where('stock_reserved', '>=', $qty)
                    ->decrement('stock_reserved', $qty);
            }

            $units = $this->pieces->productUnits($item);
            Product::whereKey($item->product_id)
                ->where('stock_reserved', '>=', $units)
                ->decrement('stock_reserved', $units);
        }
    }

    public function finalizePaid(iterable $items): void
    {
        foreach ($items as $item) {
            foreach ($this->pieces->expand($item) as $variantId => $qty) {
                ProductVariant::whereKey($variantId)->decrement('stock', $qty);
                ProductVariant::whereKey($variantId)
                    ->where('stock_reserved', '>=', $qty)
                    ->decrement('stock_reserved', $qty);
            }

            $units = $this->pieces->productUnits($item);
            Product::whereKey($item->product_id)->decrement('stock', $units);
            Product::whereKey($item->product_id)
                ->where('stock_reserved', '>=', $units)
                ->decrement('stock_reserved', $units);
        }
    }

    /**
     * @param  Collection<int, mixed>  $cartItems
     * @return array{0: array<int, int>, 1: array<int, int>, 2: array<int, Product>}
     */
    private function demand(Collection $cartItems): array
    {
        $variantNeed = [];
        $productNeed = [];
        $products = [];

        foreach ($cartItems as $cartItem) {
            foreach ($this->pieces->expand($cartItem) as $variantId => $qty) {
                $variantNeed[$variantId] = ($variantNeed[$variantId] ?? 0) + $qty;
            }

            $productNeed[$cartItem->product_id] = ($productNeed[$cartItem->product_id] ?? 0) + $this->pieces->productUnits($cartItem);
        }

        foreach (array_keys($productNeed) as $productId) {
            $products[$productId] = Product::lockForUpdate()->findOrFail($productId);
        }

        return [$variantNeed, $productNeed, $products];
    }
}
