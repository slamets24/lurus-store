<?php

namespace Tests\Unit;

use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderStatusConstraintsTest extends TestCase
{
    use RefreshDatabase;

    public function test_mark_paid_statuses_persist(): void
    {
        $order = Order::create([
            'order_number' => 'ORD-TEST-STATUS-1',
            'customer_email' => 'buyer@example.com',
            'customer_phone' => '08123456789',
            'subtotal' => 100000,
            'discount_amount' => 0,
            'shipping_cost' => 0,
            'total_amount' => 100000,
            'status' => Order::STATUS_PENDING,
            'shipping_address' => [
                'name' => 'Buyer',
                'email' => 'buyer@example.com',
                'phone' => '08123456789',
                'address' => 'Jl. Test',
                'city' => 'Jakarta',
                'postal_code' => '10110',
            ],
            'payment_method' => Order::PAYMENT_METHOD_MIDTRANS,
            'payment_status' => Order::PAYMENT_UNPAID,
        ]);

        $order->forceFill([
            'status' => Order::STATUS_READY_TO_SHIP,
            'payment_status' => Order::PAYMENT_PAID,
            'payment_verified_at' => now(),
        ])->save();

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'ready_to_ship',
            'payment_status' => 'paid',
        ]);

        $order->forceFill([
            'status' => Order::STATUS_STOCK_CONFIRMATION,
            'payment_status' => Order::PAYMENT_PENDING_VERIFICATION,
        ])->save();

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'stock_confirmation',
            'payment_status' => 'pending_verification',
        ]);
    }
}
