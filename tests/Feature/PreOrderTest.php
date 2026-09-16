<?php

namespace Tests\Feature;

use App\Enums\OrderStatus;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class PreOrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_and_manage_preorder_product(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $category = Category::create(['name' => 'Fashion', 'slug' => 'fashion', 'is_active' => true]);

        $response = $this->actingAs($admin)->post(route('admin.products.store'), [
            'name' => 'Limited Pre-Order Jacket',
            'category_id' => $category->id,
            'category_name' => $category->name,
            'price' => 350000,
            'description' => 'Special pre-order batch',
            'is_active' => true,
            'is_preorder' => true,
            'preorder_estimate_days' => 14,
            'preorder_release_date' => now()->addDays(20)->toDateString(),
            'preorder_note' => 'Estimasi produksi 14 hari kerja setelah periode PO ditutup.',
            'variants' => [
                ['sku' => 'PO-JKT-M', 'size' => 'M', 'color' => 'Black', 'stock' => 20, 'price' => 350000],
            ],
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('products', [
            'name' => 'Limited Pre-Order Jacket',
            'is_preorder' => true,
            'preorder_estimate_days' => 14,
        ]);
    }

    public function test_cart_prevents_adding_more_than_preorder_quota(): void
    {
        $category = Category::create(['name' => 'Fashion', 'slug' => 'fashion', 'is_active' => true]);
        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'PO Shoes',
            'slug' => 'po-shoes',
            'price' => 500000,
            'stock' => 2, // Quota is 2
            'sku' => 'PO-SHOE-01',
            'is_active' => true,
            'is_preorder' => true,
            'preorder_estimate_days' => 10,
        ]);

        $user = User::factory()->create();

        // Adding 2 should succeed
        $this->actingAs($user)
            ->post('/cart', ['product_id' => $product->id, 'quantity' => 2])
            ->assertRedirect();

        // Adding 1 more should fail because quota is 2
        $this->actingAs($user)
            ->post('/cart', ['product_id' => $product->id, 'quantity' => 1])
            ->assertSessionHas('error');
    }

    public function test_checkout_marks_order_and_items_as_preorder(): void
    {
        Notification::fake();

        $category = Category::create(['name' => 'Fashion', 'slug' => 'fashion', 'is_active' => true]);
        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Pre-Order Hoodie',
            'slug' => 'po-hoodie',
            'price' => 250000,
            'stock' => 10,
            'sku' => 'PO-HD-01',
            'is_active' => true,
            'is_preorder' => true,
            'preorder_estimate_days' => 7,
            'preorder_release_date' => now()->addDays(14)->toDateString(),
            'preorder_note' => 'Barang dikirim serentak tanggal rilis.',
        ]);

        $user = User::factory()->create();
        $this->actingAs($user)->post('/cart', ['product_id' => $product->id, 'quantity' => 1]);

        $response = $this->actingAs($user)->post('/checkout', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '081234567890',
            'address' => 'Jl. Merdeka No. 10',
            'province' => 'DKI Jakarta',
            'city' => 'Jakarta Selatan',
            'district' => 'Kebayoran Baru',
            'postal_code' => '12110',
            'payment_method' => Order::PAYMENT_METHOD_BANK_TRANSFER,
        ]);

        $response->assertRedirect();

        $order = Order::latest('id')->firstOrFail();
        $this->assertTrue((bool) $order->has_preorder);
        $this->assertNotNull($order->preorder_release_date);

        $orderItem = $order->items->first();
        $this->assertTrue((bool) $orderItem->is_preorder);
        $this->assertNotEmpty($orderItem->preorder_estimate);
    }

    public function test_paid_order_with_preorder_transitions_to_preorder_status(): void
    {
        Notification::fake();

        $category = Category::create(['name' => 'Fashion', 'slug' => 'fashion', 'is_active' => true]);
        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Pre-Order Hoodie',
            'slug' => 'po-hoodie-2',
            'price' => 250000,
            'stock' => 10,
            'sku' => 'PO-HD-02',
            'is_active' => true,
            'is_preorder' => true,
            'preorder_estimate_days' => 7,
        ]);

        $user = User::factory()->create();
        $order = Order::create([
            'user_id' => $user->id,
            'order_number' => 'ORD-PO-TEST-1',
            'subtotal' => 250000,
            'discount_amount' => 0,
            'shipping_cost' => 15000,
            'total_amount' => 265000,
            'status' => Order::STATUS_PENDING,
            'shipping_address' => [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'phone' => '08123456789',
                'address' => 'Jl. Merdeka No. 10',
                'province' => 'DKI Jakarta',
                'city' => 'Jakarta Selatan',
                'district' => 'Kebayoran Baru',
                'postal_code' => '12110',
            ],
            'payment_method' => Order::PAYMENT_METHOD_BANK_TRANSFER,
            'payment_status' => Order::PAYMENT_UNPAID,
            'payment_expires_at' => now()->addDay(),
            'has_preorder' => true,
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'product_name' => $product->name,
            'sku' => $product->sku,
            'quantity' => 1,
            'price' => 250000,
            'is_preorder' => true,
            'preorder_estimate' => 'Estimasi pengerjaan: 7 hari kerja',
        ]);

        $orderService = app(\App\Services\OrderService::class);
        $orderService->markPaid($order, 'bank_transfer', 'ref-123');

        $order->refresh();
        $this->assertSame(Order::PAYMENT_PAID, $order->payment_status);
        $this->assertSame(Order::STATUS_PREORDER, $order->status);
    }

    public function test_admin_can_mark_preorder_as_ready_to_ship(): void
    {
        Notification::fake();

        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $order = Order::create([
            'order_number' => 'ORD-PO-TEST-2',
            'subtotal' => 250000,
            'discount_amount' => 0,
            'shipping_cost' => 15000,
            'total_amount' => 265000,
            'status' => Order::STATUS_PREORDER,
            'shipping_address' => [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'phone' => '08123456789',
                'address' => 'Jl. Merdeka No. 10',
                'province' => 'DKI Jakarta',
                'city' => 'Jakarta Selatan',
                'district' => 'Kebayoran Baru',
                'postal_code' => '12110',
            ],
            'payment_method' => Order::PAYMENT_METHOD_BANK_TRANSFER,
            'payment_status' => Order::PAYMENT_PAID,
            'has_preorder' => true,
        ]);

        $response = $this->actingAs($admin)
            ->patch(route('admin.orders.mark-ready-to-ship', $order));

        $response->assertRedirect();
        $order->refresh();
        $this->assertSame(Order::STATUS_READY_TO_SHIP, $order->status);
    }

    public function test_biteship_shipment_is_disabled_while_order_is_in_preorder(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $order = Order::create([
            'order_number' => 'ORD-PO-TEST-3',
            'subtotal' => 250000,
            'discount_amount' => 0,
            'shipping_cost' => 15000,
            'total_amount' => 265000,
            'status' => Order::STATUS_PREORDER,
            'shipping_address' => [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'phone' => '08123456789',
                'address' => 'Jl. Merdeka No. 10',
                'province' => 'DKI Jakarta',
                'city' => 'Jakarta Selatan',
                'district' => 'Kebayoran Baru',
                'postal_code' => '12110',
            ],
            'payment_method' => Order::PAYMENT_METHOD_BANK_TRANSFER,
            'payment_status' => Order::PAYMENT_PAID,
            'has_preorder' => true,
        ]);

        $response = $this->actingAs($admin)
            ->post("/admin/orders/{$order->order_number}/biteship-shipment");

        $response->assertSessionHas('error');
    }
}
