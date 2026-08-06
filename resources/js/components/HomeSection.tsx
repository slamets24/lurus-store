import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { Reveal } from '@/components/Reveal';
import { cn } from '@/lib/utils';
import type { HomeSection as HomeSectionType } from '@/types';

interface HomeSectionProps {
    section: HomeSectionType;
}

export function HomeSection({ section }: HomeSectionProps) {
    const [activeSlug, setActiveSlug] = useState(section.categories[0]?.slug ?? '');
    const products =
        section.productsByCategory?.[activeSlug] ??
        (activeSlug === section.categories[0]?.slug ? section.products : []);

    return (
        <section className="py-[var(--spacing-section-gap)]">
            <Reveal>
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <h2 className="font-serif text-3xl tracking-tight text-on-surface md:text-4xl">
                        {section.label}
                    </h2>
                    {activeSlug && (
                        <Button variant="outline" asChild className="self-start md:self-auto">
                            <Link href={`/categories/${activeSlug}`}>View All</Link>
                        </Button>
                    )}
                </div>
            </Reveal>

            {section.categories.length > 0 && (
                <div className="mb-8 flex flex-wrap gap-2 border-b border-outline-variant" role="tablist">
                    {section.categories.map((category) => (
                        <button
                            key={category.slug}
                            type="button"
                            role="tab"
                            aria-selected={activeSlug === category.slug}
                            onClick={() => setActiveSlug(category.slug)}
                            className={cn(
                                'border-b-2 px-4 py-2 text-sm transition-colors hover:text-warm-brown',
                                activeSlug === category.slug
                                    ? 'border-warm-brown text-warm-brown'
                                    : 'border-transparent text-secondary',
                            )}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
                {products.length > 0 ? (
                    products.map((product, index) => (
                        <Reveal key={`${activeSlug}-${product.id}`} delayMs={Math.min(index, 3) * 60}>
                            <ProductCard product={product} />
                        </Reveal>
                    ))
                ) : (
                    <p className="col-span-full py-12 text-center text-secondary">
                        No products in this category yet.
                    </p>
                )}
            </div>
        </section>
    );
}
