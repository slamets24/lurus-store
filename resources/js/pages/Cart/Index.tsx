import { Link, router, usePage } from '@inertiajs/react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FreeShippingHint } from '@/components/FreeShippingHint';
import { SeoHead } from '@/components/SeoHead';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { formatCurrency, storageUrl } from '@/lib/utils';
import type { CartItem, CommerceProps } from '@/types';

interface CartIndexProps {
    cartItems: CartItem[];
    subtotal: number;
    discount_amount: number;
    total: number;
}

export default function CartIndex({ cartItems, subtotal, discount_amount, total }: CartIndexProps) {
    const { commerce } = usePage().props as unknown as { commerce: CommerceProps };

    return (
        <StorefrontLayout>
            <SeoHead
                title="Keranjang Belanja | Lurus Store"
                canonical="/cart"
                noindex
            />
            <div className="mx-auto max-w-[var(--container-max)] px-4 py-10 pb-28 md:px-[var(--spacing-margin-desktop)] md:py-16 md:pb-16">
                <h1 className="mb-10 font-serif text-4xl tracking-tight">Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <div className="py-20 text-center">
                        <p className="mb-6 text-secondary">Your cart is empty.</p>
                        <Button variant="accent" asChild>
                            <Link href="/products">Continue Shopping</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-10 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <ul className="divide-y divide-outline-variant border-y border-outline-variant">
                                {cartItems.map((item) => (
                                    <CartLineItem key={item.id} item={item} />
                                ))}
                            </ul>
                            <div className="mt-4 flex justify-end">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-error"
                                    onClick={() => router.delete('/cart')}
                                >
                                    Clear Cart
                                </Button>
                            </div>
                        </div>

                        <div className="h-fit border border-outline-variant p-6">
                            <h2 className="mb-6 font-serif text-xl">Order Summary</h2>
                            <dl className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-secondary">Subtotal</dt>
                                    <dd>{formatCurrency(subtotal)}</dd>
                                </div>
                                {discount_amount > 0 && (
                                    <div className="flex justify-between text-warm-brown">
                                        <dt>Discount</dt>
                                        <dd>-{formatCurrency(discount_amount)}</dd>
                                    </div>
                                )}
                                <div className="flex justify-between border-t border-outline-variant pt-3 text-base font-medium">
                                    <dt>Total</dt>
                                    <dd>{formatCurrency(total)}</dd>
                                </div>
                            </dl>
                            <div className="mt-4">
                                <FreeShippingHint
                                    total={total}
                                    enabled={commerce.freeShippingEnabled}
                                    threshold={commerce.freeShippingThreshold}
                                />
                            </div>
                            <Button variant="accent" className="mt-6 hidden w-full md:inline-flex" asChild>
                                <Link href="/checkout">Proceed to Checkout</Link>
                            </Button>
                            <Button variant="outline" className="mt-3 w-full" asChild>
                                <Link href="/products">Continue Shopping</Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {cartItems.length > 0 && (
                <div
                    className="fixed inset-x-0 z-40 border-t border-outline-variant bg-background/95 px-4 py-3 backdrop-blur-sm md:hidden"
                    style={{ bottom: 'calc(3.5rem + env(safe-area-inset-bottom))' }}
                >
                    <div className="flex items-center gap-3">
                        <div>
                            <p className="text-sm font-medium">{formatCurrency(total)}</p>
                            <FreeShippingHint
                                total={total}
                                enabled={commerce.freeShippingEnabled}
                                threshold={commerce.freeShippingThreshold}
                            />
                        </div>
                        <Button variant="accent" className="ml-auto" asChild>
                            <Link href="/checkout">Checkout</Link>
                        </Button>
                    </div>
                </div>
            )}
        </StorefrontLayout>
    );
}

function CartLineItem({ item }: { item: CartItem }) {
    const image = item.product.images?.[0]?.image_path ?? item.product.image;
    const unitPrice = item.unit_price ?? item.product.price;

    return (
        <li className="flex gap-4 py-6">
            <Link href={`/products/${item.product.slug}`} className="h-28 w-20 shrink-0 overflow-hidden bg-surface-container">
                <img
                    src={storageUrl(image)}
                    alt={item.product.name}
                    onError={(e) => {
                        e.currentTarget.src = '/images/placeholder-product.svg';
                    }}
                    className="h-full w-full object-cover"
                />
            </Link>
            <div className="flex flex-1 flex-col justify-between">
                <div>
                    <Link href={`/products/${item.product.slug}`} className="text-sm font-medium hover:text-warm-brown">
                        {item.product.name}
                    </Link>
                    {(item.size || item.color) && (
                        <p className="mt-1 text-xs text-secondary">
                            {[item.color, item.size].filter(Boolean).join(' / ')}
                        </p>
                    )}
                    <p className="mt-2 text-sm">{formatCurrency(unitPrice)}</p>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center border border-outline-variant">
                        <button
                            type="button"
                            className="p-2 disabled:opacity-50"
                            disabled={item.quantity <= 1}
                            onClick={() => router.patch(`/cart/${item.id}`, { quantity: item.quantity - 1 })}
                        >
                            <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                        <button
                            type="button"
                            className="p-2"
                            onClick={() => router.patch(`/cart/${item.id}`, { quantity: item.quantity + 1 })}
                        >
                            <Plus className="h-3 w-3" />
                        </button>
                    </div>
                    <button
                        type="button"
                        className="p-2 text-secondary hover:text-error"
                        onClick={() => router.delete(`/cart/${item.id}`)}
                        aria-label="Remove item"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </li>
    );
}
