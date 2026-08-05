<?php

namespace Database\Seeders;

use App\Models\Collection;
use Illuminate\Database\Seeder;

class CollectionSeeder extends Seeder
{
    public function run(): void
    {
        $collections = [
            [
                'name' => 'New Collection',
                'slug' => 'new-collection',
                'description' => 'Latest arrivals for this season',
                'subtitle' => 'Fresh styles curated just for you',
                'is_active' => true,
                'sort_order' => 0,
            ],
            [
                'name' => 'Best Sellers',
                'slug' => 'best-sellers',
                'description' => 'Most popular items',
                'subtitle' => 'Loved by our customers',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Premium Line',
                'slug' => 'premium',
                'description' => 'Exclusive premium quality',
                'subtitle' => 'The finest craftsmanship',
                'is_active' => true,
                'sort_order' => 2,
            ],
        ];

        foreach ($collections as $collection) {
            Collection::firstOrCreate(
                ['slug' => $collection['slug']],
                $collection,
            );
        }
    }
}
