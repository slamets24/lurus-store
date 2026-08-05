import { Link } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { storageUrl } from '@/lib/utils';
import type { Category } from '@/types';

interface CategoriesIndexProps {
    categories: Category[];
}

export default function CategoriesIndex({ categories }: CategoriesIndexProps) {
    return (
        <StorefrontLayout>
            <div className="mx-auto max-w-[var(--container-max)] px-4 py-10 md:px-[var(--spacing-margin-desktop)] md:py-16">
                <h1 className="mb-2 font-serif text-4xl tracking-tight">Categories</h1>
                <p className="mb-10 text-sm text-secondary">Browse our modest fashion by category</p>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/categories/${category.slug}`}
                            className="group border border-outline-variant transition-colors hover:border-warm-brown"
                        >
                            {category.image && (
                                <div className="aspect-[4/3] overflow-hidden bg-surface-container">
                                    <img
                                        src={storageUrl(category.image)}
                                        alt={category.name}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                            )}
                            <div className="p-6">
                                <h2 className="font-serif text-xl group-hover:text-warm-brown">{category.name}</h2>
                                {category.children && category.children.length > 0 && (
                                    <ul className="mt-3 flex flex-wrap gap-2">
                                        {category.children.map((child) => (
                                            <li key={child.id}>
                                                <span className="text-xs text-secondary">{child.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </StorefrontLayout>
    );
}
