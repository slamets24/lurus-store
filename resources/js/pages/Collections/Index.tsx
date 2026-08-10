import { Link } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { storageUrl } from '@/lib/utils';
import type { Collection } from '@/types';

interface CollectionsIndexProps {
    collections: Collection[];
}

export default function CollectionsIndex({ collections }: CollectionsIndexProps) {
    return (
        <StorefrontLayout>
            <div className="mx-auto max-w-[var(--container-max)] px-4 py-10 md:px-[var(--spacing-margin-desktop)] md:py-16">
                <div className="mb-12 text-center">
                    <p className="text-[11px] tracking-[0.35em] text-secondary uppercase">Collection</p>
                    <h1 className="mt-3 font-serif text-3xl tracking-tight md:text-4xl">Collections</h1>
                    <p className="mx-auto mt-3 max-w-md text-sm text-secondary">
                        Curated edits for every occasion
                    </p>
                </div>

                <div className="grid gap-10 md:grid-cols-2 md:gap-12">
                    {collections.map((collection) => (
                        <Link
                            key={collection.id}
                            href={`/collections/${collection.slug}`}
                            className="group block"
                        >
                            {collection.banner_image ? (
                                <div className="aspect-[16/9] overflow-hidden bg-surface-container">
                                    <img
                                        src={storageUrl(collection.banner_image)}
                                        alt={collection.name}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                            ) : (
                                <div className="aspect-[16/9] bg-surface-container" />
                            )}
                            <div className="mt-5 text-center">
                                {collection.subtitle && (
                                    <p className="text-[11px] tracking-[0.25em] text-secondary uppercase">
                                        {collection.subtitle}
                                    </p>
                                )}
                                <h2 className="mt-2 font-serif text-2xl transition-colors group-hover:text-warm-brown">
                                    {collection.name}
                                </h2>
                                {collection.description && (
                                    <p className="mx-auto mt-2 max-w-sm text-sm text-secondary">
                                        {collection.description}
                                    </p>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </StorefrontLayout>
    );
}
