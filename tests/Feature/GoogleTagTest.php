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
        $this->get('/')
            ->assertOk()
            ->assertSee('<title>', false)
            ->assertSee('Modest Fashion', false)
            ->assertSee('name="description"', false)
            ->assertSee('modest fashion for Muslim women', false)
            ->assertSee('rel="canonical"', false);
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
            ->assertSee('googletagmanager.com/gtag/js?id=G-TEST123', false)
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
