import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { FormEvent, useMemo, useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/layouts/AdminLayout';
import { storageUrl } from '@/lib/utils';
import type { AuthProps } from '@/types';

type Faq = { question: string; answer: string };
type SectionItem = {
    id: number;
    item_type: string;
    product_id: number | null;
    category_id: number | null;
    title: string | null;
    subtitle: string | null;
    image_path: string | null;
    link_url: string | null;
    sort_order: number;
    is_active: boolean;
    config_json: {
        source?: string;
        limit?: number;
        product_ids?: number[];
        align?: string;
        x?: number;
        y?: number;
        mobile_image?: string;
    } | null;
};
type Section = {
    id: number;
    type: string;
    title: string | null;
    subtitle: string | null;
    content: string | null;
    image_path: string | null;
    link_url: string | null;
    button_label: string | null;
    sort_order: number;
    is_active: boolean;
    config_json: { messages?: string[]; source?: string; limit?: number; items?: Faq[] } | null;
    items: SectionItem[];
};

interface HomepageIndexProps {
    types: Record<string, string>;
    sections: Section[];
    products: { id: number; name: string; slug: string; categorySlug: string | null }[];
    categories: { id: number; name: string; slug: string }[];
    homeSeo: { title: string; description: string; keywords: string };
    settings: {
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
    };
}

const storePages = [
    { href: '/contact', label: 'Kontak' },
    { href: '/collections', label: 'Koleksi' },
    { href: '/categories', label: 'Semua kategori' },
];

const alignPoint: Record<string, { x: number; y: number }> = {
    center: { x: 50, y: 50 },
    top: { x: 50, y: 16 },
    bottom: { x: 50, y: 84 },
    left: { x: 16, y: 50 },
    right: { x: 84, y: 50 },
    'bottom-left': { x: 16, y: 84 },
    'bottom-right': { x: 84, y: 84 },
};

function productPath(product: { slug: string }) {
    return `/products/${product.slug}`;
}

function itemTypeFor(type: string) {
    if (type === 'hero') return 'slide';
    if (type === 'category_tiles') return 'tile';
    if (type === 'collection_tabs') return 'tab';
    return 'product';
}

function acceptsItems(type: string) {
    return ['hero', 'category_tiles', 'collection_tabs', 'product_rail'].includes(type);
}

function fileError(file: File) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        return 'Gunakan foto JPG, PNG, atau WebP.';
    }
    if (file.size > 8 * 1024 * 1024) {
        return 'Foto maksimal 8 MB.';
    }
    return '';
}

export default function HomepageIndex({ types, sections, products, categories, homeSeo, settings }: HomepageIndexProps) {
    const isSuperAdmin = usePage<{ auth: AuthProps }>().props.auth?.isSuperAdmin ?? false;
    const [editing, setEditing] = useState<number | null>(null);
    const [creating, setCreating] = useState(false);
    const [itemSectionId, setItemSectionId] = useState<number | null>(null);
    const [editingItem, setEditingItem] = useState<number | null>(null);
    const [sectionPreview, setSectionPreview] = useState<string | null>(null);
    const [itemPreview, setItemPreview] = useState<string | null>(null);
    const [mobilePreview, setMobilePreview] = useState<string | null>(null);
    const [sectionFileError, setSectionFileError] = useState('');
    const [itemFileError, setItemFileError] = useState('');
    const [mobileFileError, setMobileFileError] = useState('');
    const [positionView, setPositionView] = useState<'desktop' | 'mobile'>('desktop');
    const [linkKind, setLinkKind] = useState<'catalog' | 'category' | 'product' | 'page' | 'custom'>('catalog');
    const [linkTarget, setLinkTarget] = useState('');

    const form = useForm({
        type: 'editorial',
        title: '',
        subtitle: '',
        content: '',
        image_path: '',
        image: null as File | null,
        link_url: '/products',
        button_label: 'Belanja sekarang',
        sort_order: sections.length * 10,
        is_active: true,
        messages: '',
        source: 'latest',
        limit: 8,
        faqs: [{ question: '', answer: '' }] as Faq[],
    });

    form.transform((data) => (data.image instanceof File ? data : { ...data, image: undefined }));

    const itemForm = useForm({
        item_type: 'slide',
        product_id: '' as number | '',
        category_id: '' as number | '',
        title: '',
        subtitle: '',
        image_path: '',
        image: null as File | null,
        mobile_image_path: '',
        mobile_image: null as File | null,
        link_url: '/products',
        sort_order: 0,
        is_active: true,
        source: 'latest',
        limit: 8,
        product_ids: [] as number[],
        x: 50,
        y: 50,
    });

    itemForm.transform((data) => ({
        ...data,
        image: data.image instanceof File ? data.image : undefined,
        mobile_image: data.mobile_image instanceof File ? data.mobile_image : undefined,
    }));

    const seoForm = useForm({
        title: homeSeo.title,
        description: homeSeo.description,
        keywords: homeSeo.keywords,
    });

    const socialForm = useForm({
        section: 'social_media',
        whatsapp_number: settings.whatsappNumber,
        social_links: settings.socialLinks.length ? settings.socialLinks.map((link) => ({ ...link })) : [{ name: '', url: '' }],
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

    const visible = useMemo(() => {
        const type = form.data.type;
        return {
            subtitle: ['product_rail', 'editorial'].includes(type),
            content: type === 'editorial',
            image: type === 'editorial',
            link: ['hero', 'product_rail', 'editorial'].includes(type),
            button: ['product_rail', 'editorial'].includes(type),
            messages: type === 'announcement',
            rail: type === 'product_rail',
            faqs: type === 'faq',
        };
    }, [form.data.type]);

    const titleLabel = form.data.type === 'hero' ? 'Nama di admin' : form.data.type === 'announcement' ? 'Nama pengumuman' : 'Judul yang pembeli lihat';

    const clearPreview = (target: 'section' | 'item') => {
        if (target === 'section' && sectionPreview) {
            URL.revokeObjectURL(sectionPreview);
            setSectionPreview(null);
        }
        if (target === 'item') {
            if (itemPreview) URL.revokeObjectURL(itemPreview);
            if (mobilePreview) URL.revokeObjectURL(mobilePreview);
            setItemPreview(null);
            setMobilePreview(null);
        }
    };

    const onFile = (target: 'section' | 'item' | 'mobile', file: File | null) => {
        const notice = target === 'section' ? setSectionFileError : target === 'mobile' ? setMobileFileError : setItemFileError;
        if (!file) {
            notice('');
            return;
        }
        const message = fileError(file);
        if (message) {
            notice(message);
            return;
        }
        notice('');
        if (target === 'mobile') {
            itemForm.clearErrors('mobile_image');
            if (mobilePreview) URL.revokeObjectURL(mobilePreview);
            itemForm.setData('mobile_image', file);
            setMobilePreview(URL.createObjectURL(file));
            return;
        }
        clearPreview(target);
        if (target === 'section') {
            form.clearErrors('image');
            form.setData('image', file);
            setSectionPreview(URL.createObjectURL(file));
        } else {
            itemForm.clearErrors('image');
            itemForm.setData('image', file);
            setItemPreview(URL.createObjectURL(file));
        }
    };

    const resetSection = () => {
        setEditing(null);
        setCreating(false);
        clearPreview('section');
        form.reset();
        form.setData('image', null);
        form.setData('type', 'editorial');
        form.setData('faqs', [{ question: '', answer: '' }]);
    };

    const edit = (section: Section) => {
        setCreating(false);
        clearPreview('section');
        setEditing(section.id);
        form.setData({
            type: section.type,
            title: section.title ?? '',
            subtitle: section.subtitle ?? '',
            content: section.content ?? '',
            image_path: section.image_path ?? '',
            image: null,
            link_url: section.link_url ?? '',
            button_label: section.button_label ?? '',
            sort_order: section.sort_order,
            is_active: section.is_active,
            messages: (section.config_json?.messages ?? []).join('\n'),
            source: section.config_json?.source ?? 'latest',
            limit: section.config_json?.limit ?? 8,
            faqs: section.config_json?.items?.length ? section.config_json.items.map((faq) => ({ ...faq })) : [{ question: '', answer: '' }],
        });
        setItemSectionId(null);
        setEditingItem(null);
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        const options = { forceFormData: true, preserveScroll: true, onSuccess: () => resetSection() };
        if (editing) {
            form.put(`/admin/homepage/sections/${editing}`, options);
        } else {
            form.post('/admin/homepage/sections', options);
        }
    };

    const readLink = (url: string) => {
        const value = url.trim();
        if (value === '' || value === '/products') {
            setLinkKind('catalog');
            setLinkTarget('');
            return;
        }
        const category = categories.find((item) => value === `/categories/${item.slug}`);
        if (category) {
            setLinkKind('category');
            setLinkTarget(String(category.id));
            return;
        }
        const product = products.find((item) => value === productPath(item));
        if (product) {
            setLinkKind('product');
            setLinkTarget(String(product.id));
            return;
        }
        const page = storePages.find((item) => item.href === value);
        if (page) {
            setLinkKind('page');
            setLinkTarget(page.href);
            return;
        }
        setLinkKind('custom');
        setLinkTarget('');
    };

    const applyLink = (kind = linkKind, target = linkTarget) => {
        if (kind === 'custom') return;
        if (kind === 'catalog') {
            itemForm.setData('link_url', '/products');
            return;
        }
        if (kind === 'category') {
            const category = categories.find((item) => String(item.id) === target);
            itemForm.setData('link_url', category ? `/categories/${category.slug}` : '');
            return;
        }
        if (kind === 'product') {
            const product = products.find((item) => String(item.id) === target);
            itemForm.setData('link_url', product ? productPath(product) : '');
            return;
        }
        itemForm.setData('link_url', target);
    };

    const editItem = (item: SectionItem) => {
        clearPreview('item');
        setPositionView('desktop');
        setEditingItem(item.id);
        const point = item.config_json && Number.isFinite(Number(item.config_json.x)) && Number.isFinite(Number(item.config_json.y))
            ? { x: Number(item.config_json.x), y: Number(item.config_json.y) }
            : alignPoint[item.config_json?.align || 'center'] ?? { x: 50, y: 50 };
        itemForm.setData({
            item_type: item.item_type,
            product_id: item.product_id ?? '',
            category_id: item.category_id ?? '',
            title: item.title ?? '',
            subtitle: item.subtitle ?? '',
            image_path: item.image_path ?? '',
            image: null,
            mobile_image_path: item.config_json?.mobile_image ?? '',
            mobile_image: null,
            link_url: item.link_url ?? '',
            sort_order: item.sort_order,
            is_active: item.is_active,
            source: item.config_json?.source ?? 'latest',
            limit: item.config_json?.limit ?? 8,
            product_ids: item.config_json?.product_ids ?? [],
            x: point.x,
            y: point.y,
        });
        readLink(item.link_url ?? '');
    };

    const submitItem = (event: FormEvent, section: Section) => {
        event.preventDefault();
        const type = itemTypeFor(section.type);
        itemForm.transform((data) => ({
            ...data,
            item_type: type,
            image: data.image instanceof File ? data.image : undefined,
            mobile_image: data.mobile_image instanceof File ? data.mobile_image : undefined,
        }));
        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setEditingItem(null);
                clearPreview('item');
                itemForm.reset();
                setLinkKind('catalog');
                setLinkTarget('');
                setPositionView('desktop');
                setItemSectionId(null);
            },
        };
        if (editingItem) {
            itemForm.put(`/admin/homepage/items/${editingItem}`, options);
        } else {
            itemForm.post(`/admin/homepage/sections/${section.id}/items`, options);
        }
    };

    const positionImage = positionView === 'mobile'
        ? mobilePreview || (itemForm.data.mobile_image_path ? storageUrl(itemForm.data.mobile_image_path) : '') || itemPreview || (itemForm.data.image_path ? storageUrl(itemForm.data.image_path) : '')
        : itemPreview || (itemForm.data.image_path ? storageUrl(itemForm.data.image_path) : '') || mobilePreview || (itemForm.data.mobile_image_path ? storageUrl(itemForm.data.mobile_image_path) : '');

    const sectionFields = (mode: 'create' | 'edit') => (
        <>
            <label className="flex flex-col gap-2 md:col-span-2 text-sm">
                Jenis
                <select className="h-10 rounded-md border bg-white px-3" value={form.data.type} onChange={(event) => form.setData('type', event.target.value)}>
                    {Object.entries(types).map(([type, label]) => (
                        <option key={type} value={type}>{label}</option>
                    ))}
                </select>
            </label>
            <label className="flex flex-col gap-2 text-sm">
                {titleLabel}
                <Input value={form.data.title} onChange={(event) => form.setData('title', event.target.value)} />
            </label>
            {visible.subtitle && (
                <label className="flex flex-col gap-2 text-sm">
                    Subjudul
                    <Input value={form.data.subtitle} onChange={(event) => form.setData('subtitle', event.target.value)} />
                </label>
            )}
            {visible.content && (
                <label className="flex flex-col gap-2 text-sm md:col-span-2">
                    Teks
                    <textarea className="min-h-24 rounded-md border bg-white px-3 py-2" value={form.data.content} onChange={(event) => form.setData('content', event.target.value)} />
                </label>
            )}
            {visible.image && (
                <label className="flex flex-col gap-2 text-sm">
                    Foto
                    {(sectionPreview || form.data.image_path) && (
                        <img src={sectionPreview || storageUrl(form.data.image_path)} alt="" className="h-28 w-full rounded-2xl object-cover" />
                    )}
                    <Input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => onFile('section', event.target.files?.[0] ?? null)} />
                    {sectionFileError && <p className="text-sm text-red-600">{sectionFileError}</p>}
                    {form.errors.image && <p className="text-sm text-red-600">{form.errors.image}</p>}
                </label>
            )}
            {visible.link && (
                <label className="flex flex-col gap-2 text-sm">
                    Tautan
                    <Input value={form.data.link_url} onChange={(event) => form.setData('link_url', event.target.value)} />
                </label>
            )}
            {visible.button && (
                <label className="flex flex-col gap-2 text-sm">
                    Teks tombol
                    <Input value={form.data.button_label} onChange={(event) => form.setData('button_label', event.target.value)} />
                </label>
            )}
            <label className="flex flex-col gap-2 text-sm">
                Urutan
                <Input type="number" min={0} value={form.data.sort_order} onChange={(event) => form.setData('sort_order', Number(event.target.value))} />
                <span className="text-xs text-on-surface-variant">Angka kecil tampil lebih dulu.</span>
            </label>
            {visible.messages && (
                <label className="flex flex-col gap-2 text-sm md:col-span-2">
                    Kalimat pengumuman, satu baris satu kalimat
                    <textarea className="min-h-24 rounded-md border bg-white px-3 py-2" value={form.data.messages} onChange={(event) => form.setData('messages', event.target.value)} />
                </label>
            )}
            {visible.rail && (
                <>
                    <label className="flex flex-col gap-2 text-sm">
                        Produk yang ditampilkan
                        <select className="h-10 rounded-md border bg-white px-3" value={form.data.source} onChange={(event) => form.setData('source', event.target.value)}>
                            <option value="latest">Terbaru</option>
                            <option value="featured">Unggulan</option>
                            <option value="manual">Dipilih sendiri</option>
                        </select>
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                        Jumlah produk
                        <Input type="number" min={1} max={24} value={form.data.limit} onChange={(event) => form.setData('limit', Number(event.target.value))} />
                    </label>
                </>
            )}
            {visible.faqs && (
                <div className="grid gap-3 md:col-span-2">
                    {form.data.faqs.map((faq, index) => (
                        <div key={index} className="grid gap-2 rounded-2xl border p-3">
                            <Input placeholder="Pertanyaan" value={faq.question} onChange={(event) => {
                                const faqs = [...form.data.faqs];
                                faqs[index] = { ...faqs[index], question: event.target.value };
                                form.setData('faqs', faqs);
                            }} />
                            <textarea className="min-h-16 rounded-md border px-3 py-2" placeholder="Jawaban" value={faq.answer} onChange={(event) => {
                                const faqs = [...form.data.faqs];
                                faqs[index] = { ...faqs[index], answer: event.target.value };
                                form.setData('faqs', faqs);
                            }} />
                            <Button type="button" variant="ghost" size="sm" className="w-fit" onClick={() => form.setData('faqs', form.data.faqs.filter((_, faqIndex) => faqIndex !== index))}>
                                Hapus pertanyaan
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" className="w-fit" onClick={() => form.setData('faqs', [...form.data.faqs, { question: '', answer: '' }])}>
                        Tambah pertanyaan
                    </Button>
                </div>
            )}
            <label className="flex items-center gap-2 text-sm md:col-span-2">
                <input type="checkbox" checked={form.data.is_active} onChange={(event) => form.setData('is_active', event.target.checked)} />
                Tampil di toko
            </label>
            <div className="flex gap-2 md:col-span-2">
                <Button type="submit" variant="accent" disabled={form.processing}>{mode === 'create' ? 'Simpan' : 'Simpan bagian'}</Button>
                <Button type="button" variant="ghost" onClick={resetSection}>Batal</Button>
            </div>
        </>
    );

    return (
        <AdminLayout title="Beranda">
            <Head title="Beranda" />
            <div className="mx-auto flex max-w-5xl flex-col gap-6">
                <AdminPageHeader
                    eyebrow="Beranda"
                    title="Beranda toko"
                    description="Urutan di sini sama dengan yang pembeli lihat, dari atas ke bawah. Hero adalah foto besar di paling atas."
                >
                    <Button asChild variant="outline">
                        <Link href="/">Lihat toko</Link>
                    </Button>
                    {!creating && !editing && (
                        <Button variant="accent" onClick={() => { resetSection(); setCreating(true); form.setData('sort_order', sections.length * 10); }}>
                            Tambah bagian
                        </Button>
                    )}
                </AdminPageHeader>

                <form className="grid gap-4 rounded-3xl border border-outline-variant/20 bg-white p-5 md:grid-cols-2" onSubmit={(event) => { event.preventDefault(); seoForm.put('/admin/homepage/seo', { preserveScroll: true }); }}>
                    <div className="md:col-span-2">
                        <h2 className="font-serif text-2xl">SEO beranda</h2>
                        <p className="mt-1 text-sm text-on-surface-variant">Judul dan deskripsi ini yang tampil di hasil pencarian.</p>
                    </div>
                    <label className="flex flex-col gap-2 text-sm">
                        Judul pencarian
                        <Input maxLength={70} value={seoForm.data.title} onChange={(event) => seoForm.setData('title', event.target.value)} placeholder="Busana muslimah elegan" />
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                        Kata kunci organik
                        <Input maxLength={300} value={seoForm.data.keywords} onChange={(event) => seoForm.setData('keywords', event.target.value)} placeholder="gamis, hijab, modest wear" />
                        <span className="text-xs text-on-surface-variant">Pisahkan dengan koma. Kata ini masuk ke meta halaman beranda.</span>
                    </label>
                    <label className="flex flex-col gap-2 text-sm md:col-span-2">
                        Deskripsi pencarian
                        <textarea className="min-h-20 rounded-md border px-3 py-2" maxLength={160} value={seoForm.data.description} onChange={(event) => seoForm.setData('description', event.target.value)} />
                    </label>
                    <div className="md:col-span-2">
                        <Button type="submit" variant="accent" disabled={seoForm.processing}>Simpan SEO</Button>
                    </div>
                </form>

                {creating && (
                    <form className="grid gap-4 rounded-3xl border border-outline-variant/20 bg-white p-5 md:grid-cols-2" onSubmit={submit}>
                        <h2 className="font-serif text-2xl md:col-span-2">Bagian baru</h2>
                        {sectionFields('create')}
                    </form>
                )}

                <div className="grid gap-4">
                    {sections.map((section) => (
                        <article key={section.id} className="rounded-3xl border border-outline-variant/20 bg-white p-4 md:p-5">
                            <div className="flex items-start gap-3">
                                {section.image_path && <img src={storageUrl(section.image_path)} alt="" className="size-16 rounded-2xl object-cover" />}
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold">{section.title || types[section.type]}</p>
                                    <p className="text-sm text-on-surface-variant">{types[section.type]} · urutan {section.sort_order}</p>
                                    <Badge className="mt-2" variant={section.is_active ? 'default' : 'secondary'}>
                                        {section.is_active ? 'Tampil' : 'Disembunyikan'}
                                    </Badge>
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="sm" onClick={() => (editing === section.id ? resetSection() : edit(section))}>
                                        {editing === section.id ? 'Tutup' : 'Ubah'}
                                    </Button>
                                    {isSuperAdmin && (
                                        <Button variant="ghost" size="sm" onClick={() => {
                                            if (confirm('Pindahkan bagian beranda ini ke arsip? Hanya superadmin yang bisa memulihkan.')) {
                                                router.delete(`/admin/homepage/sections/${section.id}`);
                                            }
                                        }}>
                                            Hapus
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {editing === section.id && (
                                <form className="mt-4 grid gap-4 rounded-2xl bg-surface-container-low p-4 md:grid-cols-2" onSubmit={submit}>
                                    {sectionFields('edit')}
                                </form>
                            )}

                            {section.type === 'product_rail' && section.config_json?.source !== 'manual' && (
                                <p className="mt-4 border-t pt-4 text-sm text-on-surface-variant">
                                    Produk di bagian ini terisi otomatis. Tekan Ubah untuk mengganti sumber atau jumlahnya.
                                </p>
                            )}

                            {acceptsItems(section.type) && !(section.type === 'product_rail' && section.config_json?.source !== 'manual') && (
                                <div className="mt-4 border-t pt-4">
                                    <p className="mb-3 text-sm font-medium">{section.type === 'hero' ? 'Slide foto' : 'Isi bagian'}</p>
                                    <ul className="mb-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {section.items.map((item) => (
                                            <li key={item.id} className="overflow-hidden rounded-2xl border">
                                                {item.image_path && <img src={storageUrl(item.image_path)} alt="" className="h-36 w-full object-cover" />}
                                                <div className="flex items-start justify-between gap-2 p-3">
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-semibold">{item.title || (section.type === 'hero' ? 'Tanpa tulisan' : 'Tanpa judul')}</p>
                                                        <p className="truncate text-xs text-on-surface-variant">
                                                            {section.type === 'hero' ? (item.subtitle ? `Tombol: ${item.subtitle}` : 'Tanpa tombol') : item.subtitle}
                                                        </p>
                                                    </div>
                                                    <div className="flex shrink-0 flex-col">
                                                        <Button variant="ghost" size="sm" onClick={() => { setItemSectionId(section.id); editItem(item); }}>Ubah</Button>
                                                        {isSuperAdmin && (
                                                            <Button variant="ghost" size="sm" onClick={() => {
                                                                if (confirm('Pindahkan isi bagian ini ke arsip? Hanya superadmin yang bisa memulihkan.')) {
                                                                    router.delete(`/admin/homepage/items/${item.id}`);
                                                                }
                                                            }}>Hapus</Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    {itemSectionId === section.id ? (
                                        <form className="grid gap-3 rounded-2xl bg-surface-container-low p-4 md:grid-cols-2" onSubmit={(event) => submitItem(event, section)}>
                                            <label className="flex flex-col gap-2 text-sm">
                                                {section.type === 'hero' ? 'Tulisan SEO banner' : 'Judul'}
                                                <Input value={itemForm.data.title} onChange={(event) => itemForm.setData('title', event.target.value)} placeholder={section.type === 'hero' ? 'Koleksi, gamis syari' : ''} />
                                                {section.type === 'hero' && <span className="text-xs text-on-surface-variant">Tidak tampil di foto. Tetap ada di halaman untuk Google dan pembaca layar.</span>}
                                            </label>
                                            <label className="flex flex-col gap-2 text-sm">
                                                {section.type === 'hero' ? 'Teks tombol' : 'Subjudul'}
                                                <Input value={itemForm.data.subtitle} onChange={(event) => itemForm.setData('subtitle', event.target.value)} placeholder={section.type === 'hero' ? 'Kosongkan untuk menyembunyikan' : ''} />
                                            </label>
                                            {section.type === 'hero' && (
                                                <div className="grid gap-3 md:col-span-2 md:grid-cols-2">
                                                    <div className="md:col-span-2">
                                                        <p className="text-sm font-semibold tracking-[0.14em] uppercase">Hero banner</p>
                                                        <p className="mt-1 text-xs leading-5 text-on-surface-variant">Desktop 1920×800. Mobile 1619×971. Keduanya menyesuaikan lebar layar.</p>
                                                    </div>
                                                    <label className="flex flex-col gap-2 text-sm">
                                                        Foto desktop
                                                        {(itemPreview || itemForm.data.image_path) && <img src={itemPreview || storageUrl(itemForm.data.image_path)} alt="" className="aspect-[1920/800] w-full rounded-2xl object-cover" />}
                                                        <Input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => onFile('item', event.target.files?.[0] ?? null)} />
                                                        {itemFileError && <p className="text-sm text-red-600">{itemFileError}</p>}
                                                    </label>
                                                    <label className="flex flex-col gap-2 text-sm">
                                                        Foto mobile
                                                        {(mobilePreview || itemForm.data.mobile_image_path) && <img src={mobilePreview || storageUrl(itemForm.data.mobile_image_path)} alt="" className="aspect-[1619/971] w-full rounded-2xl object-cover" />}
                                                        <Input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => onFile('mobile', event.target.files?.[0] ?? null)} />
                                                        {mobileFileError && <p className="text-sm text-red-600">{mobileFileError}</p>}
                                                    </label>
                                                    <div className="flex flex-col gap-2 md:col-span-2">
                                                        <div className="flex items-center justify-between gap-3">
                                                            <span className="text-sm">Posisi tombol</span>
                                                            <div className="flex rounded-full bg-white p-1 text-xs">
                                                                <button type="button" className={`rounded-full px-3 py-1 ${positionView === 'desktop' ? 'bg-neutral-900 text-white' : ''}`} onClick={() => setPositionView('desktop')}>Desktop</button>
                                                                <button type="button" className={`rounded-full px-3 py-1 ${positionView === 'mobile' ? 'bg-neutral-900 text-white' : ''}`} onClick={() => setPositionView('mobile')}>Mobile</button>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={`relative touch-none overflow-hidden rounded-2xl bg-neutral-900 select-none ${positionView === 'mobile' ? 'aspect-[1619/971]' : 'aspect-[1920/800]'}`}
                                                            onPointerDown={(event) => {
                                                                const stage = event.currentTarget;
                                                                const move = (ev: PointerEvent) => {
                                                                    const rect = stage.getBoundingClientRect();
                                                                    itemForm.setData('x', Math.round(Math.min(92, Math.max(8, ((ev.clientX - rect.left) / rect.width) * 100))));
                                                                    itemForm.setData('y', Math.round(Math.min(92, Math.max(8, ((ev.clientY - rect.top) / rect.height) * 100))));
                                                                };
                                                                move(event.nativeEvent);
                                                                const stop = () => {
                                                                    stage.removeEventListener('pointermove', move);
                                                                    stage.removeEventListener('pointerup', stop);
                                                                };
                                                                stage.addEventListener('pointermove', move);
                                                                stage.addEventListener('pointerup', stop);
                                                            }}
                                                        >
                                                            {positionImage && <img src={positionImage} alt="" className="pointer-events-none size-full object-cover" />}
                                                            <span className="pointer-events-none absolute rounded-full bg-white px-4 py-2 text-xs tracking-[0.14em] text-black uppercase" style={{ left: `${itemForm.data.x}%`, top: `${itemForm.data.y}%`, transform: 'translate(-50%, -50%)' }}>
                                                                {itemForm.data.subtitle || 'Tombol'}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-on-surface-variant">Tarik atau klik di foto untuk meletakkan tombol. Posisi yang sama dipakai di desktop dan HP.</p>
                                                    </div>
                                                </div>
                                            )}
                                            {section.type !== 'product_rail' && section.type !== 'hero' && (
                                                <label className="flex flex-col gap-2 text-sm">
                                                    Foto
                                                    {(itemPreview || itemForm.data.image_path) && <img src={itemPreview || storageUrl(itemForm.data.image_path)} alt="" className="h-28 w-full rounded-2xl object-cover" />}
                                                    <Input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => onFile('item', event.target.files?.[0] ?? null)} />
                                                </label>
                                            )}
                                            <label className="flex flex-col gap-2 text-sm">
                                                Halaman tujuan
                                                <select className="h-10 rounded-md border bg-white px-3" value={linkKind} onChange={(event) => {
                                                    const kind = event.target.value as typeof linkKind;
                                                    let target = linkTarget;
                                                    if (kind === 'page' && !storePages.some((page) => page.href === target)) target = storePages[0].href;
                                                    if (kind === 'category' || kind === 'product') target = '';
                                                    setLinkKind(kind);
                                                    setLinkTarget(target);
                                                    if (kind === 'custom') itemForm.setData('link_url', '');
                                                    else applyLink(kind, target);
                                                }}>
                                                    <option value="catalog">Katalog semua</option>
                                                    <option value="category">Satu kategori</option>
                                                    <option value="product">Satu produk</option>
                                                    <option value="page">Halaman toko</option>
                                                    <option value="custom">Tautan lain</option>
                                                </select>
                                                {linkKind === 'category' && (
                                                    <select className="h-10 rounded-md border bg-white px-3" value={linkTarget} onChange={(event) => { setLinkTarget(event.target.value); applyLink('category', event.target.value); }}>
                                                        <option value="">Pilih kategori</option>
                                                        {categories.map((category) => <option key={category.id} value={String(category.id)}>{category.name}</option>)}
                                                    </select>
                                                )}
                                                {linkKind === 'product' && (
                                                    <select className="h-10 rounded-md border bg-white px-3" value={linkTarget} onChange={(event) => { setLinkTarget(event.target.value); applyLink('product', event.target.value); }}>
                                                        <option value="">Pilih produk</option>
                                                        {products.map((product) => <option key={product.id} value={String(product.id)}>{product.name}</option>)}
                                                    </select>
                                                )}
                                                {linkKind === 'page' && (
                                                    <select className="h-10 rounded-md border bg-white px-3" value={linkTarget} onChange={(event) => { setLinkTarget(event.target.value); applyLink('page', event.target.value); }}>
                                                        {storePages.map((page) => <option key={page.href} value={page.href}>{page.label}</option>)}
                                                    </select>
                                                )}
                                                {linkKind === 'custom' && (
                                                    <Input value={itemForm.data.link_url} onChange={(event) => itemForm.setData('link_url', event.target.value)} placeholder="/halaman atau https://..." />
                                                )}
                                            </label>
                                            <label className="flex flex-col gap-2 text-sm">
                                                Urutan
                                                <Input type="number" min={0} value={itemForm.data.sort_order} onChange={(event) => itemForm.setData('sort_order', Number(event.target.value))} />
                                            </label>
                                            {(section.type === 'category_tiles' || section.type === 'collection_tabs') && (
                                                <label className="flex flex-col gap-2 text-sm">
                                                    Kategori
                                                    <select className="h-10 rounded-md border bg-white px-3" value={itemForm.data.category_id} onChange={(event) => itemForm.setData('category_id', event.target.value === '' ? '' : Number(event.target.value))}>
                                                        <option value="">Tanpa kategori</option>
                                                        {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                                                    </select>
                                                </label>
                                            )}
                                            {section.type === 'product_rail' && (
                                                <label className="flex flex-col gap-2 text-sm">
                                                    Produk
                                                    <select className="h-10 rounded-md border bg-white px-3" value={itemForm.data.product_id} onChange={(event) => itemForm.setData('product_id', event.target.value === '' ? '' : Number(event.target.value))}>
                                                        <option value="">Pilih produk</option>
                                                        {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
                                                    </select>
                                                </label>
                                            )}
                                            {section.type === 'collection_tabs' && (
                                                <>
                                                    <label className="flex flex-col gap-2 text-sm">
                                                        Produk di tab ini
                                                        <select className="h-10 rounded-md border bg-white px-3" value={itemForm.data.source} onChange={(event) => itemForm.setData('source', event.target.value)}>
                                                            <option value="latest">Terbaru</option>
                                                            <option value="featured">Unggulan</option>
                                                            <option value="category">Kategori di atas</option>
                                                            <option value="manual">Produk dipilih</option>
                                                        </select>
                                                    </label>
                                                    <label className="flex flex-col gap-2 text-sm">
                                                        Jumlah kartu
                                                        <Input type="number" min={1} max={24} value={itemForm.data.limit} onChange={(event) => itemForm.setData('limit', Number(event.target.value))} />
                                                    </label>
                                                    {itemForm.data.source === 'manual' && (
                                                        <div className="grid max-h-40 gap-1 overflow-auto rounded-xl border bg-white p-2 md:col-span-2">
                                                            {products.map((product) => (
                                                                <label key={product.id} className="flex items-center gap-2 text-sm">
                                                                    <input type="checkbox" checked={itemForm.data.product_ids.includes(product.id)} onChange={() => {
                                                                        itemForm.setData('product_ids', itemForm.data.product_ids.includes(product.id)
                                                                            ? itemForm.data.product_ids.filter((id) => id !== product.id)
                                                                            : [...itemForm.data.product_ids, product.id]);
                                                                    }} />
                                                                    {product.name}
                                                                </label>
                                                            ))}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                            <div className="flex gap-2 md:col-span-2">
                                                <Button type="submit" size="sm" variant="accent" disabled={itemForm.processing}>{editingItem ? 'Simpan perubahan' : 'Tambah'}</Button>
                                                <Button type="button" size="sm" variant="ghost" onClick={() => { setItemSectionId(null); setEditingItem(null); }}>Tutup</Button>
                                            </div>
                                        </form>
                                    ) : (
                                        <Button type="button" variant="outline" size="sm" onClick={() => {
                                            setItemSectionId(section.id);
                                            setEditingItem(null);
                                            setPositionView('desktop');
                                            clearPreview('item');
                                            itemForm.reset();
                                            itemForm.setData('sort_order', section.items.length);
                                            setLinkKind('catalog');
                                            setLinkTarget('');
                                        }}>
                                            {section.type === 'hero' ? 'Tambah slide' : 'Tambah isi'}
                                        </Button>
                                    )}
                                </div>
                            )}
                        </article>
                    ))}
                </div>

                <form className="space-y-4 rounded-xl border border-outline-variant/15 bg-white p-6" onSubmit={(event) => { event.preventDefault(); socialForm.post('/admin/homepage', { preserveScroll: true }); }}>
                    <h2 className="font-serif text-xl">Social & WhatsApp</h2>
                    <label className="block text-sm">
                        <span className="mb-1 block text-on-surface-variant">WhatsApp Number</span>
                        <Input value={socialForm.data.whatsapp_number} onChange={(event) => socialForm.setData('whatsapp_number', event.target.value)} />
                    </label>
                    {socialForm.data.social_links.map((link, index) => (
                        <div key={index} className="grid gap-2 sm:grid-cols-2">
                            <Input placeholder="Platform name" value={link.name} onChange={(event) => {
                                const links = [...socialForm.data.social_links];
                                links[index] = { ...links[index], name: event.target.value };
                                socialForm.setData('social_links', links);
                            }} />
                            <Input placeholder="URL" value={link.url} onChange={(event) => {
                                const links = [...socialForm.data.social_links];
                                links[index] = { ...links[index], url: event.target.value };
                                socialForm.setData('social_links', links);
                            }} />
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => socialForm.setData('social_links', [...socialForm.data.social_links, { name: '', url: '' }])}>Add Link</Button>
                    <Button type="submit" variant="accent" disabled={socialForm.processing}>Save Social Links</Button>
                </form>

                <form className="space-y-4 rounded-xl border border-outline-variant/15 bg-white p-6" onSubmit={(event) => { event.preventDefault(); promoForm.post('/admin/homepage', { forceFormData: true, preserveScroll: true }); }}>
                    <div className="flex items-center justify-between">
                        <h2 className="font-serif text-xl">Promo Popup</h2>
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={promoForm.data.enabled} onChange={(event) => promoForm.setData('enabled', event.target.checked)} />
                            Enabled
                        </label>
                    </div>
                    <Input placeholder="Title" value={promoForm.data.title} onChange={(event) => promoForm.setData('title', event.target.value)} />
                    <Input placeholder="Subtitle" value={promoForm.data.subtitle} onChange={(event) => promoForm.setData('subtitle', event.target.value)} />
                    <div className="grid gap-3 sm:grid-cols-2">
                        <Input placeholder="CTA text" value={promoForm.data.cta_text} onChange={(event) => promoForm.setData('cta_text', event.target.value)} />
                        <Input placeholder="CTA URL" value={promoForm.data.cta_url} onChange={(event) => promoForm.setData('cta_url', event.target.value)} />
                    </div>
                    <Input type="file" accept="image/*" onChange={(event) => promoForm.setData('image', event.target.files?.[0] ?? null)} />
                    <Button type="submit" variant="accent" disabled={promoForm.processing}>Save Promo Popup</Button>
                </form>
            </div>
        </AdminLayout>
    );
}
