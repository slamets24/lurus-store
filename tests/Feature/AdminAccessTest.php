<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_cannot_access_admin_dashboard(): void
    {
        $customer = User::factory()->create(['role' => User::ROLE_CUSTOMER]);

        $this->actingAs($customer)
            ->get('/admin')
            ->assertForbidden();
    }

    public function test_admin_can_access_admin_dashboard(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        User::factory()->create(['role' => User::ROLE_CUSTOMER]);

        $this->actingAs($admin)
            ->get('/admin')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Dashboard')
                ->where('auth.isAdmin', true)
                ->where('stats.totalCustomers', 1)
                ->has('stats.needsAction')
                ->has('stats.chartStats')
                ->where('stats.chartRange', '30d')
                ->where('stats.chartGranularity', 'day')
                ->has('stats.lowStockProducts')
                ->has('stats.topProducts')
                ->has('stats.recentOrders')
            );
    }

    public function test_shared_auth_is_admin_flag_matches_role(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $customer = User::factory()->create(['role' => User::ROLE_CUSTOMER]);

        $this->actingAs($admin)
            ->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('auth.isAdmin', true));

        $this->actingAs($customer)
            ->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('auth.isAdmin', false));
    }

    public function test_admin_dashboard_chart_range_uses_months_for_year_view(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);

        $this->actingAs($admin)
            ->get('/admin?range=1y')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Dashboard')
                ->where('stats.chartRange', '1y')
                ->where('stats.chartGranularity', 'month')
                ->has('stats.chartStats', 12)
            );
    }

    public function test_admin_roles_do_not_require_email_verification(): void
    {
        $admin = User::factory()->unverified()->create(['role' => User::ROLE_ADMIN]);
        $superAdmin = User::factory()->unverified()->create(['role' => User::ROLE_SUPER_ADMIN]);
        $customer = User::factory()->unverified()->create(['role' => User::ROLE_CUSTOMER]);

        $this->assertTrue($admin->hasVerifiedEmail());
        $this->assertTrue($superAdmin->hasVerifiedEmail());
        $this->assertFalse($customer->hasVerifiedEmail());
    }

    public function test_unverified_admin_login_skips_customer_otp(): void
    {
        $admin = User::factory()->unverified()->create([
            'email' => 'login-admin@example.com',
            'role' => User::ROLE_ADMIN,
        ]);

        $this->withSession(['_token' => 'test-token'])
            ->post('/login', [
                '_token' => 'test-token',
                'email' => $admin->email,
                'password' => 'password',
            ])
            ->assertRedirect('/admin');

        $this->assertNull($admin->fresh()->email_otp_hash);
    }

    public function test_super_admin_can_access_admin_dashboard(): void
    {
        $superAdmin = User::factory()->create(['role' => User::ROLE_SUPER_ADMIN]);

        $this->actingAs($superAdmin)
            ->get('/admin')
            ->assertOk();
    }

    public function test_only_one_super_admin_can_exist(): void
    {
        User::factory()->create(['role' => User::ROLE_SUPER_ADMIN]);

        $this->expectException(ValidationException::class);

        User::factory()->create(['role' => User::ROLE_SUPER_ADMIN]);
    }

    public function test_admin_users_default_to_customers(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $customer = User::factory()->create([
            'email' => 'customer@example.com',
            'role' => User::ROLE_CUSTOMER,
        ]);

        $this->actingAs($admin)
            ->get('/admin/users')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Users/Index')
                ->where('filters.type', 'customer')
                ->where('users.data.0.email', $customer->email)
                ->missing('users.data.1'));
    }

    public function test_admin_users_can_show_admin_accounts(): void
    {
        $admin = User::factory()->create([
            'email' => 'admin@example.com',
            'role' => User::ROLE_ADMIN,
        ]);
        User::factory()->create(['role' => User::ROLE_CUSTOMER]);

        $this->actingAs($admin)
            ->get('/admin/users?type=admin')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Users/Index')
                ->where('filters.type', 'admin')
                ->where('users.data.0.email', $admin->email)
                ->missing('users.data.1'));
    }

    public function test_register_creates_customer_and_redirects_to_email_verification(): void
    {
        $this->withSession(['_token' => 'test-token'])->post('/register', [
            '_token' => 'test-token',
            'name' => 'New Customer',
            'email' => 'new-customer@example.com',
            'role' => User::ROLE_SUPER_ADMIN,
            'created_by_user_id' => 999999,
            'email_verified_at' => now(),
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ])->assertRedirect(route('verification.notice'));

        $this->assertDatabaseHas('users', [
            'email' => 'new-customer@example.com',
            'role' => User::ROLE_CUSTOMER,
            'created_by_user_id' => null,
            'email_verified_at' => null,
        ]);
        $this->assertNotNull(User::where('email', 'new-customer@example.com')->value('email_otp_hash'));
    }

    public function test_admin_cannot_create_admin_user(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);

        $this->actingAs($admin)
            ->withSession(['_token' => 'test-token'])
            ->post('/admin/users', [
                '_token' => 'test-token',
                'name' => 'Created Admin',
                'email' => 'created-admin@example.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ])
            ->assertForbidden();

        $this->assertDatabaseMissing('users', [
            'email' => 'created-admin@example.com',
        ]);
    }

    public function test_super_admin_creation_ignores_privileged_payload_and_records_creator(): void
    {
        $superAdmin = User::factory()->create(['role' => User::ROLE_SUPER_ADMIN]);

        $this->actingAs($superAdmin)
            ->withSession(['_token' => 'test-token'])
            ->post('/admin/users', [
                '_token' => 'test-token',
                'name' => 'Created User',
                'email' => 'created-user@example.com',
                'role' => User::ROLE_SUPER_ADMIN,
                'created_by_user_id' => 999999,
                'email_verified_at' => now(),
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ])
            ->assertRedirect(route('admin.users.index', ['type' => 'admin']));

        $this->assertDatabaseHas('users', [
            'email' => 'created-user@example.com',
            'role' => User::ROLE_ADMIN,
            'created_by_user_id' => $superAdmin->id,
            'email_verified_at' => null,
        ]);
    }
}
