import { usePage } from '@inertiajs/react';
import { Pagination } from '@/components/Pagination';
import { ProductCard } from '@/components/ProductCard';
import { SeoHead } from '@/components/SeoHead';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { storageUrl } from '@/lib/utils';
import type { Category, Paginated, ProductCard as ProductCardType } from '@/types';

interface CategoryDetailProps {
    category: Category;
    products: Paginated<ProductCardType & { images?: Array<{ image_path: string; thumb_path?: string | null }> }>;
}

function toCard(product: CategoryDetailProps['products']['data'][0]): ProductCardType {
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

export default function CategoryDetail({ category, products }: CategoryDetailProps) {
    const { appUrl } = usePage().props as unknown as { appUrl?: string };
    const baseUrl = (appUrl || '').replace(/\/$/, '');

    const description = category.description
        ? category.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
        : `Koleksi ${category.name} terbaik di Lurus Store. Busana muslimah elegan dengan pilihan material premium dan potongan yang nyaman.`;

    const categoryImage = category.image ? storageUrl(category.image) : undefined;

    const categoryJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: baseUrl || '/',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Categories',
                item: baseUrl ? `${baseUrl}/categories` : '/categories',
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: category.name,
                item: baseUrl ? `${baseUrl}/categories/${category.slug}` : `/categories/${category.slug}`,
            },
        ],
    };

    return (
        <StorefrontLayout>
            <SeoHead
                title={`${category.name} | Koleksi Busana Muslimah | Lurus Store`}
                description={description}
                canonical={`/categories/${category.slug}`}
                image={categoryImage}
                preloadImage={categoryImage}
                jsonLd={categoryJsonLd}
            />
            <div className="mx-auto max-w-[var(--container-max)] px-4 py-10 md:px-[var(--spacing-margin-desktop)] md:py-16">
                {category.image && (
                    <div className="mb-10 aspect-[21/9] overflow-hidden bg-surface-container">
                        <img
                            src={storageUrl(category.image)}
                            alt={category.name}
                            onError={(e) => {
                                e.currentTarget.src = '/images/placeholder-product.svg';
                            }}
                            className="h-full w-full object-cover"
                        />
                    </div>
                )}
                <h1 className="mb-2 font-serif text-4xl tracking-tight">{category.name}</h1>
                {category.description && (
                    <p className="mb-10 max-w-2xl text-sm leading-relaxed text-secondary">{category.description}</p>
                )}

                {products.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
                            {products.data.map((product, index) => (
                                <ProductCard key={product.id} product={toCard(product)} priority={index < 4} />
                            ))}
                        </div>
                        <Pagination pagination={products} className="mt-12" />
                    </>
                ) : (
                    <p className="py-20 text-center text-secondary">No products in this category yet.</p>
                )}
            </div>
        </StorefrontLayout>
    );
}
