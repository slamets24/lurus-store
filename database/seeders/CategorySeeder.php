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
                'name' => 'Koko & Kurta',
                'slug' => 'koko-kurta',
                'description' => 'Kemeja koko dan kurta modern untuk pria muslim',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Gamis & Jubah',
                'slug' => 'gamis-jubah',
                'description' => 'Gamis dan jubah elegan untuk berbagai acara',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Celana',
                'slug' => 'celana',
                'description' => 'Celana muslim nyaman untuk aktivitas sehari-hari',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Sarung',
                'slug' => 'sarung',
                'description' => 'Sarung premium untuk sholat dan santai',
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Peci & Kopiah',
                'slug' => 'peci-kopiah',
                'description' => 'Peci dan kopiah berkualitas tinggi',
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'name' => 'Aksesori',
                'slug' => 'aksesori',
                'description' => 'Aksesori pelengkap busana muslim',
                'is_active' => true,
                'sort_order' => 6,
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
