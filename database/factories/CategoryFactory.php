<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition(): array
    {
        $name = $this->faker->unique()->randomElement([
            'Apparel',
            'Peci',
            'Accessories',
            'Koko & Kurta',
            'Gamis & Jubah',
            'Celana',
            'Sarung',
            'Aksesoris',
            'Outerwear',
            'Setelan Muslim',
        ]);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => $this->faker->sentence(),
            'image' => null,
            'parent_id' => null,
            'is_active' => true,
            'sort_order' => $this->faker->numberBetween(0, 10),
        ];
    }
}
