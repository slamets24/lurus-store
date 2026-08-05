<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class StoreCategoriesNavTest extends TestCase
{
    use RefreshDatabase;

    public function test_shared_store_categories_are_ordered_by_product_count_desc(): void
    {
        $low = $this->categoryWithProducts('Low', 1);
        $mid = $this->categoryWithProducts('Mid', 3);
        $high = $this->categoryWithProducts('High', 5);
        $extra = $this->categoryWithProducts('Extra', 2);
        Category::create(['name' => 'Empty', 'slug' => 'empty-'.Str::lower(Str::random(6)), 'is_active' => true]);

        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->has('storeCategories', 4)
            ->where('storeCategories.0.slug', $high->slug)
            ->where('storeCategories.1.slug', $mid->slug)
            ->where('storeCategories.2.slug', $extra->slug)
            ->where('storeCategories.3.slug', $low->slug)
        );
    }

    private function categoryWithProducts(string $name, int $count): Category
    {
        $category = Category::create([
            'name' => $name,
            'slug' => Str::slug($name).'-'.Str::lower(Str::random(6)),
            'is_active' => true,
        ]);

        for ($i = 0; $i < $count; $i++) {
            Product::create([
                'category_id' => $category->id,
                'name' => "{$name} Product {$i}",
                'slug' => Str::slug("{$name}-{$i}").'-'.Str::lower(Str::random(4)),
                'price' => 100000,
                'stock' => 5,
                'sku' => 'SKU-'.Str::upper(Str::random(8)),
                'is_active' => true,
            ]);
        }

        return $category;
    }
}
