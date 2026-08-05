<?php

namespace App\Http\Controllers;

use App\Support\StorefrontSitemap;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class SitemapController extends Controller
{
    public function index(): SymfonyResponse
    {
        return StorefrontSitemap::make()->toResponse(request());
    }

    public function robots(): Response
    {
        $sitemap = route('sitemap');
        $body = implode("\n", [
            'User-agent: *',
            'Disallow:',
            '',
            'User-agent: OAI-SearchBot',
            'Allow: /',
            '',
            'User-agent: GPTBot',
            'Allow: /',
            '',
            "Sitemap: {$sitemap}",
        ])."\n";

        return response($body, 200)->header('Content-Type', 'text/plain; charset=UTF-8');
    }

    public function llms(): Response
    {
        $base = rtrim(config('app.url'), '/');

        $store = config('app.name', 'Lurus Store');

        $body = implode("\n", [
            "# {$store}",
            '',
            "> Official website of {$store} — modest fashion for Muslim women in Indonesia.",
            '',
            '## About',
            "{$store} offers elegant modest wear: blouses, dresses, skirts, hijab, scarves, and everyday essentials designed for comfort and style.",
            '',
            '## Public pages',
            "- Home: {$base}/",
            "- All products: {$base}/products",
            "- Categories: {$base}/categories",
            "- Collections: {$base}/collections",
            "- About: {$base}/about",
            "- FAQ: {$base}/faq",
            "- Contact: {$base}/contact",
            '',
            '## Shopping',
            '- Guest checkout is supported.',
            '- Payments: Midtrans Snap and bank transfer.',
            '- Shipping: Indonesia via Biteship couriers.',
            '',
            '## Support',
            "Questions and returns: {$base}/contact",
            "Policies and common questions: {$base}/faq",
        ])."\n";

        return response($body, 200)->header('Content-Type', 'text/plain; charset=UTF-8');
    }
}
