import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/Pagination';
import { ProductCard } from '@/components/ProductCard';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import type { Paginated, ProductCard as ProductCardType } from '@/types';

interface SearchProps {
    query: string;
    products: Paginated<ProductCardType & { category?: { name: string; slug: string } | null; images?: Array<{ image_path: string }> }>;
}

function toCard(product: SearchProps['products']['data'][0]): ProductCardType {
    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        discount_percent: product.discount_percent,
        effective_price: product.effective_price,
        image: product.image ?? product.images?.[0]?.image_path,
        hover_image: product.hover_image ?? product.images?.[1]?.image_path,
        is_new: product.is_new,
        stock: product.stock,
    };
}

export default function Search({ query, products }: SearchProps) {
    const [searchQuery, setSearchQuery] = useState(query);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/search', { q: searchQuery.trim() }, { preserveState: true });
    };

    return (
        <StorefrontLayout>
            <div className="mx-auto max-w-[var(--container-max)] px-4 py-10 md:px-[var(--spacing-margin-desktop)] md:py-16">
                <h1 className="mb-8 font-serif text-4xl tracking-tight">Search</h1>

                <form onSubmit={handleSearch} className="mb-10 flex max-w-xl gap-2">
                    <Input
                        type="search"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button type="submit" variant="accent">
                        <SearchIcon className="h-4 w-4" />
                    </Button>
                </form>

                {query && (
                    <p className="mb-6 text-sm text-secondary">
                        {products.meta.total} result{products.meta.total !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
                    </p>
                )}

                {products.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
                            {products.data.map((product) => (
                                <ProductCard key={product.id} product={toCard(product)} />
                            ))}
                        </div>
                        <Pagination pagination={products} className="mt-12" />
                    </>
                ) : query ? (
                    <div className="py-20 text-center">
                        <p className="mb-6 text-secondary">No products found for your search.</p>
                        <Button variant="outline" asChild>
                            <Link href="/products">Browse All Products</Link>
                        </Button>
                    </div>
                ) : (
                    <p className="text-secondary">Enter a search term to find products.</p>
                )}
            </div>
        </StorefrontLayout>
    );
}
