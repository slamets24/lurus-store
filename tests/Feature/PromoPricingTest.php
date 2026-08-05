<?php

namespace Tests\Feature;

use App\Models\CartItem;
use App\Models\Category;
use App\Models\Product;
use App\Models\Promo;
use App\Models\PromoComponent;
use App\Models\PromoTarget;
use App\Models\User;
use App\Services\CartPricingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class PromoPricingTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_percent_discount_reduces_unit_price(): void
    {
        $product = $this->product(price: 100000, discountPercent: 10);

        $this->assertSame(90000.0, $product->effectiveUnitPrice());
        $this->assertSame(90000.0, app(CartPricingService::class)->effectiveUnitPrice($product));
    }

    public function test_bxgy_buy_2_get_1_makes_cheapest_unit_free(): void
    {
        $product = $this->product(price: 100000, discountPercent: 0);
        Promo::create([
            'name' => 'Beli 2 gratis 1',
            'type' => Promo::TYPE_BXGY,
            'is_active' => true,
            'scope' => Promo::SCOPE_PRODUCTS,
            'buy_qty' => 2,
            'free_qty' => 1,
            'free_pick' => Promo::FREE_PICK_CHEAPEST,
        ])->targets()->create([
            'target_type' => PromoTarget::TYPE_PRODUCT,
            'target_id' => $product->id,
        ]);

        $quote = app(CartPricingService::class)->quote(collect([
            (object) ['product' => $product, 'quantity' => 3],
        ]));

        $this->assertSame(300000.0, $quote['subtotal']);
        $this->assertSame(100000.0, $quote['discount_amount']);
        $this->assertSame(200000.0, $quote['payable']);
    }

    public function test_bundle_promo_charges_package_price(): void
    {
        $a = $this->product('Kaos', 100000);
        $b = $this->product('Celana', 150000);
        $promo = Promo::create([
            'name' => 'Set hemat',
            'type' => Promo::TYPE_BUNDLE,
            'is_active' => true,
            'scope' => Promo::SCOPE_PRODUCTS,
            'package_price' => 200000,
        ]);
        PromoComponent::create(['promo_id' => $promo->id, 'product_id' => $a->id, 'quantity' => 1]);
        PromoComponent::create(['promo_id' => $promo->id, 'product_id' => $b->id, 'quantity' => 1]);

        $quote = app(CartPricingService::class)->quote(collect([
            (object) ['product' => $a, 'quantity' => 1],
            (object) ['product' => $b, 'quantity' => 1],
        ]));

        $this->assertSame(250000.0, $quote['subtotal']);
        $this->assertSame(50000.0, $quote['discount_amount']);
        $this->assertSame(200000.0, $quote['payable']);
    }

    public function test_checkout_applies_discount_percent_and_stores_order_discount(): void
    {
        config(['services.biteship.fake_rates' => true, 'services.biteship.free_shipping_threshold' => 999999999]);

        $product = $this->product(price: 100000, discountPercent: 10, stock: 5);
        Promo::create([
            'name' => 'Beli 2 gratis 1',
            'type' => Promo::TYPE_BXGY,
            'is_active' => true,
            'scope' => Promo::SCOPE_PRODUCTS,
            'buy_qty' => 2,
            'free_qty' => 1,
            'free_pick' => Promo::FREE_PICK_CHEAPEST,
        ])->targets()->create([
            'target_type' => PromoTarget::TYPE_PRODUCT,
            'target_id' => $product->id,
        ]);

        $user = User::factory()->create();
        CartItem::create(['user_id' => $user->id, 'product_id' => $product->id, 'quantity' => 3]);

        $this->actingAs($user)
            ->post('/checkout', [
                'name' => 'Buyer',
                'email' => $user->email,
                'phone' => '08123456789',
                'address' => 'Jl. Test 1',
                'province' => 'Jawa Barat',
                'city' => 'Bandung',
                'district' => 'Coblong',
                'postal_code' => '40123',
                'shipping_courier' => 'jne',
                'shipping_service' => 'reg',
                'payment_method' => 'bank_transfer',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('orders', [
            'customer_email' => strtolower($user->email),
            'subtotal' => 270000,
            'discount_amount' => 90000,
        ]);
    }

    public function test_admin_can_create_bxgy_promo_via_builder(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $product = $this->product();

        $this->actingAs($admin)
            ->post('/admin/promos', [
                'name' => 'Flash BXGY',
                'type' => 'bxgy',
                'is_active' => true,
                'scope' => 'products',
                'buy_qty' => 2,
                'free_qty' => 1,
                'free_pick' => 'cheapest',
                'target_ids' => [$product->id],
            ])
            ->assertRedirect('/admin/promos');

        $this->assertDatabaseHas('promos', ['name' => 'Flash BXGY', 'type' => 'bxgy']);
        $this->assertDatabaseHas('promo_targets', [
            'target_type' => 'product',
            'target_id' => $product->id,
        ]);
    }

    private function product(string $name = 'Test Shirt', int $price = 100000, int $stock = 10, float $discountPercent = 0): Product
    {
        $category = Category::create([
            'name' => 'Category '.Str::random(6),
            'slug' => 'category-'.Str::lower(Str::random(8)),
            'is_active' => true,
        ]);

        return Product::create([
            'category_id' => $category->id,
            'name' => $name,
            'slug' => Str::slug($name).'-'.Str::lower(Str::random(6)),
            'price' => $price,
            'discount_percent' => $discountPercent,
            'stock' => $stock,
            'sku' => 'SKU-'.Str::upper(Str::random(8)),
            'is_active' => true,
        ]);
    }
}
