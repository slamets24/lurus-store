<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProductImageColorTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_assign_one_uploaded_image_to_each_product_color(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $category = Category::factory()->create();

        $this->actingAs($admin)->post(route('admin.products.store'), [
            ...$this->productPayload($category),
            'images' => [
                UploadedFile::fake()->image('white.jpg'),
                UploadedFile::fake()->image('black.jpg'),
            ],
            'image_colors' => ['White', 'Black'],
        ])->assertRedirect(route('admin.products.index'));

        $product = Product::where('sku', 'COLOR-IMAGES')->firstOrFail();

        $this->assertDatabaseHas('product_images', [
            'product_id' => $product->id,
            'color' => 'White',
        ]);
        $this->assertDatabaseHas('product_images', [
            'product_id' => $product->id,
            'color' => 'Black',
        ]);
    }

    public function test_admin_can_swap_existing_image_color_assignments(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $category = Category::factory()->create();
        $product = Product::create([
            ...$this->productPayload($category),
            'slug' => 'color-images',
            'stock' => 4,
            'colors' => ['White', 'Black'],
            'sizes' => ['M'],
            'is_active' => true,
        ]);
        $whiteImage = $product->images()->create([
            'image_path' => 'products/white.webp',
            'color' => 'White',
        ]);
        $blackImage = $product->images()->create([
            'image_path' => 'products/black.webp',
            'color' => 'Black',
        ]);

        $this->actingAs($admin)->put(route('admin.products.update', $product), [
            ...$this->productPayload($category),
            'existing_image_colors' => [
                $whiteImage->id => 'Black',
                $blackImage->id => 'White',
            ],
        ])->assertRedirect(route('admin.products.index'));

        $this->assertSame('Black', $whiteImage->fresh()->color);
        $this->assertSame('White', $blackImage->fresh()->color);
    }

    public function test_duplicate_image_color_assignments_are_rejected(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $category = Category::factory()->create();
        $product = Product::create([
            ...$this->productPayload($category),
            'slug' => 'color-images',
            'stock' => 4,
            'colors' => ['White', 'Black'],
            'sizes' => ['M'],
            'is_active' => true,
        ]);
        $firstImage = $product->images()->create(['image_path' => 'products/one.webp']);
        $secondImage = $product->images()->create(['image_path' => 'products/two.webp']);

        $this->actingAs($admin)->put(route('admin.products.update', $product), [
            ...$this->productPayload($category),
            'existing_image_colors' => [
                $firstImage->id => 'Black',
                $secondImage->id => 'Black',
            ],
        ])->assertSessionHasErrors('image_colors');

        $this->assertNull($firstImage->fresh()->color);
        $this->assertNull($secondImage->fresh()->color);
    }

    private function productPayload(Category $category): array
    {
        return [
            'name' => 'Color Images',
            'description' => 'Product with color images.',
            'price' => 199000,
            'discount_percent' => 0,
            'sku' => 'COLOR-IMAGES',
            'category_id' => $category->id,
            'category_name' => $category->name,
            'color_hexes' => [
                'White' => '#FFFFFF',
                'Black' => '#000000',
            ],
            'variants' => [
                ['color' => 'White', 'size' => 'M', 'stock' => 2],
                ['color' => 'Black', 'size' => 'M', 'stock' => 2],
            ],
            'material' => 'Cotton',
            'is_active' => true,
        ];
    }
}
