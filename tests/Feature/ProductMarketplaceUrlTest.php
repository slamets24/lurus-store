<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProductMarketplaceUrlTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_save_marketplace_urls_and_product_page_exposes_them(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $category = Category::factory()->create(['name' => 'Kaos']);

        $this->actingAs($admin)->post(route('admin.products.store'), [
            ...$this->productPayload($category),
            'shopee_url' => 'https://shopee.co.id/aaamen/123',
            'tokopedia_url' => 'https://www.tokopedia.com/aaamen/kaos',
            'tiktok_url' => 'https://www.tiktok.com/@aaamen/product/123',
        ])->assertRedirect(route('admin.products.index'));

        $product = Product::where('sku', 'MKT-01')->firstOrFail();
        $this->assertSame('https://shopee.co.id/aaamen/123', $product->shopee_url);
        $this->assertSame('https://www.tokopedia.com/aaamen/kaos', $product->tokopedia_url);
        $this->assertSame('https://www.tiktok.com/@aaamen/product/123', $product->tiktok_url);

        $this->get(route('products.show', $product->slug))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('ProductDetail')
                ->where('product.shopee_url', 'https://shopee.co.id/aaamen/123')
                ->where('product.tokopedia_url', 'https://www.tokopedia.com/aaamen/kaos')
                ->where('product.tiktok_url', 'https://www.tiktok.com/@aaamen/product/123'));
    }

    public function test_invalid_marketplace_url_is_rejected(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $category = Category::factory()->create(['name' => 'Kaos']);

        $this->actingAs($admin)->post(route('admin.products.store'), [
            ...$this->productPayload($category),
            'shopee_url' => 'javascript:alert(1)',
        ])->assertSessionHasErrors('shopee_url');
    }

    private function productPayload(Category $category): array
    {
        return [
            'name' => 'Marketplace Tee',
            'description' => 'Marketplace Tee description',
            'price' => 199000,
            'discount_percent' => 0,
            'sku' => 'MKT-01',
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
