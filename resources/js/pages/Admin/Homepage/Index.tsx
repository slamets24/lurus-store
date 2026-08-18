import { Head, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/layouts/AdminLayout';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';

interface HeroBanner {
    id: string;
    desktop_image?: string | null;
    mobile_image?: string | null;
    link?: string | null;
}

interface ProductOption {
    id: number;
    name: string;
    slug: string;
    price: number;
    image?: string | null;
}

interface CategoryOption {
    id: number;
    name: string;
    slug: string;
}

interface HomeSection {
    key: string;
    label: string;
    category_slugs: string[];
}

interface HomepageSettings {
    hero: HeroBanner[];
    announcementBar: {
        enabled: boolean;
        text: string;
        link?: string | null;
    };
    homeSections: HomeSection[];
    featuredProductIds: number[];
    socialLinks: Array<{ name: string; url: string }>;
    whatsappNumber: string;
    promoPopup: {
        enabled: boolean;
        title?: string;
        subtitle?: string;
        cta_text?: string;
        cta_url?: string;
        image?: string | null;
    };
}

interface HomepageIndexProps {
    settings: HomepageSettings;
    products: ProductOption[];
    categories: CategoryOption[];
}

export default function HomepageIndex({ settings, products, categories }: HomepageIndexProps) {
    const [editingHeroId, setEditingHeroId] = useState<string | null>(null);

    const heroForm = useForm({
        section: 'hero',
        hero_action: 'save' as 'save' | 'delete' | 'reorder',
        hero_id: '',
        hero_link: '',
        hero_desktop_image: null as File | null,
        hero_mobile_image: null as File | null,
    });

    const announcementForm = useForm({
        section: 'announcement_bar',
        enabled: settings.announcementBar.enabled,
        text: settings.announcementBar.text,
        link: settings.announcementBar.link ?? '',
    });

    const sectionsForm = useForm({
        section: 'home_sections',
        sections: settings.homeSections.length
            ? settings.homeSections.map((section) => ({
                  key: section.key,
                  label: section.label,
                  category_slugs: [...section.category_slugs],
              }))
            : [{ key: '', label: '', category_slugs: [] as string[] }],
    });

    const featuredForm = useForm({
        section: 'featured_products',
        featured_product_ids: [...settings.featuredProductIds],
    });

    const socialForm = useForm({
        section: 'social_media',
        whatsapp_number: settings.whatsappNumber,
        social_links: settings.socialLinks.length
            ? settings.socialLinks.map((link) => ({ ...link }))
            : [{ name: '', url: '' }],
    });

    const promoForm = useForm({
        section: 'promo_popup',
        enabled: settings.promoPopup.enabled,
        title: settings.promoPopup.title ?? '',
        subtitle: settings.promoPopup.subtitle ?? '',
        cta_text: settings.promoPopup.cta_text ?? '',
        cta_url: settings.promoPopup.cta_url ?? '',
        image: null as File | null,
    });

    const submitHero = (action: 'save' | 'delete', heroId?: string, link?: string) => {
        heroForm.setData({
            section: 'hero',
            hero_action: action,
            hero_id: heroId ?? '',
            hero_link: link ?? heroForm.data.hero_link,
            hero_desktop_image: heroForm.data.hero_desktop_image,
            hero_mobile_image: heroForm.data.hero_mobile_image,
        });
        heroForm.post('/admin/homepage', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setEditingHeroId(null);
                heroForm.reset('hero_desktop_image', 'hero_mobile_image', 'hero_link', 'hero_id');
            },
        });
    };

    const toggleFeatured = (productId: number) => {
        const ids = featuredForm.data.featured_product_ids;
        featuredForm.setData(
            'featured_product_ids',
            ids.includes(productId) ? ids.filter((id) => id !== productId) : [...ids, productId],
        );
    };

    const updateSection = (index: number, patch: Partial<HomeSection>) => {
        const next = sectionsForm.data.sections.map((section, i) =>
            i === index ? { ...section, ...patch } : section,
        );
        sectionsForm.setData('sections', next);
    };

    const toggleSectionCategory = (index: number, slug: string) => {
        const section = sectionsForm.data.sections[index];
        const slugs = section.category_slugs.includes(slug)
            ? section.category_slugs.filter((item) => item !== slug)
            : [...section.category_slugs, slug];
        updateSection(index, { category_slugs: slugs });
    };

    return (
        <AdminLayout title="Homepage">
            <Head title="Homepage" />

            <div className="mx-auto max-w-5xl space-y-8">
                <AdminPageHeader
                    title="Store Content"
                    description="Manage announcement, hero, home sections, featured products, social links, and promo popup."
                    eyebrow="Homepage"
                />

                <form
                    className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 space-y-4"
                    onSubmit={(event) => {
                        event.preventDefault();
                        announcementForm.post('/admin/homepage', { preserveScroll: true });
                    }}
                >
                    <div className="flex items-center justify-between">
                        <h2 className="font-serif text-xl text-primary">Announcement Bar</h2>
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={announcementForm.data.enabled}
                                onChange={(event) => announcementForm.setData('enabled', event.target.checked)}
                            />
                            Enabled
                        </label>
                    </div>
                    <label className="block text-sm">
                        <span className="mb-1 block text-on-surface-variant">Text</span>
                        <Input
                            value={announcementForm.data.text}
                            onChange={(event) => announcementForm.setData('text', event.target.value)}
                        />
                        {announcementForm.errors.text ? (
                            <p className="mt-1 text-xs text-error">{announcementForm.errors.text}</p>
                        ) : null}
                    </label>
                    <label className="block text-sm">
                        <span className="mb-1 block text-on-surface-variant">Link (optional)</span>
                        <Input
                            placeholder="/products or https://..."
                            value={announcementForm.data.link}
                            onChange={(event) => announcementForm.setData('link', event.target.value)}
                        />
                        {announcementForm.errors.link ? (
                            <p className="mt-1 text-xs text-error">{announcementForm.errors.link}</p>
                        ) : null}
                    </label>
                    <Button type="submit" variant="accent" disabled={announcementForm.processing}>
                        Save Announcement Bar
                    </Button>
                </form>

                <section className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="font-serif text-xl text-primary">Hero Banners</h2>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setEditingHeroId('new');
                                heroForm.reset();
                            }}
                        >
                            Add Banner
                        </Button>
                    </div>

                    <div className="mt-4 space-y-4">
                        {settings.hero.map((banner) => (
                            <div key={banner.id} className="rounded-lg border border-outline-variant/20 p-4">
                                <div className="flex flex-wrap gap-4">
                                    {banner.desktop_image ? (
                                        <img
                                            src={`/storage/${banner.desktop_image}`}
                                            alt="Desktop hero"
                                            className="h-20 w-32 rounded-sm object-cover"
                                        />
                                    ) : null}
                                    <div className="flex-1">
                                        <p className="text-sm text-on-surface-variant">
                                            Link: {banner.link || '—'}
                                        </p>
                                        <div className="mt-2 flex gap-2">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    setEditingHeroId(banner.id);
                                                    heroForm.setData({
                                                        ...heroForm.data,
                                                        hero_id: banner.id,
                                                        hero_link: banner.link ?? '',
                                                    });
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => submitHero('delete', banner.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {editingHeroId ? (
                            <form
                                className="rounded-lg border border-warm-brown/30 bg-surface-container/30 p-4 space-y-3"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    submitHero('save', editingHeroId === 'new' ? undefined : editingHeroId);
                                }}
                            >
                                <Input
                                    placeholder="Banner link (optional)"
                                    value={heroForm.data.hero_link}
                                    onChange={(event) => heroForm.setData('hero_link', event.target.value)}
                                />
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <label className="text-sm">
                                        <span className="mb-1 block text-on-surface-variant">Desktop image (1920×800)</span>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(event) =>
                                                heroForm.setData('hero_desktop_image', event.target.files?.[0] ?? null)
                                            }
                                        />
                                    </label>
                                    <label className="text-sm">
                                        <span className="mb-1 block text-on-surface-variant">Mobile image (1619×971)</span>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(event) =>
                                                heroForm.setData('hero_mobile_image', event.target.files?.[0] ?? null)
                                            }
                                        />
                                    </label>
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" variant="accent" disabled={heroForm.processing}>
                                        Save Banner
                                    </Button>
                                    <Button type="button" variant="ghost" onClick={() => setEditingHeroId(null)}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        ) : null}
                    </div>
                </section>

                <form
                    className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 space-y-4"
                    onSubmit={(event) => {
                        event.preventDefault();
                        sectionsForm.post('/admin/homepage', { preserveScroll: true });
                    }}
                >
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="font-serif text-xl text-primary">Home Sections</h2>
                            <p className="mt-1 text-sm text-on-surface-variant">
                                Category rails shown on the homepage (label + categories).
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                sectionsForm.setData('sections', [
                                    ...sectionsForm.data.sections,
                                    { key: '', label: '', category_slugs: [] },
                                ])
                            }
                        >
                            <Plus className="mr-1 h-4 w-4" />
                            Add Section
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {sectionsForm.data.sections.map((section, index) => (
                            <div key={index} className="rounded-lg border border-outline-variant/20 p-4 space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="grid flex-1 gap-3 sm:grid-cols-2">
                                        <label className="text-sm">
                                            <span className="mb-1 block text-on-surface-variant">Label</span>
                                            <Input
                                                value={section.label}
                                                onChange={(event) => updateSection(index, { label: event.target.value })}
                                            />
                                            {sectionsForm.errors[`sections.${index}.label`] ? (
                                                <p className="mt-1 text-xs text-error">
                                                    {sectionsForm.errors[`sections.${index}.label`]}
                                                </p>
                                            ) : null}
                                        </label>
                                        <label className="text-sm">
                                            <span className="mb-1 block text-on-surface-variant">Key (optional)</span>
                                            <Input
                                                placeholder="auto from label"
                                                value={section.key}
                                                onChange={(event) => updateSection(index, { key: event.target.value })}
                                            />
                                        </label>
                                    </div>
                                    {sectionsForm.data.sections.length > 1 ? (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                sectionsForm.setData(
                                                    'sections',
                                                    sectionsForm.data.sections.filter((_, i) => i !== index),
                                                )
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    ) : null}
                                </div>

                                <div>
                                    <p className="mb-2 text-sm text-on-surface-variant">Categories</p>
                                    {categories.length === 0 ? (
                                        <p className="text-sm text-on-surface-variant">No active categories yet.</p>
                                    ) : (
                                        <div className="grid gap-2 sm:grid-cols-2">
                                            {categories.map((category) => {
                                                const selected = section.category_slugs.includes(category.slug);
                                                return (
                                                    <label
                                                        key={category.id}
                                                        className={cn(
                                                            'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm',
                                                            selected
                                                                ? 'border-warm-brown bg-warm-brown/5'
                                                                : 'border-outline-variant/20',
                                                        )}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selected}
                                                            onChange={() => toggleSectionCategory(index, category.slug)}
                                                        />
                                                        {category.name}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}
                                    {sectionsForm.errors[`sections.${index}.category_slugs`] ? (
                                        <p className="mt-1 text-xs text-error">
                                            {sectionsForm.errors[`sections.${index}.category_slugs`]}
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>

                    {sectionsForm.errors.sections ? (
                        <p className="text-xs text-error">{sectionsForm.errors.sections}</p>
                    ) : null}

                    <Button type="submit" variant="accent" disabled={sectionsForm.processing}>
                        Save Home Sections
                    </Button>
                </form>

                <form
                    className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6"
                    onSubmit={(event) => {
                        event.preventDefault();
                        featuredForm.post('/admin/homepage', { preserveScroll: true });
                    }}
                >
                    <h2 className="font-serif text-xl text-primary">Featured Products</h2>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {products.map((product) => {
                            const selected = featuredForm.data.featured_product_ids.includes(product.id);
                            return (
                                <label
                                    key={product.id}
                                    className={cn(
                                        'flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors',
                                        selected ? 'border-warm-brown bg-warm-brown/5' : 'border-outline-variant/20',
                                    )}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selected}
                                        onChange={() => toggleFeatured(product.id)}
                                    />
                                    <div>
                                        <p className="text-sm font-medium">{product.name}</p>
                                        <p className="text-xs text-on-surface-variant">{formatPrice(product.price)}</p>
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                    <Button type="submit" variant="accent" className="mt-4" disabled={featuredForm.processing}>
                        Save Featured Products
                    </Button>
                </form>

                <form
                    className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 space-y-4"
                    onSubmit={(event) => {
                        event.preventDefault();
                        socialForm.post('/admin/homepage', { preserveScroll: true });
                    }}
                >
                    <h2 className="font-serif text-xl text-primary">Social & WhatsApp</h2>
                    <label className="block text-sm">
                        <span className="mb-1 block text-on-surface-variant">WhatsApp Number</span>
                        <Input
                            value={socialForm.data.whatsapp_number}
                            onChange={(event) => socialForm.setData('whatsapp_number', event.target.value)}
                        />
                    </label>
                    {socialForm.data.social_links.map((link, index) => (
                        <div key={index} className="grid gap-2 sm:grid-cols-2">
                            <Input
                                placeholder="Platform name"
                                value={link.name}
                                onChange={(event) => {
                                    const links = [...socialForm.data.social_links];
                                    links[index] = { ...links[index], name: event.target.value };
                                    socialForm.setData('social_links', links);
                                }}
                            />
                            <Input
                                placeholder="URL"
                                value={link.url}
                                onChange={(event) => {
                                    const links = [...socialForm.data.social_links];
                                    links[index] = { ...links[index], url: event.target.value };
                                    socialForm.setData('social_links', links);
                                }}
                            />
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            socialForm.setData('social_links', [...socialForm.data.social_links, { name: '', url: '' }])
                        }
                    >
                        Add Link
                    </Button>
                    <Button type="submit" variant="accent" disabled={socialForm.processing}>
                        Save Social Links
                    </Button>
                </form>

                <form
                    className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 space-y-4"
                    onSubmit={(event) => {
                        event.preventDefault();
                        promoForm.post('/admin/homepage', { forceFormData: true, preserveScroll: true });
                    }}
                >
                    <div className="flex items-center justify-between">
                        <h2 className="font-serif text-xl text-primary">Promo Popup</h2>
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={promoForm.data.enabled}
                                onChange={(event) => promoForm.setData('enabled', event.target.checked)}
                            />
                            Enabled
                        </label>
                    </div>
                    <Input
                        placeholder="Title"
                        value={promoForm.data.title}
                        onChange={(event) => promoForm.setData('title', event.target.value)}
                    />
                    <Input
                        placeholder="Subtitle"
                        value={promoForm.data.subtitle}
                        onChange={(event) => promoForm.setData('subtitle', event.target.value)}
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                        <Input
                            placeholder="CTA text"
                            value={promoForm.data.cta_text}
                            onChange={(event) => promoForm.setData('cta_text', event.target.value)}
                        />
                        <Input
                            placeholder="CTA URL"
                            value={promoForm.data.cta_url}
                            onChange={(event) => promoForm.setData('cta_url', event.target.value)}
                        />
                    </div>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(event) => promoForm.setData('image', event.target.files?.[0] ?? null)}
                    />
                    <Button type="submit" variant="accent" disabled={promoForm.processing}>
                        Save Promo Popup
                    </Button>
                </form>
            </div>
        </AdminLayout>
    );
}
