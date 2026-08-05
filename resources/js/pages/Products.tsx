import { Link } from '@inertiajs/react';
import { Pagination } from '@/components/Pagination';
import { ProductCard } from '@/components/ProductCard';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { cn } from '@/lib/utils';
import type { NavCategory, Paginated, ProductCard as ProductCardType } from '@/types';

interface ProductsProps {
    products: Paginated<ProductCardType & { category?: { name: string; slug: string } | null }>;
    categories: NavCategory[];
}

export default function Products({ products, categories }: ProductsProps) {
    const activeCategory = new URLSearchParams(window.location.search).get('category');

    return (
        <StorefrontLayout>
            <div className="mx-auto max-w-[var(--container-max)] px-4 py-10 md:px-[var(--spacing-margin-desktop)] md:py-16">
                <h1 className="mb-2 font-serif text-4xl tracking-tight">Shop</h1>
                <p className="mb-10 text-sm text-secondary">Discover our modest fashion collection</p>

                <div className="flex flex-col gap-10 lg:flex-row">
                    <aside className="lg:w-56 lg:shrink-0">
                        <h2 className="mb-4 text-xs tracking-widest text-secondary">FILTERS</h2>
                        <div className="space-y-6 border border-outline-variant p-4">
                            <div>
                                <h3 className="mb-3 text-sm font-medium">Category</h3>
                                <ul className="space-y-2 text-sm">
                                    <li>
                                        <Link
                                            href="/products"
                                            className={cn(
                                                'hover:text-warm-brown',
                                                !activeCategory && 'font-medium text-warm-brown',
                                            )}
                                        >
                                            All Products
                                        </Link>
                                    </li>
                                    {categories.map((cat) => (
                                        <li key={cat.slug}>
                                            <Link
                                                href={`/products?category=${cat.slug}`}
                                                className={cn(
                                                    'hover:text-warm-brown',
                                                    activeCategory === cat.slug && 'font-medium text-warm-brown',
                                                )}
                                            >
                                                {cat.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="mb-3 text-sm font-medium">Price</h3>
                                <p className="text-xs text-secondary">Filter coming soon</p>
                            </div>
                            <div>
                                <h3 className="mb-3 text-sm font-medium">Size</h3>
                                <p className="text-xs text-secondary">Filter coming soon</p>
                            </div>
                        </div>
                    </aside>

                    <div className="flex-1">
                        <p className="mb-6 text-sm text-secondary">
                            Showing {products.meta.from ?? 0}–{products.meta.to ?? 0} of {products.meta.total} products
                        </p>

                        {products.data.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
                                    {products.data.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                                <Pagination pagination={products} className="mt-12" />
                            </>
                        ) : (
                            <p className="py-20 text-center text-secondary">No products found.</p>
                        )}
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
