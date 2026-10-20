import { Link } from '@inertiajs/react';
import { ChevronDown, ChevronLeft, ChevronRight, Package, RefreshCw, Truck } from 'lucide-react';
import { useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Reveal } from '@/components/Reveal';
import { Button } from '@/components/ui/button';
import { storageUrl } from '@/lib/utils';
import type { ProductCard as ProductCardType } from '@/types';

interface Slide {
    title?: string | null;
    subtitle?: string | null;
    image?: string | null;
    mobileImage?: string | null;
    link?: string | null;
    button?: string | null;
    x?: number;
    y?: number;
}

interface Faq {
    question: string;
    answer: string;
}

interface Tab {
    title?: string | null;
    link?: string | null;
    products: ProductCardType[];
}

interface Tile {
    title?: string | null;
    image?: string | null;
    link?: string | null;
}

export interface PageSection {
    id: number;
    type: string;
    title?: string | null;
    subtitle?: string | null;
    content?: string | null;
    image?: string | null;
    link?: string | null;
    button?: string | null;
    slides?: Slide[];
    products?: ProductCardType[];
    tiles?: Tile[];
    tabs?: Tab[];
    faqs?: Faq[];
}

export function ConfiguredHome({ sections }: { sections: PageSection[] }) {
    const [heroIndex, setHeroIndex] = useState<Record<number, number>>({});
    const [tabIndex, setTabIndex] = useState<Record<number, number>>({});

    return (
        <>
            {sections.map((section, sectionIndex) => {
                if (section.type === 'hero') {
                    const slides = section.slides?.length
                        ? section.slides
                        : [{
                            title: 'Lurus Store',
                            subtitle: section.button,
                            image: section.image,
                            mobileImage: section.image,
                            link: section.link || '/products',
                            button: section.button,
                            x: 50,
                            y: 72,
                        }];
                    const slide = slides[(heroIndex[section.id] ?? 0) % slides.length];
                    const image = slide.image || slide.mobileImage;

                    return (
                        <div key={section.id}>
                            <section className="relative bg-neutral-950 text-white">
                                {image ? (
                                    <picture>
                                        {slide.mobileImage && slide.mobileImage !== slide.image && (
                                            <source media="(max-width: 768px)" srcSet={storageUrl(slide.mobileImage)} />
                                        )}
                                        <img
                                            src={storageUrl(image)}
                                            alt={slide.title || 'Lurus Store'}
                                            className="aspect-[4/5] w-full object-cover sm:aspect-[16/9] md:aspect-[21/9]"
                                            loading={sectionIndex === 0 ? 'eager' : 'lazy'}
                                        />
                                    </picture>
                                ) : (
                                    <img
                                        src="/images/productplaceholder/hero.jpg"
                                        alt="Lurus Store"
                                        className="aspect-[4/5] w-full object-cover sm:aspect-[16/9] md:aspect-[21/9]"
                                    />
                                )}
                                <h1 className="sr-only">{slide.title || 'Lurus Store'}</h1>
                                {slide.button && (
                                    <div
                                        className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                                        style={{ left: `${slide.x ?? 50}%`, top: `${slide.y ?? 50}%` }}
                                    >
                                        <Button variant="accent" asChild>
                                            <Link href={slide.link || '/products'}>{slide.button}</Link>
                                        </Button>
                                    </div>
                                )}
                                {slides.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            className="absolute top-1/2 left-4 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black"
                                            aria-label="Slide sebelumnya"
                                            onClick={() =>
                                                setHeroIndex((current) => ({
                                                    ...current,
                                                    [section.id]: ((current[section.id] ?? 0) - 1 + slides.length) % slides.length,
                                                }))
                                            }
                                        >
                                            <ChevronLeft className="size-4" />
                                        </button>
                                        <button
                                            type="button"
                                            className="absolute top-1/2 right-4 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black"
                                            aria-label="Slide berikutnya"
                                            onClick={() =>
                                                setHeroIndex((current) => ({
                                                    ...current,
                                                    [section.id]: ((current[section.id] ?? 0) + 1) % slides.length,
                                                }))
                                            }
                                        >
                                            <ChevronRight className="size-4" />
                                        </button>
                                    </>
                                )}
                            </section>
                            {sectionIndex === sections.findIndex((item) => item.type === 'hero') && <TrustBar />}
                        </div>
                    );
                }

                if (section.type === 'product_rail') {
                    return (
                        <section key={section.id} className="mx-auto max-w-[var(--container-max)] px-4 py-[var(--spacing-section-gap)] md:px-[var(--spacing-margin-desktop)]">
                            <Reveal>
                                <div className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
                                    <div>
                                        {section.subtitle && (
                                            <p className="text-xs tracking-[0.3em] text-warm-brown uppercase">{section.subtitle}</p>
                                        )}
                                        <h2 className="mt-1 font-serif text-3xl tracking-tight md:text-4xl">{section.title}</h2>
                                    </div>
                                    {section.link && (
                                        <Button variant="outline" asChild>
                                            <Link href={section.link}>{section.button || 'Lihat Semua'}</Link>
                                        </Button>
                                    )}
                                </div>
                            </Reveal>
                            <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 lg:grid-cols-4">
                                {(section.products ?? []).map((product) => (
                                    <div key={product.id} className="w-[42vw] shrink-0 sm:w-48 md:w-auto">
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    );
                }

                if (section.type === 'collection_tabs') {
                    const tabs = section.tabs ?? [];
                    const active = tabs[tabIndex[section.id] ?? 0] ?? tabs[0];

                    return (
                        <section key={section.id} className="mx-auto max-w-[var(--container-max)] px-4 py-[var(--spacing-section-gap)] md:px-[var(--spacing-margin-desktop)]">
                            <div className="mb-8 text-center">
                                <h2 className="font-serif text-3xl tracking-tight md:text-4xl">{section.title}</h2>
                                {tabs.length > 0 && (
                                    <div className="mt-6 flex gap-6 overflow-x-auto md:justify-center" role="tablist">
                                        {tabs.map((tab, index) => (
                                            <button
                                                key={`${tab.title}-${index}`}
                                                type="button"
                                                role="tab"
                                                aria-selected={(tabIndex[section.id] ?? 0) === index}
                                                className={(tabIndex[section.id] ?? 0) === index ? 'text-sm text-on-surface' : 'text-sm text-secondary'}
                                                onClick={() => setTabIndex((current) => ({ ...current, [section.id]: index }))}
                                            >
                                                {tab.title}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                {(active?.products ?? []).map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </section>
                    );
                }

                if (section.type === 'category_tiles') {
                    return (
                        <section key={section.id} className="mx-auto max-w-[var(--container-max)] px-4 pb-[var(--spacing-section-gap)] md:px-[var(--spacing-margin-desktop)]">
                            <div className="mb-8">
                                {section.subtitle && (
                                    <p className="text-xs tracking-[0.3em] text-warm-brown uppercase">{section.subtitle}</p>
                                )}
                                <h2 className="mt-1 font-serif text-3xl tracking-tight md:text-4xl">{section.title}</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
                                {(section.tiles ?? []).map((tile) => (
                                    <Link key={tile.link || tile.title} href={tile.link || '/categories'} className="group relative block aspect-[3/4] overflow-hidden bg-surface-container">
                                        {tile.image ? (
                                            <img src={storageUrl(tile.image)} alt={tile.title || ''} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        ) : (
                                            <div className="flex h-full items-center justify-center font-serif text-3xl text-outline-variant">
                                                {(tile.title || 'K').charAt(0)}
                                            </div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-4 text-white">
                                            <h3 className="font-serif text-lg">{tile.title}</h3>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    );
                }

                if (section.type === 'editorial') {
                    return (
                        <section key={section.id} className="mx-auto grid max-w-[var(--container-max)] items-center gap-8 border-t border-outline-variant px-4 py-[var(--spacing-section-gap)] md:grid-cols-2 md:px-[var(--spacing-margin-desktop)]">
                            {section.image && (
                                <img src={storageUrl(section.image)} alt={section.title || ''} className="aspect-[4/5] w-full object-cover" />
                            )}
                            <div className={section.image ? '' : 'md:col-span-2 text-center'}>
                                {section.subtitle && (
                                    <p className="text-xs tracking-[0.3em] text-warm-brown uppercase">{section.subtitle}</p>
                                )}
                                <h2 className="mt-2 font-serif text-3xl tracking-tight md:text-4xl">{section.title}</h2>
                                {section.content && <p className="mt-3 text-sm leading-relaxed text-secondary">{section.content}</p>}
                                {section.button && section.link && (
                                    <Button variant="accent" className="mt-6" asChild>
                                        <Link href={section.link}>{section.button}</Link>
                                    </Button>
                                )}
                            </div>
                        </section>
                    );
                }

                if (section.type === 'faq') {
                    return (
                        <section key={section.id} className="mx-auto max-w-3xl px-4 py-[var(--spacing-section-gap)]">
                            <div className="text-center">
                                {section.subtitle && (
                                    <p className="text-xs tracking-[0.3em] text-warm-brown uppercase">{section.subtitle}</p>
                                )}
                                <h2 className="mt-2 font-serif text-3xl tracking-tight md:text-4xl">{section.title || 'Pertanyaan Umum'}</h2>
                            </div>
                            <div className="mt-8 space-y-4">
                                {(section.faqs ?? []).map((faq) => (
                                    <details key={faq.question} className="group border border-outline-variant bg-surface-container-lowest p-5 [&_summary::-webkit-details-marker]:hidden">
                                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                                            <h3 className="font-serif text-base font-medium md:text-lg">{faq.question}</h3>
                                            <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
                                        </summary>
                                        <p className="mt-3 border-t border-outline-variant/50 pt-3 text-sm leading-relaxed text-secondary">{faq.answer}</p>
                                    </details>
                                ))}
                            </div>
                        </section>
                    );
                }

                return null;
            })}
        </>
    );
}

function TrustBar() {
    return (
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
    );
}
