<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Blouse',
                'slug' => 'blouse',
                'description' => 'Blouse modest dengan potongan nyaman untuk aktivitas harian.',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Dress',
                'slug' => 'dress',
                'description' => 'Dress elegan untuk acara formal maupun kasual.',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Skirt',
                'slug' => 'skirt',
                'description' => 'Rok panjang dan midi dengan siluet feminin.',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Pants',
                'slug' => 'pants',
                'description' => 'Celana panjang modest dengan bahan adem.',
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Outer',
                'slug' => 'outer',
                'description' => 'Outerwear ringan untuk melengkapi outfit.',
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'name' => 'Scarves',
                'slug' => 'scarves',
                'description' => 'Scarf dan hijab segi empat premium.',
                'is_active' => true,
                'sort_order' => 6,
            ],
            [
                'name' => 'Shoes',
                'slug' => 'shoes',
                'description' => 'Sepatu dan sandal modest untuk wanita.',
                'is_active' => true,
                'sort_order' => 7,
            ],
            [
                'name' => 'Bag',
                'slug' => 'bag',
                'description' => 'Tas modest wanita untuk berbagai aktivitas.',
                'is_active' => true,
                'sort_order' => 8,
            ],
            [
                'name' => 'Accessories',
                'slug' => 'accessories',
                'description' => 'Aksesoris pelengkap busana muslimah.',
                'is_active' => true,
                'sort_order' => 9,
            ],
            [
                'name' => 'Prayer Set',
                'slug' => 'prayer-set',
                'description' => 'Mukena dan set ibadah wanita muslimah.',
                'is_active' => true,
                'sort_order' => 10,
            ],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(
                ['slug' => $category['slug']],
                $category,
            );
        }
    }
}
