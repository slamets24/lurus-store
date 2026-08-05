import { Link, router } from '@inertiajs/react';
import { Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/Pagination';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { formatCurrency, storageUrl } from '@/lib/utils';
import type { Paginated, WishlistItem } from '@/types';

interface WishlistProps {
    wishlistItems: Paginated<WishlistItem>;
}

export default function Wishlist({ wishlistItems }: WishlistProps) {
    return (
        <StorefrontLayout>
            <div className="mx-auto max-w-[var(--container-max)] px-4 py-10 md:px-[var(--spacing-margin-desktop)] md:py-16">
                <h1 className="mb-10 font-serif text-4xl tracking-tight">Wishlist</h1>

                {wishlistItems.data.length === 0 ? (
                    <div className="py-20 text-center">
                        <Heart className="mx-auto mb-4 h-12 w-12 text-outline-variant" />
                        <p className="mb-6 text-secondary">Your wishlist is empty.</p>
                        <Button variant="accent" asChild>
                            <Link href="/products">Browse Products</Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {wishlistItems.data.map((item) => (
                                <div key={item.id} className="group relative border border-outline-variant">
                                    <Link href={`/products/${item.product.slug}`}>
                                        <div className="aspect-[3/4] overflow-hidden bg-surface-container">
                                            <img
                                                src={storageUrl(item.product.images?.[0]?.image_path ?? item.product.image)}
                                                alt={item.product.name}
                                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-sm font-medium group-hover:text-warm-brown">{item.product.name}</h3>
                                            <p className="mt-1 text-sm">{formatCurrency(item.product.price)}</p>
                                        </div>
                                    </Link>
                                    <button
                                        type="button"
                                        className="absolute right-3 top-3 rounded-full bg-background/80 p-2 text-secondary hover:text-error"
                                        onClick={() => router.delete(`/wishlist/${item.id}`)}
                                        aria-label="Remove from wishlist"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <Pagination pagination={wishlistItems} className="mt-10" />
                    </>
                )}
            </div>
        </StorefrontLayout>
    );
}
