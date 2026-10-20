import { Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    ChevronDown,
    Layers,
    Package,
    RefreshCw,
    ShieldCheck,
    Sparkles,
    Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfiguredHome, type PageSection } from '@/components/home/ConfiguredHome';
import { HomeSection } from '@/components/HomeSection';
import { ProductCard } from '@/components/ProductCard';
import { Reveal } from '@/components/Reveal';
import { SeoHead } from '@/components/SeoHead';
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

interface Faq {
    question: string;
    answer: string;
}

interface HomeProps {
    categories: Category[];
    announcementBar: AnnouncementBar;
    homeSections: HomeSectionType[];
    pageSections?: PageSection[];
    homeSeo?: { title?: string; description?: string; keywords?: string };
    heroBanners: HeroBanner[];
    faqs: Faq[];
    featuredProducts: ProductCardType[];
    featuredCollectionCards: FeaturedCollectionCard[];
    testimonials: Testimonial[];
}

export default function Home({
    categories,
    announcementBar,
    homeSections,
    pageSections = [],
    homeSeo,
    heroBanners,
    faqs,
    featuredProducts,
    featuredCollectionCards,
    testimonials,
}: HomeProps) {
    const hero = heroBanners[0];
    const configured = pageSections.length > 0;
    const { appUrl } = usePage().props as unknown as { appUrl?: string };
    const baseUrl = (appUrl || '').replace(/\/$/, '');

    const homeJsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Lurus Store',
            url: baseUrl || undefined,
            description: 'Brand busana muslimah elegan, modest wear, dress, hijab, dan aksesoris wanita muslim di Indonesia.',
            potentialAction: {
                '@type': 'SearchAction',
                target: {
                    '@type': 'EntryPoint',
                    urlTemplate: `${baseUrl}/search?q={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
            },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Lurus Store',
            url: baseUrl || undefined,
            logo: baseUrl ? `${baseUrl}/logo.svg` : undefined,
        },
        {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.answer,
                },
            })),
        },
    ];

    return (
        <StorefrontLayout announcementBar={announcementBar}>
            <SeoHead
                title={homeSeo?.title || 'Lurus Store | Modest Fashion & Muslimah Elegance'}
                description={homeSeo?.description || 'Belanja koleksi busana muslimah elegan, modern, dan nyaman di Lurus Store. Tersedia dress muslim, hijab, blouse, skirt, dan daily wear muslimah berkualitas.'}
                keywords={homeSeo?.keywords || undefined}
                image={hero?.desktopImage ?? hero?.mobileImage ?? undefined}
                preloadImage={hero?.desktopImage ?? hero?.mobileImage ?? undefined}
                preloadImageMobile={hero?.mobileImage ?? undefined}
                canonical="/"
                jsonLd={homeJsonLd}
            />
            {configured ? <ConfiguredHome sections={pageSections} /> : hero ? (
                <section className="relative">
                    <Link href={hero.link ?? '/products'} className="block">
                        <picture>
                            {hero.mobileImage && (
                                <source media="(max-width: 768px)" srcSet={hero.mobileImage} />
                            )}
                            <img
                                src={hero.desktopImage ?? hero.mobileImage ?? ''}
                                alt={hero.title ? `${hero.title} - Lurus Store Modest Fashion` : 'Lurus Store Hero Banner'}
                                className="aspect-[4/5] w-full object-cover sm:aspect-[16/9] md:aspect-[21/9]"
                                loading="eager"
                                fetchPriority="high"
                                decoding="async"
                            />
                        </picture>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute inset-0 flex items-end justify-start p-6 md:items-center md:justify-center md:p-12">
                            <div className="max-w-xl text-left text-white md:text-center">
                                <p className="text-xs font-medium tracking-[0.35em] uppercase opacity-90">
                                    Modest Wear & Elegance
                                </p>
                                <h1 className="mt-3 font-serif text-4xl tracking-wide md:text-6xl">
                                    {hero.title || 'Lurus'}
                                    <span className="sr-only"> — Modest Fashion & Busana Muslimah Elegan</span>
                                </h1>
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
                <section className="relative">
                    <Link href="/products" className="block">
                        <img
                            src="/images/productplaceholder/hero.jpg"
                            alt="Lurus Store - Busana Muslimah Elegan & Modest Wear"
                            className="aspect-[4/5] w-full object-cover sm:aspect-[16/9] md:aspect-[21/9]"
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute inset-0 flex items-end justify-start p-6 md:items-center md:justify-center md:p-12">
                            <div className="max-w-xl text-left text-white md:text-center">
                                <p className="text-xs font-medium tracking-[0.35em] uppercase opacity-90">
                                    Modest Fashion Indonesia
                                </p>
                                <h1 className="mt-3 font-serif text-4xl tracking-wide md:text-6xl">
                                    Lurus
                                    <span className="mt-2 block font-sans text-xs font-normal tracking-[0.25em] uppercase opacity-90 sm:text-sm">
                                        Modest Fashion & Busana Muslimah Elegan
                                    </span>
                                </h1>
                                <p className="mt-3 max-w-md text-sm tracking-wide opacity-90 md:mx-auto md:text-base">
                                    Siluet anggun untuk kenyamanan sehari-hari — busana muslimah elegan yang dirancang
                                    menemani setiap langkah Anda.
                                </p>
                                <Button variant="accent" className="mt-6" asChild>
                                    <span>Shop Now</span>
                                </Button>
                            </div>
                        </div>
                    </Link>
                </section>
            )}

            {!configured && (
            <div className="border-y border-outline-variant bg-surface-container-low">
                <div className="mx-auto grid max-w-[var(--container-max)] gap-6 px-4 py-8 sm:grid-cols-3 md:px-[var(--spacing-margin-desktop)]">
                    {[
                        { icon: Truck, title: 'Island-wide Delivery', copy: 'Pengiriman aman dan terlacak ke seluruh Indonesia' },
                        { icon: RefreshCw, title: 'Easy Returns', copy: 'Garansi penukaran ukuran fleksibel hingga 7 hari' },
                        { icon: Package, title: 'Thoughtful Quality', copy: 'Bahan premium pilihan ramah di kulit muslimah aktif' },
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
            )}

            <div className="mx-auto max-w-[var(--container-max)] px-4 md:px-[var(--spacing-margin-desktop)]">
                {!configured && featuredProducts.length > 0 && (
                    <section className="py-[var(--spacing-section-gap)]">
                        <Reveal>
                            <div className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
                                <div>
                                    <p className="text-xs tracking-[0.3em] text-warm-brown uppercase">
                                        Koleksi Terbaru
                                    </p>
                                    <h2 className="mt-1 font-serif text-3xl tracking-tight md:text-4xl">
                                        Latest Release — Busana Muslimah Pilihan
                                    </h2>
                                </div>
                                <Button variant="outline" asChild>
                                    <Link href="/products">Lihat Semua</Link>
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

                {!configured && homeSections.map((section) => (
                    <HomeSection key={section.key} section={section} />
                ))}

                {featuredCollectionCards.length > 0 && (
                    <section className="pb-[var(--spacing-section-gap)]">
                        <Reveal>
                            <div className="mb-8 text-center md:text-left">
                                <p className="text-xs tracking-[0.3em] text-warm-brown uppercase">
                                    Inspirasi Gaya
                                </p>
                                <h2 className="mt-1 font-serif text-3xl tracking-tight md:text-4xl">
                                    Curated Collections — Pilihan Modest Wear Elegan
                                </h2>
                            </div>
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
                                            alt={`${card.title} - Koleksi Busana Muslimah Lurus Store`}
                                            onError={(e) => {
                                                e.currentTarget.src = '/images/placeholder-product.svg';
                                            }}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                                        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                                            <h3 className="font-serif text-2xl">{card.title}</h3>
                                            <p className="mt-1 text-sm opacity-90">{card.subtitle}</p>
                                            <span className="mt-4 inline-flex items-center gap-1 text-xs tracking-[0.2em] uppercase md:opacity-0 md:transition-opacity md:duration-300 md:group-hover:opacity-100">
                                                Explore <ArrowRight className="h-3.5 w-3.5" />
                                            </span>
                                        </div>
                                    </Link>
                                </Reveal>
                            ))}
                        </div>
                    </section>
                )}

                {!configured && categories.length > 0 && (
                    <section className="pb-[var(--spacing-section-gap)]">
                        <Reveal>
                            <div className="mb-8 flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
                                <div>
                                    <p className="text-xs tracking-[0.3em] text-warm-brown uppercase">
                                        Kategori Produk
                                    </p>
                                    <h2 className="mt-1 font-serif text-3xl tracking-tight md:text-4xl">
                                        Shop by Category — Pilihan Busana Muslimah
                                    </h2>
                                    <p className="mt-2 max-w-xl text-sm text-secondary">
                                        Temukan busana muslimah yang sesuai dengan karakter Anda: blouse santun, dress anggun,
                                        rok, celana modest, outer chic, hingga scarf premium.
                                    </p>
                                </div>
                                <Button variant="outline" asChild className="hidden md:inline-flex">
                                    <Link href="/categories">Semua Kategori</Link>
                                </Button>
                            </div>
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
                                                alt={`Koleksi busana muslimah ${category.name} - Lurus Store`}
                                                onError={(e) => {
                                                    e.currentTarget.src = '/images/placeholder-product.svg';
                                                }}
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
                                                    {category.products_count} produk
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                </Reveal>
                            ))}
                        </div>
                    </section>
                )}

                {!configured && (
                <section className="border-t border-outline-variant py-[var(--spacing-section-gap)]">
                    <Reveal>
                        <div className="text-center">
                            <p className="text-xs tracking-[0.3em] text-warm-brown uppercase">
                                Keanggunan Dalam Kesederhanaan
                            </p>
                            <h2 className="mt-2 font-serif text-3xl tracking-tight md:text-4xl">
                                Lurus Store — Destinasi Modest Fashion & Busana Muslimah Elegan
                            </h2>
                            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-secondary">
                                Hadir untuk melengkapi kebutuhan muslimah modern yang mendambakan penampilan santun,
                                berkelas, dan nyaman dalam balutan busana berkualitas tinggi.
                            </p>
                        </div>
                    </Reveal>
                    <div className="mt-10 grid gap-6 md:grid-cols-3">
                        <Reveal delayMs={50}>
                            <div className="h-full border border-outline-variant bg-surface-container-lowest p-6 transition-all duration-300 hover:border-warm-brown/40">
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-warm-brown/10 text-warm-brown">
                                    <Sparkles className="h-5 w-5" />
                                </div>
                                <h3 className="font-serif text-lg font-medium text-on-surface md:text-xl">
                                    Siluet Timeless & Potongan Santun
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-secondary">
                                    Setiap potong busana dirancang dengan potongan longgar (modest cut) yang anggun tanpa
                                    meninggalkan sentuhan modern, mendukung ruang gerak aktif dan rasa percaya diri Anda.
                                </p>
                            </div>
                        </Reveal>
                        <Reveal delayMs={100}>
                            <div className="h-full border border-outline-variant bg-surface-container-lowest p-6 transition-all duration-300 hover:border-warm-brown/40">
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-warm-brown/10 text-warm-brown">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <h3 className="font-serif text-lg font-medium text-on-surface md:text-xl">
                                    Material Pilihan & Breathable
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-secondary">
                                    Menggunakan kain berkualitas tinggi seperti katun alami, serat linen, rayon premium,
                                    dan silk blend yang lembut, tidak menerawang, serta sejuk untuk iklim tropis Indonesia.
                                </p>
                            </div>
                        </Reveal>
                        <Reveal delayMs={150}>
                            <div className="h-full border border-outline-variant bg-surface-container-lowest p-6 transition-all duration-300 hover:border-warm-brown/40">
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-warm-brown/10 text-warm-brown">
                                    <Layers className="h-5 w-5" />
                                </div>
                                <h3 className="font-serif text-lg font-medium text-on-surface md:text-xl">
                                    Koleksi Serbaguna (Versatile Styling)
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-secondary">
                                    Mudah dipadupadankan untuk berbagai kesempatan: mulai dari gaya kasual harian, busana kantor
                                    formal, hingga momen kebersamaan keluarga dan perayaan istimewa.
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </section>
                )}

                {!configured && (
                <section className="border-t border-outline-variant py-[var(--spacing-section-gap)]">
                    <Reveal>
                        <div className="text-center">
                            <p className="text-xs tracking-[0.3em] text-warm-brown uppercase">
                                Pertanyaan Umum
                            </p>
                            <h2 className="mt-2 font-serif text-3xl tracking-tight md:text-4xl">
                                Frequently Asked Questions (FAQ) — Panduan Belanja
                            </h2>
                            <p className="mx-auto mt-3 max-w-xl text-sm text-secondary">
                                Jawaban seputar pemilihan bahan, panduan ukuran, pengiriman, dan layanan pelanggan Lurus Store.
                            </p>
                        </div>
                    </Reveal>

                    <div className="mx-auto mt-8 max-w-3xl space-y-4">
                        {faqs.map((faq, index) => (
                            <Reveal key={faq.question} delayMs={index * 50}>
                                <details className="group border border-outline-variant bg-surface-container-lowest p-5 transition-all hover:border-warm-brown/30 [&_summary::-webkit-details-marker]:hidden">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                                        <h3 className="font-serif text-base font-medium text-on-surface md:text-lg">
                                            {faq.question}
                                        </h3>
                                        <ChevronDown className="h-4 w-4 shrink-0 text-secondary transition-transform duration-300 group-open:rotate-180" />
                                    </summary>
                                    <p className="mt-3 border-t border-outline-variant/50 pt-3 text-sm leading-relaxed text-secondary">
                                        {faq.answer}
                                    </p>
                                </details>
                            </Reveal>
                        ))}
                    </div>
                </section>
                )}

                {testimonials.length > 0 && (
                    <section className="border-t border-outline-variant py-[var(--spacing-section-gap)]">
                        <Reveal>
                            <div className="mb-8 text-center">
                                <p className="text-xs tracking-[0.3em] text-warm-brown uppercase">
                                    Kata Mereka
                                </p>
                                <h2 className="mt-1 font-serif text-3xl tracking-tight md:text-4xl">
                                    What Our Customers Say — Ulasan Pelanggan
                                </h2>
                            </div>
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
                        <p className="text-xs tracking-[0.3em] text-warm-brown uppercase">Mulai Eksplorasi</p>
                        <h2 className="mt-3 font-serif text-3xl tracking-tight md:text-4xl">
                            Find Your Next Modest Essential — Belanja Busana Muslimah
                        </h2>
                        <p className="mx-auto mt-3 max-w-md text-sm text-secondary">
                            Jelajahi seluruh koleksi pilihan kami: blouse elegan, dress modern, skirt, dan busana modest
                            sehari-hari yang memadukan kesantunan dan keanggunan.
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
