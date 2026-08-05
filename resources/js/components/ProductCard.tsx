import { Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { cn, formatCurrency, storageUrl } from '@/lib/utils';
import type { ProductCard as ProductCardType } from '@/types';

interface ProductCardProps {
    product: ProductCardType;
    className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
    const hasDiscount = (product.discount_percent ?? 0) > 0;
    const isSoldOut = product.stock !== undefined && product.stock <= 0;
    const displayPrice = product.effective_price ?? product.price;

    return (
        <Link
            href={`/products/${product.slug}`}
            className={cn('group flex flex-col', className)}
        >
            <div className="relative mb-3 aspect-[3/4] overflow-hidden bg-surface-container">
                <img
                    src={storageUrl(product.image)}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
                {hasDiscount && (
                    <Badge variant="sale" className="absolute left-2 top-2">
                        -{Math.round(product.discount_percent!)}%
                    </Badge>
                )}
                {isSoldOut && (
                    <Badge variant="secondary" className="absolute right-2 top-2 bg-on-surface/80 text-white">
                        Sold Out
                    </Badge>
                )}
            </div>
            <h3 className="text-sm font-medium leading-snug text-on-surface group-hover:text-warm-brown">
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
