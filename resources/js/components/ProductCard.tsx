import { Link, router, usePage } from '@inertiajs/react';
import type { MouseEvent } from 'react';
import { Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn, formatCurrency, storageUrl } from '@/lib/utils';
import type { AuthProps, ProductCard as ProductCardType } from '@/types';

/**
 * Every card sits in a 2 / 3 / 4-column grid, so its rendered width tracks the
 * viewport rather than a fixed pixel size.
 */
const CARD_SIZES = '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw';

/**
 * Intrinsic widths of the two stored variants for a 3:4 portrait shot — thumbs
 * are capped at a 400px edge (WebpImage::THUMB_EDGE) and originals at 2000px
 * (WebpImage::MAX_EDGE). Under-claiming is safe: the browser then errs toward
 * the sharper file rather than upscaling a small one.
 */
const THUMB_WIDTH = 300;
const FULL_WIDTH = 1500;

function buildSrcSet(thumbPath?: string | null, fullPath?: string | null): string | undefined {
    if (!thumbPath || !fullPath) {
        return undefined;
    }

    const thumb = storageUrl(thumbPath);
    const full = storageUrl(fullPath);

    // thumbUrl() falls back to the original when no thumb could be generated.
    return thumb === full ? undefined : `${thumb} ${THUMB_WIDTH}w, ${full} ${FULL_WIDTH}w`;
}

interface ProductCardProps {
    product: ProductCardType & {
        images?: Array<{ image_path?: string; thumb_path?: string | null }>;
    };
    className?: string;
    /**
     * Set on cards above the fold. Lazy-loading the LCP candidate delays it by a
     * full network round trip, so the first row of a grid must opt out.
     */
    priority?: boolean;
}

export function ProductCard({ product, className, priority = false }: ProductCardProps) {
    const { auth, wishlistMap } = usePage().props as unknown as {
        auth: AuthProps;
        wishlistMap?: Record<number, number>;
    };

    const hasDiscount = (product.discount_percent ?? 0) > 0;
    const isSoldOut = product.stock !== undefined && product.stock <= 0;
    const displayPrice = product.effective_price ?? product.price;
    const isWishlisted = Boolean(wishlistMap?.[product.id]);
    const mainImage = product.image ?? product.images?.[0]?.image_path;
    const hoverImage = product.hover_image ?? product.images?.[1]?.image_path;
    const mainSrcSet = buildSrcSet(product.images?.[0]?.thumb_path, mainImage);
    const hoverSrcSet = buildSrcSet(product.images?.[1]?.thumb_path, hoverImage);

    const toggleWishlist = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!auth.user) {
            router.visit('/login');
            return;
        }

        if (isWishlisted && wishlistMap?.[product.id]) {
            router.delete(`/wishlist/${wishlistMap[product.id]}`, { preserveScroll: true });
            return;
        }

        router.post('/wishlist', { product_id: product.id }, { preserveScroll: true });
    };

    return (
        <Link href={`/products/${product.slug}`} className={cn('group flex flex-col', className)}>
            <div className="relative mb-3 aspect-[3/4] overflow-hidden bg-surface-container">
                <img
                    src={storageUrl(mainImage)}
                    srcSet={mainSrcSet}
                    sizes={mainSrcSet ? CARD_SIZES : undefined}
                    alt={product.name}
                    width={600}
                    height={800}
                    onError={(e) => {
                        e.currentTarget.srcset = '';
                        e.currentTarget.src = '/images/placeholder-product.svg';
                    }}
                    className={cn(
                        'h-full w-full object-cover transition-opacity duration-500',
                        hoverImage && 'group-hover:opacity-0',
                        !hoverImage && 'transition-transform duration-500 group-hover:scale-105',
                    )}
                    loading={priority ? 'eager' : 'lazy'}
                    fetchPriority={priority ? 'high' : 'auto'}
                    decoding="async"
                />
                {hoverImage && (
                    <img
                        src={storageUrl(hoverImage)}
                        srcSet={hoverSrcSet}
                        sizes={hoverSrcSet ? CARD_SIZES : undefined}
                        alt=""
                        aria-hidden
                        width={600}
                        height={800}
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        loading="lazy"
                        decoding="async"
                    />
                )}

                <div className="absolute left-2 top-2 flex flex-col gap-1">
                    {product.is_preorder && (
                        <Badge className="bg-stone-900 text-white font-semibold text-[10px] tracking-wider uppercase shadow-sm">
                            Pre-Order
                        </Badge>
                    )}
                    {product.is_new && !isSoldOut && !product.is_preorder && (
                        <Badge className="bg-warm-brown text-white">New</Badge>
                    )}
                    {hasDiscount && (
                        <Badge variant="sale">-{Math.round(product.discount_percent!)}%</Badge>
                    )}
                </div>

                {isSoldOut && (
                    <Badge variant="secondary" className="absolute right-2 top-2 bg-on-surface/80 text-white">
                        {product.is_preorder ? 'PO Penuh' : 'Sold Out'}
                    </Badge>
                )}

                <button
                    type="button"
                    onClick={toggleWishlist}
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    className={cn(
                        'absolute right-2 top-2 flex h-9 w-9 items-center justify-center bg-background/90 text-on-surface shadow-sm transition-all duration-300',
                        'opacity-100 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100',
                        isSoldOut && 'top-10',
                        isWishlisted && 'text-warm-brown',
                    )}
                >
                    <Heart className={cn('h-4 w-4', isWishlisted && 'fill-warm-brown')} />
                </button>
            </div>
            <h3 className="text-sm font-medium leading-snug text-on-surface transition-colors group-hover:text-warm-brown">
                {product.name}
            </h3>
            <div className="mt-1 flex items-center gap-2">
                <span className="text-sm text-on-surface">{formatCurrency(displayPrice)}</span>
                {hasDiscount && (
                    <span className="text-xs text-secondary line-through">{formatCurrency(product.price)}</span>
                )}
            </div>
        </Link>
    );
}
