<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Tests\TestCase;

class OrderSuccessPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_logged_in_midtrans_success_survives_status_api_failure(): void
    {
        config([
            'services.midtrans.server_key' => 'server-key',
            'services.midtrans.status_url' => 'https://midtrans.test/v2',
        ]);
        Http::fake([
            'https://midtrans.test/v2/*' => Http::response(['status_message' => 'Transaction not found'], 404),
        ]);

        $user = User::factory()->create();
        $order = Order::create([
            'user_id' => $user->id,
            'order_number' => 'ORD-TEST-SUCCESS1',
            'customer_email' => $user->email,
            'customer_phone' => '08123456789',
            'subtotal' => 100000,
            'discount_amount' => 0,
            'shipping_cost' => 0,
            'total_amount' => 100000,
            'status' => Order::STATUS_PENDING,
            'shipping_address' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => '08123456789',
                'address' => 'Jl. Test',
                'city' => 'Bandung',
                'postal_code' => '40123',
            ],
            'payment_method' => Order::PAYMENT_METHOD_MIDTRANS,
            'payment_status' => Order::PAYMENT_UNPAID,
            'payment_url' => 'https://midtrans.test/snap/x',
            'payment_reference' => 'tok',
            'payment_expires_at' => now()->addHour(),
        ]);

        $this->actingAs($user)
            ->get('/orders/'.$order->order_number.'/success?awaiting_payment=1')
            ->assertOk();
    }

    public function test_guest_success_without_token_is_forbidden(): void
    {
        $token = Str::random(40);
        $order = Order::create([
            'guest_token' => hash('sha256', $token),
            'order_number' => 'ORD-TEST-SUCCESS2',
            'customer_email' => 'guest@example.com',
            'customer_phone' => '08123456789',
            'subtotal' => 100000,
            'discount_amount' => 0,
            'shipping_cost' => 0,
            'total_amount' => 100000,
            'status' => Order::STATUS_PENDING,
            'shipping_address' => [
                'name' => 'Guest',
                'email' => 'guest@example.com',
                'phone' => '08123456789',
                'address' => 'Jl. Test',
                'city' => 'Bandung',
                'postal_code' => '40123',
            ],
            'payment_method' => Order::PAYMENT_METHOD_MIDTRANS,
            'payment_status' => Order::PAYMENT_UNPAID,
            'payment_expires_at' => now()->addHour(),
        ]);

        $this->get('/orders/'.$order->order_number.'/success?awaiting_payment=1')
            ->assertForbidden();
    }
}
