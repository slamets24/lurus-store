import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { HomeSection } from '@/components/HomeSection';
import { ProductCard } from '@/components/ProductCard';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { cn, storageUrl } from '@/lib/utils';
import type {
    AnnouncementBar,
    Category,
    FeaturedCollectionCard,
    HeroBanner,
    HomeSection as HomeSectionType,
    ProductCard as ProductCardType,
    Testimonial,
} from '@/types';

interface HomeProps {
    categories: Category[];
    announcementBar: AnnouncementBar;
    homeSections: HomeSectionType[];
    heroBanners: HeroBanner[];
    featuredProducts: ProductCardType[];
    featuredCollectionCards: FeaturedCollectionCard[];
    testimonials: Testimonial[];
}

export default function Home({
    categories,
    announcementBar,
    homeSections,
    heroBanners,
    featuredProducts,
    featuredCollectionCards,
    testimonials,
}: HomeProps) {
    const hero = heroBanners[0];

    return (
        <StorefrontLayout announcementBar={announcementBar}>
            {hero && (
                <section className="relative">
                    <Link href={hero.link ?? '/products'} className="block">
                        <picture>
                            {hero.mobileImage && (
                                <source media="(max-width: 768px)" srcSet={hero.mobileImage} />
                            )}
                            <img
                                src={hero.desktopImage ?? hero.mobileImage ?? ''}
                                alt={hero.title ?? 'Hero banner'}
                                className="aspect-[16/9] w-full object-cover md:aspect-[21/9]"
                            />
                        </picture>
                        {(hero.title || hero.subtitle) && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <div className="text-center text-white">
                                    {hero.title && (
                                        <h1 className="font-serif text-4xl tracking-wide md:text-6xl">{hero.title}</h1>
                                    )}
                                    {hero.subtitle && (
                                        <p className="mt-2 text-sm tracking-widest md:text-base">{hero.subtitle}</p>
                                    )}
                                    {hero.ctaLabel && (
                                        <Button variant="accent" className="mt-6" asChild>
                                            <span>{hero.ctaLabel}</span>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </Link>
                </section>
            )}

            <div className="mx-auto max-w-[var(--container-max)] px-4 md:px-[var(--spacing-margin-desktop)]">
                {featuredProducts.length > 0 && (
                    <section className="py-[var(--spacing-section-gap)]">
                        <div className="mb-8 flex items-end justify-between">
                            <h2 className="font-serif text-3xl tracking-tight md:text-4xl">Latest Release</h2>
                            <Button variant="outline" asChild>
                                <Link href="/products">View All</Link>
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </section>
                )}

                {homeSections.map((section) => (
                    <HomeSection key={section.key} section={section} />
                ))}

                {featuredCollectionCards.length > 0 && (
                    <section className="pb-[var(--spacing-section-gap)]">
                        <h2 className="mb-8 font-serif text-3xl tracking-tight md:text-4xl">Curated Collections</h2>
                        <div className="grid gap-6 md:grid-cols-3">
                            {featuredCollectionCards.map((card) => (
                                <Link
                                    key={card.slug}
                                    href={`/collections/${card.slug}`}
                                    className="group relative aspect-[4/5] overflow-hidden"
                                >
                                    <img
                                        src={storageUrl(card.product.image)}
                                        alt={card.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-0 p-6 text-white">
                                        <h3 className="font-serif text-2xl">{card.title}</h3>
                                        <p className="mt-1 text-sm opacity-90">{card.subtitle}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {categories.length > 0 && (
                    <section className="pb-[var(--spacing-section-gap)]">
                        <h2 className="mb-8 font-serif text-3xl tracking-tight md:text-4xl">Shop by Category</h2>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/categories/${category.slug}`}
                                    className="group border border-outline-variant p-6 text-center transition-colors hover:border-warm-brown"
                                >
                                    {category.image && (
                                        <img
                                            src={storageUrl(category.image)}
                                            alt={category.name}
                                            className="mx-auto mb-4 aspect-square w-24 object-cover"
                                        />
                                    )}
                                    <h3 className="font-serif text-lg group-hover:text-warm-brown">{category.name}</h3>
                                    {category.products_count !== undefined && (
                                        <p className="mt-1 text-xs text-secondary">{category.products_count} products</p>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {testimonials.length > 0 && (
                    <section className="border-t border-outline-variant py-[var(--spacing-section-gap)]">
                        <h2 className="mb-8 text-center font-serif text-3xl tracking-tight md:text-4xl">
                            What Our Customers Say
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {testimonials.map((t) => (
                                <blockquote
                                    key={t.id}
                                    className="border border-outline-variant bg-surface-container-lowest p-6"
                                >
                                    <div className="mb-3 flex gap-0.5 text-warm-brown">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <span key={i} className={cn(i < t.rating ? 'opacity-100' : 'opacity-25')}>
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-sm leading-relaxed text-on-surface">&ldquo;{t.comment}&rdquo;</p>
                                    <footer className="mt-4 text-xs text-secondary">
                                        — {t.name}
                                        {t.product_name && <span className="block">{t.product_name}</span>}
                                    </footer>
                                </blockquote>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </StorefrontLayout>
    );
}
