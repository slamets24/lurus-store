<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\EmailOtpNotification;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class EmailOtpService
{
    public const EXPIRY_MINUTES = 5;

    private const MAX_VERIFY_ATTEMPTS = 5;

    private const RESEND_COOLDOWN_SECONDS = 60;

    public function send(User $user, bool $enforceCooldown = true): void
    {
        if ($user->hasVerifiedEmail()) {
            return;
        }

        $key = $this->resendKey($user);

        if ($enforceCooldown && RateLimiter::tooManyAttempts($key, 1)) {
            throw ValidationException::withMessages([
                'code' => 'Wait '.RateLimiter::availableIn($key).' seconds before resending the code.',
            ]);
        }

        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $user->forceFill([
            'email_otp_hash' => Hash::make($code),
            'email_otp_expires_at' => now()->addMinutes(self::EXPIRY_MINUTES),
        ])->save();

        $user->notify(new EmailOtpNotification($code));
        RateLimiter::hit($key, self::RESEND_COOLDOWN_SECONDS);
    }

    public function verify(User $user, string $code): void
    {
        if ($user->hasVerifiedEmail()) {
            return;
        }

        $key = $this->verifyKey($user);

        if (RateLimiter::tooManyAttempts($key, self::MAX_VERIFY_ATTEMPTS)) {
            throw ValidationException::withMessages([
                'code' => 'Too many attempts. Try again in '.RateLimiter::availableIn($key).' seconds.',
            ]);
        }

        if (! $user->email_otp_hash || ! $user->email_otp_expires_at?->isFuture()) {
            RateLimiter::hit($key, self::EXPIRY_MINUTES * 60);

            throw ValidationException::withMessages([
                'code' => 'Code has expired. Please request a new code.',
            ]);
        }

        if (! Hash::check($code, $user->email_otp_hash)) {
            RateLimiter::hit($key, self::EXPIRY_MINUTES * 60);

            throw ValidationException::withMessages([
                'code' => 'Verification code is incorrect.',
            ]);
        }

        $user->forceFill([
            'email_verified_at' => now(),
            'email_otp_hash' => null,
            'email_otp_expires_at' => null,
        ])->save();

        RateLimiter::clear($key);
        RateLimiter::clear($this->resendKey($user));
    }

    private function resendKey(User $user): string
    {
        return 'email-otp-resend:'.$user->id;
    }

    private function verifyKey(User $user): string
    {
        return 'email-otp-verify:'.$user->id;
    }
}
