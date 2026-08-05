<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProductSizeChartAndRelatedFitTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_link_related_fit(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $category = Category::factory()->create(['name' => 'Kaos']);
        $oversize = Product::create([
            ...$this->productPayload($category, 'Humanoid Oversize', 'HUM-OS'),
            'slug' => 'humanoid-oversize-kaos',
            'stock' => 2,
            'colors' => ['Black'],
            'sizes' => ['L'],
            'is_active' => true,
        ]);

        $this->actingAs($admin)->post(route('admin.products.store'), [
            ...$this->productPayload($category, 'Humanoid Regular', 'HUM-RG'),
            'related_fit_product_id' => $oversize->id,
        ])->assertRedirect(route('admin.products.index'));

        $regular = Product::where('sku', 'HUM-RG')->firstOrFail();

        $this->assertSame($oversize->id, $regular->related_fit_product_id);
        $this->assertSame($regular->id, $oversize->fresh()->related_fit_product_id);
    }

    public function test_product_detail_exposes_size_chart_and_related_fit_link(): void
    {
        Storage::fake('public');
        $category = Category::factory()->create([
            'name' => 'Kaos',
            'size_chart_path' => 'categories/size-chart.webp',
        ]);
        $oversize = Product::create([
            ...$this->productPayload($category, 'Humanoid Oversize', 'HUM-OS'),
            'slug' => 'humanoid-oversize-kaos',
            'stock' => 2,
            'colors' => ['Black'],
            'sizes' => ['L'],
            'is_active' => true,
        ]);
        $regular = Product::create([
            ...$this->productPayload($category, 'Humanoid Regular', 'HUM-RG'),
            'slug' => 'humanoid-regular-kaos',
            'stock' => 2,
            'colors' => ['Black'],
            'sizes' => ['M'],
            'related_fit_product_id' => $oversize->id,
            'is_active' => true,
        ]);
        $oversize->update(['related_fit_product_id' => $regular->id]);
        Storage::disk('public')->put('categories/size-chart.webp', 'fake');

        $this->get(route('products.show', $regular->slug))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('ProductDetail')
                ->where('product.size_chart_url', '/storage/categories/size-chart.webp')
                ->where('product.related_fit.slug', 'humanoid-oversize-kaos')
                ->where('product.related_fit.name', 'Humanoid Oversize'));
    }

    public function test_admin_can_upload_category_size_chart(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);

        $this->actingAs($admin)->post(route('admin.categories.store'), [
            'name' => 'Kaos',
            'size_chart' => UploadedFile::fake()->image('size-chart.png', 800, 1200),
        ])->assertRedirect(route('admin.categories.index'));

        $category = Category::where('slug', 'kaos')->firstOrFail();
        $this->assertNotNull($category->size_chart_path);
        Storage::disk('public')->assertExists($category->size_chart_path);
    }

    public function test_product_detail_falls_back_to_category_size_chart(): void
    {
        Storage::fake('public');
        $category = Category::factory()->create([
            'name' => 'Kaos',
            'size_chart_path' => 'categories/size-chart.webp',
        ]);
        Storage::disk('public')->put('categories/size-chart.webp', 'fake');
        $product = Product::create([
            ...$this->productPayload($category, 'Humanoid', 'HUM-01'),
            'slug' => 'humanoid-kaos',
            'stock' => 2,
            'colors' => ['Black'],
            'sizes' => ['M', 'Oversize L'],
            'is_active' => true,
        ]);

        $this->get(route('products.show', $product->slug))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('ProductDetail')
                ->where('product.size_chart_url', '/storage/categories/size-chart.webp'));
    }

    private function productPayload(Category $category, string $name, string $sku): array
    {
        return [
            'name' => $name,
            'description' => $name.' description',
            'price' => 199000,
            'discount_percent' => 0,
            'sku' => $sku,
            'category_id' => $category->id,
            'category_name' => $category->name,
            'color_hexes' => ['Black' => '#000000'],
            'variants' => [
                ['color' => 'Black', 'size' => 'M', 'stock' => 2],
            ],
            'material' => 'Cotton',
            'is_active' => true,
        ];
    }
}
