<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserPasswordTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_can_reset_admin_password_without_current_password(): void
    {
        $superAdmin = User::factory()->create(['role' => User::ROLE_SUPER_ADMIN]);
        $admin = User::factory()->create([
            'role' => User::ROLE_ADMIN,
            'password' => 'old-password',
        ]);

        $this->actingAs($superAdmin)
            ->patch(route('admin.users.password.update', $admin), [
                'password' => 'new-password',
                'password_confirmation' => 'new-password',
            ])
            ->assertSessionHasNoErrors();

        $this->assertTrue(Hash::check('new-password', $admin->fresh()->password));
    }

    public function test_admin_password_reset_is_limited_to_super_admin_and_admin_targets(): void
    {
        $superAdmin = User::factory()->create(['role' => User::ROLE_SUPER_ADMIN]);
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $customer = User::factory()->create(['role' => User::ROLE_CUSTOMER]);

        $this->actingAs($admin)
            ->patch(route('admin.users.password.update', $admin), [
                'password' => 'new-password',
                'password_confirmation' => 'new-password',
            ])
            ->assertForbidden();

        $this->actingAs($superAdmin)
            ->patch(route('admin.users.password.update', $customer), [
                'password' => 'new-password',
                'password_confirmation' => 'new-password',
            ])
            ->assertForbidden();
    }

    public function test_updating_own_password_requires_current_password(): void
    {
        $user = User::factory()->create(['password' => 'old-password']);

        $this->actingAs($user)
            ->patch(route('account.password.update'), [
                'current_password' => 'wrong-password',
                'password' => 'new-password',
                'password_confirmation' => 'new-password',
            ])
            ->assertSessionHasErrors('current_password');

        $this->assertTrue(Hash::check('old-password', $user->fresh()->password));

        $this->actingAs($user)
            ->patch(route('account.password.update'), [
                'current_password' => 'old-password',
                'password' => 'new-password',
                'password_confirmation' => 'new-password',
            ])
            ->assertSessionHasNoErrors();

        $this->assertTrue(Hash::check('new-password', $user->fresh()->password));
    }
}
