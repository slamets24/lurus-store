<?php

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_receives_password_reset_email(): void
    {
        Notification::fake();
        $user = User::factory()->create(['role' => User::ROLE_CUSTOMER]);

        $this->post('/forgot-password', ['email' => $user->email])
            ->assertRedirect()
            ->assertSessionHas('status');

        Notification::assertSentTo($user, ResetPasswordNotification::class);
    }

    public function test_admin_does_not_receive_password_reset_email(): void
    {
        Notification::fake();
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);

        $this->post('/forgot-password', ['email' => $admin->email])
            ->assertRedirect()
            ->assertSessionHas('status');

        Notification::assertNothingSent();
    }

    public function test_customer_can_reset_password_with_valid_token(): void
    {
        $user = User::factory()->create([
            'role' => User::ROLE_CUSTOMER,
            'password' => 'old-password',
        ]);
        $token = Password::broker()->createToken($user);

        $this->post('/reset-password', [
            'token' => $token,
            'email' => $user->email,
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ])
            ->assertRedirect(route('login'))
            ->assertSessionHas('status');

        $this->assertTrue(Hash::check('new-password', $user->fresh()->password));
    }
}
