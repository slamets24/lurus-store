import { usePage } from '@inertiajs/react';
import { Pagination } from '@/components/Pagination';
import { ProductCard } from '@/components/ProductCard';
import { SeoHead } from '@/components/SeoHead';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { storageUrl } from '@/lib/utils';
import type { Collection, Paginated, ProductCard as ProductCardType } from '@/types';

interface CollectionDetailProps {
    collection: Collection;
    products: Paginated<ProductCardType & { images?: Array<{ image_path: string }> }>;
}

function toCard(product: CollectionDetailProps['products']['data'][0]): ProductCardType {
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

export default function CollectionDetail({ collection, products }: CollectionDetailProps) {
    const { appUrl } = usePage().props as unknown as { appUrl?: string };
    const baseUrl = (appUrl || '').replace(/\/$/, '');

    const description = collection.description
        ? collection.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
        : `Jelajahi koleksi ${collection.name} di Lurus Store. Pilihan modest wear anggun dan modern untuk gaya busana muslimah Anda.`;

    const bannerImage = collection.banner_image ? storageUrl(collection.banner_image) : undefined;

    const collectionJsonLd = {
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
                name: 'Collections',
                item: baseUrl ? `${baseUrl}/collections` : '/collections',
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: collection.name,
                item: baseUrl ? `${baseUrl}/collections/${collection.slug}` : `/collections/${collection.slug}`,
            },
        ],
    };

    return (
        <StorefrontLayout>
            <SeoHead
                title={`${collection.name} | Koleksi Busana Muslimah | Lurus Store`}
                description={description}
                canonical={`/collections/${collection.slug}`}
                image={bannerImage}
                preloadImage={bannerImage}
                jsonLd={collectionJsonLd}
            />
            <div className="mx-auto max-w-[var(--container-max)] px-4 py-10 md:px-[var(--spacing-margin-desktop)] md:py-16">
                {collection.banner_image && (
                    <div className="mb-12 aspect-[21/9] overflow-hidden bg-surface-container">
                        <img
                            src={storageUrl(collection.banner_image)}
                            alt={collection.name}
                            className="h-full w-full object-cover"
                        />
                    </div>
                )}

                <div className="mb-12 text-center">
                    <p className="text-[11px] tracking-[0.35em] text-secondary uppercase">
                        {collection.subtitle || 'Collection'}
                    </p>
                    <h1 className="mt-3 font-serif text-3xl tracking-tight md:text-4xl">
                        {collection.name}
                    </h1>
                    {collection.description && (
                        <p className="mx-auto mt-3 max-w-md text-sm text-secondary">
                            {collection.description}
                        </p>
                    )}
                </div>

                {products.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
                            {products.data.map((product) => (
                                <ProductCard key={product.id} product={toCard(product)} />
                            ))}
                        </div>
                        <Pagination pagination={products} className="mt-12" />
                    </>
                ) : (
                    <p className="py-20 text-center text-secondary">No products in this collection yet.</p>
                )}
            </div>
        </StorefrontLayout>
    );
}
