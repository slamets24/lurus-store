<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
        $response->headers->set('Cross-Origin-Opener-Policy', 'same-origin');
        $response->headers->set('Content-Security-Policy', $this->contentSecurityPolicy());

        if ($request->secure()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        return $response;
    }

    /**
     * Allowlist covers first-party assets, Midtrans Snap (checkout), Google tags
     * (storefront blade), and jsDelivr (admin shipping label barcode).
     * 'unsafe-inline' is required for gtag bootstrap + Quill/Inertia inline styles;
     * object-src/base-uri/frame-ancestors still block classic XSS payloads.
     */
    private function contentSecurityPolicy(): string
    {
        $midtrans = [
            'https://app.midtrans.com',
            'https://app.sandbox.midtrans.com',
            'https://api.midtrans.com',
            'https://api.sandbox.midtrans.com',
        ];

        $google = [
            'https://www.googletagmanager.com',
            'https://www.google-analytics.com',
            'https://analytics.google.com',
            'https://www.google.com',
            'https://googleads.g.doubleclick.net',
            'https://www.googleadservices.com',
        ];

        $script = array_merge(
            ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
            ['https://app.midtrans.com', 'https://app.sandbox.midtrans.com'],
            ['https://www.googletagmanager.com', 'https://www.google-analytics.com'],
        );

        $connect = array_merge(["'self'"], $midtrans, $google, [
            'https://api.biteship.com',
        ]);

        $frame = [
            "'self'",
            'https://app.midtrans.com',
            'https://app.sandbox.midtrans.com',
            'https://www.google.com',
        ];

        $directives = [
            "default-src 'self'",
            'script-src '.implode(' ', $script),
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: blob: https:",
            "font-src 'self' data:",
            'connect-src '.implode(' ', $connect),
            'frame-src '.implode(' ', $frame),
            "worker-src 'self' blob:",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
        ];

        if (app()->isProduction()) {
            $directives[] = 'upgrade-insecure-requests';
        }

        return implode('; ', $directives);
    }
}
