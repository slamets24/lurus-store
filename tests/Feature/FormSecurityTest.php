<?php

namespace Tests\Feature;

use App\Models\CartItem;
use App\Models\Category;
use App\Models\Product;
use App\Support\ContactRules;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FormSecurityTest extends TestCase
{
    use RefreshDatabase;

    private function checkoutPayload(array $overrides = []): array
    {
        return $overrides + [
            'name' => 'Buyer',
            'email' => 'buyer@example.com',
            'phone' => '08123456789',
            'address' => 'Jl. Contoh No. 1',
            'province' => 'Jawa Barat',
            'city' => 'Bandung',
            'district' => 'Coblong',
            'postal_code' => '40123',
            'payment_method' => 'bank_transfer',
        ];
    }

    private function fillCart(): string
    {
        $category = Category::create(['name' => 'Test', 'slug' => 'test', 'is_active' => true]);
        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Shirt',
            'slug' => 'shirt',
            'price' => 100000,
            'stock' => 5,
            'sku' => 'SKU-TEST0001',
            'is_active' => true,
        ]);
        $token = str_repeat('a', 40);
        CartItem::create(['session_id' => $token, 'product_id' => $product->id, 'quantity' => 1]);

        return $token;
    }

    public function test_checkout_rejects_garbage_phone_and_accepts_international(): void
    {
        $this->post('/checkout', $this->checkoutPayload(['phone' => 'not-a-phone']))
            ->assertSessionHasErrors('phone');

        $this->post('/checkout', $this->checkoutPayload(['phone' => '0000']))
            ->assertSessionHasErrors('phone');

        // International + formatted numbers normalize and pass phone validation.
        foreach (['+62 812-3456-7890', '+1 (415) 555-2671', '08123456789'] as $phone) {
            $this->post('/checkout', $this->checkoutPayload(['phone' => $phone]))
                ->assertSessionDoesntHaveErrors('phone');
        }
    }

    public function test_checkout_honeypot_blocks_bots(): void
    {
        $this->post('/checkout', $this->checkoutPayload(['website' => 'http://spam.example']))
            ->assertSessionHasErrors('website');
    }

    public function test_contact_honeypot_and_email_rules(): void
    {
        $this->post('/contact', [
            'name' => 'Bot',
            'email' => 'bot@example.com',
            'message' => 'hi',
            'website' => 'spam',
        ])->assertSessionHasErrors('website');

        $this->post('/contact', [
            'name' => 'Person',
            'email' => 'not-an-email',
            'message' => 'hi',
        ])->assertSessionHasErrors('email');
    }

    public function test_register_rejects_invalid_phone(): void
    {
        $this->post('/register', [
            'name' => 'User',
            'email' => 'user@example.com',
            'phone' => 'abc',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ])->assertSessionHasErrors('phone');
    }

    public function test_contact_route_is_throttled(): void
    {
        for ($i = 0; $i < 5; $i++) {
            $this->post('/contact', []);
        }

        $this->post('/contact', [])->assertStatus(429);
    }

    public function test_security_headers_are_sent(): void
    {
        $response = $this->get('/');

        $response
            ->assertHeader('X-Frame-Options', 'DENY')
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
            ->assertHeader('Cross-Origin-Opener-Policy', 'same-origin');

        $csp = $response->headers->get('Content-Security-Policy');
        $this->assertNotEmpty($csp);
        $this->assertStringContainsString("default-src 'self'", $csp);
        $this->assertStringContainsString("object-src 'none'", $csp);
        $this->assertStringContainsString('https://app.midtrans.com', $csp);
        $this->assertStringContainsString("frame-ancestors 'none'", $csp);
    }

    public function test_session_fingerprint_logs_out_authenticated_user_on_ua_change(): void
    {
        $user = \App\Models\User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $this->withHeaders(['User-Agent' => 'Browser-A'])
            ->actingAs($user)
            ->get('/account')
            ->assertOk();

        $this->withHeaders(['User-Agent' => 'Browser-B'])
            ->get('/account')
            ->assertRedirect(route('login'));

        $this->assertGuest();
    }

    public function test_phone_normalization(): void
    {
        $this->assertSame('+6281234567890', ContactRules::normalizePhone('+62 812-3456-7890'));
        $this->assertSame('08123456789', ContactRules::normalizePhone('0812.3456.789'));
        $this->assertNull(ContactRules::normalizePhone('  '));
    }

    public function test_checkout_completes_with_valid_international_phone(): void
    {
        $token = $this->fillCart();

        $this->withCookie(\App\Http\Middleware\EnsureGuestCartToken::COOKIE, $token)
            ->post('/checkout', $this->checkoutPayload(['phone' => '+1 415 555 2671']))
            ->assertRedirect();

        $this->assertDatabaseHas('orders', ['customer_phone' => '+14155552671']);
    }
}
