<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GoogleTagTest extends TestCase
{
    use RefreshDatabase;

    public function test_search_console_verification_meta_when_configured(): void
    {
        config([
            'services.google.site_verification' => 'gsc-token-test',
            'services.google.tag_id' => null,
        ]);

        $this->get('/')
            ->assertOk()
            ->assertSee('name="google-site-verification"', false)
            ->assertSee('content="gsc-token-test"', false);
    }

    public function test_storefront_html_includes_crawlable_title_and_description(): void
    {
        // Tags now come from App\Support\SeoMeta and carry the data-inertia keys that
        // let Inertia's head manager adopt them on hydration instead of duplicating.
        $this->get('/')
            ->assertOk()
            ->assertSee('<title data-inertia="">', false)
            ->assertSee('Modest Fashion', false)
            ->assertSee('name="description"', false)
            ->assertSee('Belanja koleksi busana muslimah elegan', false)
            ->assertSee('rel="canonical"', false)
            ->assertSee('name="robots"', false)
            ->assertSee('max-image-preview:large', false)
            ->assertSee('name="keywords"', false)
            ->assertSee('Lurus Store', false)
            ->assertSee('name="author"', false)
            ->assertSee('property="og:title"', false)
            ->assertSee('property="og:description"', false)
            ->assertSee('name="twitter:card"', false);
    }

    public function test_google_tag_script_loads_on_storefront_when_configured(): void
    {
        config([
            'services.google.tag_id' => 'G-TEST123',
            'services.google.ads_id' => 'AW-TEST456',
            'services.google.site_verification' => null,
        ]);

        $this->get('/')
            ->assertOk()
            ->assertSee('googletagmanager.com/gtag/js?id=', false)
            ->assertSee('G-TEST123', false)
            ->assertSee('AW-TEST456', false)
            ->assertSee('ga-disable-', false);
    }

    public function test_google_tag_skipped_when_not_configured(): void
    {
        config([
            'services.google.tag_id' => null,
            'services.google.ads_id' => null,
            'services.google.site_verification' => null,
        ]);

        $this->get('/')
            ->assertOk()
            ->assertDontSee('googletagmanager.com/gtag/js', false)
            ->assertDontSee('google-site-verification', false);
    }
}
