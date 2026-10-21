<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\HomeSection;
use App\Models\HomeSectionItem;
use App\Models\StoreContentSetting;
use App\Models\User;
use App\Services\HomePageService;
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

        $superAdmin = User::query()->where('role', User::ROLE_SUPER_ADMIN)->first()
            ?? User::factory()->create(['role' => User::ROLE_SUPER_ADMIN]);

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

    public function test_announcement_bar_can_be_saved(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);

        $this->actingAs($admin)->withSession(['_token' => 'test-token'])->post('/admin/homepage', [
            '_token' => 'test-token',
            'section' => 'announcement_bar',
            'enabled' => '1',
            'text' => 'Free shipping this week',
            'link' => '/products',
        ])->assertRedirect();

        $this->assertSame([
            'enabled' => true,
            'text' => 'Free shipping this week',
            'link' => '/products',
        ], StoreContentSetting::value('announcement_bar'));

        $this->get('/admin/homepage')->assertInertia(fn (Assert $page) => $page
            ->where('settings.announcementBar.text', 'Free shipping this week')
            ->where('settings.announcementBar.enabled', true)
            ->where('settings.announcementBar.link', '/products'));
    }

    public function test_home_sections_can_be_saved_and_used_by_homepage_service(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $blouse = Category::query()->where('slug', 'blouse')->first()
            ?? Category::factory()->create(['name' => 'Blouse', 'slug' => 'blouse', 'is_active' => true, 'sort_order' => 1]);
        $dress = Category::query()->where('slug', 'dress')->first()
            ?? Category::factory()->create(['name' => 'Dress', 'slug' => 'dress', 'is_active' => true, 'sort_order' => 2]);

        $this->actingAs($admin)->withSession(['_token' => 'test-token'])->post('/admin/homepage', [
            '_token' => 'test-token',
            'section' => 'home_sections',
            'sections' => [
                [
                    'key' => '',
                    'label' => 'New Arrivals Rail',
                    'category_slugs' => [$blouse->slug, $dress->slug],
                ],
            ],
        ])->assertRedirect();

        $this->assertSame([
            [
                'key' => 'new-arrivals-rail',
                'label' => 'New Arrivals Rail',
                'category_slugs' => [$blouse->slug, $dress->slug],
            ],
        ], StoreContentSetting::value('home_sections'));

        $this->actingAs($admin)->withSession(['_token' => 'test-token'])->post('/admin/homepage/sections', [
            '_token' => 'test-token',
            'type' => 'faq',
            'title' => 'Pertanyaan toko',
            'sort_order' => 80,
            'is_active' => '1',
            'faqs' => [
                ['question' => 'Berapa lama pengiriman?', 'answer' => 'Dua sampai lima hari.'],
            ],
        ])->assertRedirect();

        $section = HomeSection::query()->where('title', 'Pertanyaan toko')->first();
        $this->assertNotNull($section);
        $this->assertSame('faq', $section->type);
        $this->assertSame('Berapa lama pengiriman?', $section->config_json['items'][0]['question']);

        $this->actingAs($admin)->withSession(['_token' => 'test-token'])->put('/admin/homepage/seo', [
            '_token' => 'test-token',
            'title' => 'Lurus Modest Wear',
            'description' => 'Belanja busana muslimah.',
            'keywords' => 'gamis, hijab',
        ])->assertRedirect();

        $this->assertSame('Lurus Modest Wear', StoreContentSetting::value('home_seo')['title']);

        Storage::fake('public');
        $hero = HomeSection::query()->create([
            'type' => 'hero',
            'title' => 'Hero',
            'sort_order' => 10,
            'is_active' => true,
        ]);
        $desktop = UploadedFile::fake()->image('desktop.png', 3000, 1500);
        $mobile = UploadedFile::fake()->image('mobile.png', 400, 800);

        $this->actingAs($admin)->withSession(['_token' => 'test-token'])->post("/admin/homepage/sections/{$hero->id}/items", [
            '_token' => 'test-token',
            'item_type' => 'slide',
            'title' => 'Banner',
            'image' => $desktop,
            'mobile_image' => $mobile,
            'link_url' => '/products',
            'sort_order' => 0,
            'is_active' => '1',
            'x' => 50,
            'y' => 40,
        ])->assertRedirect()->assertSessionHasNoErrors();

        $item = HomeSectionItem::query()->where('home_section_id', $hero->id)->first();
        $this->assertNotNull($item?->image_path);
        $this->assertNotNull($item->config_json['mobile_image'] ?? null);
        $this->assertStringEndsWith('.webp', $item->image_path);
        $this->assertStringEndsWith('.webp', $item->config_json['mobile_image']);
        Storage::disk('public')->assertExists($item->image_path);
        Storage::disk('public')->assertExists($item->config_json['mobile_image']);
        $stored = imagecreatefromwebp(Storage::disk('public')->path($item->image_path));
        $this->assertNotFalse($stored);
        $this->assertSame(2000, imagesx($stored));
        $this->assertSame(1000, imagesy($stored));
        imagedestroy($stored);

        $previous = $item->image_path;
        $mobilePath = $item->config_json['mobile_image'];
        $replacement = UploadedFile::fake()->image('next.png', 900, 500);

        $this->actingAs($admin)->withSession(['_token' => 'test-token'])->post("/admin/homepage/items/{$item->id}", [
            '_token' => 'test-token',
            '_method' => 'put',
            'item_type' => 'slide',
            'title' => 'Banner',
            'image' => $replacement,
            'mobile_image_path' => $item->config_json['mobile_image'],
            'link_url' => '/products',
            'sort_order' => 0,
            'is_active' => '1',
            'x' => 50,
            'y' => 40,
        ])->assertRedirect()->assertSessionHasNoErrors();

        $item->refresh();
        $this->assertNotSame($previous, $item->image_path);
        Storage::disk('public')->assertExists($item->image_path);
        $this->assertSame($mobilePath, $item->config_json['mobile_image']);

        $sections = app(HomePageService::class)->sections();
        $this->assertCount(1, $sections);
        $this->assertSame('New Arrivals Rail', $sections[0]['label']);
        $this->assertSame('new-arrivals-rail', $sections[0]['key']);
        $this->assertSame(
            [
                ['name' => $blouse->name, 'slug' => $blouse->slug],
                ['name' => $dress->name, 'slug' => $dress->slug],
            ],
            $sections[0]['categories'],
        );
    }
}
