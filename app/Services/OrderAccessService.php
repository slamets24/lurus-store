<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderAccessService
{
    public function authorize(Request $request, Order $order): ?string
    {
        if ($request->user() && $order->user_id === $request->user()->id) {
            return null;
        }

        $token = $request->input('token', $request->query('token'));

        if ($order->guest_token && is_string($token) && hash_equals($order->guest_token, hash('sha256', $token))) {
            return $token;
        }

        abort(403);
    }
}
