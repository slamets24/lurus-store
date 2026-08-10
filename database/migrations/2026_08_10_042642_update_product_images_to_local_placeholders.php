<?php

use App\Models\Product;
use App\Models\ProductImage;
use App\Support\ProductPlaceholderImages;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        $paths = ProductPlaceholderImages::paths();
        if ($paths === []) {
            return;
        }

        Product::query()->orderBy('id')->each(function (Product $product) {
            $product->images()->delete();

            foreach (ProductPlaceholderImages::forProduct($product->id, 2) as $i => $path) {
                ProductImage::query()->create([
                    'product_id' => $product->id,
                    'image_path' => $path,
                    'is_primary' => $i === 0,
                    'sort_order' => $i + 1,
                ]);
            }
        });
    }

    public function down(): void
    {
        //
    }
};
