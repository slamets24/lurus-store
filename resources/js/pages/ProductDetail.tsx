import { Link, router, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Heart, Minus, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { cn, formatCurrency, storageUrl } from '@/lib/utils';
import type { AuthProps, ProductCard as ProductCardType, ProductDetailData } from '@/types';

interface ProductDetailProps {
    product: ProductDetailData;
    recommendedProducts: Array<ProductCardType & { images?: Array<{ image_path: string }> }>;
    latestProducts: Array<ProductCardType & { images?: Array<{ image_path: string }> }>;
}

function toCard(product: ProductCardType & { images?: Array<{ image_path: string }> }): ProductCardType {
    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        discount_percent: product.discount_percent,
        effective_price: product.effective_price,
        image: product.image ?? product.images?.[0]?.image_path,
        stock: product.stock,
    };
}

export default function ProductDetail({ product, recommendedProducts, latestProducts }: ProductDetailProps) {
    const { wishlistMap, auth } = usePage().props as unknown as { wishlistMap: Record<number, number>; auth: AuthProps };
    const [activeImage, setActiveImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] ?? '');
    const [selectedColor, setSelectedColor] = useState(product.colors?.[0] ?? '');

    const hasDiscount = (product.discount_percent ?? 0) > 0;
    const effectivePrice = hasDiscount
        ? product.price * (1 - (product.discount_percent ?? 0) / 100)
        : product.price;

    const variantStock = useMemo(() => {
        if (product.published_variants.length === 0) return product.stock;
        const match = product.published_variants.find(
            (v) =>
                (!selectedColor || v.color === selectedColor) &&
                (!selectedSize || v.size === selectedSize),
        );
        return match?.stock ?? 0;
    }, [product, selectedColor, selectedSize]);

    const isSoldOut = variantStock <= 0;
    const isWishlisted = Boolean(wishlistMap[product.id]);

    const { data, setData, post, processing } = useForm({
        product_id: product.id,
        quantity: 1,
        size: selectedSize || null,
        color: selectedColor || null,
    });

    const handleAddToCart = () => {
        post('/cart', {
            preserveScroll: true,
            onBefore: () => {
                setData({ ...data, size: selectedSize || null, color: selectedColor || null });
            },
        });
    };

    const images = product.images.length > 0 ? product.images : [{ id: 0, image_path: '', thumb_path: null }];

    return (
        <StorefrontLayout>
            <div className="mx-auto max-w-[var(--container-max)] px-4 py-10 md:px-[var(--spacing-margin-desktop)] md:py-16">
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

                <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
                    <div>
                        <div className="aspect-[3/4] overflow-hidden bg-surface-container">
                            <img
                                src={storageUrl(images[activeImage]?.image_path)}
                                alt={product.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        {images.length > 1 && (
                            <div className="mt-4 flex gap-2 overflow-x-auto">
                                {images.map((img, i) => (
                                    <button
                                        key={img.id}
                                        type="button"
                                        onClick={() => setActiveImage(i)}
                                        className={cn(
                                            'h-20 w-16 shrink-0 overflow-hidden border-2',
                                            activeImage === i ? 'border-warm-brown' : 'border-transparent',
                                        )}
                                    >
                                        <img
                                            src={storageUrl(img.thumb_path ?? img.image_path)}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        {product.category && (
                            <p className="text-xs tracking-widest text-secondary">{product.category.name.toUpperCase()}</p>
                        )}
                        <h1 className="mt-2 font-serif text-3xl tracking-tight md:text-4xl">{product.name}</h1>

                        <div className="mt-4 flex items-center gap-3">
                            <span className="text-xl">{formatCurrency(effectivePrice)}</span>
                            {hasDiscount && (
                                <>
                                    <span className="text-sm text-secondary line-through">
                                        {formatCurrency(product.price)}
                                    </span>
                                    <Badge variant="sale">-{Math.round(product.discount_percent!)}%</Badge>
                                </>
                            )}
                        </div>

                        {isSoldOut && (
                            <Badge variant="secondary" className="mt-4">Sold Out</Badge>
                        )}

                        {product.description && (
                            <p className="mt-6 text-sm leading-relaxed text-secondary">{product.description}</p>
                        )}

                        {product.colors && product.colors.length > 0 && (
                            <div className="mt-8">
                                <p className="mb-3 text-sm font-medium">Color: {selectedColor}</p>
                                <div className="flex flex-wrap gap-2">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setSelectedColor(color)}
                                            className={cn(
                                                'border px-4 py-2 text-sm transition-colors',
                                                selectedColor === color
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

                        {product.sizes && product.sizes.length > 0 && (
                            <div className="mt-6">
                                <div className="mb-3 flex items-center justify-between">
                                    <p className="text-sm font-medium">Size: {selectedSize}</p>
                                    {product.size_chart_url && (
                                        <a
                                            href={product.size_chart_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-warm-brown hover:underline"
                                        >
                                            Size Guide
                                        </a>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => setSelectedSize(size)}
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
                                    disabled={data.quantity >= variantStock}
                                    onClick={() => setData('quantity', data.quantity + 1)}
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                            {!isSoldOut && variantStock > 0 && (
                                <p className="text-xs text-secondary">{variantStock} in stock</p>
                            )}
                        </div>

                        <div className="mt-6 flex gap-3">
                            <Button
                                variant="accent"
                                className="flex-1"
                                disabled={isSoldOut || processing}
                                onClick={handleAddToCart}
                            >
                                {isSoldOut ? 'Sold Out' : 'Add to Cart'}
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
                            {recommendedProducts.map((p) => (
                                <ProductCard key={p.id} product={toCard(p)} />
                            ))}
                        </div>
                    </section>
                )}

                {latestProducts.length > 0 && (
                    <section className="mt-16">
                        <h2 className="mb-8 font-serif text-2xl tracking-tight">Latest Arrivals</h2>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
                            {latestProducts.map((p) => (
                                <ProductCard key={p.id} product={toCard(p)} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </StorefrontLayout>
    );
}
