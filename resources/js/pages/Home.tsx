import { Link } from '@inertiajs/react';
import { Package, RefreshCw, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HomeSection } from '@/components/HomeSection';
import { ProductCard } from '@/components/ProductCard';
import { Reveal } from '@/components/Reveal';
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
            {hero ? (
                <section className="relative">
                    <Link href={hero.link ?? '/products'} className="block">
                        <picture>
                            {hero.mobileImage && (
                                <source media="(max-width: 768px)" srcSet={hero.mobileImage} />
                            )}
                            <img
                                src={hero.desktopImage ?? hero.mobileImage ?? ''}
                                alt={hero.title ?? 'Hero banner'}
                                className="aspect-[4/5] w-full object-cover sm:aspect-[16/9] md:aspect-[21/9]"
                            />
                        </picture>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent" />
                        <div className="absolute inset-0 flex items-end justify-start p-6 md:items-center md:justify-center md:p-12">
                            <div className="max-w-xl text-left text-white md:text-center">
                                <p className="text-xs tracking-[0.35em] uppercase opacity-90">Lurus</p>
                                {hero.title && (
                                    <h1 className="mt-3 font-serif text-4xl tracking-wide md:text-6xl">
                                        {hero.title}
                                    </h1>
                                )}
                                {hero.subtitle && (
                                    <p className="mt-3 max-w-md text-sm tracking-wide opacity-90 md:mx-auto md:text-base">
                                        {hero.subtitle}
                                    </p>
                                )}
                                {hero.ctaLabel && (
                                    <Button variant="accent" className="mt-6" asChild>
                                        <span>{hero.ctaLabel}</span>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Link>
                </section>
            ) : (
                <section className="relative overflow-hidden bg-surface-container">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#e8e0d4_0%,_transparent_55%)]" />
                    <div className="relative mx-auto flex min-h-[70vh] max-w-[var(--container-max)] flex-col justify-end px-4 py-16 md:min-h-[60vh] md:justify-center md:px-[var(--spacing-margin-desktop)] md:py-24">
                        <p className="text-xs tracking-[0.35em] text-warm-brown uppercase">Modest Fashion</p>
                        <h1 className="mt-4 max-w-2xl font-serif text-5xl tracking-tight text-on-surface md:text-7xl">
                            Lurus
                        </h1>
                        <p className="mt-4 max-w-md text-sm leading-relaxed text-secondary md:text-base">
                            Refined silhouettes for everyday elegance — intentional modest wear, made to move with you.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Button variant="accent" asChild>
                                <Link href="/products">Shop Now</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/collections/new-collection">New Arrivals</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            )}

            <div className="border-y border-outline-variant bg-surface-container-low">
                <div className="mx-auto grid max-w-[var(--container-max)] gap-6 px-4 py-8 sm:grid-cols-3 md:px-[var(--spacing-margin-desktop)]">
                    {[
                        { icon: Truck, title: 'Island-wide Delivery', copy: 'Tracked shipping across Indonesia' },
                        { icon: RefreshCw, title: 'Easy Returns', copy: 'Hassle-free within 7 days' },
                        { icon: Package, title: 'Thoughtful Quality', copy: 'Fabrics chosen for daily wear' },
                    ].map(({ icon: Icon, title, copy }) => (
                        <div key={title} className="flex items-start gap-3">
                            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-warm-brown" aria-hidden />
                            <div>
                                <p className="text-sm font-medium text-on-surface">{title}</p>
                                <p className="mt-0.5 text-xs text-secondary">{copy}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mx-auto max-w-[var(--container-max)] px-4 md:px-[var(--spacing-margin-desktop)]">
                {featuredProducts.length > 0 && (
                    <section className="py-[var(--spacing-section-gap)]">
                        <Reveal>
                            <div className="mb-8 flex items-end justify-between">
                                <h2 className="font-serif text-3xl tracking-tight md:text-4xl">Latest Release</h2>
                                <Button variant="outline" asChild>
                                    <Link href="/products">View All</Link>
                                </Button>
                            </div>
                        </Reveal>
                        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 lg:grid-cols-4">
                            {featuredProducts.map((product, index) => (
                                <Reveal
                                    key={product.id}
                                    className="w-[42vw] shrink-0 sm:w-48 md:w-auto"
                                    delayMs={Math.min(index, 3) * 60}
                                >
                                    <ProductCard product={product} />
                                </Reveal>
                            ))}
                        </div>
                    </section>
                )}

                {homeSections.map((section) => (
                    <HomeSection key={section.key} section={section} />
                ))}

                {featuredCollectionCards.length > 0 && (
                    <section className="pb-[var(--spacing-section-gap)]">
                        <Reveal>
                            <h2 className="mb-8 font-serif text-3xl tracking-tight md:text-4xl">
                                Curated Collections
                            </h2>
                        </Reveal>
                        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
                            {featuredCollectionCards.map((card, index) => (
                                <Reveal key={card.slug} delayMs={index * 80}>
                                    <Link
                                        href={`/collections/${card.slug}`}
                                        className="group relative block aspect-[4/5] overflow-hidden"
                                    >
                                        <img
                                            src={storageUrl(card.product.image)}
                                            alt={card.title}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                                        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                                            <h3 className="font-serif text-2xl">{card.title}</h3>
                                            <p className="mt-1 text-sm opacity-90">{card.subtitle}</p>
                                            <span className="mt-4 inline-block text-xs tracking-[0.2em] uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                Explore →
                                            </span>
                                        </div>
                                    </Link>
                                </Reveal>
                            ))}
                        </div>
                    </section>
                )}

                {categories.length > 0 && (
                    <section className="pb-[var(--spacing-section-gap)]">
                        <Reveal>
                            <h2 className="mb-8 font-serif text-3xl tracking-tight md:text-4xl">
                                Shop by Category
                            </h2>
                        </Reveal>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
                            {categories.map((category, index) => (
                                <Reveal key={category.id} delayMs={Math.min(index, 5) * 50}>
                                    <Link
                                        href={`/categories/${category.slug}`}
                                        className="group relative block aspect-[3/4] overflow-hidden bg-surface-container"
                                    >
                                        {category.image ? (
                                            <img
                                                src={storageUrl(category.image)}
                                                alt={category.name}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center bg-surface-container-high">
                                                <span className="font-serif text-3xl text-outline-variant">
                                                    {category.name.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                                        <div className="absolute inset-x-0 bottom-0 p-4 text-white md:p-5">
                                            <h3 className="font-serif text-lg md:text-xl">{category.name}</h3>
                                            {category.products_count !== undefined && (
                                                <p className="mt-1 text-xs opacity-80">
                                                    {category.products_count} products
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                </Reveal>
                            ))}
                        </div>
                    </section>
                )}

                {testimonials.length > 0 && (
                    <section className="border-t border-outline-variant py-[var(--spacing-section-gap)]">
                        <Reveal>
                            <h2 className="mb-8 text-center font-serif text-3xl tracking-tight md:text-4xl">
                                What Our Customers Say
                            </h2>
                        </Reveal>
                        <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
                            {testimonials.map((t, index) => (
                                <Reveal key={t.id} delayMs={Math.min(index, 3) * 70}>
                                    <blockquote className="h-full border border-outline-variant bg-surface-container-lowest p-6">
                                        <div className="mb-3 flex gap-0.5 text-warm-brown">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <span
                                                    key={i}
                                                    className={cn(i < t.rating ? 'opacity-100' : 'opacity-25')}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-sm leading-relaxed text-on-surface">
                                            &ldquo;{t.comment}&rdquo;
                                        </p>
                                        <footer className="mt-4 text-xs text-secondary">
                                            — {t.name}
                                            {t.product_name && <span className="block">{t.product_name}</span>}
                                        </footer>
                                    </blockquote>
                                </Reveal>
                            ))}
                        </div>
                    </section>
                )}

                <section className="border-t border-outline-variant py-[var(--spacing-section-gap)] text-center">
                    <Reveal>
                        <p className="text-xs tracking-[0.3em] text-warm-brown uppercase">Start here</p>
                        <h2 className="mt-3 font-serif text-3xl tracking-tight md:text-4xl">
                            Find your next modest essential
                        </h2>
                        <p className="mx-auto mt-3 max-w-md text-sm text-secondary">
                            Browse the full collection — blouses, dresses, scarves, and everyday pieces.
                        </p>
                        <Button variant="accent" className="mt-8" asChild>
                            <Link href="/products">Shop All Products</Link>
                        </Button>
                    </Reveal>
                </section>
            </div>
        </StorefrontLayout>
    );
}
