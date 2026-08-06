import { Link, router, usePage } from '@inertiajs/react';
import type { MouseEvent } from 'react';
import { Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn, formatCurrency, storageUrl } from '@/lib/utils';
import type { AuthProps, ProductCard as ProductCardType } from '@/types';

interface ProductCardProps {
    product: ProductCardType;
    className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
    const { auth, wishlistMap } = usePage().props as unknown as {
        auth: AuthProps;
        wishlistMap?: Record<number, number>;
    };

    const hasDiscount = (product.discount_percent ?? 0) > 0;
    const isSoldOut = product.stock !== undefined && product.stock <= 0;
    const displayPrice = product.effective_price ?? product.price;
    const isWishlisted = Boolean(wishlistMap?.[product.id]);
    const hoverImage = product.hover_image;

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
                    src={storageUrl(product.image)}
                    alt={product.name}
                    className={cn(
                        'h-full w-full object-cover transition-opacity duration-500',
                        hoverImage && 'group-hover:opacity-0',
                        !hoverImage && 'transition-transform duration-500 group-hover:scale-105',
                    )}
                    loading="lazy"
                />
                {hoverImage && (
                    <img
                        src={storageUrl(hoverImage)}
                        alt=""
                        aria-hidden
                        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        loading="lazy"
                    />
                )}

                <div className="absolute left-2 top-2 flex flex-col gap-1">
                    {product.is_new && !isSoldOut && (
                        <Badge className="bg-warm-brown text-white">New</Badge>
                    )}
                    {hasDiscount && (
                        <Badge variant="sale">-{Math.round(product.discount_percent!)}%</Badge>
                    )}
                </div>

                {isSoldOut && (
                    <Badge variant="secondary" className="absolute right-2 top-2 bg-on-surface/80 text-white">
                        Sold Out
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
