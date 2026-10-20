<?php

namespace Tests\Feature;

use App\Http\Middleware\EnsureGuestCartToken;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProductSellOptionTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_add_pieces_and_extra_sell_options(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $category = Category::factory()->create(['name' => 'Set']);

        $this->actingAs($admin)->post(route('admin.products.store'), [
            ...$this->payload($category),
            'components' => [
                ['key' => 'top', 'name' => 'Atasan'],
                ['key' => 'skirt', 'name' => 'Rok'],
            ],
            'offers' => [
                ['name' => 'Atasan saja', 'price' => 200000, 'component_keys' => ['top']],
                ['name' => 'Set atasan + rok', 'price' => 350000, 'component_keys' => ['top', 'skirt']],
            ],
            'variants' => [
                ['component_key' => 'top', 'color' => 'Black', 'size' => 'M', 'stock' => 1],
                ['component_key' => 'skirt', 'color' => 'Black', 'size' => 'M', 'stock' => 2],
            ],
        ])->assertRedirect(route('admin.products.index'));

        $product = Product::where('sku', 'CALLA')->firstOrFail();
        $this->assertSame(200000.0, (float) $product->price);
        $this->assertSame(2, $product->components()->count());
        $this->assertSame(2, $product->offers()->count());
        $this->assertSame(1, $product->variants()->whereHas('component', fn ($query) => $query->where('name', 'Atasan'))->value('stock'));

        $top = $product->components()->where('name', 'Atasan')->firstOrFail();
        $skirt = $product->components()->where('name', 'Rok')->firstOrFail();

        $this->actingAs($admin)->put(route('admin.products.update', $product), [
            ...$this->payload($category),
            'components' => [
                ['id' => $top->id, 'key' => (string) $top->id, 'name' => 'Atasan'],
                ['id' => $skirt->id, 'key' => (string) $skirt->id, 'name' => 'Rok'],
                ['key' => 'pants', 'name' => 'Celana'],
            ],
            'offers' => [
                ['name' => 'Atasan saja', 'price' => 200000, 'component_keys' => [(string) $top->id]],
                ['name' => 'Set atasan + rok', 'price' => 350000, 'component_keys' => [(string) $top->id, (string) $skirt->id]],
                ['name' => 'Set atasan + celana', 'price' => 370000, 'component_keys' => [(string) $top->id, 'pants']],
            ],
            'variants' => [
                ['component_key' => (string) $top->id, 'color' => 'Black', 'size' => 'M', 'stock' => 1],
                ['component_key' => (string) $skirt->id, 'color' => 'Black', 'size' => 'M', 'stock' => 2],
                ['component_key' => 'pants', 'color' => 'Black', 'size' => 'M', 'stock' => 3],
            ],
        ])->assertRedirect(route('admin.products.index'));

        $this->assertSame(3, $product->components()->count());
        $this->assertTrue($product->offers()->where('name', 'Set atasan + celana')->exists());

        $this->get(route('products.show', $product->slug))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('ProductDetail')
                ->where('product.offers', fn ($offers) => collect($offers)->pluck('name')->sort()->values()->all() === [
                    'Atasan saja',
                    'Set atasan + celana',
                    'Set atasan + rok',
                ]));
    }

    public function test_shared_piece_stock_blocks_a_second_option(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $category = Category::factory()->create(['name' => 'Set']);
        $this->actingAs($admin)->post(route('admin.products.store'), [
            ...$this->payload($category),
            'components' => [
                ['key' => 'top', 'name' => 'Atasan'],
                ['key' => 'skirt', 'name' => 'Rok'],
            ],
            'offers' => [
                ['name' => 'Atasan saja', 'price' => 200000, 'component_keys' => ['top']],
                ['name' => 'Set atasan + rok', 'price' => 350000, 'component_keys' => ['top', 'skirt']],
            ],
            'variants' => [
                ['component_key' => 'top', 'color' => 'Black', 'size' => 'M', 'stock' => 1],
                ['component_key' => 'skirt', 'color' => 'Black', 'size' => 'M', 'stock' => 2],
            ],
        ])->assertRedirect();

        $product = Product::where('sku', 'CALLA')->firstOrFail();
        $top = $product->components()->where('name', 'Atasan')->firstOrFail();
        $skirt = $product->components()->where('name', 'Rok')->firstOrFail();
        $atasan = $product->offers()->where('name', 'Atasan saja')->firstOrFail();
        $set = $product->offers()->where('name', 'Set atasan + rok')->firstOrFail();
        $token = Str::random(40);
        auth()->logout();

        $this->withCookie(EnsureGuestCartToken::COOKIE, $token)
            ->post('/cart', [
                'product_id' => $product->id,
                'quantity' => 1,
                'offer_id' => $atasan->id,
                'color' => 'Black',
                'sizes' => [$top->id => 'M'],
            ])
            ->assertRedirect()
            ->assertSessionHas('success');

        $this->assertDatabaseHas('cart_items', [
            'session_id' => $token,
            'product_offer_id' => $atasan->id,
            'size' => 'M',
        ]);

        $this->withCookie(EnsureGuestCartToken::COOKIE, $token)
            ->get(route('cart.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('cartItems.0.unit_price', 200000));

        $this->withCookie(EnsureGuestCartToken::COOKIE, $token)
            ->post('/cart', [
                'product_id' => $product->id,
                'quantity' => 1,
                'offer_id' => $set->id,
                'color' => 'Black',
                'sizes' => [$top->id => 'M', $skirt->id => 'M'],
            ])
            ->assertRedirect()
            ->assertSessionHas('error', 'Insufficient stock.');

        $this->assertSame(1, CartItem::query()->where('session_id', $token)->count());
    }

    private function payload(Category $category): array
    {
        return [
            'name' => 'Calla',
            'description' => 'Set calla',
            'price' => 350000,
            'discount_percent' => 0,
            'sku' => 'CALLA',
            'category_id' => $category->id,
            'category_name' => $category->name,
            'color_hexes' => ['Black' => '#000000'],
            'material' => 'Katun',
            'is_active' => true,
        ];
    }
}
