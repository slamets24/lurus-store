import { Head, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

export interface SeoHeadProps {
    title: string;
    description?: string;
    keywords?: string;
    author?: string;
    image?: string;
    preloadImage?: string;
    canonical?: string;
    type?: string;
    noindex?: boolean;
    jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const DEFAULT_KEYWORDS =
    'Lurus Store, modest fashion, busana muslim wanita, dress muslim, hijab, scarf, gamis modern, pakaian muslimah elegan, brand lokal muslimah';
const DEFAULT_AUTHOR = 'Lurus Store';

export function SeoHead({
    title,
    description,
    keywords = DEFAULT_KEYWORDS,
    author = DEFAULT_AUTHOR,
    image,
    preloadImage,
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

    const ogImage = useMemo(() => {
        if (image) {
            return absoluteUrl(image);
        }
        return absoluteUrl('/logo.png');
    }, [image, appUrl]);

    const lcpPreload = useMemo(() => {
        if (preloadImage) {
            return absoluteUrl(preloadImage);
        }
        return undefined;
    }, [preloadImage, appUrl]);

    const jsonLdText = useMemo(() => {
        if (!jsonLd) return '';
        return JSON.stringify(jsonLd);
    }, [jsonLd]);

    return (
        <Head>
            <title>{title}</title>
            {lcpPreload && (
                <link
                    head-key="preload-lcp"
                    rel="preload"
                    as="image"
                    href={lcpPreload}
                    fetchPriority="high"
                />
            )}
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
            <meta head-key="og:site_name" property="og:site_name" content="Lurus Store" />

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
