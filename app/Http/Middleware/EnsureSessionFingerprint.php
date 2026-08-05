<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Bind the session to the browser User-Agent so a stolen session cookie
 * used from a different client is invalidated (basic hijack mitigation).
 * IP binding is intentionally avoided — mobile networks rotate IPs.
 */
class EnsureSessionFingerprint
{
    private const KEY = '_ua_fp';

    public function handle(Request $request, Closure $next): Response
    {
        $fingerprint = hash('sha256', (string) $request->userAgent());

        if (! $request->session()->has(self::KEY)) {
            $request->session()->put(self::KEY, $fingerprint);

            return $next($request);
        }

        if (hash_equals((string) $request->session()->get(self::KEY), $fingerprint)) {
            return $next($request);
        }

        $wasAuthenticated = Auth::check();

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerate(true);
        $request->session()->put(self::KEY, $fingerprint);

        if (! $wasAuthenticated) {
            return $next($request);
        }

        if ($request->expectsJson()) {
            return response()->json(['message' => 'Session expired.'], 419);
        }

        return redirect()->guest(route('login'))
            ->with('status', 'Your session expired. Please sign in again.');
    }
}
