<?php

namespace Tests\Feature;

use App\Models\StoreContentSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminHomepageSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_social_media_can_be_saved_without_resubmitting_other_homepage_sections(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $hero = [[
            'id' => 'banner-1',
            'link' => '/products/example',
            'desktop_image' => 'desktop.jpg',
            'mobile_image' => 'mobile.jpg',
        ]];

        StoreContentSetting::putValue('hero', $hero);
        StoreContentSetting::putValue('featured_product_ids', [10, 20]);

        $this->actingAs($admin)->withSession(['_token' => 'test-token'])->post('/admin/homepage', [
            '_token' => 'test-token',
            'section' => 'social_media',
            'whatsapp_number' => '628111222333',
            'social_links' => [
                ['name' => 'Instagram', 'url' => 'https://instagram.com/aaamen'],
            ],
        ])->assertRedirect();

        $this->assertSame($hero, StoreContentSetting::value('hero'));
        $this->assertSame([10, 20], StoreContentSetting::value('featured_product_ids'));
        $this->assertSame('628111222333', StoreContentSetting::value('whatsapp_number'));

        $this->get('/admin/homepage')->assertInertia(fn (Assert $page) => $page
            ->where('settings.whatsappNumber', '628111222333'));
    }

    public function test_hero_banners_can_be_added_and_deleted(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);

        $desktop = UploadedFile::fake()->image('desktop.jpg', 1920, 800);
        $mobile = UploadedFile::fake()->image('mobile.jpg', 1619, 971);

        $this->actingAs($admin)->withSession(['_token' => 'test-token'])->post('/admin/homepage', [
            '_token' => 'test-token',
            'section' => 'hero',
            'hero_action' => 'save',
            'hero_link' => '/products/kaos',
            'hero_desktop_image' => $desktop,
            'hero_mobile_image' => $mobile,
        ])->assertRedirect();

        $banners = StoreContentSetting::heroBanners();
        $this->assertCount(1, $banners);
        $this->assertSame('/products/kaos', $banners[0]['link']);
        Storage::disk('public')->assertExists($banners[0]['desktop_image']);
        Storage::disk('public')->assertExists($banners[0]['mobile_image']);

        $this->actingAs($admin)->withSession(['_token' => 'test-token'])->post('/admin/homepage', [
            '_token' => 'test-token',
            'section' => 'hero',
            'hero_action' => 'delete',
            'hero_id' => $banners[0]['id'],
        ])->assertForbidden();

        $this->assertCount(1, StoreContentSetting::heroBanners());

        $superAdmin = User::factory()->create(['role' => User::ROLE_SUPER_ADMIN]);

        $this->actingAs($superAdmin)->withSession(['_token' => 'test-token'])->post('/admin/homepage', [
            '_token' => 'test-token',
            'section' => 'hero',
            'hero_action' => 'delete',
            'hero_id' => $banners[0]['id'],
        ])->assertRedirect();

        $this->assertSame([], StoreContentSetting::heroBanners());
    }

    public function test_legacy_single_hero_is_normalized_to_list(): void
    {
        StoreContentSetting::putValue('hero', [
            'link' => '/sale',
            'desktop_image' => 'old-desktop.jpg',
            'mobile_image' => 'old-mobile.jpg',
        ]);

        $banners = StoreContentSetting::heroBanners();

        $this->assertCount(1, $banners);
        $this->assertSame('/sale', $banners[0]['link']);
        $this->assertSame('old-desktop.jpg', $banners[0]['desktop_image']);
    }

    public function test_promo_popup_can_be_saved_and_shared_on_storefront(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $image = UploadedFile::fake()->image('promo.jpg', 800, 1000);

        $this->actingAs($admin)->withSession(['_token' => 'test-token'])->post('/admin/homepage', [
            '_token' => 'test-token',
            'section' => 'promo_popup',
            'enabled' => '1',
            'title' => 'BEBAS ONGKIR SETIAP HARI',
            'subtitle' => '*maksimal free ongkir 35K',
            'cta_text' => 'Belanja Sekarang',
            'cta_url' => '/products',
            'image' => $image,
        ])->assertRedirect();

        $settings = StoreContentSetting::promoPopupSettings();
        $this->assertTrue($settings['enabled']);
        $this->assertSame('BEBAS ONGKIR SETIAP HARI', $settings['title']);
        $this->assertSame('/products', $settings['cta_url']);
        Storage::disk('public')->assertExists($settings['image']);

        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->where('promoPopup.title', 'BEBAS ONGKIR SETIAP HARI')
            ->where('promoPopup.cta_text', 'Belanja Sekarang')
            ->where('promoPopup.cta_url', '/products')
            ->where('promoPopup.version', $settings['version']));

        $this->actingAs($admin)->withSession(['_token' => 'test-token'])->post('/admin/homepage', [
            '_token' => 'test-token',
            'section' => 'promo_popup',
            'enabled' => '0',
            'title' => 'BEBAS ONGKIR SETIAP HARI',
            'subtitle' => '*maksimal free ongkir 35K',
            'cta_text' => 'Belanja Sekarang',
            'cta_url' => '/products',
        ])->assertRedirect();

        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->where('promoPopup', null));
    }
}
