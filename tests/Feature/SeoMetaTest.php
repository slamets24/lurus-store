<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * The storefront renders through Inertia without an SSR server, so these assertions
 * cover what a crawler or a social scraper actually receives: the initial HTML,
 * before any JavaScript runs.
 *
 * @see \App\Support\SeoMeta
 */
class SeoMetaTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_page_html_carries_page_specific_meta(): void
    {
        $product = $this->product();

        $response = $this->get('/products/'.$product->slug)->assertOk();

        $response->assertSee('<title data-inertia="">Gamis Linen Sand | Lurus Store</title>', false);
        $response->assertSee('content="Gamis linen premium yang adem dan jatuh."', false);
        $response->assertSee('rel="canonical" href="'.config('app.url').'/products/'.$product->slug.'"', false);
        $response->assertSee('property="og:type" content="product"', false);
    }

    public function test_product_page_html_carries_product_structured_data(): void
    {
        $product = $this->product();

        $html = $this->get('/products/'.$product->slug)->assertOk()->getContent();

        $this->assertStringContainsString('type="application/ld+json"', $html);
        $this->assertStringContainsString('"@type":"Product"', $html);
        $this->assertStringContainsString('"priceCurrency":"IDR"', $html);
        $this->assertStringContainsString('"availability":"https://schema.org/InStock"', $html);
        $this->assertStringContainsString('"@type":"BreadcrumbList"', $html);
    }

    public function test_out_of_stock_product_is_marked_as_such_for_crawlers(): void
    {
        $product = $this->product(['stock' => 0]);

        $this->get('/products/'.$product->slug)
            ->assertOk()
            ->assertSee('"availability":"https://schema.org/OutOfStock"', false);
    }

    public function test_category_filtered_listing_gets_its_own_title_and_canonical(): void
    {
        $category = Category::factory()->create(['name' => 'Dress', 'slug' => 'dress', 'is_active' => true]);
        $this->product(['category_id' => $category->id]);

        $this->get('/products?category=dress')
            ->assertOk()
            ->assertSee('<title data-inertia="">Dress | Koleksi Busana Muslimah | Lurus Store</title>', false)
            ->assertSee('rel="canonical" href="'.config('app.url').'/products?category=dress"', false);
    }

    public function test_private_pages_are_marked_noindex_in_the_served_html(): void
    {
        $this->get('/cart')
            ->assertOk()
            ->assertSee('name="robots" content="noindex, nofollow"', false);
    }

    public function test_home_page_faq_copy_and_faq_structured_data_come_from_one_source(): void
    {
        $html = $this->get('/')->assertOk()->getContent();

        $this->assertStringContainsString('"@type":"FAQPage"', $html);
        // The same list drives the rendered accordion via the `faqs` prop.
        $this->assertStringContainsString('Bahan apa saja yang digunakan', $html);
    }

    public function test_social_preview_points_at_a_real_image(): void
    {
        $this->get('/about')
            ->assertOk()
            ->assertSee('property="og:image" content="'.config('app.url').'/og-image.jpg"', false)
            ->assertSee('property="og:locale" content="id_ID"', false);

        $this->assertFileExists(public_path('og-image.jpg'));
    }

    private function product(array $attributes = []): Product
    {
        return Product::create([
            'category_id' => $attributes['category_id']
                ?? Category::factory()->create(['is_active' => true])->id,
            'name' => 'Gamis Linen Sand',
            'slug' => 'gamis-linen-sand',
            'description' => 'Gamis linen premium yang adem dan jatuh.',
            'price' => 350000,
            'discount_percent' => 0,
            'stock' => 10,
            'sku' => 'SKU-SEO-1',
            'is_active' => true,
            ...$attributes,
        ]);
    }
}
