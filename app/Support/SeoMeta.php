<?php

namespace App\Support;

use Illuminate\Support\Arr;
use Illuminate\Support\Str;

/**
 * Server-rendered SEO head tags for the storefront.
 *
 * The app runs Inertia without a Node SSR process (Vercel PHP runtime), so the
 * HTML that crawlers and social scrapers receive would otherwise carry only the
 * static fallback meta from the root template. This class re-derives the same
 * metadata that resources/js/components/SeoHead.tsx renders on the client and
 * emits it into the initial response.
 *
 * Every tag carries a `data-inertia` key identical to the `head-key` used by
 * SeoHead, so Inertia's head manager adopts these elements on hydration and
 * replaces them in place instead of appending duplicates.
 *
 * @see resources/js/components/SeoHead.tsx — keep the two in sync.
 */
final class SeoMeta
{
    public const SITE_NAME = 'Lurus Store';

    /** 1200x630 social preview shipped in public/. */
    public const DEFAULT_IMAGE = '/og-image.jpg';

    public const DEFAULT_IMAGE_WIDTH = 1200;

    public const DEFAULT_IMAGE_HEIGHT = 630;

    public const DEFAULT_KEYWORDS = 'Lurus Store, modest fashion, busana muslim wanita, dress muslim, hijab, scarf, gamis modern, pakaian muslimah elegan, brand lokal muslimah';

    public const DEFAULT_TITLE = 'Lurus Store | Modest Fashion & Muslimah Elegance';

    public const DEFAULT_DESCRIPTION = 'Belanja koleksi busana muslimah elegan, modern, dan nyaman di Lurus Store. Tersedia dress muslim, hijab, blouse, skirt, dan daily wear muslimah berkualitas.';

    /** Inertia components that must never be indexed. */
    private const NOINDEX_COMPONENTS = [
        'Account',
        'Cart/Index',
        'Checkout',
        'OrderTracking',
        'Orders/Index',
        'Orders/Show',
        'Orders/Success',
        'Search',
        'Testimonials/Create',
        'Wishlist',
    ];

    /**
     * Render the head tags for the given Inertia page object.
     *
     * @param  array<string, mixed>  $page
     * @return array<int, string>
     */
    public static function tags(array $page): array
    {
        $meta = self::resolve($page);

        $tags = [];
        $tags[] = '<title data-inertia="">'.e($meta['title']).'</title>';

        if ($meta['preload']) {
            foreach ($meta['preload'] as $key => $preload) {
                $media = $preload['media'] ? ' media="'.e($preload['media']).'"' : '';
                $tags[] = '<link data-inertia="'.e($key).'" rel="preload" as="image" href="'.e($preload['href']).'" fetchpriority="high"'.$media.'>';
            }
        }

        if ($meta['description']) {
            $tags[] = self::meta('description', 'description', $meta['description']);
        }

        $tags[] = '<link data-inertia="canonical" rel="canonical" href="'.e($meta['canonical']).'">';
        $tags[] = self::meta('robots', 'robots', $meta['robots']);
        $tags[] = self::meta('keywords', 'keywords', self::DEFAULT_KEYWORDS);
        $tags[] = self::meta('author', 'author', self::SITE_NAME);

        $tags[] = self::meta('og:title', 'og:title', $meta['title'], property: true);
        if ($meta['description']) {
            $tags[] = self::meta('og:description', 'og:description', $meta['description'], property: true);
        }
        $tags[] = self::meta('og:type', 'og:type', $meta['type'], property: true);
        $tags[] = self::meta('og:url', 'og:url', $meta['canonical'], property: true);
        $tags[] = self::meta('og:image', 'og:image', $meta['image'], property: true);
        $tags[] = self::meta('og:image:alt', 'og:image:alt', $meta['title'], property: true);
        $tags[] = self::meta('og:site_name', 'og:site_name', self::SITE_NAME, property: true);
        $tags[] = self::meta('og:locale', 'og:locale', 'id_ID', property: true);

        if ($meta['usesDefaultImage']) {
            $tags[] = self::meta('og:image:width', 'og:image:width', (string) self::DEFAULT_IMAGE_WIDTH, property: true);
            $tags[] = self::meta('og:image:height', 'og:image:height', (string) self::DEFAULT_IMAGE_HEIGHT, property: true);
        }

        $tags[] = self::meta('twitter:card', 'twitter:card', 'summary_large_image');
        $tags[] = self::meta('twitter:title', 'twitter:title', $meta['title']);
        if ($meta['description']) {
            $tags[] = self::meta('twitter:description', 'twitter:description', $meta['description']);
        }
        $tags[] = self::meta('twitter:image', 'twitter:image', $meta['image']);

        if ($meta['jsonLd']) {
            $json = json_encode(
                $meta['jsonLd'],
                JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP,
            );

            if ($json !== false) {
                $tags[] = '<script data-inertia="json-ld" type="application/ld+json">'.$json.'</script>';
            }
        }

        return $tags;
    }

    /**
     * Resolve the metadata for a page without rendering it.
     *
     * @param  array<string, mixed>  $page
     * @return array<string, mixed>
     */
    public static function resolve(array $page): array
    {
        $component = (string) ($page['component'] ?? '');
        $props = (array) ($page['props'] ?? []);

        $meta = self::forComponent($component, $props);

        $image = $meta['image'] ?? null;
        $usesDefaultImage = ! filled($image);

        return [
            'title' => $meta['title'] ?? self::DEFAULT_TITLE,
            'description' => self::truncate($meta['description'] ?? self::DEFAULT_DESCRIPTION),
            'canonical' => self::url($meta['canonical'] ?? self::path($page)),
            'image' => self::url($usesDefaultImage ? self::DEFAULT_IMAGE : $image),
            'usesDefaultImage' => $usesDefaultImage,
            'type' => $meta['type'] ?? 'website',
            'robots' => in_array($component, self::NOINDEX_COMPONENTS, true) || Str::startsWith($component, ['Auth/', 'Admin/'])
                ? 'noindex, nofollow'
                : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
            'jsonLd' => $meta['jsonLd'] ?? null,
            'preload' => $meta['preload'] ?? [],
        ];
    }

    /**
     * Per-page metadata, mirroring each page component's <SeoHead /> call.
     *
     * @param  array<string, mixed>  $props
     * @return array<string, mixed>
     */
    private static function forComponent(string $component, array $props): array
    {
        return match ($component) {
            'Home' => [
                'title' => self::DEFAULT_TITLE,
                'description' => self::DEFAULT_DESCRIPTION,
                'canonical' => '/',
                'image' => self::heroImage($props),
                'preload' => self::heroPreload($props),
                'jsonLd' => self::homeJsonLd($props),
            ],
            'ProductDetail' => self::product($props),
            'Products' => self::products($props),
            'CategoryDetail' => self::taxonomy($props, 'category', 'categories', 'Categories'),
            'CollectionDetail' => self::taxonomy($props, 'collection', 'collections', 'Collections'),
            'Categories/Index' => [
                'title' => 'Kategori Busana Muslimah | Lurus Store',
                'description' => 'Temukan berbagai kategori busana muslimah elegan di Lurus Store: dress, hijab, blouse, skirt, dan koleksi modest wear lainnya.',
                'canonical' => '/categories',
            ],
            'Collections/Index' => [
                'title' => 'Koleksi Pilihan | Lurus Store',
                'description' => 'Jelajahi kurasi koleksi busana muslimah terbaik untuk berbagai momen di Lurus Store. Pilihan gaya modest yang elegan dan timeless.',
                'canonical' => '/collections',
            ],
            'About' => [
                'title' => 'Tentang Kami | Lurus Store — Modest Fashion & Muslimah Elegance',
                'description' => 'Pelajari komitmen Lurus Store dalam menghadirkan modest wear dan busana muslimah elegan, nyaman, dan berkarakter untuk wanita Indonesia.',
                'canonical' => '/about',
            ],
            'Faq' => [
                'title' => 'FAQ - Pertanyaan Umum | Lurus Store',
                'description' => 'Temukan jawaban atas pertanyaan umum seputar cara pemesanan, metode pembayaran, opsi pengiriman, dan kebijakan retur di Lurus Store.',
                'canonical' => '/faq',
            ],
            'Contact' => [
                'title' => 'Hubungi Kami | Customer Service Lurus Store',
                'description' => 'Hubungi layanan pelanggan Lurus Store untuk pertanyaan produk, konsultasi ukuran, status pengiriman, atau informasi kerjasama.',
                'canonical' => '/contact',
            ],
            'NewArrivals' => [
                'title' => 'Produk Terbaru | Koleksi New Arrivals Busana Muslimah | Lurus Store',
                'description' => 'Temukan koleksi produk terbaru busana muslimah dan modest wear di Lurus Store. Model fresh, bahan nyaman, dan potongan elegan.',
                'canonical' => '/new-arrivals',
            ],
            'BestSellers' => [
                'title' => 'Produk Terlaris | Best Sellers Busana Muslimah | Lurus Store',
                'description' => 'Koleksi busana muslimah dan modest wear terfavorit dan paling banyak dibeli di Lurus Store. Kualitas terpercaya dan desain anggun.',
                'canonical' => '/best-sellers',
            ],
            'SpecialOffers' => [
                'title' => 'Penawaran Spesial & Promo | Lurus Store',
                'description' => 'Dapatkan penawaran menarik dan diskon eksklusif untuk koleksi busana muslimah pilihan di Lurus Store.',
                'canonical' => '/special-offers',
            ],
            'SizeGuide' => [
                'title' => 'Panduan Ukuran (Size Guide) | Lurus Store',
                'description' => 'Panduan lengkap memilih ukuran busana muslimah yang pas dan nyaman di Lurus Store. Cek tabel ukuran dada, pinggang, pinggul, dan panjang baju.',
                'canonical' => '/size-guide',
            ],
            'ShippingReturns' => [
                'title' => 'Kebijakan Pengiriman & Pengembalian | Lurus Store',
                'description' => 'Informasi mengenai estimasi pengiriman, ekspedisi kurir, bebas ongkir, serta syarat dan ketentuan pengembalian barang di Lurus Store.',
                'canonical' => '/shipping-returns',
            ],
            'PrivacyPolicy' => [
                'title' => 'Kebijakan Privasi | Lurus Store',
                'description' => 'Kebijakan privasi Lurus Store menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.',
                'canonical' => '/privacy-policy',
            ],
            'TermsOfService' => [
                'title' => 'Syarat & Ketentuan Layanan | Lurus Store',
                'description' => 'Syarat dan ketentuan penggunaan layanan, pembelian produk, dan transaksi di website resmi Lurus Store.',
                'canonical' => '/terms-of-service',
            ],
            default => [],
        };
    }

    /**
     * @param  array<string, mixed>  $props
     * @return array<string, mixed>
     */
    private static function product(array $props): array
    {
        $product = (array) Arr::get($props, 'product', []);

        if ($product === []) {
            return [];
        }

        $name = (string) Arr::get($product, 'name', '');
        $slug = (string) Arr::get($product, 'slug', '');
        $url = self::url('/products/'.$slug);
        $description = self::plainText(Arr::get($product, 'description'))
            ?: "Beli {$name} berkualitas premium di Lurus Store. Busana muslimah elegan dengan material pilihan yang nyaman dan anggun.";

        $images = collect(Arr::get($product, 'images', []))
            ->map(fn ($image) => self::url((string) Arr::get((array) $image, 'image_path', '')))
            ->filter()
            ->values()
            ->all();

        $price = (float) Arr::get($product, 'price', 0);
        $discount = (float) Arr::get($product, 'discount_percent', 0);
        $effectivePrice = $discount > 0 ? $price * (1 - $discount / 100) : $price;
        $category = Arr::get($product, 'category');

        $breadcrumbs = [
            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => self::url('/')],
            ['@type' => 'ListItem', 'position' => 2, 'name' => 'Products', 'item' => self::url('/products')],
        ];

        if (is_array($category)) {
            $breadcrumbs[] = [
                '@type' => 'ListItem',
                'position' => 3,
                'name' => Arr::get($category, 'name'),
                'item' => self::url('/categories/'.Arr::get($category, 'slug')),
            ];
            $breadcrumbs[] = ['@type' => 'ListItem', 'position' => 4, 'name' => $name, 'item' => $url];
        } else {
            $breadcrumbs[] = ['@type' => 'ListItem', 'position' => 3, 'name' => $name, 'item' => $url];
        }

        return [
            'title' => "{$name} | Lurus Store",
            'description' => $description,
            'canonical' => '/products/'.$slug,
            'type' => 'product',
            'image' => $images[0] ?? null,
            'preload' => isset($images[0])
                ? ['preload-lcp' => ['href' => $images[0], 'media' => null]]
                : [],
            'jsonLd' => [
                [
                    '@context' => 'https://schema.org',
                    '@type' => 'Product',
                    'name' => $name,
                    'image' => $images ?: null,
                    'description' => self::truncate($description),
                    'sku' => 'PROD-'.Arr::get($product, 'id'),
                    'brand' => ['@type' => 'Brand', 'name' => self::SITE_NAME],
                    'offers' => [
                        '@type' => 'Offer',
                        'url' => $url,
                        'priceCurrency' => 'IDR',
                        'price' => $effectivePrice,
                        'itemCondition' => 'https://schema.org/NewCondition',
                        'availability' => ((int) Arr::get($product, 'stock', 0)) > 0
                            ? 'https://schema.org/InStock'
                            : 'https://schema.org/OutOfStock',
                        'seller' => ['@type' => 'Organization', 'name' => self::SITE_NAME],
                    ],
                ],
                [
                    '@context' => 'https://schema.org',
                    '@type' => 'BreadcrumbList',
                    'itemListElement' => $breadcrumbs,
                ],
            ],
        ];
    }

    /**
     * @param  array<string, mixed>  $props
     * @return array<string, mixed>
     */
    private static function products(array $props): array
    {
        $slug = (string) request()->query('category', '');
        $category = collect(Arr::get($props, 'categories', []))
            ->first(fn ($item) => (string) Arr::get((array) $item, 'slug') === $slug);

        if ($slug !== '' && is_array($category)) {
            $name = (string) Arr::get($category, 'name');

            return [
                'title' => "{$name} | Koleksi Busana Muslimah | Lurus Store",
                'description' => "Jelajahi koleksi {$name} terbaik di Lurus Store. Pilihan modest wear wanita modern dengan bahan berkualitas tinggi dan desain elegan.",
                'canonical' => '/products?category='.$slug,
            ];
        }

        return [
            'title' => 'Semua Produk | Koleksi Busana Muslimah & Modest Wear | Lurus Store',
            'description' => 'Temukan koleksi lengkap busana muslimah Lurus Store: dress, hijab, blouse, rok, dan pakaian modest harian wanita dengan kualitas premium.',
            'canonical' => '/products',
        ];
    }

    /**
     * Shared shape for /categories/{slug} and /collections/{slug}.
     *
     * @param  array<string, mixed>  $props
     * @return array<string, mixed>
     */
    private static function taxonomy(array $props, string $prop, string $segment, string $crumb): array
    {
        $item = (array) Arr::get($props, $prop, []);

        if ($item === []) {
            return [];
        }

        $name = (string) Arr::get($item, 'name', '');
        $slug = (string) Arr::get($item, 'slug', '');
        $path = "/{$segment}/{$slug}";
        $image = Arr::get($item, 'image') ?: Arr::get($item, 'banner_image');
        $image = filled($image) ? self::url((string) $image) : null;

        return [
            'title' => "{$name} | Koleksi Busana Muslimah | Lurus Store",
            'description' => self::plainText(Arr::get($item, 'description'))
                ?: "Koleksi {$name} terbaik di Lurus Store. Busana muslimah elegan dengan pilihan material premium dan potongan yang nyaman.",
            'canonical' => $path,
            'image' => $image,
            'preload' => $image ? ['preload-lcp' => ['href' => $image, 'media' => null]] : [],
            'jsonLd' => [
                '@context' => 'https://schema.org',
                '@type' => 'BreadcrumbList',
                'itemListElement' => [
                    ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => self::url('/')],
                    ['@type' => 'ListItem', 'position' => 2, 'name' => $crumb, 'item' => self::url('/'.$segment)],
                    ['@type' => 'ListItem', 'position' => 3, 'name' => $name, 'item' => self::url($path)],
                ],
            ],
        ];
    }

    /**
     * @param  array<string, mixed>  $props
     * @return array<int, array<string, mixed>>
     */
    private static function homeJsonLd(array $props): array
    {
        $base = self::url('/');

        $graph = [
            [
                '@context' => 'https://schema.org',
                '@type' => 'WebSite',
                'name' => self::SITE_NAME,
                'url' => $base,
                'description' => 'Brand busana muslimah elegan, modest wear, dress, hijab, dan aksesoris wanita muslim di Indonesia.',
                'potentialAction' => [
                    '@type' => 'SearchAction',
                    'target' => [
                        '@type' => 'EntryPoint',
                        'urlTemplate' => self::url('/search').'?q={search_term_string}',
                    ],
                    'query-input' => 'required name=search_term_string',
                ],
            ],
            [
                '@context' => 'https://schema.org',
                '@type' => 'Organization',
                'name' => self::SITE_NAME,
                'url' => $base,
                'logo' => self::url('/logo.svg'),
            ],
        ];

        $faqs = Arr::get($props, 'faqs', []);

        if (is_array($faqs) && $faqs !== []) {
            $graph[] = [
                '@context' => 'https://schema.org',
                '@type' => 'FAQPage',
                'mainEntity' => array_map(fn ($faq) => [
                    '@type' => 'Question',
                    'name' => Arr::get((array) $faq, 'question'),
                    'acceptedAnswer' => [
                        '@type' => 'Answer',
                        'text' => Arr::get((array) $faq, 'answer'),
                    ],
                ], $faqs),
            ];
        }

        return $graph;
    }

    /**
     * @param  array<string, mixed>  $props
     */
    private static function heroImage(array $props): ?string
    {
        $hero = (array) (Arr::get($props, 'heroBanners.0') ?? []);
        $image = Arr::get($hero, 'desktopImage') ?: Arr::get($hero, 'mobileImage');

        return filled($image) ? self::url((string) $image) : null;
    }

    /**
     * Preload the image the browser will actually paint: the mobile art-direction
     * source below 768px, the desktop source above it.
     *
     * @param  array<string, mixed>  $props
     * @return array<string, array<string, ?string>>
     */
    private static function heroPreload(array $props): array
    {
        $hero = (array) (Arr::get($props, 'heroBanners.0') ?? []);
        $desktop = Arr::get($hero, 'desktopImage');
        $mobile = Arr::get($hero, 'mobileImage');

        if (blank($desktop) && blank($mobile)) {
            return [];
        }

        // A single source serves every breakpoint: preload it unconditionally.
        if (blank($mobile) || blank($desktop) || $mobile === $desktop) {
            return ['preload-lcp' => ['href' => self::url((string) ($desktop ?: $mobile)), 'media' => null]];
        }

        return [
            'preload-lcp' => ['href' => self::url((string) $desktop), 'media' => '(min-width: 769px)'],
            'preload-lcp-mobile' => ['href' => self::url((string) $mobile), 'media' => '(max-width: 768px)'],
        ];
    }

    private static function meta(string $key, string $name, ?string $content, bool $property = false): string
    {
        $attribute = $property ? 'property' : 'name';

        return '<meta data-inertia="'.e($key).'" '.$attribute.'="'.e($name).'" content="'.e((string) $content).'">';
    }

    private static function path(array $page): string
    {
        $url = (string) ($page['url'] ?? '/');

        return Str::before($url, '?') ?: '/';
    }

    private static function url(?string $path): string
    {
        $path = (string) $path;

        if ($path === '') {
            return '';
        }

        if (Str::startsWith($path, ['http://', 'https://'])) {
            return $path;
        }

        return rtrim((string) config('app.url'), '/').Str::start($path, '/');
    }

    private static function plainText(mixed $value): string
    {
        if (! is_string($value) || $value === '') {
            return '';
        }

        return trim((string) preg_replace('/\s+/', ' ', strip_tags($value)));
    }

    private static function truncate(?string $value): ?string
    {
        if (! filled($value)) {
            return null;
        }

        $clean = trim((string) preg_replace('/\s+/', ' ', (string) $value));

        return Str::length($clean) <= 160 ? $clean : Str::substr($clean, 0, 157).'...';
    }
}
