<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class EnsureGuestCartToken
{
    public const ATTRIBUTE = 'guest_cart_token';

    public const COOKIE = 'guest_cart_token';

    public const COOKIE_MINUTES = 60 * 24 * 7;

    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()) {
            $token = $request->cookie(self::COOKIE) ?: Str::random(40);

            $request->attributes->set(self::ATTRIBUTE, $token);

            if (! $request->cookie(self::COOKIE)) {
                Cookie::queue(self::COOKIE, $token, self::COOKIE_MINUTES, '/', null, $request->isSecure(), true, false, 'lax');
            }
        }

        return $next($request);
    }
}
