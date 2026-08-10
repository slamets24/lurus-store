<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductImage;
use App\Support\ProductPlaceholderImages;
use Illuminate\Database\Seeder;

class ProductImageSeeder extends Seeder
{
    public function run(): void
    {
        $paths = ProductPlaceholderImages::paths();
        if ($paths === []) {
            $this->command?->warn('No images in public/images/productplaceholder');

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
}
