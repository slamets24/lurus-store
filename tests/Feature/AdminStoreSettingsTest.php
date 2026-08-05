<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\StoreContentSetting;
use App\Models\User;
use App\Services\BiteshipService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminStoreSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_env_couriers_are_defaults_not_the_admin_catalog_limit(): void
    {
        config(['services.biteship.couriers' => 'jne,sicepat,anteraja']);

        $this->assertSame(
            ['jne', 'sicepat', 'anteraja'],
            StoreContentSetting::shippingSettings()['couriers'],
        );
        $this->assertContains('paxel', StoreContentSetting::availableCouriers());
    }

    public function test_admin_can_manage_payment_methods_channels_and_couriers(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);

        $this->actingAs($admin)->post('/admin/settings', [
            'section' => 'payment',
            'enabled' => true,
            'methods' => ['midtrans'],
            'midtrans_channels' => ['gopay', 'other_qris'],
        ])->assertRedirect();

        $this->actingAs($admin)->post('/admin/settings', [
            'section' => 'shipping',
            'biteship_enabled' => true,
            'couriers' => ['jne', 'paxel'],
            'flat_shipping_cost' => 30000,
            'free_shipping_enabled' => true,
            'free_shipping_threshold' => 250000,
            'free_shipping_starts_at' => '2026-10-10',
            'free_shipping_ends_at' => '2026-10-11',
        ])->assertRedirect();

        $this->assertSame([
            'enabled' => true,
            'methods' => ['midtrans'],
            'midtrans_channels' => ['gopay', 'other_qris'],
        ], StoreContentSetting::paymentSettings());
        $this->assertSame([
            'biteship_enabled' => true,
            'couriers' => ['jne', 'paxel'],
            'flat_shipping_cost' => 30000,
            'free_shipping_enabled' => true,
            'free_shipping_threshold' => 250000,
            'free_shipping_max_subsidy' => null,
            'free_shipping_starts_at' => '2026-10-10',
            'free_shipping_ends_at' => '2026-10-11',
        ], StoreContentSetting::shippingSettings());

        $this->get('/admin/settings')->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Settings/Index')
            ->where('paymentSettings.methods', ['midtrans'])
            ->where('shippingSettings.couriers', ['jne', 'paxel'])
            ->has('couriers', count(StoreContentSetting::COURIERS)));
    }

    public function test_admin_can_manage_bank_transfer_account(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);

        $this->actingAs($admin)->post('/admin/settings', [
            'section' => 'bank_transfer',
            'bank' => 'BCA',
            'account_number' => '1234 5678 90',
            'account_name' => 'Lurus Store',
        ])->assertRedirect();

        $this->assertSame([
            'bank' => 'BCA',
            'account_number' => '1234567890',
            'account_name' => 'Lurus Store',
        ], StoreContentSetting::bankTransferSettings());

        $this->get('/admin/settings')->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Settings/Index')
            ->where('bankTransferSettings.account_number', '1234567890'));
    }

    public function test_bank_transfer_account_number_is_required(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);

        $this->actingAs($admin)->from('/admin/settings')->post('/admin/settings', [
            'section' => 'bank_transfer',
            'bank' => 'BCA',
            'account_number' => '',
            'account_name' => 'Lurus Store',
        ])->assertRedirect('/admin/settings')->assertSessionHasErrors('account_number');
    }

    public function test_active_payments_require_at_least_one_method(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);

        $this->actingAs($admin)->from('/admin/settings')->post('/admin/settings', [
            'section' => 'payment',
            'enabled' => true,
            'methods' => [],
            'midtrans_channels' => [],
        ])->assertRedirect('/admin/settings')->assertSessionHasErrors('methods');
    }

    public function test_active_biteship_requires_at_least_one_courier(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);

        $this->actingAs($admin)->from('/admin/settings')->post('/admin/settings', [
            'section' => 'shipping',
            'biteship_enabled' => true,
            'couriers' => [],
            'flat_shipping_cost' => 25000,
            'free_shipping_enabled' => false,
            'free_shipping_threshold' => 500000,
        ])->assertRedirect('/admin/settings')->assertSessionHasErrors('couriers');
    }

    public function test_free_shipping_promo_respects_threshold_and_date_window(): void
    {
        config(['services.biteship.fake_rates' => true]);
        $category = Category::create([
            'name' => 'Free Ship',
            'slug' => 'free-ship',
            'is_active' => true,
        ]);
        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Free Ship Product',
            'slug' => 'free-ship-product',
            'price' => 300000,
            'stock' => 10,
            'sku' => 'SKU-'.Str::upper(Str::random(8)),
            'is_active' => true,
        ]);
        $item = (object) ['product' => $product, 'quantity' => 1];
        $biteship = app(BiteshipService::class);

        StoreContentSetting::putValue('shipping_settings', [
            'biteship_enabled' => true,
            'couriers' => ['jne'],
            'flat_shipping_cost' => 25000,
            'free_shipping_enabled' => true,
            'free_shipping_threshold' => 250000,
            'free_shipping_max_subsidy' => null,
            'free_shipping_starts_at' => '2026-10-10',
            'free_shipping_ends_at' => '2026-10-10',
        ]);

        $this->travelTo('2026-10-10 12:00:00');
        $covered = $biteship->ratesForCart([$item], '40123')[0];
        $this->assertSame('jne', $covered['courier_code']);
        $this->assertSame(0, $covered['price']);
        $this->assertSame(12000, $covered['original_price']);

        $this->travelTo('2026-10-11 12:00:00');
        $outside = $biteship->ratesForCart([$item], '40123')[0];
        $this->assertSame('jne', $outside['courier_code']);
        $this->assertSame(12000, $outside['price']);
        $this->assertArrayNotHasKey('original_price', $outside);

        StoreContentSetting::putValue('shipping_settings', [
            'biteship_enabled' => true,
            'couriers' => ['jne'],
            'flat_shipping_cost' => 25000,
            'free_shipping_enabled' => true,
            'free_shipping_threshold' => 250000,
            'free_shipping_max_subsidy' => 5000,
            'free_shipping_starts_at' => null,
            'free_shipping_ends_at' => null,
        ]);
        $capped = $biteship->ratesForCart([$item], '40123')[0];
        $this->assertSame(7000, $capped['price']);
        $this->assertSame(12000, $capped['original_price']);

        StoreContentSetting::putValue('shipping_settings', [
            'biteship_enabled' => true,
            'couriers' => ['jne'],
            'flat_shipping_cost' => 25000,
            'free_shipping_enabled' => false,
            'free_shipping_threshold' => 0,
            'free_shipping_max_subsidy' => null,
            'free_shipping_starts_at' => null,
            'free_shipping_ends_at' => null,
        ]);
        $this->travelTo('2026-10-10 12:00:00');
        $this->assertSame('jne', $biteship->ratesForCart([$item], '40123')[0]['courier_code']);
        $this->assertSame(12000, $biteship->ratesForCart([$item], '40123')[0]['price']);
    }

    public function test_only_admins_can_manage_store_settings(): void
    {
        $customer = User::factory()->create();

        $this->get('/admin/settings')->assertRedirect('/login');
        $this->actingAs($customer)->get('/admin/settings')->assertForbidden();
    }

    public function test_checkout_rejects_new_orders_when_payments_are_disabled(): void
    {
        StoreContentSetting::putValue('payment_settings', [
            'enabled' => false,
            'methods' => ['bank_transfer'],
            'midtrans_channels' => [],
        ]);

        $this->post('/checkout', [
            'name' => 'Buyer',
            'email' => 'buyer@example.com',
            'phone' => '08123456789',
            'address' => 'Jl. Contoh 1',
            'province' => 'Jawa Barat',
            'city' => 'Bandung',
            'district' => 'Coblong',
            'postal_code' => '40123',
            'payment_method' => 'bank_transfer',
        ])->assertSessionHasErrors('payment_method');
    }

    public function test_checkout_rejects_inactive_payment_methods_and_channels(): void
    {
        StoreContentSetting::putValue('payment_settings', [
            'enabled' => true,
            'methods' => ['midtrans'],
            'midtrans_channels' => ['gopay'],
        ]);
        $checkout = [
            'name' => 'Buyer',
            'email' => 'buyer@example.com',
            'phone' => '08123456789',
            'address' => 'Jl. Contoh 1',
            'province' => 'Jawa Barat',
            'city' => 'Bandung',
            'district' => 'Coblong',
            'postal_code' => '40123',
        ];

        $this->post('/checkout', $checkout + [
            'payment_method' => 'bank_transfer',
        ])->assertSessionHasErrors('payment_method');

        $this->post('/checkout', $checkout + [
            'payment_method' => 'midtrans',
            'midtrans_channel' => 'bca_va',
        ])->assertSessionHasErrors('midtrans_channel');
    }

    public function test_biteship_toggle_and_courier_allowlist_control_new_rates(): void
    {
        config([
            'services.biteship.fake_rates' => true,
            'services.biteship.free_shipping_threshold' => 999999999,
            'services.biteship.fallback_shipping_cost' => 25000,
        ]);
        $category = Category::create([
            'name' => 'Shipping Test',
            'slug' => 'shipping-test',
            'is_active' => true,
        ]);
        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Shipping Test Product',
            'slug' => 'shipping-test-product',
            'price' => 100000,
            'stock' => 10,
            'sku' => 'SKU-'.Str::upper(Str::random(8)),
            'is_active' => true,
        ]);
        $item = (object) ['product' => $product, 'quantity' => 1];
        $biteship = app(BiteshipService::class);

        StoreContentSetting::putValue('shipping_settings', [
            'biteship_enabled' => true,
            'couriers' => ['jne'],
            'flat_shipping_cost' => 32000,
        ]);
        $this->assertSame(['jne'], collect($biteship->ratesForCart([$item], '40123'))
            ->pluck('courier_code')->all());

        StoreContentSetting::putValue('shipping_settings', [
            'biteship_enabled' => false,
            'couriers' => ['jne'],
            'flat_shipping_cost' => 32000,
        ]);
        $rate = $biteship->ratesForCart([$item], '40123')[0];
        $this->assertSame('flat', $rate['courier_code']);
        $this->assertSame(32000, $rate['price']);
    }
}
