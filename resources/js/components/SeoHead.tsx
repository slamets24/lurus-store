import { Head, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

/**
 * Head tags for a storefront page.
 *
 * Every element carries a `head-key`, which Inertia turns into a `data-inertia`
 * attribute. App\Support\SeoMeta renders the same tags with the same keys into
 * the initial HTML response, so on hydration these replace the server-rendered
 * ones in place rather than duplicating them. Keep the two files in sync.
 */
export interface SeoHeadProps {
    title: string;
    description?: string;
    keywords?: string;
    author?: string;
    image?: string;
    /** LCP image to preload. Paired with `preloadImageMobile` for art direction. */
    preloadImage?: string;
    /** Art-directed source actually painted below 769px, when it differs. */
    preloadImageMobile?: string;
    canonical?: string;
    type?: string;
    noindex?: boolean;
    jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const DEFAULT_KEYWORDS =
    'Lurus Store, modest fashion, busana muslim wanita, dress muslim, hijab, scarf, gamis modern, pakaian muslimah elegan, brand lokal muslimah';
const DEFAULT_AUTHOR = 'Lurus Store';

/** 1200x630 social preview shipped in public/ — mirrors SeoMeta::DEFAULT_IMAGE. */
const DEFAULT_IMAGE = '/og-image.jpg';
const DEFAULT_IMAGE_WIDTH = '1200';
const DEFAULT_IMAGE_HEIGHT = '630';

export function SeoHead({
    title,
    description,
    keywords = DEFAULT_KEYWORDS,
    author = DEFAULT_AUTHOR,
    image,
    preloadImage,
    preloadImageMobile,
    canonical,
    type = 'website',
    noindex = false,
    jsonLd,
}: SeoHeadProps) {
    const page = usePage();
    const appUrl = useMemo(() => {
        const sharedUrl = (page.props as { appUrl?: string }).appUrl;
        if (sharedUrl) {
            return sharedUrl.replace(/\/$/, '');
        }
        if (typeof window !== 'undefined' && window.location?.origin) {
            return window.location.origin.replace(/\/$/, '');
        }
        return '';
    }, [page.props]);

    const absoluteUrl = (path: string): string => {
        if (!path) return '';
        if (path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }
        return `${appUrl}${path.startsWith('/') ? path : `/${path}`}`;
    };

    const canonicalUrl = useMemo(() => {
        if (canonical) {
            return absoluteUrl(canonical);
        }
        const currentPath = page.url ? page.url.split('?')[0] : '';
        return absoluteUrl(currentPath);
    }, [canonical, page.url, appUrl]);

    const metaDescription = useMemo(() => {
        if (!description) return undefined;
        const cleaned = description.replace(/\s+/g, ' ').trim();
        return cleaned.length <= 160 ? cleaned : `${cleaned.slice(0, 157)}...`;
    }, [description]);

    const robotsContent = useMemo(
        () =>
            noindex
                ? 'noindex, nofollow'
                : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
        [noindex],
    );

    const usesDefaultImage = !image;

    const ogImage = useMemo(
        () => absoluteUrl(image || DEFAULT_IMAGE),
        [image, appUrl],
    );

    /**
     * Preloading a single source breaks art direction: below 769px the <picture>
     * paints the mobile file, so preloading the desktop one both misses the LCP
     * candidate and downloads a second image. Emit one media-scoped link per
     * source whenever the two differ.
     */
    const lcpPreloads = useMemo(() => {
        const desktop = preloadImage ? absoluteUrl(preloadImage) : undefined;
        const mobile = preloadImageMobile ? absoluteUrl(preloadImageMobile) : undefined;

        if (!desktop && !mobile) {
            return [];
        }

        if (!desktop || !mobile || desktop === mobile) {
            return [{ key: 'preload-lcp', href: (desktop ?? mobile)!, media: undefined }];
        }

        return [
            { key: 'preload-lcp', href: desktop, media: '(min-width: 769px)' },
            { key: 'preload-lcp-mobile', href: mobile, media: '(max-width: 768px)' },
        ];
    }, [preloadImage, preloadImageMobile, appUrl]);

    const jsonLdText = useMemo(() => {
        if (!jsonLd) return '';
        return JSON.stringify(jsonLd);
    }, [jsonLd]);

    return (
        <Head>
            <title>{title}</title>
            {lcpPreloads.map(({ key, href, media }) => (
                <link
                    key={key}
                    head-key={key}
                    rel="preload"
                    as="image"
                    href={href}
                    fetchPriority="high"
                    media={media}
                />
            ))}
            {metaDescription && (
                <meta head-key="description" name="description" content={metaDescription} />
            )}
            <link head-key="canonical" rel="canonical" href={canonicalUrl} />
            <meta head-key="robots" name="robots" content={robotsContent} />
            {keywords && <meta head-key="keywords" name="keywords" content={keywords} />}
            {author && <meta head-key="author" name="author" content={author} />}

            {/* Open Graph / Facebook / WhatsApp */}
            <meta head-key="og:title" property="og:title" content={title} />
            {metaDescription && (
                <meta
                    head-key="og:description"
                    property="og:description"
                    content={metaDescription}
                />
            )}
            <meta head-key="og:type" property="og:type" content={type} />
            <meta head-key="og:url" property="og:url" content={canonicalUrl} />
            {ogImage && <meta head-key="og:image" property="og:image" content={ogImage} />}
            {ogImage && <meta head-key="og:image:alt" property="og:image:alt" content={title} />}
            {usesDefaultImage && (
                <meta
                    head-key="og:image:width"
                    property="og:image:width"
                    content={DEFAULT_IMAGE_WIDTH}
                />
            )}
            {usesDefaultImage && (
                <meta
                    head-key="og:image:height"
                    property="og:image:height"
                    content={DEFAULT_IMAGE_HEIGHT}
                />
            )}
            <meta head-key="og:site_name" property="og:site_name" content="Lurus Store" />
            <meta head-key="og:locale" property="og:locale" content="id_ID" />

            {/* Twitter Card */}
            <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
            <meta head-key="twitter:title" name="twitter:title" content={title} />
            {metaDescription && (
                <meta
                    head-key="twitter:description"
                    name="twitter:description"
                    content={metaDescription}
                />
            )}
            {ogImage && <meta head-key="twitter:image" name="twitter:image" content={ogImage} />}

            {/* Structured Data JSON-LD */}
            {jsonLd && (
                <script
                    head-key="json-ld"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: jsonLdText }}
                />
            )}
        </Head>
    );
}

export default SeoHead;
