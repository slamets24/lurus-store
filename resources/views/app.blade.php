<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}"  @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/logo.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/logo.png">

        {{-- ponytail: static crawl fallback; page-accurate meta needs Inertia SSR --}}
        <title>{{ config('app.name', 'Lurus Store') }} | Modest Fashion</title>
        <meta name="description" content="{{ config('app.name', 'Lurus Store') }} — modest fashion for Muslim women. Blouses, dresses, hijab, scarves, and everyday essentials with elegant, comfortable design.">
        <link rel="canonical" href="{{ url()->current() }}">

        @php
            $googleTagId = config('services.google.tag_id');
            $googleAdsId = config('services.google.ads_id');
            $googleAdsPurchaseLabel = config('services.google.ads_purchase_label');
            $googleSiteVerification = config('services.google.site_verification');
            $loadGoogleTag = filled($googleTagId) && ! request()->is('admin', 'admin/*');
        @endphp

        @if (filled($googleSiteVerification))
            <meta name="google-site-verification" content="{{ $googleSiteVerification }}">
        @endif

        @if ($loadGoogleTag)
            <script async src="https://www.googletagmanager.com/gtag/js?id={{ $googleTagId }}"></script>
            <script>
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', @json($googleTagId), { send_page_view: true, anonymize_ip: true });
                @if (filled($googleAdsId))
                gtag('config', @json($googleAdsId));
                @endif
                // SPA navigation can reach /admin without a page reload; the
                // official ga-disable flag stops GA4 hits while in admin.
                (function () {
                    var sync = function () {
                        var off = location.pathname.indexOf('/admin') === 0;
                        window['ga-disable-' + @json($googleTagId)] = off;
                        @if (filled($googleAdsId))
                        window['ga-disable-' + @json($googleAdsId)] = off;
                        @endif
                    };
                    sync();
                    document.addEventListener('inertia:navigate', sync);
                })();
                window.__GOOGLE__ = {
                    tagId: @json($googleTagId),
                    adsId: @json($googleAdsId ?: null),
                    adsPurchaseLabel: @json($googleAdsPurchaseLabel ?: null),
                };
            </script>
        @endif

        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        <x-inertia::head />
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
