<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class InventoryReservationService
{
    /**
     * @param  Collection<int, array{cartItem: mixed, product: Product, variant: ?ProductVariant}>  $lockedRows
     */
    public function reserve(Collection $lockedRows): void
    {
        foreach ($lockedRows as $row) {
            $quantity = (int) $row['cartItem']->quantity;
            $product = $row['product'];
            $variant = $row['variant'];

            if ($variant) {
                $available = max(0, (int) $variant->stock - (int) $variant->stock_reserved);
                if ($available < $quantity) {
                    throw ValidationException::withMessages([
                        'cart' => "Insufficient stock for {$product->name}.",
                    ]);
                }

                ProductVariant::whereKey($variant->id)->increment('stock_reserved', $quantity);
            }

            $productAvailable = max(0, (int) $product->stock - (int) $product->stock_reserved);
            if ($productAvailable < $quantity) {
                throw ValidationException::withMessages([
                    'cart' => "Insufficient stock for {$product->name}.",
                ]);
            }

            Product::whereKey($product->id)->increment('stock_reserved', $quantity);
        }
    }

    public function releaseForOrderItems(iterable $items): void
    {
        foreach ($items as $item) {
            $quantity = (int) $item->quantity;

            if ($item->product_variant_id) {
                ProductVariant::whereKey($item->product_variant_id)
                    ->where('stock_reserved', '>=', $quantity)
                    ->decrement('stock_reserved', $quantity);
            }

            Product::whereKey($item->product_id)
                ->where('stock_reserved', '>=', $quantity)
                ->decrement('stock_reserved', $quantity);
        }
    }

    public function finalizePaid(iterable $items): void
    {
        foreach ($items as $item) {
            $quantity = (int) $item->quantity;

            if ($item->product_variant_id) {
                ProductVariant::whereKey($item->product_variant_id)->decrement('stock', $quantity);
                ProductVariant::whereKey($item->product_variant_id)
                    ->where('stock_reserved', '>=', $quantity)
                    ->decrement('stock_reserved', $quantity);
            }

            Product::whereKey($item->product_id)->decrement('stock', $quantity);
            Product::whereKey($item->product_id)
                ->where('stock_reserved', '>=', $quantity)
                ->decrement('stock_reserved', $quantity);
        }
    }
}
