import { Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, Minus, Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { SeoHead } from '@/components/SeoHead';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { cn, formatCurrency, storageUrl } from '@/lib/utils';
import type { AuthProps, ProductCard as ProductCardType, ProductDetailData } from '@/types';

interface ProductDetailProps {
    product: ProductDetailData;
    recommendedProducts: Array<ProductCardType & { images?: Array<{ image_path: string; thumb_path?: string | null }> }>;
    latestProducts: Array<ProductCardType & { images?: Array<{ image_path: string; thumb_path?: string | null }> }>;
}

const DESCRIPTION_COLLAPSED_HEIGHT = 160;

function toCard(product: ProductCardType & { images?: Array<{ image_path: string; thumb_path?: string | null }> }): ProductCardType {
    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        discount_percent: product.discount_percent,
        effective_price: product.effective_price,
        image: product.image ?? product.images?.[0]?.image_path,
        images: product.images,
        hover_image: product.hover_image ?? product.images?.[1]?.image_path,
        is_new: product.is_new,
        stock: product.stock,
    };
}

export default function ProductDetail({ product, recommendedProducts, latestProducts }: ProductDetailProps) {
    const { wishlistMap, auth, appUrl } = usePage().props as unknown as {
        wishlistMap: Record<number, number>;
        auth: AuthProps;
        appUrl?: string;
    };
    const baseUrl = (appUrl || '').replace(/\/$/, '');
    const [activeImage, setActiveImage] = useState(() => {
        const firstColor = product.colors?.[0];
        if (!firstColor || (product.images?.length ?? 0) === 0) return 0;
        const idx = product.images.findIndex(
            (img) => img.color && img.color.trim().toLowerCase() === firstColor.trim().toLowerCase(),
        );
        return idx !== -1 ? idx : 0;
    });
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState(product.colors?.[0] ?? '');
    const offers = product.offers ?? [];
    const hasOffers = offers.length > 0;
    const pieceMode = hasOffers && offers.every((offer) => offer.components.length === 1);
    const [selectedOfferId, setSelectedOfferId] = useState<number | null>(offers[0]?.id ?? null);
    const [pieceSizes, setPieceSizes] = useState<Record<number, string>>({});
    const selectedOffer = offers.find((offer) => offer.id === selectedOfferId) ?? null;
    const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
    const [guideIndex, setGuideIndex] = useState(0);
    const sizeGuides = product.size_guide_images?.length
        ? product.size_guide_images
        : product.size_chart_url
            ? [product.size_chart_url]
            : [];
    const [zoomOrigin, setZoomOrigin] = useState('50% 50%');
    const [zoomed, setZoomed] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [descExpanded, setDescExpanded] = useState(false);
    const [descOverflows, setDescOverflows] = useState(false);
    const descRef = useRef<HTMLDivElement>(null);
    const galleryRef = useRef<HTMLDivElement>(null);
    const isInteractingRef = useRef(false);
    const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isProgrammaticScroll = useRef(false);

    const needsSize = !hasOffers && (product.sizes?.length ?? 0) > 0;
    const offerColors = useMemo(() => {
        if (pieceMode) {
            return [
                ...new Set(
                    product.published_variants
                        .map((variant) => variant.color)
                        .filter((color): color is string => Boolean(color)),
                ),
            ];
        }

        if (!selectedOffer) {
            return [] as string[];
        }

        let shared: string[] | null = null;
        for (const component of selectedOffer.components) {
            const colors = [
                ...new Set(
                    product.published_variants
                        .filter((variant) => variant.component_id === component.id && variant.color)
                        .map((variant) => variant.color as string),
                ),
            ];
            shared = shared === null ? colors : shared.filter((color) => colors.includes(color));
        }

        return shared ?? [];
    }, [pieceMode, product.published_variants, selectedOffer]);
    const activeColor = hasOffers ? (offerColors.includes(selectedColor) ? selectedColor : (offerColors[0] ?? '')) : selectedColor;
    const sizesForPiece = (componentId: number) => [
        ...new Set(
            product.published_variants
                .filter((variant) => variant.component_id === componentId && (!activeColor || variant.color === activeColor) && variant.size)
                .map((variant) => variant.size as string),
        ),
    ];
    const pieceComponentId = pieceMode ? selectedOffer?.components[0]?.id : undefined;
    const pieceSize = pieceComponentId ? (pieceSizes[pieceComponentId] ?? '') : '';
    const pieceSizeOptions = pieceMode
        ? [
            ...new Set(
                product.published_variants
                    .filter((variant) => variant.size && (!activeColor || variant.color === activeColor))
                    .map((variant) => variant.size as string),
            ),
        ]
        : [];
    const sizeMissing = pieceMode
        ? pieceSize === ''
        : hasOffers
            ? (selectedOffer?.components ?? []).some((component) => !pieceSizes[component.id])
            : needsSize && selectedSize === '';
    const matchedPiece = pieceMode && pieceComponentId && pieceSize
        ? product.published_variants.find(
            (variant) => variant.component_id === pieceComponentId
                && (!activeColor || variant.color === activeColor)
                && variant.size === pieceSize,
        )
        : null;
    const listPrice = matchedPiece?.price != null
        ? matchedPiece.price
        : selectedOffer
            ? selectedOffer.price
            : product.price;
    const hasDiscount = (product.discount_percent ?? 0) > 0;
    const effectivePrice = hasDiscount
        ? listPrice * (1 - (product.discount_percent ?? 0) / 100)
        : listPrice;

    const colorHasStock = useMemo(() => {
        if (hasOffers && selectedOffer) {
            return selectedOffer.components.every((component) =>
                product.published_variants.some(
                    (variant) => variant.component_id === component.id
                        && (!activeColor || variant.color === activeColor)
                        && variant.stock > 0,
                ),
            );
        }

        if (product.published_variants.length === 0) {
            return product.stock > 0;
        }

        return product.published_variants.some(
            (variant) => variant.stock > 0 && (!selectedColor || variant.color === selectedColor),
        );
    }, [activeColor, hasOffers, product, selectedColor, selectedOffer]);

    const variantStock = useMemo(() => {
        if (hasOffers && selectedOffer) {
            if (sizeMissing) {
                return 0;
            }

            const stocks = selectedOffer.components.map((component) => {
                const match = product.published_variants.find(
                    (variant) => variant.component_id === component.id
                        && (!activeColor || variant.color === activeColor)
                        && variant.size === pieceSizes[component.id],
                );

                return match?.stock ?? 0;
            });

            return stocks.length > 0 ? Math.min(...stocks) : 0;
        }

        if (product.published_variants.length === 0) {
            return product.stock;
        }

        const match = product.published_variants.find(
            (variant) =>
                (!selectedColor || variant.color === selectedColor) &&
                (!needsSize || variant.size === selectedSize),
        );

        return match?.stock ?? 0;
    }, [activeColor, hasOffers, needsSize, pieceSizes, product, selectedColor, selectedOffer, selectedSize, sizeMissing]);

    const isSoldOut = !colorHasStock || (!sizeMissing && variantStock <= 0);
    const isWishlisted = Boolean(wishlistMap[product.id]);
    const canAdd = !isSoldOut && !sizeMissing && variantStock > 0;

    const { data, setData, post, processing } = useForm({
        product_id: product.id,
        quantity: 1,
        size: null as string | null,
        color: selectedColor || null,
        offer_id: offers[0]?.id ?? null,
        sizes: {} as Record<number, string>,
    });

    useEffect(() => {
        setData((current) => ({
            ...current,
            color: activeColor || null,
            offer_id: selectedOffer?.id ?? null,
            sizes: pieceSizes,
            size: hasOffers ? null : (selectedSize || null),
        }));
    }, [activeColor, hasOffers, pieceSizes, selectedOffer, selectedSize]);

    useEffect(() => {
        const el = descRef.current;
        if (!el) {
            return;
        }

        const measure = () => setDescOverflows(el.scrollHeight > DESCRIPTION_COLLAPSED_HEIGHT + 24);
        measure();

        const observer = new ResizeObserver(measure);
        observer.observe(el);

        return () => observer.disconnect();
    }, [product.description]);

    useEffect(() => {
        setDescExpanded(false);
    }, [product.id]);

    useEffect(() => {
        if (!sizeGuideOpen) {
            return;
        }

        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setSizeGuideOpen(false);
            }
            if (sizeGuides.length < 2) {
                return;
            }
            if (event.key === 'ArrowLeft') {
                setGuideIndex((index) => (index + sizeGuides.length - 1) % sizeGuides.length);
            }
            if (event.key === 'ArrowRight') {
                setGuideIndex((index) => (index + 1) % sizeGuides.length);
            }
        };

        document.addEventListener('keydown', onKey);

        return () => document.removeEventListener('keydown', onKey);
    }, [sizeGuideOpen, sizeGuides.length]);

    const handleAddToCart = () => {
        if (!canAdd) {
            return;
        }

        post('/cart', { preserveScroll: true });
    };

    const images = product.images.length > 0 ? product.images : [{ id: 0, image_path: '', thumb_path: null }];

    const findImageIndexForColor = (colorName: string) => {
        if (!colorName || images.length === 0) {
            return -1;
        }

        const cleanTarget = colorName.trim().toLowerCase();

        // 1. Exact match on img.color
        const exactIndex = images.findIndex(
            (img) => img.color && img.color.trim().toLowerCase() === cleanTarget,
        );
        if (exactIndex !== -1) {
            return exactIndex;
        }

        // 2. Partial match on img.color
        const partialIndex = images.findIndex(
            (img) =>
                img.color &&
                (img.color.toLowerCase().includes(cleanTarget) ||
                    cleanTarget.includes(img.color.toLowerCase())),
        );
        if (partialIndex !== -1) {
            return partialIndex;
        }

        // 3. Match in image_path (filename contains color slug)
        const slugTarget = cleanTarget.replace(/\s+/g, '-');
        const pathIndex = images.findIndex((img) => {
            if (!img.image_path) {
                return false;
            }
            const path = img.image_path.toLowerCase();
            return path.includes(slugTarget) || path.includes(cleanTarget);
        });
        if (pathIndex !== -1) {
            return pathIndex;
        }

        // 4. Index alignment fallback with product.colors
        if (product.colors && product.colors.length > 0) {
            const colorIdx = product.colors.findIndex((c) => c.trim().toLowerCase() === cleanTarget);
            if (colorIdx !== -1 && colorIdx < images.length) {
                return colorIdx;
            }
        }

        return -1;
    };

    const pauseAndScheduleResume = (delayMs = 5000) => {
        isInteractingRef.current = true;
        if (resumeTimeoutRef.current) {
            clearTimeout(resumeTimeoutRef.current);
        }
        resumeTimeoutRef.current = setTimeout(() => {
            isInteractingRef.current = false;
        }, delayMs);
    };

    const showImage = (index: number) => {
        setActiveImage(index);
        if (galleryRef.current) {
            const width = galleryRef.current.clientWidth || 0;
            isProgrammaticScroll.current = true;
            galleryRef.current.scrollTo({ left: index * width, behavior: 'smooth' });
            setTimeout(() => {
                isProgrammaticScroll.current = false;
            }, 400);
        }
    };

    const handleColorClick = (color: string) => {
        setSelectedColor(color);
        setData('color', color);
        if (hasOffers) {
            setPieceSizes({});
        }

        const targetIndex = findImageIndexForColor(color);
        if (targetIndex !== -1) {
            showImage(targetIndex);
        }
        pauseAndScheduleResume(5000);
    };

    const handleThumbnailClick = (index: number) => {
        showImage(index);
        pauseAndScheduleResume(5000);

        const img = images[index];
        if (img?.color && product.colors?.includes(img.color)) {
            setSelectedColor(img.color);
            setData('color', img.color);
        }
    };

    const showPreviousImage = () => {
        const prev = (activeImage - 1 + images.length) % images.length;
        showImage(prev);
        pauseAndScheduleResume(5000);
    };

    const showNextImage = () => {
        const next = (activeImage + 1) % images.length;
        showImage(next);
        pauseAndScheduleResume(5000);
    };

    const onGalleryScroll = () => {
        if (isProgrammaticScroll.current) {
            return;
        }

        const el = galleryRef.current;
        if (!el?.clientWidth) {
            return;
        }

        const index = Math.round(el.scrollLeft / el.clientWidth);
        if (index !== activeImage && index >= 0 && index < images.length) {
            setActiveImage(index);
        }
    };

    useEffect(() => {
        if (images.length <= 1) {
            return;
        }

        const interval = setInterval(() => {
            if (isInteractingRef.current || isHovered || zoomed || document.hidden) {
                return;
            }

            setActiveImage((prev) => {
                const next = (prev + 1) % images.length;
                if (galleryRef.current) {
                    const width = galleryRef.current.clientWidth || 0;
                    isProgrammaticScroll.current = true;
                    galleryRef.current.scrollTo({ left: next * width, behavior: 'smooth' });
                    setTimeout(() => {
                        isProgrammaticScroll.current = false;
                    }, 400);
                }
                return next;
            });
        }, 3500);

        return () => {
            clearInterval(interval);
            if (resumeTimeoutRef.current) {
                clearTimeout(resumeTimeoutRef.current);
            }
        };
    }, [images.length, isHovered, zoomed]);

    const addLabel = sizeMissing
        ? 'Select a size'
        : isSoldOut
          ? product.is_preorder
              ? 'Kuota Pre-Order Penuh'
              : 'Sold Out'
          : product.is_preorder
            ? 'Pre-Order Sekarang'
            : 'Add to Cart';

    const productDescription = useMemo(() => {
        if (product.description) {
            const clean = product.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
            if (clean) return clean;
        }
        return `Beli ${product.name} berkualitas premium di Lurus Store. Busana muslimah elegan dengan material pilihan yang nyaman dan anggun.`;
    }, [product.name, product.description]);

    const primaryImage = product.images?.[0]?.image_path
        ? storageUrl(product.images[0].image_path)
        : undefined;

    const productJsonLd = useMemo(() => {
        const itemUrl = baseUrl ? `${baseUrl}/products/${product.slug}` : `/products/${product.slug}`;
        const imageUrls = product.images?.length
            ? product.images.map((img) => storageUrl(img.image_path))
            : undefined;

        const breadcrumbs = [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: baseUrl || '/',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Products',
                item: baseUrl ? `${baseUrl}/products` : '/products',
            },
        ];

        if (product.category) {
            breadcrumbs.push(
                {
                    '@type': 'ListItem',
                    position: 3,
                    name: product.category.name,
                    item: baseUrl
                        ? `${baseUrl}/categories/${product.category.slug}`
                        : `/categories/${product.category.slug}`,
                },
                {
                    '@type': 'ListItem',
                    position: 4,
                    name: product.name,
                    item: itemUrl,
                },
            );
        } else {
            breadcrumbs.push({
                '@type': 'ListItem',
                position: 3,
                name: product.name,
                item: itemUrl,
            });
        }

        return [
            {
                '@context': 'https://schema.org',
                '@type': 'Product',
                name: product.name,
                image: imageUrls,
                description: productDescription,
                sku: `PROD-${product.id}`,
                brand: {
                    '@type': 'Brand',
                    name: 'Lurus Store',
                },
                offers: {
                    '@type': 'Offer',
                    url: itemUrl,
                    priceCurrency: 'IDR',
                    price: effectivePrice,
                    itemCondition: 'https://schema.org/NewCondition',
                    availability:
                        product.stock > 0
                            ? 'https://schema.org/InStock'
                            : 'https://schema.org/OutOfStock',
                    seller: {
                        '@type': 'Organization',
                        name: 'Lurus Store',
                    },
                },
            },
            {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: breadcrumbs,
            },
        ];
    }, [product, baseUrl, effectivePrice, productDescription]);

    return (
        <StorefrontLayout>
            <SeoHead
                title={`${product.name} | Lurus Store`}
                description={productDescription}
                canonical={`/products/${product.slug}`}
                type="product"
                image={primaryImage}
                preloadImage={primaryImage}
                jsonLd={productJsonLd}
            />
            <div className="mx-auto max-w-[var(--container-max)] px-4 py-10 pb-28 md:px-[var(--spacing-margin-desktop)] md:py-16 md:pb-16">
                <nav className="mb-8 text-xs text-secondary">
                    <Link href="/" className="hover:text-warm-brown">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href="/products" className="hover:text-warm-brown">Shop</Link>
                    {product.category && (
                        <>
                            <span className="mx-2">/</span>
                            <Link href={`/categories/${product.category.slug}`} className="hover:text-warm-brown">
                                {product.category.name}
                            </Link>
                        </>
                    )}
                    <span className="mx-2">/</span>
                    <span className="text-on-surface">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
                    <div className="min-w-0">
                        <div className="relative">
                            <div
                                ref={galleryRef}
                                className="flex snap-x snap-mandatory overflow-x-auto md:hidden"
                                onScroll={onGalleryScroll}
                                onTouchStart={() => pauseAndScheduleResume(5000)}
                                onTouchEnd={() => pauseAndScheduleResume(4000)}
                            >
                                {images.map((img, i) => (
                                    <div key={img.id || i} className="aspect-[3/4] w-full shrink-0 snap-center overflow-hidden bg-surface-container">
                                        <img
                                            src={storageUrl(img.image_path)}
                                            alt={`${product.name} - ${i + 1}`}
                                            onError={(e) => {
                                                e.currentTarget.src = '/images/placeholder-product.svg';
                                            }}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>

                            {images.length > 1 && (
                                <div className="pointer-events-none absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 md:hidden">
                                    {images.map((img, i) => (
                                        <span
                                            key={img.id || i}
                                            className={cn(
                                                'h-1.5 rounded-full transition-all duration-300',
                                                activeImage === i ? 'w-5 bg-warm-brown' : 'w-1.5 bg-black/30',
                                            )}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div
                            className="group relative hidden aspect-[3/4] overflow-hidden bg-surface-container md:block"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseMove={(event) => {
                                setIsHovered(true);
                                const rect = event.currentTarget.getBoundingClientRect();
                                const x = ((event.clientX - rect.left) / rect.width) * 100;
                                const y = ((event.clientY - rect.top) / rect.height) * 100;
                                setZoomOrigin(`${x}% ${y}%`);
                                setZoomed(true);
                            }}
                            onMouseLeave={() => {
                                setIsHovered(false);
                                setZoomed(false);
                                pauseAndScheduleResume(3500);
                            }}
                        >
                            {images.map((img, i) => (
                                <img
                                    key={img.id || i}
                                    src={storageUrl(img.image_path)}
                                    alt={`${product.name} - ${i + 1}`}
                                    onError={(e) => {
                                        e.currentTarget.src = '/images/placeholder-product.svg';
                                    }}
                                    className={cn(
                                        'absolute inset-0 h-full w-full cursor-zoom-in object-cover transition-opacity duration-500 ease-in-out',
                                        activeImage === i ? 'opacity-100 z-10' : 'pointer-events-none opacity-0 z-0',
                                    )}
                                    style={{
                                        transformOrigin: zoomOrigin,
                                        transform: zoomed && activeImage === i ? 'scale(1.6)' : 'scale(1)',
                                        transitionProperty: 'opacity, transform',
                                    }}
                                />
                            ))}

                            {images.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            showPreviousImage();
                                        }}
                                        className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-on-surface opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-200 hover:bg-background group-hover:opacity-100"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            showNextImage();
                                        }}
                                        className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-on-surface opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-200 hover:bg-background group-hover:opacity-100"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {images.length > 1 && (
                            <div className="mt-4 flex gap-2 overflow-x-auto">
                                {images.map((img, i) => (
                                    <button
                                        key={img.id || i}
                                        type="button"
                                        onClick={() => handleThumbnailClick(i)}
                                        className={cn(
                                            'h-20 w-16 shrink-0 overflow-hidden border-2 transition-colors',
                                            activeImage === i ? 'border-warm-brown' : 'border-transparent hover:border-outline-variant',
                                        )}
                                    >
                                        <img
                                            src={storageUrl(img.thumb_path ?? img.image_path)}
                                            alt=""
                                            onError={(e) => {
                                                e.currentTarget.src = '/images/placeholder-product.svg';
                                            }}
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="min-w-0">
                        {product.category && (
                            <p className="text-xs tracking-widest text-secondary">{product.category.name.toUpperCase()}</p>
                        )}
                        <h1 className="mt-2 font-serif text-3xl tracking-tight md:text-4xl">{product.name}</h1>

                        <div className="mt-4 flex items-center gap-3">
                            <span className="text-xl">{formatCurrency(effectivePrice)}</span>
                            {hasDiscount && (
                                <>
                                    <span className="text-sm text-secondary line-through">
                                        {formatCurrency(listPrice)}
                                    </span>
                                    <Badge variant="sale">-{Math.round(product.discount_percent!)}%</Badge>
                                </>
                            )}
                        </div>

                        {product.is_preorder && (
                            <div className="mt-5 rounded-xl border border-warm-brown/30 bg-[#faf8f5] p-4 text-stone-800">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center rounded bg-stone-900 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white">
                                        Pre-Order
                                    </span>
                                    <span className="text-xs font-semibold text-warm-brown">
                                        {product.preorder_release_date
                                            ? `Estimasi Pengiriman: Mulai ${product.preorder_release_date}`
                                            : product.preorder_estimate_days
                                              ? `Estimasi Pengiriman: ${product.preorder_estimate_days} hari kerja`
                                              : 'Produk Pre-Order'}
                                    </span>
                                </div>
                                {product.preorder_note && (
                                    <p className="mt-2 text-xs text-stone-600 leading-relaxed">
                                        {product.preorder_note}
                                    </p>
                                )}
                            </div>
                        )}

                        {isSoldOut && (
                            <Badge variant="secondary" className="mt-4">
                                {product.is_preorder ? 'Kuota Pre-Order Penuh' : 'Sold Out'}
                            </Badge>
                        )}

                        {product.description && (
                            <div className="mt-6">
                                <div
                                    className={cn(
                                        'relative',
                                        descOverflows && !descExpanded && 'overflow-hidden',
                                    )}
                                    style={
                                        descOverflows && !descExpanded
                                            ? { maxHeight: DESCRIPTION_COLLAPSED_HEIGHT }
                                            : undefined
                                    }
                                >
                                    <div
                                        ref={descRef}
                                        className="break-words text-sm leading-relaxed text-secondary font-sans space-y-2 [&_img]:h-auto [&_img]:max-w-full [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_b]:font-semibold [&_strong]:font-semibold [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:text-base [&_h2]:font-semibold [&_h3]:text-sm [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_a]:text-warm-brown [&_a]:underline"
                                        dangerouslySetInnerHTML={{ __html: product.description }}
                                    />
                                    {descOverflows && !descExpanded && (
                                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
                                    )}
                                </div>
                                {descOverflows && (
                                    <button
                                        type="button"
                                        onClick={() => setDescExpanded((value) => !value)}
                                        className="mt-2 text-xs font-medium text-warm-brown hover:underline"
                                        aria-expanded={descExpanded}
                                    >
                                        {descExpanded ? 'Tampilkan lebih sedikit' : 'Lihat selengkapnya'}
                                    </button>
                                )}
                            </div>
                        )}

                        {hasOffers && selectedOffer && !pieceMode && (
                            <div className="mt-8">
                                <p className="mb-3 text-sm font-medium">Opsi: {selectedOffer.name}</p>
                                <div className="flex flex-wrap gap-2">
                                    {offers.map((offer) => (
                                        <button
                                            key={offer.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedOfferId(offer.id);
                                                setPieceSizes({});
                                            }}
                                            className={cn(
                                                'border px-4 py-2 text-sm transition-colors',
                                                selectedOffer.id === offer.id
                                                    ? 'border-warm-brown text-warm-brown'
                                                    : 'border-outline-variant hover:border-warm-brown',
                                            )}
                                        >
                                            {offer.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(hasOffers ? offerColors.length > 0 : (product.colors?.length ?? 0) > 0) && (
                            <div className="mt-8">
                                <p className="mb-3 text-sm font-medium">Color: {activeColor}</p>
                                <div className="flex flex-wrap gap-2">
                                    {(hasOffers ? offerColors : product.colors ?? []).map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => handleColorClick(color)}
                                            className={cn(
                                                'border px-4 py-2 text-sm transition-colors',
                                                activeColor === color
                                                    ? 'border-warm-brown text-warm-brown'
                                                    : 'border-outline-variant hover:border-warm-brown',
                                            )}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {pieceMode && selectedOffer && (
                            <div className="mt-6 space-y-5">
                                <div>
                                    <div className="mb-3 flex items-center justify-between">
                                        <p className="text-sm font-medium">
                                            Size{pieceSize ? `: ${pieceSize}` : ''}
                                        </p>
                                        {sizeGuides.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setGuideIndex(0);
                                                    setSizeGuideOpen(true);
                                                }}
                                                className="text-xs text-warm-brown hover:underline"
                                            >
                                                Size Guide
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {pieceSizeOptions.map((size) => (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => {
                                                    const componentId = selectedOffer.components[0]?.id;
                                                    if (!componentId) {
                                                        return;
                                                    }
                                                    setPieceSizes({ [componentId]: size });
                                                }}
                                                className={cn(
                                                    'min-w-12 border px-3 py-2 text-sm transition-colors',
                                                    pieceSize === size
                                                        ? 'border-warm-brown text-warm-brown'
                                                        : 'border-outline-variant hover:border-warm-brown',
                                                )}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="mb-3 text-sm font-medium">Tipe: {selectedOffer.name}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {offers.map((offer) => (
                                            <button
                                                key={offer.id}
                                                type="button"
                                                onClick={() => {
                                                    const componentId = offer.components[0]?.id;
                                                    const sizeStillFits = componentId
                                                        ? product.published_variants.some(
                                                            (variant) => variant.component_id === componentId
                                                                && (!activeColor || variant.color === activeColor)
                                                                && variant.size === pieceSize,
                                                        )
                                                        : false;
                                                    setSelectedOfferId(offer.id);
                                                    setPieceSizes(componentId && pieceSize && sizeStillFits ? { [componentId]: pieceSize } : {});
                                                }}
                                                className={cn(
                                                    'border px-4 py-2 text-sm transition-colors',
                                                    selectedOffer.id === offer.id
                                                        ? 'border-warm-brown text-warm-brown'
                                                        : 'border-outline-variant hover:border-warm-brown',
                                                )}
                                            >
                                                {offer.name}
                                                {offer.price ? ` · ${formatCurrency(offer.price)}` : ''}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {hasOffers && selectedOffer && !pieceMode && (
                            <div className="mt-6 space-y-5">
                                {selectedOffer.components.map((component) => (
                                    <div key={component.id}>
                                        <p className="mb-3 text-sm font-medium">
                                            {component.name}{pieceSizes[component.id] ? `: ${pieceSizes[component.id]}` : ''}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {sizesForPiece(component.id).map((size) => (
                                                <button
                                                    key={size}
                                                    type="button"
                                                    onClick={() => setPieceSizes((current) => ({ ...current, [component.id]: size }))}
                                                    className={cn(
                                                        'min-w-12 border px-3 py-2 text-sm transition-colors',
                                                        pieceSizes[component.id] === size
                                                            ? 'border-warm-brown text-warm-brown'
                                                            : 'border-outline-variant hover:border-warm-brown',
                                                    )}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {sizeGuides.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setGuideIndex(0);
                                            setSizeGuideOpen(true);
                                        }}
                                        className="text-xs text-warm-brown hover:underline"
                                    >
                                        Size Guide
                                    </button>
                                )}
                            </div>
                        )}

                        {!hasOffers && product.sizes && product.sizes.length > 0 && (
                            <div className="mt-6">
                                <div className="mb-3 flex items-center justify-between">
                                    <p className="text-sm font-medium">
                                        Size{selectedSize ? `: ${selectedSize}` : ''}
                                    </p>
                                    {sizeGuides.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setGuideIndex(0);
                                                setSizeGuideOpen(true);
                                            }}
                                            className="text-xs text-warm-brown hover:underline"
                                        >
                                            Size Guide
                                        </button>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => {
                                                setSelectedSize(size);
                                                setData('size', size);
                                            }}
                                            className={cn(
                                                'min-w-12 border px-3 py-2 text-sm transition-colors',
                                                selectedSize === size
                                                    ? 'border-warm-brown text-warm-brown'
                                                    : 'border-outline-variant hover:border-warm-brown',
                                            )}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-8 flex items-center gap-4">
                            <div className="flex items-center border border-outline-variant">
                                <button
                                    type="button"
                                    className="p-3 hover:text-warm-brown disabled:opacity-50"
                                    disabled={data.quantity <= 1}
                                    onClick={() => setData('quantity', data.quantity - 1)}
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="min-w-10 text-center text-sm">{data.quantity}</span>
                                <button
                                    type="button"
                                    className="p-3 hover:text-warm-brown disabled:opacity-50"
                                    disabled={data.quantity >= variantStock || sizeMissing}
                                    onClick={() => setData('quantity', data.quantity + 1)}
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                            {!isSoldOut && !sizeMissing && variantStock > 0 && (
                                <p className="text-xs text-secondary">
                                    {product.is_preorder ? `Sisa Kuota: ${variantStock}` : `${variantStock} in stock`}
                                </p>
                            )}
                        </div>

                        <div className="mt-6 hidden gap-3 md:flex">
                            <Button
                                variant="accent"
                                className="flex-1"
                                disabled={!canAdd || processing}
                                onClick={handleAddToCart}
                            >
                                {processing ? 'Adding...' : addLabel}
                            </Button>
                            {auth.user && (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    disabled={isWishlisted}
                                    onClick={() => router.post('/wishlist', { product_id: product.id })}
                                    aria-label="Add to wishlist"
                                >
                                    <Heart className={cn('h-5 w-5', isWishlisted && 'fill-warm-brown text-warm-brown')} />
                                </Button>
                            )}
                        </div>

                        {product.related_fit && (
                            <p className="mt-6 text-sm">
                                Also available in{' '}
                                <Link
                                    href={`/products/${product.related_fit.slug}`}
                                    className="text-warm-brown hover:underline"
                                >
                                    {product.related_fit.name}
                                </Link>
                            </p>
                        )}

                        {(product.material || product.care_instructions) && (
                            <div className="mt-8 space-y-2 border-t border-outline-variant pt-8 text-sm">
                                {product.material && (
                                    <p><span className="font-medium">Material:</span> {product.material}</p>
                                )}
                                {product.care_instructions && (
                                    <p><span className="font-medium">Care:</span> {product.care_instructions}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {recommendedProducts.length > 0 && (
                    <section className="mt-20 border-t border-outline-variant pt-16">
                        <h2 className="mb-8 font-serif text-2xl tracking-tight">You May Also Like</h2>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
                            {recommendedProducts.map((item) => (
                                <ProductCard key={item.id} product={toCard(item)} />
                            ))}
                        </div>
                    </section>
                )}

                {latestProducts.length > 0 && (
                    <section className="mt-16">
                        <h2 className="mb-8 font-serif text-2xl tracking-tight">Latest Arrivals</h2>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
                            {latestProducts.map((item) => (
                                <ProductCard key={item.id} product={toCard(item)} />
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <div
                className="fixed inset-x-0 z-40 border-t border-outline-variant bg-background/95 px-4 py-3 backdrop-blur-sm md:hidden"
                style={{ bottom: 'calc(3.5rem + env(safe-area-inset-bottom))' }}
            >
                <div className="flex items-center gap-3">
                    <div className="min-w-0">
                        <p className="text-sm font-medium">{formatCurrency(effectivePrice)}</p>
                        <p className="truncate text-[11px] text-secondary">
                            {hasOffers
                                ? [selectedOffer?.name, activeColor, selectedOffer?.components.map((component) => pieceSizes[component.id]).filter(Boolean).join(' · ')].filter(Boolean).join(' / ')
                                : (selectedSize || (needsSize ? 'Choose a size' : selectedColor))}
                        </p>
                    </div>
                    <Button
                        variant="accent"
                        className="ml-auto"
                        disabled={!canAdd || processing}
                        onClick={handleAddToCart}
                    >
                        {processing ? 'Adding...' : addLabel}
                    </Button>
                </div>
            </div>

            {sizeGuideOpen && sizeGuides.length > 0 && (
                <div
                    className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-0 md:items-center md:p-8"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Size guide"
                    onClick={() => setSizeGuideOpen(false)}
                >
                    <div
                        className="max-h-[90vh] w-full overflow-auto bg-background p-4 md:max-w-2xl md:p-6"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="font-serif text-xl">Size Guide</h2>
                            <button type="button" onClick={() => setSizeGuideOpen(false)} aria-label="Close size guide">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="relative overflow-hidden bg-stone-100">
                            <img src={sizeGuides[guideIndex]} alt={`Size guide ${guideIndex + 1}`} className="max-h-[70vh] w-full object-contain" />
                            {sizeGuides.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 shadow-sm"
                                        aria-label="Gambar sebelumnya"
                                        onClick={() => setGuideIndex((index) => (index + sizeGuides.length - 1) % sizeGuides.length)}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 shadow-sm"
                                        aria-label="Gambar berikutnya"
                                        onClick={() => setGuideIndex((index) => (index + 1) % sizeGuides.length)}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                    <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-neutral-950/80 px-2.5 py-1 text-xs text-white">
                                        {guideIndex + 1} / {sizeGuides.length}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </StorefrontLayout>
    );
}
