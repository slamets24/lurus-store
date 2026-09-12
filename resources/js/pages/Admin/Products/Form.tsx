import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, Loader2, Plus, Trash2, Upload } from 'lucide-react';
import * as React from 'react';
import { CategoryCombobox } from '@/components/admin/CategoryCombobox';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import AdminLayout from '@/layouts/AdminLayout';
import type { AdminCategory, AdminProduct, ProductVariant } from '@/types/admin';

interface ProductsFormProps {
    product?: AdminProduct | null;
    categories: AdminCategory[];
    fitProductOptions?: Array<{ id: number; name: string }>;
    variantOptions: {
        colors: string[];
        colorHexes: Record<string, string>;
        sizes: string[];
    };
}

const emptyVariant = (): ProductVariant => ({ color: '', size: '', stock: 0 });

export default function ProductsForm({
    product,
    categories,
    fitProductOptions = [],
    variantOptions,
}: ProductsFormProps) {
    const isEdit = Boolean(product?.id);

    const form = useForm({
        name: product?.name ?? '',
        description: product?.description ?? '',
        price: product?.price ?? 0,
        discount_percent: product?.discount_percent ?? 0,
        sku: product?.sku ?? '',
        category_id: product?.category_id ?? (product?.category?.id ? String(product.category.id) : ''),
        category_name: product?.category_name ?? product?.category?.name ?? '',
        material: product?.material ?? '',
        shopee_url: product?.shopee_url ?? '',
        tokopedia_url: product?.tokopedia_url ?? '',
        tiktok_url: product?.tiktok_url ?? '',
        related_fit_product_id: product?.related_fit_product_id ? String(product.related_fit_product_id) : '',
        is_active: product?.is_active ?? true,
        is_featured: product?.is_featured ?? false,
        variants: (product?.variants?.length ? product.variants : [emptyVariant()]).map((variant) => ({
            color: variant.color,
            size: variant.size,
            stock: variant.stock,
        })),
        images: [] as File[],
        image_colors: [] as string[],
        existing_image_colors: (product?.images ?? []).reduce<Record<number, string>>((acc, image) => {
            if (image.color) {
                acc[image.id] = image.color;
            }
            return acc;
        }, {}),
    });

    const [imagePreviews, setImagePreviews] = React.useState<Array<{ file: File; url: string }>>([]);
    const [bulkStock, setBulkStock] = React.useState('');

    const applyBulkStock = () => {
        const qty = Number(bulkStock);
        if (isNaN(qty) || qty < 0) return;
        const updated = form.data.variants.map((v) => ({ ...v, stock: qty }));
        form.setData('variants', updated);
    };

    // Calculate discounted price
    const calculatedDiscountedPrice = React.useMemo(() => {
        const p = Number(form.data.price) || 0;
        const d = Math.min(100, Math.max(0, Number(form.data.discount_percent) || 0));
        return Math.max(0, Math.round(p * (1 - d / 100)));
    }, [form.data.price, form.data.discount_percent]);

    // Format number to IDR string
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('id-ID').format(num);
    };

    // Parse formatted string back to number
    const handlePriceChange = (val: string) => {
        const cleaned = val.replace(/[^0-9]/g, '');
        form.setData('price', cleaned ? Number(cleaned) : 0);
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        if (isEdit && product?.id) {
            form.transform((data) => ({ ...data, _method: 'put' }));
            form.post(`/admin/products/${product.id}`, {
                forceFormData: true,
                preserveScroll: true,
            });
            return;
        }

        form.post('/admin/products', { forceFormData: true });
    };

    const updateVariant = (index: number, field: keyof ProductVariant, value: string | number) => {
        const variants = [...form.data.variants];
        variants[index] = { ...variants[index], [field]: value };
        form.setData('variants', variants);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (files.length === 0) return;

        const newPreviews = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));

        const updatedFiles = [...form.data.images, ...files];
        const updatedColors = [...form.data.image_colors, ...files.map(() => '')];

        setImagePreviews((prev) => [...prev, ...newPreviews]);
        form.setData('images', updatedFiles);
        form.setData('image_colors', updatedColors);
    };

    const removeNewImage = (index: number) => {
        const updatedFiles = form.data.images.filter((_, i) => i !== index);
        const updatedColors = form.data.image_colors.filter((_, i) => i !== index);
        setImagePreviews((prev) => {
            URL.revokeObjectURL(prev[index].url);
            return prev.filter((_, i) => i !== index);
        });
        form.setData('images', updatedFiles);
        form.setData('image_colors', updatedColors);
    };

    const totalStock = form.data.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);

    return (
        <AdminLayout title={isEdit ? 'Edit Product' : 'Create Product'}>
            <Head title={isEdit ? 'Edit Product' : 'Create Product'} />

            <div className="mx-auto max-w-5xl space-y-7 pb-16">
                {/* Header matching Image 2 */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="font-serif text-3xl font-normal text-stone-900 tracking-tight">
                            {isEdit ? 'Edit Product' : 'Create Product'}
                        </h1>
                        <p className="mt-1 font-sans text-sm text-stone-500">
                            {isEdit ? (product?.name ?? 'Edit product details') : 'Add a new product to your store'}
                        </p>
                    </div>

                    <Link
                        href="/admin/products"
                        className="inline-flex items-center gap-1 font-sans text-sm font-medium text-stone-600 hover:text-stone-900 transition"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Back</span>
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* SECTION: BASIC INFORMATION (Image 2 Replica) */}
                    <div className="rounded-2xl border border-[#e5e1dc] bg-white p-6 sm:p-8 shadow-sm space-y-6">
                        <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-stone-800">
                            BASIC INFORMATION
                        </h2>

                        {/* ROW 1: 3 Columns */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {/* NAMA ARTIKEL * */}
                            <div>
                                <label className="block font-sans text-xs font-bold uppercase tracking-wide text-stone-700 mb-2">
                                    NAMA ARTIKEL <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nama artikel"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    className="flex h-11 w-full rounded-md border border-[#e5e1dc] bg-[#faf8f5] px-3.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-warm-brown focus:bg-white focus:outline-none focus:ring-1 focus:ring-warm-brown transition-colors"
                                    required
                                />
                                {form.errors.name && (
                                    <p className="mt-1 text-xs text-red-500">{form.errors.name}</p>
                                )}
                            </div>

                            {/* KATEGORI ARTIKEL * */}
                            <div>
                                <label className="block font-sans text-xs font-bold uppercase tracking-wide text-stone-700 mb-2">
                                    KATEGORI ARTIKEL <span className="text-red-500">*</span>
                                </label>
                                <CategoryCombobox
                                    categories={categories}
                                    categoryId={form.data.category_id}
                                    categoryName={form.data.category_name}
                                    placeholder="Pilih atau ketik kategori..."
                                    onChange={(id, name) => {
                                        form.setData({
                                            ...form.data,
                                            category_id: String(id),
                                            category_name: name,
                                        });
                                    }}
                                    error={form.errors.category_name || form.errors.category_id}
                                />
                            </div>

                            {/* HARGA JUAL * */}
                            <div>
                                <label className="block font-sans text-xs font-bold uppercase tracking-wide text-stone-700 mb-2">
                                    HARGA JUAL <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-sans text-sm text-stone-500 select-none">
                                        Rp
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="0"
                                        value={form.data.price ? formatNumber(Number(form.data.price)) : '0'}
                                        onChange={(e) => handlePriceChange(e.target.value)}
                                        className="flex h-11 w-full rounded-md border border-[#e5e1dc] bg-[#faf8f5] pl-10 pr-3.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-warm-brown focus:bg-white focus:outline-none focus:ring-1 focus:ring-warm-brown transition-colors"
                                        required
                                    />
                                </div>
                                {form.errors.price && (
                                    <p className="mt-1 text-xs text-red-500">{form.errors.price}</p>
                                )}
                            </div>
                        </div>

                        {/* ROW 2: 3 Columns */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {/* DISKON (%) */}
                            <div>
                                <label className="block font-sans text-xs font-bold uppercase tracking-wide text-stone-700 mb-2">
                                    DISKON (%)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    placeholder="0"
                                    value={form.data.discount_percent || 0}
                                    onChange={(e) => form.setData('discount_percent', Number(e.target.value))}
                                    className="flex h-11 w-full rounded-md border border-[#e5e1dc] bg-[#faf8f5] px-3.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-warm-brown focus:bg-white focus:outline-none focus:ring-1 focus:ring-warm-brown transition-colors"
                                />
                                <p className="mt-1.5 font-sans text-xs text-stone-500">
                                    Harga setelah diskon: Rp {formatNumber(calculatedDiscountedPrice)}
                                </p>
                                {form.errors.discount_percent && (
                                    <p className="mt-1 text-xs text-red-500">{form.errors.discount_percent}</p>
                                )}
                            </div>

                            {/* MATERIAL */}
                            <div>
                                <label className="block font-sans text-xs font-bold uppercase tracking-wide text-stone-700 mb-2">
                                    MATERIAL
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Cotton, Polyester"
                                    value={form.data.material}
                                    onChange={(e) => form.setData('material', e.target.value)}
                                    className="flex h-11 w-full rounded-md border border-[#e5e1dc] bg-[#faf8f5] px-3.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-warm-brown focus:bg-white focus:outline-none focus:ring-1 focus:ring-warm-brown transition-colors"
                                />
                                {form.errors.material && (
                                    <p className="mt-1 text-xs text-red-500">{form.errors.material}</p>
                                )}
                            </div>

                            {/* SHOPEE URL */}
                            <div>
                                <label className="block font-sans text-xs font-bold uppercase tracking-wide text-stone-700 mb-2">
                                    SHOPEE URL
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://shopee.co.id/..."
                                    value={form.data.shopee_url}
                                    onChange={(e) => form.setData('shopee_url', e.target.value)}
                                    className="flex h-11 w-full rounded-md border border-[#e5e1dc] bg-[#faf8f5] px-3.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-warm-brown focus:bg-white focus:outline-none focus:ring-1 focus:ring-warm-brown transition-colors"
                                />
                                {form.errors.shopee_url && (
                                    <p className="mt-1 text-xs text-red-500">{form.errors.shopee_url}</p>
                                )}
                            </div>
                        </div>

                        {/* ROW 3: 3 Columns */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {/* TOKOPEDIA URL */}
                            <div>
                                <label className="block font-sans text-xs font-bold uppercase tracking-wide text-stone-700 mb-2">
                                    TOKOPEDIA URL
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://www.tokopedia.com/..."
                                    value={form.data.tokopedia_url}
                                    onChange={(e) => form.setData('tokopedia_url', e.target.value)}
                                    className="flex h-11 w-full rounded-md border border-[#e5e1dc] bg-[#faf8f5] px-3.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-warm-brown focus:bg-white focus:outline-none focus:ring-1 focus:ring-warm-brown transition-colors"
                                />
                                {form.errors.tokopedia_url && (
                                    <p className="mt-1 text-xs text-red-500">{form.errors.tokopedia_url}</p>
                                )}
                            </div>

                            {/* TIKTOK SHOP URL */}
                            <div>
                                <label className="block font-sans text-xs font-bold uppercase tracking-wide text-stone-700 mb-2">
                                    TIKTOK SHOP URL
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://vt.tokopedia.com/... atau https://www.tiktok.com/..."
                                    value={form.data.tiktok_url}
                                    onChange={(e) => form.setData('tiktok_url', e.target.value)}
                                    className="flex h-11 w-full rounded-md border border-[#e5e1dc] bg-[#faf8f5] px-3.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-warm-brown focus:bg-white focus:outline-none focus:ring-1 focus:ring-warm-brown transition-colors"
                                />
                                {form.errors.tiktok_url && (
                                    <p className="mt-1 text-xs text-red-500">{form.errors.tiktok_url}</p>
                                )}
                            </div>

                            {/* SKU / KODE ARTIKEL (OPSIONAL) */}
                            <div>
                                <label className="block font-sans text-xs font-bold uppercase tracking-wide text-stone-700 mb-2">
                                    SKU (KODE ARTIKEL)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Auto-generated jika kosong"
                                    value={form.data.sku}
                                    onChange={(e) => form.setData('sku', e.target.value)}
                                    className="flex h-11 w-full rounded-md border border-[#e5e1dc] bg-[#faf8f5] px-3.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-warm-brown focus:bg-white focus:outline-none focus:ring-1 focus:ring-warm-brown transition-colors"
                                />
                                {form.errors.sku && (
                                    <p className="mt-1 text-xs text-red-500">{form.errors.sku}</p>
                                )}
                            </div>
                        </div>

                        {/* ROW 4: DESCRIPTION (Rich Text Editor) */}
                        <div>
                            <label className="block font-sans text-xs font-bold uppercase tracking-wide text-stone-700 mb-2">
                                DESCRIPTION
                            </label>
                            <RichTextEditor
                                value={form.data.description}
                                onChange={(val) => form.setData('description', val)}
                                placeholder="Tulis deskripsi artikel seperti dokumen..."
                            />
                            {form.errors.description && (
                                <p className="mt-1 text-xs text-red-500">{form.errors.description}</p>
                            )}
                        </div>
                    </div>

                    {/* SECTION: VARIANTS & INVENTORY */}
                    <div className="rounded-2xl border border-[#e5e1dc] bg-white p-6 sm:p-8 shadow-sm space-y-5">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0ece5] pb-4">
                            <div>
                                <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-stone-800">
                                    VARIAN PRODUK & STOK
                                </h2>
                                <p className="mt-1 font-sans text-xs text-stone-500">
                                    Atur kombinasi warna, ukuran, dan jumlah stok. Total stok terdaftar:{' '}
                                    <strong className="text-stone-800 font-semibold">{totalStock} pcs</strong>
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                {/* Stock All (Set Stok Sekaligus) */}
                                <div className="flex items-center rounded-md border border-[#e5e1dc] bg-[#faf8f5] p-0.5">
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="Qty stok"
                                        value={bulkStock}
                                        onChange={(e) => setBulkStock(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                applyBulkStock();
                                            }
                                        }}
                                        className="h-8 w-20 bg-transparent px-2.5 text-center text-xs font-semibold text-stone-800 focus:outline-none placeholder:text-stone-400 placeholder:font-normal"
                                    />
                                    <button
                                        type="button"
                                        onClick={applyBulkStock}
                                        disabled={bulkStock === ''}
                                        className="rounded bg-stone-200/80 px-3 py-1.5 font-sans text-xs font-semibold text-stone-700 hover:bg-[#8b7355] hover:text-white disabled:opacity-40 disabled:hover:bg-stone-200/80 disabled:hover:text-stone-700 transition cursor-pointer"
                                        title="Terapkan jumlah stok ini ke semua baris varian sekaligus"
                                    >
                                        Set Semua Stok
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => form.setData('variants', [...form.data.variants, emptyVariant()])}
                                    className="inline-flex items-center gap-1.5 rounded-md border border-[#e5e1dc] bg-[#faf8f5] px-3.5 py-2 font-sans text-xs font-semibold text-stone-700 hover:bg-[#f0ece5] hover:text-stone-900 transition cursor-pointer"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    <span>Tambah Varian</span>
                                </button>
                            </div>
                        </div>

                        {form.errors.variants && (
                            <p className="text-xs text-red-500">{form.errors.variants}</p>
                        )}

                        <div className="space-y-3">
                            <div className="hidden sm:grid sm:grid-cols-12 gap-3 text-xs font-bold uppercase tracking-wider text-stone-500 px-1">
                                <div className="sm:col-span-5">WARNA</div>
                                <div className="sm:col-span-4">UKURAN</div>
                                <div className="sm:col-span-2">STOK (PCS)</div>
                                <div className="sm:col-span-1 text-right">AKSI</div>
                            </div>

                            {form.data.variants.map((variant, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-1 sm:grid-cols-12 gap-3 rounded-xl border border-[#ece8e3] bg-[#faf8f5]/60 p-3 items-center"
                                >
                                    <div className="sm:col-span-5">
                                        <span className="sm:hidden block text-[11px] font-bold uppercase text-stone-500 mb-1">
                                            Warna
                                        </span>
                                        <input
                                            list="color-options"
                                            placeholder="e.g. Black, White, Navy"
                                            value={variant.color}
                                            onChange={(e) => updateVariant(index, 'color', e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-[#e5e1dc] bg-white px-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-warm-brown focus:outline-none focus:ring-1 focus:ring-warm-brown"
                                            required
                                        />
                                    </div>

                                    <div className="sm:col-span-4">
                                        <span className="sm:hidden block text-[11px] font-bold uppercase text-stone-500 mb-1">
                                            Ukuran
                                        </span>
                                        <input
                                            list="size-options"
                                            placeholder="e.g. S, M, L, XL"
                                            value={variant.size}
                                            onChange={(e) => updateVariant(index, 'size', e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-[#e5e1dc] bg-white px-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-warm-brown focus:outline-none focus:ring-1 focus:ring-warm-brown"
                                            required
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <span className="sm:hidden block text-[11px] font-bold uppercase text-stone-500 mb-1">
                                            Stok
                                        </span>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            value={variant.stock}
                                            onChange={(e) => updateVariant(index, 'stock', Number(e.target.value))}
                                            className="flex h-10 w-full rounded-md border border-[#e5e1dc] bg-white px-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-warm-brown focus:outline-none focus:ring-1 focus:ring-warm-brown"
                                            required
                                        />
                                    </div>

                                    <div className="sm:col-span-1 flex justify-end">
                                        <button
                                            type="button"
                                            disabled={form.data.variants.length <= 1}
                                            onClick={() =>
                                                form.setData(
                                                    'variants',
                                                    form.data.variants.filter((_, i) => i !== index),
                                                )
                                            }
                                            title="Hapus baris varian"
                                            className="flex h-9 w-9 items-center justify-center rounded-md text-stone-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-stone-400 transition"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <datalist id="color-options">
                            {variantOptions.colors.map((color) => (
                                <option key={color} value={color} />
                            ))}
                        </datalist>
                        <datalist id="size-options">
                            {variantOptions.sizes.map((size) => (
                                <option key={size} value={size} />
                            ))}
                        </datalist>
                    </div>

                    {/* SECTION: PRODUCT IMAGES */}
                    <div className="rounded-2xl border border-[#e5e1dc] bg-white p-6 sm:p-8 shadow-sm space-y-6">
                        <div>
                            <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-stone-800">
                                FOTO PRODUK
                            </h2>
                            <p className="mt-1 font-sans text-xs text-stone-500">
                                Unggah foto produk (format JPG, PNG, WEBP, maks 2MB per foto). Foto pertama akan menjadi cover utama.
                            </p>
                        </div>

                        {/* Existing Images (Edit Mode) */}
                        {product?.images && product.images.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="font-sans text-xs font-semibold text-stone-700">Foto Tersimpan:</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {product.images.map((image, idx) => (
                                        <div
                                            key={image.id}
                                            className="group relative rounded-xl border border-[#e5e1dc] bg-[#faf8f5] p-2.5 space-y-2"
                                        >
                                            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-stone-100">
                                                <img
                                                    src={`/storage/${image.image_path}`}
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                />
                                                {idx === 0 && (
                                                    <span className="absolute left-2 top-2 rounded bg-stone-900/85 px-2 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wider">
                                                        Cover Utama
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-medium text-stone-500 mb-1">
                                                    Tag Warna (opsional)
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Hitam"
                                                    value={form.data.existing_image_colors[image.id] ?? ''}
                                                    onChange={(e) =>
                                                        form.setData('existing_image_colors', {
                                                            ...form.data.existing_image_colors,
                                                            [image.id]: e.target.value,
                                                        })
                                                    }
                                                    className="h-8 w-full rounded border border-[#e5e1dc] bg-white px-2 text-xs text-stone-800 focus:border-warm-brown focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Newly Selected Images Preview */}
                        {imagePreviews.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="font-sans text-xs font-semibold text-stone-700">Foto Baru yang Akan Diunggah:</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {imagePreviews.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="relative rounded-xl border border-warm-brown/30 bg-[#faf8f5] p-2.5 space-y-2"
                                        >
                                            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-stone-100">
                                                <img
                                                    src={item.url}
                                                    alt="Preview"
                                                    className="h-full w-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(idx)}
                                                    className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow hover:bg-red-700 transition"
                                                    title="Hapus foto"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-medium text-stone-500 mb-1">
                                                    Tag Warna Foto
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Putih"
                                                    value={form.data.image_colors[idx] ?? ''}
                                                    onChange={(e) => {
                                                        const updated = [...form.data.image_colors];
                                                        updated[idx] = e.target.value;
                                                        form.setData('image_colors', updated);
                                                    }}
                                                    className="h-8 w-full rounded border border-[#e5e1dc] bg-white px-2 text-xs text-stone-800 focus:border-warm-brown focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upload Dropzone */}
                        <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#e5e1dc] bg-[#faf8f5]/80 p-8 text-center hover:border-warm-brown hover:bg-[#faf8f5] transition cursor-pointer">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-200/60 text-stone-600 mb-3">
                                <Upload className="h-5 w-5" />
                            </div>
                            <p className="font-sans text-sm font-semibold text-stone-800">
                                Klik untuk memilih foto atau seret foto ke sini
                            </p>
                            <p className="mt-1 font-sans text-xs text-stone-500">
                                Mendukung format JPG, PNG, WEBP hingga 2MB
                            </p>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                className="sr-only"
                            />
                        </label>
                    </div>

                    {/* SECTION: PUBLICATION & SETTINGS */}
                    <div className="rounded-2xl border border-[#e5e1dc] bg-white p-6 sm:p-8 shadow-sm space-y-5">
                        <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-stone-800">
                            PENGATURAN STATUS & FIT
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Checkboxes */}
                            <div className="space-y-4">
                                <label className="flex items-start gap-3 rounded-xl border border-[#ece8e3] bg-[#faf8f5] p-4 cursor-pointer hover:bg-[#f5f3ef] transition">
                                    <input
                                        type="checkbox"
                                        checked={form.data.is_active}
                                        onChange={(e) => form.setData('is_active', e.target.checked)}
                                        className="mt-1 h-4 w-4 rounded border-stone-300 text-warm-brown focus:ring-warm-brown"
                                    />
                                    <div>
                                        <span className="block font-sans text-sm font-semibold text-stone-800">
                                            Published (Status Aktif)
                                        </span>
                                        <span className="block font-sans text-xs text-stone-500 mt-0.5">
                                            Produk akan langsung tampil dan dapat dipesan oleh pelanggan di website.
                                        </span>
                                    </div>
                                </label>

                                <label className="flex items-start gap-3 rounded-xl border border-[#ece8e3] bg-[#faf8f5] p-4 cursor-pointer hover:bg-[#f5f3ef] transition">
                                    <input
                                        type="checkbox"
                                        checked={form.data.is_featured}
                                        onChange={(e) => form.setData('is_featured', e.target.checked)}
                                        className="mt-1 h-4 w-4 rounded border-stone-300 text-warm-brown focus:ring-warm-brown"
                                    />
                                    <div>
                                        <span className="block font-sans text-sm font-semibold text-stone-800">
                                            Featured (Produk Unggulan)
                                        </span>
                                        <span className="block font-sans text-xs text-stone-500 mt-0.5">
                                            Tampilkan produk di bagian sorotan/koleksi unggulan halaman utama.
                                        </span>
                                    </div>
                                </label>
                            </div>

                            {/* Related Fit Product */}
                            <div className="rounded-xl border border-[#ece8e3] bg-[#faf8f5] p-4 space-y-2">
                                <label className="block font-sans text-xs font-bold uppercase tracking-wide text-stone-700">
                                    REKOMENDASI FIT / UKURAN MODEL
                                </label>
                                <p className="text-xs text-stone-500">
                                    Pilih produk referensi ukuran jika artikel ini memiliki fitting/potongan yang serupa.
                                </p>
                                <select
                                    value={form.data.related_fit_product_id}
                                    onChange={(e) => form.setData('related_fit_product_id', e.target.value)}
                                    className="h-11 w-full rounded-md border border-[#e5e1dc] bg-white px-3 text-sm text-stone-800 focus:border-warm-brown focus:outline-none"
                                >
                                    <option value="">Tidak ada produk referensi</option>
                                    {fitProductOptions.map((opt) => (
                                        <option key={opt.id} value={opt.id}>
                                            {opt.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                        <Link
                            href="/admin/products"
                            className="inline-flex items-center justify-center rounded-md border border-[#e5e1dc] bg-white px-6 py-2.5 font-sans text-sm font-semibold text-stone-700 hover:bg-[#faf8f5] transition"
                        >
                            Batal
                        </Link>

                        <div className="flex items-center gap-3">
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#8b7355] px-8 py-2.5 font-sans text-sm font-semibold text-white shadow-sm hover:bg-[#786348] focus:outline-none focus:ring-2 focus:ring-[#8b7355] focus:ring-offset-2 disabled:opacity-60 transition cursor-pointer"
                            >
                                {form.processing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Menyimpan...</span>
                                    </>
                                ) : (
                                    <span>{isEdit ? 'Update Product' : 'Create Product'}</span>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
