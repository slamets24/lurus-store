<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        $productNames = [
            'STRIERA KNIT GREY BLACK',
            'STRIERA KNIT NAVY GREEN',
            'STRIERA KNIT TERRACOTTA BLACK',
            'STRIERA KNIT BLUE NAVY',
            'STRIERA KNIT MAROON BLACK',
            'STRIERA KNIT DARK GREY',
            'STRIERA KNIT BLACK',
            'STRIERA KNIT CREAM',
            'POLO STRIPE SENSE 2 STRIPE DARK BROWN',
            'POLO STRIPE SENSE 2 STRIPE MAROON WHITE',
            'POLO STRIPE SENSE 2 STRIPE LIGHT BLUE WHITE',
            'POLO STRIPE SENSE 2 STRIPE NAVY GREEN',
            'POLO STRIPE SENSE 2 STRIPE NAVY BLUE',
            'POLO STRIPE SENSE 2 STRIPE DARK GREY BLACK',
            'POLO STRIPE SENSE 2 STRIPE BLACK WHITE',
            'POLO STRIPE SENSE 2 STRIPE BURGUNDY',
            'PREMIUM OXFORD SHIRT WHITE',
            'PREMIUM OXFORD SHIRT BLUE',
            'LINEN CASUAL SHIRT SAND',
            'LINEN CASUAL SHIRT BEIGE',
            'BOMBER JACKET BLACK',
            'BOMBER JACKET NAVY',
            'SWEATER VARSITY NAVY WHITE',
            'SWEATER PREMIUM GREY',
            'SWEATER PREMIUM CREAM',
        ];

        $name = $this->faker->randomElement($productNames);

        $sizes = $this->faker->randomElements(
            ['S', 'M', 'L', 'XL', 'XXL'],
            rand(3, 5),
        );

        $colorOptions = [
            'Black', 'White', 'Navy', 'Grey', 'Charcoal', 'Dark Grey',
            'Maroon', 'Burgundy', 'Cream', 'Beige', 'Brown', 'Dark Brown',
            'Terracotta', 'Olive', 'Navy Green', 'Blue', 'Navy Blue',
            'Light Blue', 'Khaki', 'Sand',
        ];
        $colors = $this->faker->randomElements($colorOptions, rand(1, 3));

        $price = $this->faker->randomElement([
            $this->faker->numberBetween(149000, 249000),
            $this->faker->numberBetween(250000, 349000),
            $this->faker->numberBetween(350000, 549000),
        ]);

        $stock = $this->faker->randomElement([0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 3, 4, 5, 10, 15, 25]);

        $materials = [
            'Cotton Combed 30s',
            'Cotton Combed 24s',
            'Cotton Bamboo',
            'Polyester Cotton',
            'Oxford Cotton',
            'Linen Cotton',
            'Baby Terry Premium',
            'French Terry',
            'CVC Cotton',
            'Rayon Premium',
        ];

        return [
            'category_id' => Category::inRandomOrder()->first()?->id ?? 1,
            'name' => $name,
            'slug' => Str::slug($name).'-'.Str::lower(Str::random(6)),
            'description' => $this->faker->paragraph(rand(3, 5)),
            'price' => $price,
            'stock' => $stock,
            'sku' => strtoupper(Str::random(3)).'-'.Str::random(6),
            'sizes' => $sizes,
            'colors' => $colors,
            'material' => $this->faker->randomElement($materials),
            'care_instructions' => $this->faker->randomElement([
                'Cuci dengan air dingin, setrika suhu rendah',
                'Dry clean recommended',
                'Cuci dengan mesin mode gentle, jangan gunakan pemutih',
                'Cuci terpisah dengan warna gelap, setrika suhu sedang',
                'Dry clean only',
            ]),
            'is_active' => true,
            'is_featured' => $this->faker->boolean(20),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function ($product) {
            $imageCount = rand(0, 3);

            for ($i = 0; $i < $imageCount; $i++) {
                $product->images()->create([
                    'image_path' => 'https://placehold.co/800x800/efeee9/333333?text='.urlencode($product->name),
                    'is_primary' => $i === 0,
                    'sort_order' => $i + 1,
                ]);
            }
        });
    }
}
