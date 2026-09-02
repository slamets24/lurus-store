<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}"  @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/logo.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/logo.png">

        {{-- ponytail: static crawl fallback; page-accurate meta needs Inertia SSR --}}
        <title>{{ config('app.name', 'Lurus Store') }} | Modest Fashion & Muslimah Elegance</title>
        <meta name="description" content="{{ config('app.name', 'Lurus Store') }} — modest fashion for Muslim women. Blouses, dresses, hijab, scarves, and everyday essentials with elegant, comfortable design.">
        <link rel="canonical" href="{{ url()->current() }}">

        <!-- Search Engine & Author Directives -->
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
        <meta name="keywords" content="Lurus Store, modest fashion, busana muslim wanita, dress muslim, hijab, scarf, gamis modern, pakaian muslimah elegan, brand lokal muslimah">
        <meta name="author" content="{{ config('app.name', 'Lurus Store') }}">

        <!-- Open Graph / Facebook / WhatsApp Preview -->
        <meta property="og:title" content="{{ config('app.name', 'Lurus Store') }} | Modest Fashion & Muslimah Elegance">
        <meta property="og:description" content="{{ config('app.name', 'Lurus Store') }} — modest fashion for Muslim women. Blouses, dresses, hijab, scarves, and everyday essentials with elegant, comfortable design.">
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:image" content="{{ asset('logo.png') }}">
        <meta property="og:site_name" content="{{ config('app.name', 'Lurus Store') }}">

        <!-- Twitter Meta Tags -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ config('app.name', 'Lurus Store') }} | Modest Fashion & Muslimah Elegance">
        <meta name="twitter:description" content="{{ config('app.name', 'Lurus Store') }} — modest fashion for Muslim women. Blouses, dresses, hijab, scarves, and everyday essentials with elegant, comfortable design.">
        <meta name="twitter:image" content="{{ asset('logo.png') }}">

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

        <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>
        @if ($loadGoogleTag)
            <link rel="preconnect" href="https://www.googletagmanager.com">
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

                // Deferred script injection to avoid blocking initial mobile render / TBT
                (function () {
                    var loadGtag = function () {
                        if (window._gtagLoaded) return;
                        window._gtagLoaded = true;
                        var s = document.createElement('script');
                        s.async = true;
                        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + @json($googleTagId);
                        document.head.appendChild(s);
                    };
                    if (document.readyState === 'complete') {
                        loadGtag();
                    } else {
                        window.addEventListener('load', function () {
                            if ('requestIdleCallback' in window) {
                                requestIdleCallback(loadGtag, { timeout: 2500 });
                            } else {
                                setTimeout(loadGtag, 1500);
                            }
                        });
                    }
                })();
            </script>
        @endif

        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        <x-inertia::head />
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
