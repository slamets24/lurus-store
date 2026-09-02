import { Link } from '@inertiajs/react';
import { Pagination } from '@/components/Pagination';
import { ProductCard } from '@/components/ProductCard';
import { SeoHead } from '@/components/SeoHead';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { cn } from '@/lib/utils';
import type { NavCategory, Paginated, ProductCard as ProductCardType } from '@/types';

interface ProductsProps {
    products: Paginated<ProductCardType & { category?: { name: string; slug: string } | null }>;
    categories: NavCategory[];
}

export default function Products({ products, categories }: ProductsProps) {
    const activeCategory = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('category')
        : null;
    const currentCategory = categories.find((c) => c.slug === activeCategory);

    const title = currentCategory
        ? `${currentCategory.name} | Koleksi Busana Muslimah | Lurus Store`
        : 'Semua Produk | Koleksi Busana Muslimah & Modest Wear | Lurus Store';

    const description = currentCategory
        ? `Jelajahi koleksi ${currentCategory.name} terbaik di Lurus Store. Pilihan modest wear wanita modern dengan bahan berkualitas tinggi dan desain elegan.`
        : 'Temukan koleksi lengkap busana muslimah Lurus Store: dress, hijab, blouse, rok, dan pakaian modest harian wanita dengan kualitas premium.';

    return (
        <StorefrontLayout>
            <SeoHead
                title={title}
                description={description}
                canonical={activeCategory ? `/products?category=${activeCategory}` : '/products'}
            />
            <div className="mx-auto max-w-[var(--container-max)] px-4 py-10 md:px-[var(--spacing-margin-desktop)] md:py-16">
                <div className="mb-10 text-center">
                    <p className="text-[11px] tracking-[0.35em] text-secondary uppercase">Shop</p>
                    <h1 className="mt-3 font-serif text-3xl tracking-tight md:text-4xl">All Products</h1>
                    <p className="mx-auto mt-3 max-w-md text-sm text-secondary">
                        Discover our modest fashion collection
                    </p>

                    <div
                        className="mt-8 flex flex-nowrap items-center justify-start gap-x-8 gap-y-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:flex-wrap md:justify-center md:overflow-visible [&::-webkit-scrollbar]:hidden"
                        role="tablist"
                    >
                        <Link
                            href="/products"
                            role="tab"
                            aria-selected={!activeCategory}
                            className={cn(
                                'relative pb-2 text-sm tracking-[0.2em] uppercase transition-colors md:text-base',
                                !activeCategory
                                    ? 'text-on-surface'
                                    : 'text-secondary hover:text-on-surface',
                            )}
                        >
                            All
                            <span
                                aria-hidden
                                className={cn(
                                    'absolute inset-x-0 bottom-0 h-px bg-on-surface transition-opacity',
                                    !activeCategory ? 'opacity-100' : 'opacity-0',
                                )}
                            />
                        </Link>
                        {categories.map((cat) => (
                            <Link
                                key={cat.slug}
                                href={`/products?category=${cat.slug}`}
                                role="tab"
                                aria-selected={activeCategory === cat.slug}
                                className={cn(
                                    'relative pb-2 text-sm tracking-[0.2em] uppercase transition-colors md:text-base',
                                    activeCategory === cat.slug
                                        ? 'text-on-surface'
                                        : 'text-secondary hover:text-on-surface',
                                )}
                            >
                                {cat.name}
                                <span
                                    aria-hidden
                                    className={cn(
                                        'absolute inset-x-0 bottom-0 h-px bg-on-surface transition-opacity',
                                        activeCategory === cat.slug ? 'opacity-100' : 'opacity-0',
                                    )}
                                />
                            </Link>
                        ))}
                    </div>

                    <p className="mt-6 text-xs tracking-wide text-secondary">
                        Showing {products.from ?? 0}–{products.to ?? 0} of {products.total}
                    </p>
                </div>

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
        </StorefrontLayout>
    );
}
