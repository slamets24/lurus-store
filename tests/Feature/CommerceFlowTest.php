<?php

namespace Tests\Feature;

use App\Http\Middleware\EnsureGuestCartToken;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\StoreContentSetting;
use App\Models\Testimonial;
use App\Models\User;
use App\Notifications\EmailOtpNotification;
use App\Notifications\OrderAdminNotification;
use App\Notifications\OrderCustomerNotification;
use App\Notifications\StockConfirmationNeededNotification;
use App\Services\CartPricingService;
use App\Services\CartService;
use App\Services\EmailOtpService;
use App\Services\MidtransService;
use App\Services\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\TestCase;

class CommerceFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cart_uses_token_and_only_stale_guest_cart_expires(): void
    {
        $this->travelTo(Carbon::parse('2026-07-24 00:00:00'));
        $product = $this->product(stock: 10);
        $token = Str::random(40);

        $this->withCookie(EnsureGuestCartToken::COOKIE, $token)
            ->post('/cart', ['product_id' => $product->id, 'quantity' => 1])
            ->assertRedirect()
            ->assertCookie(EnsureGuestCartToken::COOKIE);

        $guestItem = CartItem::where('session_id', $token)->firstOrFail();
        CartItem::whereKey($guestItem->id)->update(['updated_at' => now()->subDays(8)]);
        $user = User::factory()->create();
        $accountItem = CartItem::create(['user_id' => $user->id, 'product_id' => $product->id, 'quantity' => 1]);
        CartItem::whereKey($accountItem->id)->update(['updated_at' => now()->subDays(8)]);

        $this->artisan('schedule:run')->assertSuccessful();

        $this->assertDatabaseMissing('cart_items', ['id' => $guestItem->id]);
        $this->assertDatabaseHas('cart_items', ['id' => $accountItem->id, 'user_id' => $user->id]);
    }

    public function test_login_merges_duplicate_guest_cart_with_stock_cap(): void
    {
        $product = $this->product(stock: 4);
        $user = User::factory()->create(['password' => 'password']);
        $token = Str::random(40);
        CartItem::create(['user_id' => $user->id, 'product_id' => $product->id, 'quantity' => 2]);
        CartItem::create(['session_id' => $token, 'product_id' => $product->id, 'quantity' => 3]);

        $this->withCookie(EnsureGuestCartToken::COOKIE, $token)
            ->post('/login', ['email' => $user->email, 'password' => 'password'])
            ->assertRedirect()
            ->assertCookieExpired(EnsureGuestCartToken::COOKIE);

        $this->assertDatabaseHas('cart_items', ['user_id' => $user->id, 'session_id' => null, 'product_id' => $product->id, 'quantity' => 4]);
        $this->assertSame(1, CartItem::where('product_id', $product->id)->count());
    }

    public function test_cart_add_flags_only_new_line_items(): void
    {
        $product = $this->product(stock: 10);
        $token = Str::random(40);

        $this->withCookie(EnsureGuestCartToken::COOKIE, $token)
            ->post('/cart', ['product_id' => $product->id, 'quantity' => 1])
            ->assertRedirect()
            ->assertSessionHas('cart_item_created', true);

        $this->withCookie(EnsureGuestCartToken::COOKIE, $token)
            ->post('/cart', ['product_id' => $product->id, 'quantity' => 1])
            ->assertRedirect()
            ->assertSessionHas('cart_item_created', false);

        $this->assertDatabaseHas('cart_items', [
            'session_id' => $token,
            'product_id' => $product->id,
            'quantity' => 2,
        ]);
    }

    public function test_cart_preview_includes_line_items_and_totals(): void
    {
        $product = $this->product(price: 100000, stock: 5);
        $token = Str::random(40);
        CartItem::create(['session_id' => $token, 'product_id' => $product->id, 'quantity' => 2]);

        $request = Request::create('/');
        $request->cookies->set(EnsureGuestCartToken::COOKIE, $token);
        $request->attributes->set(EnsureGuestCartToken::ATTRIBUTE, $token);

        $preview = app(CartService::class)->preview(
            $request,
            app(CartPricingService::class),
        );

        $this->assertCount(1, $preview['items']);
        $this->assertSame(2, $preview['items'][0]['quantity']);
        $this->assertSame($product->id, $preview['items'][0]['product']['id']);
        $this->assertSame(200000.0, $preview['total']);
    }

    public function test_cart_update_rejects_quantity_above_stock(): void
    {
        $product = $this->product(stock: 2);
        $token = Str::random(40);
        $item = CartItem::create(['session_id' => $token, 'product_id' => $product->id, 'quantity' => 1]);

        $this->withCookie(EnsureGuestCartToken::COOKIE, $token)
            ->patch("/cart/{$item->id}", ['quantity' => 3])
            ->assertRedirect()
            ->assertSessionHas('error', 'Insufficient stock.');

        $this->assertDatabaseHas('cart_items', ['id' => $item->id, 'quantity' => 1]);

        $this->withCookie(EnsureGuestCartToken::COOKIE, $token)
            ->patch("/cart/{$item->id}", ['quantity' => 2])
            ->assertRedirect()
            ->assertSessionHas('success');

        $this->assertDatabaseHas('cart_items', ['id' => $item->id, 'quantity' => 2]);
    }

    public function test_login_from_checkout_returns_to_checkout_with_merged_cart_and_autofill(): void
    {
        $product = $this->product(stock: 5);
        $user = User::factory()->create([
            'name' => 'Logged Buyer',
            'email' => 'buyer@example.com',
            'phone' => '08111111111',
            'password' => 'password',
            'address' => 'Jl. Akun No. 9',
            'city' => 'Jakarta',
            'postal_code' => '10110',
        ]);
        $token = Str::random(40);
        CartItem::create(['session_id' => $token, 'product_id' => $product->id, 'quantity' => 1]);

        $this->withCookie(EnsureGuestCartToken::COOKIE, $token)
            ->get('/login?redirect=/checkout')
            ->assertOk();

        $this->withCookie(EnsureGuestCartToken::COOKIE, $token)
            ->post('/login', ['email' => $user->email, 'password' => 'password'])
            ->assertRedirect('/checkout');

        $this->assertDatabaseHas('cart_items', [
            'user_id' => $user->id,
            'session_id' => null,
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        $this->actingAs($user)
            ->get('/checkout')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Checkout')
                ->where('shippingAddress.name', 'Logged Buyer')
                ->where('shippingAddress.email', 'buyer@example.com')
                ->where('shippingAddress.phone', '08111111111')
                ->where('shippingAddress.address', 'Jl. Akun No. 9')
                ->where('shippingAddress.city', 'Jakarta')
                ->where('shippingAddress.postal_code', '10110'));
    }

    public function test_unverified_login_from_checkout_returns_after_otp(): void
    {
        Notification::fake();
        $product = $this->product(stock: 3);
        $user = User::factory()->unverified()->create([
            'email' => 'unverified@example.com',
            'password' => 'password',
        ]);
        $token = Str::random(40);
        CartItem::create(['session_id' => $token, 'product_id' => $product->id, 'quantity' => 1]);

        $this->withCookie(EnsureGuestCartToken::COOKIE, $token)
            ->get('/login?redirect=/checkout')
            ->assertOk();

        $this->withCookie(EnsureGuestCartToken::COOKIE, $token)
            ->post('/login', ['email' => $user->email, 'password' => 'password'])
            ->assertRedirect(route('verification.notice'));

        $this->assertDatabaseHas('cart_items', [
            'user_id' => $user->id,
            'session_id' => null,
            'product_id' => $product->id,
        ]);

        $code = Notification::sent($user->fresh(), EmailOtpNotification::class)->first()?->code;
        $this->assertNotNull($code);

        $this->post('/email/verify', ['code' => $code])
            ->assertRedirect('/checkout');
    }

    public function test_admin_cart_index_hides_guest_token(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $customer = User::factory()->create(['name' => 'Cart Owner', 'email' => 'owner@example.com']);
        $product = $this->product();
        $guestToken = 'secret-guest-token-should-not-leak';
        CartItem::create(['user_id' => $customer->id, 'product_id' => $product->id, 'quantity' => 2]);
        CartItem::create(['session_id' => $guestToken, 'product_id' => $product->id, 'quantity' => 1]);

        $this->actingAs($admin)
            ->get('/admin/carts')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Carts/Index')
                ->has('carts', 2)
                ->where('carts', fn ($carts) => collect($carts)->contains(fn ($cart) => $cart['owner_type'] === 'guest'
                    && $cart['owner_name'] === 'Guest'
                    && $cart['owner_email'] === null
                    && ! str_contains(json_encode($cart), $guestToken))
                    && collect($carts)->contains(fn ($cart) => $cart['owner_type'] === 'customer'
                        && $cart['owner_name'] === 'Cart Owner'
                        && $cart['owner_email'] === 'owner@example.com')));
    }

    public function test_checkout_uses_server_totals_snapshots_items_and_reserves_stock(): void
    {
        config([
            'services.biteship.fake_rates' => false,
            'services.biteship.fallback_shipping_cost' => 25000,
            'services.biteship.free_shipping_threshold' => 999999999,
            'services.biteship.api_key' => null,
        ]);
        Http::fake();
        $product = $this->product(name: 'Original Shirt', price: 100000, stock: 5);
        $token = Str::random(40);
        CartItem::create(['session_id' => $token, 'product_id' => $product->id, 'quantity' => 2]);

        $this->withCookie(EnsureGuestCartToken::COOKIE, $token)->post('/checkout', [
            'name' => 'Guest Buyer', 'email' => 'guest@example.com', 'phone' => '08123456789',
            'address' => 'Jl. Contoh No. 1', 'province' => 'Jawa Barat', 'city' => 'Bandung', 'district' => 'Coblong', 'postal_code' => '40123',
            'payment_method' => Order::PAYMENT_METHOD_BANK_TRANSFER, 'subtotal' => 1, 'total_amount' => 1,
        ])->assertRedirect();

        $order = Order::with('items')->sole();
        $this->assertSame('200000.00', $order->subtotal);
        $this->assertSame('0.00', $order->discount_amount);
        $this->assertSame('25000.00', $order->shipping_cost);
        $this->assertSame('225000.00', $order->total_amount);
        $this->assertSame('Original Shirt', $order->items->sole()->product_name);
        $this->assertSame('100000.00', $order->items->sole()->price);
        $this->assertSame(5, $product->fresh()->stock);
        $this->assertDatabaseMissing('cart_items', ['session_id' => $token]);
        $product->update(['name' => 'Renamed Shirt', 'price' => 999999]);
        $this->assertSame('Original Shirt', $order->items->sole()->fresh()->product_name);
        $this->assertSame('100000.00', $order->items->sole()->fresh()->price);
    }

    public function test_checkout_uses_selected_biteship_rate(): void
    {
        config([
            'services.biteship.api_key' => 'biteship-key',
            'services.biteship.base_url' => 'https://api.biteship.test',
            'services.biteship.origin_postal_code' => '15143',
            'services.biteship.fake_rates' => false,
        ]);
        Http::fake([
            'https://api.biteship.test/v1/rates/couriers' => Http::response([
                'pricing' => [
                    [
                        'courier_code' => 'jne',
                        'courier_name' => 'JNE',
                        'courier_service_code' => 'reg',
                        'courier_service_name' => 'REG',
                        'duration' => '2 - 3 days',
                        'price' => 9000,
                    ],
                ],
            ]),
        ]);
        $product = $this->product(price: 100000, stock: 5);
        $token = Str::random(40);
        CartItem::create(['session_id' => $token, 'product_id' => $product->id, 'quantity' => 2]);

        $this->withCookie(EnsureGuestCartToken::COOKIE, $token)->post('/checkout', [
            'name' => 'Guest Buyer', 'email' => 'guest@example.com', 'phone' => '08123456789',
            'address' => 'Jl. Contoh No. 1', 'province' => 'Jawa Barat', 'city' => 'Bandung', 'district' => 'Coblong', 'postal_code' => '40123',
            'shipping_courier' => 'jne', 'shipping_service' => 'reg',
            'payment_method' => Order::PAYMENT_METHOD_BANK_TRANSFER,
        ])->assertRedirect();

        $order = Order::sole();
        $this->assertSame('9000.00', $order->shipping_cost);
        $this->assertSame('209000.00', $order->total_amount);
        $this->assertSame('jne', $order->shipping_address['courier']['courier_code']);
        Http::assertSent(fn ($request) => $request->hasHeader('Authorization', 'biteship-key')
            && $request['origin_postal_code'] === 15143
            && $request['destination_postal_code'] === 40123);
    }

    public function test_checkout_area_search_uses_biteship_maps_and_caches(): void
    {
        config([
            'services.biteship.api_key' => 'biteship-key',
            'services.biteship.base_url' => 'https://api.biteship.test',
            'services.biteship.fake_rates' => false,
        ]);
        Http::fake([
            'https://api.biteship.test/v1/maps/areas*' => Http::response([
                'success' => true,
                'areas' => [
                    [
                        'id' => 'IDNP6IDNC148IDND843IDZ12250',
                        'name' => 'Pesanggrahan, Jakarta Selatan, DKI Jakarta. 12250',
                        'administrative_division_level_1_name' => 'DKI Jakarta',
                        'administrative_division_level_2_name' => 'Jakarta Selatan',
                        'administrative_division_level_3_name' => 'Pesanggrahan',
                        'postal_code' => 12250,
                    ],
                ],
            ]),
        ]);

        $this->getJson('/checkout/areas?q=Pesang')
            ->assertOk()
            ->assertJsonPath('areas.0.city', 'Jakarta Selatan')
            ->assertJsonPath('areas.0.district', 'Pesanggrahan')
            ->assertJsonPath('areas.0.postal_code', '12250');

        $this->getJson('/checkout/areas?q=Pesang')->assertOk();

        Http::assertSentCount(1);
    }

    public function test_checkout_wilayah_cities_are_cached(): void
    {
        Http::fake([
            'https://emsifa.github.io/api-wilayah-indonesia/api/regencies/32.json' => Http::response([
                ['id' => '3273', 'province_id' => '32', 'name' => 'KOTA BANDUNG'],
            ]),
        ]);

        $this->getJson('/checkout/wilayah/cities?province_id=32')
            ->assertOk()
            ->assertJsonPath('cities.0.id', '3273')
            ->assertJsonPath('cities.0.name', 'Kota Bandung');

        $this->getJson('/checkout/wilayah/cities?province_id=32')->assertOk();

        Http::assertSentCount(1);
    }

    public function test_midtrans_checkout_flashes_snap_token_and_reuses_existing_transaction(): void
    {
        config([
            'services.midtrans.server_key' => 'server-key',
            'services.midtrans.snap_url' => 'https://midtrans.test/snap/v1/transactions',
        ]);
        Http::fake([
            'https://midtrans.test/snap/v1/transactions' => Http::response([
                'token' => 'snap-token',
                'redirect_url' => 'https://midtrans.test/snap/redirect/snap-token',
            ], 201),
        ]);
        $product = $this->product(price: 100000, stock: 2);
        $cartToken = Str::random(40);
        CartItem::create(['session_id' => $cartToken, 'product_id' => $product->id, 'quantity' => 1]);

        $this->withCookie(EnsureGuestCartToken::COOKIE, $cartToken)->post('/checkout', [
            'name' => 'Guest Buyer', 'email' => 'guest@example.com', 'phone' => '08123456789',
            'address' => 'Jl. Contoh No. 1', 'province' => 'Jawa Barat', 'city' => 'Bandung', 'district' => 'Coblong', 'postal_code' => '40123',
            'payment_method' => Order::PAYMENT_METHOD_MIDTRANS,
            'midtrans_channel' => 'gopay',
        ])->assertRedirect()->assertSessionHas('midtransPayment', fn (array $payment) => $payment['token'] === 'snap-token');

        $order = Order::sole();
        $this->assertSame('snap-token', $order->payment_reference);
        $this->assertSame('https://midtrans.test/snap/redirect/snap-token', $order->payment_url);
        $this->assertSame('gopay', $order->payment_channel);
        $this->assertSame('snap-token', app(MidtransService::class)->createPayment($order->fresh())['token']);
        Http::assertSent(fn ($request) => $request->url() === 'https://midtrans.test/snap/v1/transactions'
            && ($request['enabled_payments'] ?? null) === ['gopay']);
        Http::assertSentCount(1);
    }

    public function test_midtrans_checkout_json_returns_snap_payload_for_popup_flow(): void
    {
        config([
            'services.midtrans.server_key' => 'server-key',
            'services.midtrans.snap_url' => 'https://midtrans.test/snap/v1/transactions',
        ]);
        Http::fake([
            'https://midtrans.test/snap/v1/transactions' => Http::response([
                'token' => 'snap-token-json',
                'redirect_url' => 'https://midtrans.test/snap/redirect/snap-token-json',
            ], 201),
        ]);
        $user = User::factory()->create();
        $product = $this->product(price: 100000, stock: 2);
        CartItem::create(['user_id' => $user->id, 'product_id' => $product->id, 'quantity' => 1]);

        $this->actingAs($user)
            ->postJson('/checkout', [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => '08123456789',
                'address' => 'Jl. Contoh No. 1',
                'province' => 'Jawa Barat',
                'city' => 'Bandung',
                'district' => 'Coblong',
                'postal_code' => '40123',
                'payment_method' => Order::PAYMENT_METHOD_MIDTRANS,
                'midtrans_channel' => 'bca_va',
            ])
            ->assertOk()
            ->assertJsonPath('midtransPayment.token', 'snap-token-json')
            ->assertJsonStructure(['order_number', 'success_url', 'midtransPayment']);

        Http::assertSent(fn ($request) => ($request['enabled_payments'] ?? null) === ['bca_va']);
    }

    public function test_existing_midtrans_order_can_retry_after_new_payments_are_disabled(): void
    {
        config([
            'services.midtrans.server_key' => 'server-key',
            'services.midtrans.snap_url' => 'https://midtrans.test/snap/v1/transactions',
        ]);
        Http::fake([
            'https://midtrans.test/snap/v1/transactions' => Http::response([
                'token' => 'existing-order-token',
                'redirect_url' => 'https://midtrans.test/snap/redirect/existing-order-token',
            ], 201),
        ]);
        $guestToken = Str::random(40);
        $order = $this->order($guestToken, paymentMethod: Order::PAYMENT_METHOD_MIDTRANS);
        $order->update(['payment_channel' => 'gopay']);
        StoreContentSetting::putValue('payment_settings', [
            'enabled' => false,
            'methods' => [],
            'midtrans_channels' => [],
        ]);

        $this->post('/orders/'.$order->order_number.'/midtrans', ['token' => $guestToken])
            ->assertRedirect()
            ->assertSessionHas('midtransPayment', fn (array $payment) => $payment['token'] === 'existing-order-token');
    }

    public function test_customer_order_lifecycle_sends_email_notifications(): void
    {
        Notification::fake();
        Storage::fake('local');
        config(['services.contact.to' => 'owner@aaamen.test']);

        $product = $this->product(stock: 2);
        $cartToken = Str::random(40);
        CartItem::create(['session_id' => $cartToken, 'product_id' => $product->id, 'quantity' => 1]);

        $response = $this->withCookie(EnsureGuestCartToken::COOKIE, $cartToken)->post('/checkout', [
            'name' => 'Guest Buyer', 'email' => 'guest@example.com', 'phone' => '08123456789',
            'address' => 'Jl. Contoh No. 1', 'province' => 'Jawa Barat', 'city' => 'Bandung', 'district' => 'Coblong', 'postal_code' => '40123',
            'payment_method' => Order::PAYMENT_METHOD_BANK_TRANSFER,
        ])->assertRedirect();

        $order = Order::sole();
        parse_str(parse_url($response->headers->get('Location'), PHP_URL_QUERY) ?: '', $query);
        $guestToken = $query['token'] ?? null;
        $this->assertNotEmpty($guestToken);

        Notification::assertSentOnDemand(OrderCustomerNotification::class, function (OrderCustomerNotification $notification) use ($order) {
            return str_contains($notification->subject, 'Order Received')
                && $notification->order->is($order);
        });
        Notification::assertSentOnDemand(OrderAdminNotification::class, fn (OrderAdminNotification $n) => str_contains($n->subject, 'New Order'));

        $this->post("/orders/{$order->order_number}/payment-proof", [
            'token' => $guestToken,
            'proof' => UploadedFile::fake()->image('proof.jpg'),
        ])->assertRedirect();

        Notification::assertSentOnDemand(OrderCustomerNotification::class, fn (OrderCustomerNotification $n) => str_contains($n->subject, 'Transfer Proof Received'));
        Notification::assertSentOnDemand(OrderAdminNotification::class, fn (OrderAdminNotification $n) => str_contains($n->subject, 'Transfer Proof'));

        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $this->actingAs($admin)->patch("/admin/orders/{$order->order_number}/payment/approve")->assertRedirect();
        Notification::assertSentOnDemand(OrderCustomerNotification::class, fn (OrderCustomerNotification $n) => str_contains($n->subject, 'Payment Received'));
        // Owner already approved proof — still only New Order + Transfer Proof admin mails.
        Notification::assertSentOnDemandTimes(OrderAdminNotification::class, 2);

        $this->actingAs($admin)->patch("/admin/orders/{$order->order_number}/status", ['status' => Order::STATUS_SHIPPED])->assertRedirect();
        Notification::assertSentOnDemand(OrderCustomerNotification::class, fn (OrderCustomerNotification $n) => str_contains($n->subject, 'Order Shipped'));

        $this->actingAs($admin)->patch("/admin/orders/{$order->order_number}/status", ['status' => Order::STATUS_DELIVERED])->assertRedirect();
        Notification::assertSentOnDemand(OrderCustomerNotification::class, fn (OrderCustomerNotification $n) => str_contains($n->subject, 'Order Delivered'));
    }

    public function test_midtrans_paid_notifies_admin(): void
    {
        Notification::fake();
        config(['services.contact.to' => 'owner@aaamen.test']);

        $order = $this->order(paymentMethod: Order::PAYMENT_METHOD_MIDTRANS);
        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $this->product(stock: 2)->id,
            'product_name' => 'Tee',
            'sku' => 'TEE-1',
            'quantity' => 1,
            'price' => 100000,
        ]);

        app(OrderService::class)->markPaid($order);

        Notification::assertSentOnDemand(OrderAdminNotification::class, fn (OrderAdminNotification $n) => str_contains($n->subject, 'Payment Received'));
    }

    public function test_stock_shortage_after_payment_sends_confirmation_email(): void
    {
        Notification::fake();
        $product = $this->product(stock: 0);
        $order = $this->order();
        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'product_name' => $product->name,
            'sku' => $product->sku,
            'quantity' => 1,
            'price' => $product->price,
        ]);

        app(OrderService::class)->markPaid($order);

        $this->assertSame(Order::STATUS_STOCK_CONFIRMATION, $order->fresh()->status);
        Notification::assertSentOnDemand(StockConfirmationNeededNotification::class);
    }

    public function test_guest_order_pages_require_the_exact_token(): void
    {
        $token = Str::random(40);
        $order = $this->order(guestToken: $token);
        $this->get("/orders/{$order->id}")->assertForbidden();
        $this->get("/orders/{$order->id}?token=".Str::random(40))->assertForbidden();
        $this->get("/orders/{$order->id}?token={$token}")->assertOk();
        $this->get("/orders/{$order->order_number}?token={$token}")->assertOk();
    }

    public function test_email_otp_verification_claims_matching_guest_order(): void
    {
        Notification::fake();
        $user = User::factory()->unverified()->create(['email' => 'buyer@example.com']);
        $order = $this->order(guestToken: Str::random(40), email: 'BUYER@example.com');
        $code = null;
        app(EmailOtpService::class)->send($user, enforceCooldown: false);
        Notification::assertSentTo($user, EmailOtpNotification::class, function (EmailOtpNotification $notification) use (&$code) {
            $code = $notification->code;

            return true;
        });

        $this->actingAs($user)->post('/email/verify', ['code' => $code])->assertRedirect();
        $this->assertNotNull($user->fresh()->email_verified_at);
        $this->assertNull($user->fresh()->email_otp_hash);
        $this->assertDatabaseHas('orders', ['id' => $order->id, 'user_id' => $user->id, 'guest_token' => null]);
    }

    public function test_email_otp_claims_guest_order_by_claim_token_even_with_different_email(): void
    {
        Notification::fake();
        $claimToken = Str::random(40);
        $order = $this->order(guestToken: $claimToken, email: 'guest-order@example.com');
        $user = User::factory()->unverified()->create(['email' => 'other@example.com']);
        $code = null;
        app(EmailOtpService::class)->send($user, enforceCooldown: false);
        Notification::assertSentTo($user, EmailOtpNotification::class, function (EmailOtpNotification $notification) use (&$code) {
            $code = $notification->code;

            return true;
        });

        $this->withSession(['guest_order_claim_token' => $claimToken])
            ->actingAs($user)
            ->post('/email/verify', ['code' => $code])
            ->assertRedirect();

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'user_id' => $user->id,
            'guest_token' => null,
        ]);
    }

    public function test_admin_cannot_use_otp_bypass_to_claim_guest_orders(): void
    {
        $admin = User::factory()->unverified()->create([
            'email' => 'buyer@example.com',
            'role' => User::ROLE_ADMIN,
        ]);
        $order = $this->order(guestToken: Str::random(40), email: 'BUYER@example.com');

        $this->actingAs($admin)
            ->post('/email/verify', ['code' => '000000'])
            ->assertForbidden();

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'user_id' => null,
        ]);
    }

    public function test_transfer_proof_is_private_and_admin_can_approve_payment(): void
    {
        Storage::fake('local');
        $token = Str::random(40);
        $order = $this->order(guestToken: $token);
        $this->post("/orders/{$order->id}/payment-proof", [
            'token' => $token,
            'proof' => UploadedFile::fake()->image('proof.jpg'),
        ])->assertRedirect();

        $order->refresh();
        $this->assertSame(Order::PAYMENT_PENDING_VERIFICATION, $order->payment_status);
        Storage::disk('local')->assertExists($order->payment_proof_path);
        $customer = User::factory()->create();
        $this->actingAs($customer)->get("/admin/orders/{$order->id}/payment-proof")->assertForbidden();
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $this->actingAs($admin)->patch("/admin/orders/{$order->id}/payment/approve")->assertRedirect();
        $this->assertDatabaseHas('orders', ['id' => $order->id, 'payment_status' => Order::PAYMENT_PAID, 'status' => Order::STATUS_READY_TO_SHIP]);
    }

    public function test_midtrans_signature_is_required_and_settlement_is_idempotent(): void
    {
        config(['services.midtrans.server_key' => 'server-key']);
        $order = $this->order(paymentMethod: Order::PAYMENT_METHOD_MIDTRANS);
        $payload = [
            'order_id' => $order->order_number,
            'status_code' => '200',
            'gross_amount' => $order->total_amount,
            'transaction_status' => 'settlement',
            'payment_type' => 'gopay',
        ];
        $this->postJson('/payments/midtrans/notification', $payload + ['signature_key' => 'invalid'])->assertForbidden();
        $this->assertSame(Order::PAYMENT_UNPAID, $order->fresh()->payment_status);
        $payload['signature_key'] = hash('sha512', $payload['order_id'].$payload['status_code'].$payload['gross_amount'].'server-key');
        $this->postJson('/payments/midtrans/notification', $payload)->assertOk();
        $verifiedAt = $order->fresh()->payment_verified_at;
        $this->postJson('/payments/midtrans/notification', $payload)->assertOk();
        $order->refresh();
        $this->assertSame(Order::PAYMENT_PAID, $order->payment_status);
        $this->assertSame(Order::STATUS_READY_TO_SHIP, $order->status);
        $this->assertSame('gopay', $order->payment_channel);
        $this->assertTrue($verifiedAt->equalTo($order->payment_verified_at));
    }

    public function test_stock_release_is_idempotent(): void
    {
        $product = $this->product(stock: 3);
        $order = $this->order();
        OrderItem::create(['order_id' => $order->id, 'product_id' => $product->id, 'product_name' => $product->name, 'sku' => $product->sku, 'quantity' => 2, 'price' => $product->price]);
        $service = app(OrderService::class);
        $service->releaseStock($order);
        $service->releaseStock($order->fresh());
        $this->assertSame(3, $product->fresh()->stock);
        $this->assertSame(Order::PAYMENT_EXPIRED, $order->fresh()->payment_status);
        $this->assertNotNull($order->fresh()->stock_released_at);
    }

    public function test_delivered_order_testimonial_requires_moderation(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $product = $this->product();
        $order = $this->order(status: Order::STATUS_DELIVERED);
        $testimonialToken = $order->testimonialAccessToken();
        $order->update(['testimonial_token' => hash('sha256', $testimonialToken)]);
        $item = OrderItem::create(['order_id' => $order->id, 'product_id' => $product->id, 'product_name' => $product->name, 'sku' => $product->sku, 'quantity' => 1, 'price' => $product->price]);
        $review = ['reviews' => [['order_item_id' => $item->id, 'rating' => 5, 'comment' => 'Bahannya nyaman dan ukurannya sangat pas.']]];
        $this->post("/testimonials/{$testimonialToken}", $review)->assertRedirect('/');
        $testimonial = Testimonial::sole();
        $this->assertNull($testimonial->approved_at);
        $this->post("/testimonials/{$testimonialToken}", $review)->assertNotFound();
        $this->actingAs($admin)->patch("/admin/testimonials/{$testimonial->id}/approve")->assertRedirect();
        $this->assertNotNull($testimonial->fresh()->approved_at);
    }

    public function test_admin_creates_biteship_shipment_and_webhook_marks_delivered(): void
    {
        Notification::fake();
        config([
            'services.biteship.api_key' => 'biteship-key',
            'services.biteship.base_url' => 'https://api.biteship.test',
            'services.biteship.origin_postal_code' => '15143',
            'services.biteship.origin_contact_name' => 'Lurus Store',
            'services.biteship.origin_contact_phone' => '081234567890',
            'services.biteship.origin_address' => 'Jl. Toko No. 1',
            'services.biteship.webhook_secret' => 'whsec',
            'services.biteship.fake_rates' => false,
        ]);
        Http::fake([
            'https://api.biteship.test/v1/orders' => Http::response([
                'success' => true,
                'id' => 'bs-order-1',
                'status' => 'confirmed',
                'courier' => ['waybill_id' => 'RESI123'],
            ], 200),
        ]);

        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $order = $this->order();
        StoreContentSetting::putValue('shipping_settings', [
            'biteship_enabled' => false,
            'couriers' => [],
            'flat_shipping_cost' => 25000,
        ]);
        $order->update([
            'payment_status' => Order::PAYMENT_PAID,
            'status' => Order::STATUS_READY_TO_SHIP,
            'shipping_address' => array_merge($order->shipping_address, [
                'courier' => [
                    'courier_code' => 'jne',
                    'courier_name' => 'JNE',
                    'courier_service_code' => 'reg',
                    'courier_service_name' => 'REG',
                    'price' => 9000,
                ],
            ]),
        ]);
        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $this->product()->id,
            'product_name' => 'Shirt',
            'sku' => 'SKU-1',
            'quantity' => 1,
            'price' => 100000,
        ]);

        $this->actingAs($admin)
            ->post('/admin/orders/'.$order->order_number.'/biteship-shipment')
            ->assertRedirect();

        $order->refresh();
        $this->assertSame('bs-order-1', $order->biteship_order_id);
        $this->assertSame('RESI123', $order->waybill_id);
        $this->assertSame(Order::STATUS_SHIPPED, $order->status);

        $this->postJson('/webhooks/biteship', [])->assertOk()->assertJson(['ok' => true]);

        $this->post('/webhooks/biteship', [
            'event' => 'order.status',
            'order_id' => 'bs-order-1',
            'reference_id' => $order->order_number,
            'status' => 'delivered',
            'courier' => ['waybill_id' => 'RESI123'],
        ], ['X-Biteship-Secret' => 'whsec'])->assertOk();

        $this->assertSame(Order::STATUS_DELIVERED, $order->fresh()->status);
        $this->assertNotNull($order->fresh()->delivered_at);
        $history = $order->fresh()->shipping_history ?? [];
        $this->assertNotEmpty($history);
        $this->assertSame('delivered', collect($history)->last()['status']);
    }

    public function test_admin_can_save_manual_waybill(): void
    {
        Notification::fake();
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $order = $this->order();
        $order->update(['payment_status' => Order::PAYMENT_PAID, 'status' => Order::STATUS_READY_TO_SHIP]);

        $this->actingAs($admin)
            ->patch('/admin/orders/'.$order->order_number.'/waybill', ['waybill_id' => 'MANUAL-99'])
            ->assertRedirect();

        $order->refresh();
        $this->assertSame('MANUAL-99', $order->waybill_id);
        $this->assertSame(Order::STATUS_SHIPPED, $order->status);
    }

    public function test_admin_can_print_shipping_label_when_waybill_exists(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $order = $this->order();
        $order->update([
            'payment_status' => Order::PAYMENT_PAID,
            'waybill_id' => 'RESI-PRINT-1',
            'shipping_address' => array_merge($order->shipping_address, [
                'courier' => [
                    'courier_code' => 'jne',
                    'courier_name' => 'JNE',
                    'courier_service_code' => 'reg',
                    'courier_service_name' => 'REG',
                ],
            ]),
        ]);

        $this->actingAs($admin)
            ->get('/admin/orders/'.$order->order_number.'/shipping-label')
            ->assertOk()
            ->assertSee('RESI-PRINT-1')
            ->assertSee('JNE')
            ->assertSee('Print Label');
    }

    private function product(string $name = 'Test Shirt', int $price = 100000, int $stock = 10): Product
    {
        $category = Category::create(['name' => 'Category '.Str::random(6), 'slug' => 'category-'.Str::lower(Str::random(8)), 'is_active' => true]);

        return Product::create(['category_id' => $category->id, 'name' => $name, 'slug' => Str::slug($name).'-'.Str::lower(Str::random(6)), 'price' => $price, 'stock' => $stock, 'sku' => 'SKU-'.Str::upper(Str::random(8)), 'is_active' => true]);
    }

    private function order(?string $guestToken = null, string $email = 'guest@example.com', string $paymentMethod = Order::PAYMENT_METHOD_BANK_TRANSFER, string $status = Order::STATUS_PENDING, ?string $testimonialToken = null): Order
    {
        return Order::create([
            'guest_token' => $guestToken ? hash('sha256', $guestToken) : null, 'customer_email' => strtolower($email), 'customer_phone' => '08123456789',
            'order_number' => 'ORD-'.Str::upper(Str::random(12)), 'subtotal' => 200000, 'discount_amount' => 0, 'shipping_cost' => 25000, 'total_amount' => 225000,
            'status' => $status, 'shipping_address' => ['name' => 'Guest Buyer', 'email' => strtolower($email), 'phone' => '08123456789', 'address' => 'Jl. Contoh No. 1', 'province' => 'Jawa Barat', 'city' => 'Bandung', 'district' => 'Coblong', 'postal_code' => '40123'],
            'payment_method' => $paymentMethod, 'payment_status' => Order::PAYMENT_UNPAID, 'payment_expires_at' => now()->addDay(), 'testimonial_token' => $testimonialToken ? hash('sha256', $testimonialToken) : null,
        ]);
    }
}
