<?php

namespace App\Services;

use App\Models\Order;
use App\Models\User;

class GuestOrderClaimService
{
    public function claim(User $user): int
    {
        if ($user->role !== User::ROLE_CUSTOMER || $user->email_verified_at === null) {
            return 0;
        }

        $token = session('guest_order_claim_token');

        return Order::whereNull('user_id')
            ->where(function ($query) use ($user, $token) {
                $query->whereRaw('LOWER(customer_email) = ?', [strtolower($user->email)]);

                if (is_string($token) && $token !== '') {
                    $query->orWhere('guest_token', hash('sha256', $token));
                }
            })
            ->update([
                'user_id' => $user->id,
                'guest_token' => null,
            ]);
    }
}
