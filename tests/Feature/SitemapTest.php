<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SitemapTest extends TestCase
{
    use RefreshDatabase;

    public function test_sitemap_lists_public_pages(): void
    {
        $response = $this->get(route('sitemap'));

        $response->assertOk();
        $response->assertHeader('Content-Type', 'text/xml; charset=utf-8');
        $response->assertSee(route('products.index'), false);
        $response->assertSee(route('about'), false);
    }

    public function test_sitemap_generate_command_writes_file(): void
    {
        $path = public_path('sitemap.xml');
        if (file_exists($path)) {
            unlink($path);
        }

        $this->artisan('sitemap:generate')->assertSuccessful();

        $this->assertFileExists($path);
        $this->assertStringContainsString(route('products.index'), (string) file_get_contents($path));

        unlink($path);
    }

    public function test_robots_points_to_sitemap(): void
    {
        $response = $this->get(route('robots'));

        $response->assertOk();
        $response->assertSee('Sitemap: '.route('sitemap'), false);
        $response->assertSee('OAI-SearchBot', false);
    }

    public function test_llms_txt_describes_public_store(): void
    {
        $response = $this->get(route('llms'));

        $response->assertOk();
        $response->assertSee(config('app.name', 'Lurus Store'), false);
        $response->assertSee(route('faq'), false);
    }
}
