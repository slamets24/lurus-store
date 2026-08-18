import { useState } from 'react';
import { Link } from '@inertiajs/react';
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
                <div className="mb-10 text-center">
                    <p className="text-[11px] tracking-[0.35em] text-secondary uppercase">
                        {section.label}
                    </p>

                    {section.categories.length > 0 && (
                        <div
                            className="mt-6 flex flex-nowrap items-center justify-start gap-x-8 gap-y-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:flex-wrap md:justify-center md:overflow-visible [&::-webkit-scrollbar]:hidden"
                            role="tablist"
                        >
                            {section.categories.map((category) => (
                                <button
                                    key={category.slug}
                                    type="button"
                                    role="tab"
                                    aria-selected={activeSlug === category.slug}
                                    onClick={() => setActiveSlug(category.slug)}
                                    className={cn(
                                        'relative pb-2 text-sm tracking-[0.2em] uppercase transition-colors md:text-base',
                                        activeSlug === category.slug
                                            ? 'text-on-surface'
                                            : 'text-secondary hover:text-on-surface',
                                    )}
                                >
                                    {category.name}
                                    <span
                                        aria-hidden
                                        className={cn(
                                            'absolute inset-x-0 bottom-0 h-px bg-on-surface transition-opacity',
                                            activeSlug === category.slug
                                                ? 'opacity-100'
                                                : 'opacity-0',
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                </div>
            </Reveal>

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

            {activeSlug && (
                <div className="mt-10 text-center">
                    <Link
                        href={`/categories/${activeSlug}`}
                        className="inline-block text-[11px] tracking-[0.25em] text-secondary uppercase transition-colors hover:text-on-surface"
                    >
                        View All
                    </Link>
                </div>
            )}
        </section>
    );
}
