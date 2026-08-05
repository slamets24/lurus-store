<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminSoftDeleteTest extends TestCase
{
    use RefreshDatabase;

    public function test_regular_admin_cannot_delete_or_restore_data(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $category = Category::factory()->create();
        $order = $this->makeOrder();

        $this->actingAs($admin)
            ->delete(route('admin.categories.destroy', $category))
            ->assertForbidden();

        $this->assertNotSoftDeleted($category);

        $this->actingAs($admin)
            ->delete(route('admin.orders.destroy', $order))
            ->assertForbidden();

        $this->assertNotSoftDeleted($order);

        $this->actingAs($admin)
            ->get(route('admin.restore.index'))
            ->assertForbidden();
    }

    public function test_super_admin_can_soft_delete_and_restore_data(): void
    {
        $superAdmin = User::factory()->create(['role' => User::ROLE_SUPER_ADMIN]);
        $category = Category::factory()->create();

        $this->actingAs($superAdmin)
            ->delete(route('admin.categories.destroy', $category))
            ->assertRedirect(route('admin.categories.index'));

        $this->assertSoftDeleted($category);

        $this->actingAs($superAdmin)
            ->get(route('admin.restore.index', ['type' => 'categories']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Restore/Index')
                ->where('activeType', 'categories')
                ->where('counts.categories', 1)
                ->where('records.data.0.id', $category->id)
            );

        $this->actingAs($superAdmin)
            ->post(route('admin.restore.store', ['type' => 'categories', 'id' => $category->id]))
            ->assertRedirect();

        $this->assertNotSoftDeleted($category);
    }

    public function test_super_admin_can_soft_delete_and_restore_orders(): void
    {
        $superAdmin = User::factory()->create(['role' => User::ROLE_SUPER_ADMIN]);
        $order = $this->makeOrder();

        $this->actingAs($superAdmin)
            ->delete(route('admin.orders.destroy', $order))
            ->assertRedirect(route('admin.orders.index'));

        $this->assertSoftDeleted($order);

        $this->actingAs($superAdmin)
            ->get(route('admin.restore.index', ['type' => 'orders']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Restore/Index')
                ->where('activeType', 'orders')
                ->where('counts.orders', 1)
                ->where('records.data.0.id', $order->id)
                ->where('records.data.0.name', $order->order_number)
            );

        $this->actingAs($superAdmin)
            ->post(route('admin.restore.store', ['type' => 'orders', 'id' => $order->id]))
            ->assertRedirect();

        $this->assertNotSoftDeleted($order);
    }

    public function test_regular_admin_cannot_force_delete_restored_data(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $order = $this->makeOrder();
        $order->delete();

        $this->actingAs($admin)
            ->delete(route('admin.restore.destroy', ['type' => 'orders', 'id' => $order->id]))
            ->assertForbidden();

        $this->assertSoftDeleted($order);
    }

    public function test_super_admin_can_force_delete_orders(): void
    {
        $superAdmin = User::factory()->create(['role' => User::ROLE_SUPER_ADMIN]);
        $order = $this->makeOrder();
        $order->delete();

        $this->actingAs($superAdmin)
            ->delete(route('admin.restore.destroy', ['type' => 'orders', 'id' => $order->id]))
            ->assertRedirect();

        $this->assertDatabaseMissing('orders', ['id' => $order->id]);
    }

    private function makeOrder(): Order
    {
        return Order::create([
            'order_number' => 'ORD-SOFT-DELETE-1',
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
    }
}
