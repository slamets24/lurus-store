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
                <h1 className="mb-2 font-serif text-4xl tracking-tight">Collections</h1>
                <p className="mb-10 text-sm text-secondary">Curated edits for every occasion</p>

                <div className="grid gap-8 md:grid-cols-2">
                    {collections.map((collection) => (
                        <Link
                            key={collection.id}
                            href={`/collections/${collection.slug}`}
                            className="group border border-outline-variant transition-colors hover:border-warm-brown"
                        >
                            {collection.banner_image && (
                                <div className="aspect-[16/9] overflow-hidden bg-surface-container">
                                    <img
                                        src={storageUrl(collection.banner_image)}
                                        alt={collection.name}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                            )}
                            <div className="p-8">
                                {collection.subtitle && (
                                    <p className="text-xs tracking-widest text-secondary">{collection.subtitle.toUpperCase()}</p>
                                )}
                                <h2 className="mt-2 font-serif text-2xl group-hover:text-warm-brown">{collection.name}</h2>
                                {collection.description && (
                                    <p className="mt-3 text-sm text-secondary">{collection.description}</p>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </StorefrontLayout>
    );
}
