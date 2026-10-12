<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}"  @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/logo.svg" type="image/svg+xml">

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

        {{--
            Emits the @font-face rules and preload links for the Manrope /
            Libre Caslon Text families declared in vite.config.ts. @vite does not
            include them, so without this the brand typography in app.css
            (--font-sans / --font-serif) silently falls back to system fonts.
        --}}
        @fonts

        @vite(['resources/css/app.css', 'resources/js/app.tsx'])

        {{-- Head rendered by the Inertia SSR server, when one is answering. --}}
        <x-inertia::head />

        {{--
            Otherwise emit the head ourselves. App\Support\SeoMeta mirrors SeoHead.tsx
            so crawlers and social scrapers — which never run our JS — still receive
            page-accurate title/description/canonical/OG tags and JSON-LD.

            These sit outside <x-inertia::head> on purpose: component slot contents are
            compiled as a Blade template, which would turn the "@context"/"@type" keys
            of the JSON-LD into Blade directives. dispatch() is memoised per request,
            so asking here does not trigger a second SSR call.
        --}}
        @unless (app(\Inertia\Ssr\SsrState::class)->dispatch())
            @foreach (\App\Support\SeoMeta::tags($page ?? []) as $tag)
                {!! $tag !!}
            @endforeach
        @endunless
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
