import { Head, Link, router, useForm } from '@inertiajs/react';
import { ChevronLeft, Loader2, Plus, Trash2, Upload } from 'lucide-react';
import * as React from 'react';
import { CategoryCombobox } from '@/components/admin/CategoryCombobox';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { VariantCombinationTable } from '@/components/admin/VariantCombinationTable';
import { VariantStockMatrix } from '@/components/admin/VariantStockMatrix';
import AdminLayout from '@/layouts/AdminLayout';
import { storageUrl } from '@/lib/utils';
import type { AdminCategory, AdminProduct } from '@/types/admin';

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
        price: product?.price ? Number(product.price) : ('' as unknown as number),
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
        is_preorder: Boolean(product?.is_preorder),
        preorder_estimate_days: product?.preorder_estimate_days ?? ('' as unknown as number),
        preorder_release_date: product?.preorder_release_date ?? '',
        preorder_note: product?.preorder_note ?? '',
        variants: (product?.variants?.length
            ? product.variants.filter((v) => v.color?.trim() && v.size?.trim())
            : []
        ).map((variant) => ({
            color: variant.color,
            size: variant.size,
            stock: Number(variant.stock) || 0,
            price: variant.price ?? null,
            component_key: variant.component_key ?? '',
        })),
        components: (product?.components ?? []).map((component) => ({
            id: component.id,
            key: component.key,
            name: component.name,
        })),
        offers: (product?.offers ?? []).map((offer) => ({
            id: offer.id,
            name: offer.name,
            price: Number(offer.price) || 0,
            component_keys: offer.component_keys,
        })),
        color_hexes: (product?.color_hexes ?? {}) as Record<string, string>,
        images: [] as File[],
        image_colors: [] as string[],
        existing_image_colors: (product?.images ?? []).reduce<Record<number, string>>((acc, image) => {
            if (image.color) {
                acc[image.id] = image.color;
            }
            return acc;
        }, {}),
        size_guide_order: [] as string[],
        new_size_guides: [] as File[],
    });

    const [imagePreviews, setImagePreviews] = React.useState<Array<{ file: File; url: string }>>([]);
    const [sizeGuides, setSizeGuides] = React.useState<Array<{ key: string; preview: string; token: string; file?: File }>>(
        () => (product?.size_guide_images ?? []).map((path, index) => ({
            key: `existing-${index}`,
            preview: storageUrl(path),
            token: `existing:${index}`,
        })),
    );

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
        form.setData('price', cleaned ? Number(cleaned) : ('' as unknown as number));
    };

    // Parse discount percent change
    const handleDiscountChange = (val: string) => {
        if (val === '') {
            form.setData('discount_percent', '' as unknown as number);
            return;
        }
        const num = Math.min(100, Math.max(0, Number(val) || 0));
        form.setData('discount_percent', num);
    };

    // Extract unique active colors from variants
    const activeProductColors = React.useMemo(() => {
        return Array.from(new Set(form.data.variants.map((v) => v.color?.trim()).filter(Boolean)));
    }, [form.data.variants]);

    const [pieceEditor, setPieceEditor] = React.useState((product?.components?.length ?? 0) > 0);
    const hasNamedTypes = form.data.components.some((component) => component.name.trim() !== '');

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        const freshGuides = sizeGuides.filter((item) => item.file);
        const guideIndexes = new Map(freshGuides.map((item, index) => [item.key, index]));
        form.transform((data) => ({
            ...data,
            ...(isEdit ? { _method: 'put' } : {}),
            size_guide_order: sizeGuides.map((item) => (item.file ? `new:${guideIndexes.get(item.key)}` : item.token)),
            new_size_guides: freshGuides.map((item) => item.file as File),
        }));

        form.post(isEdit && product?.id ? `/admin/products/${product.id}` : '/admin/products', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const [isDragging, setIsDragging] = React.useState(false);
    const [clientImageError, setClientImageError] = React.useState<string | null>(null);

    React.useEffect(() => {
        return () => {
            imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
        };
    }, []);

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

    const addFiles = (files: File[]) => {
        setClientImageError(null);
        const imageFiles = files.filter((file) =>
            file.type.startsWith('image/') || /\.(jpe?g|png|webp|gif|svg)$/i.test(file.name),
        );

        if (imageFiles.length === 0) {
            if (files.length > 0) {
                setClientImageError('File yang dipilih bukan format gambar yang didukung (JPG, PNG, WEBP).');
            }
            return;
        }

        const validFiles: File[] = [];
        const oversizedNames: string[] = [];

        for (const file of imageFiles) {
            if (file.size > MAX_FILE_SIZE) {
                oversizedNames.push(file.name);
            } else {
                validFiles.push(file);
            }
        }

        if (oversizedNames.length > 0) {
            setClientImageError(
                `Foto berikut melebihi batas 2MB: ${oversizedNames.join(', ')}. Silakan pilih foto dengan ukuran maksimal 2MB.`,
            );
        }

        if (validFiles.length === 0) return;

        const newPreviews = validFiles.map((file) => ({
            id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
            file,
            url: URL.createObjectURL(file),
        }));

        setImagePreviews((prev) => [...prev, ...newPreviews]);
        form.setData((prev) => ({
            ...prev,
            images: [...prev.images, ...validFiles],
            image_colors: [...prev.image_colors, ...validFiles.map(() => '')],
        }));
    };

    const addSizeGuides = (files: File[]) => {
        setClientImageError(null);
        const imageFiles = files.filter((file) => file.type.startsWith('image/') || /\.(jpe?g|png|webp)$/i.test(file.name));
        const room = 8 - sizeGuides.length;

        if (room <= 0) {
            setClientImageError('Panduan ukuran maksimal 8 gambar.');
            return;
        }

        const accepted = imageFiles.slice(0, room);
        const oversized = accepted.filter((file) => file.size > MAX_FILE_SIZE).map((file) => file.name);
        const valid = accepted.filter((file) => file.size <= MAX_FILE_SIZE);

        if (imageFiles.length > room) {
            setClientImageError('Panduan ukuran maksimal 8 gambar.');
        }

        if (oversized.length > 0) {
            setClientImageError(
                `Foto berikut melebihi batas 2MB: ${oversized.join(', ')}. Silakan pilih foto dengan ukuran maksimal 2MB.`,
            );
        }

        if (valid.length === 0) {
            return;
        }

        setSizeGuides((prev) => [
            ...prev,
            ...valid.map((file) => ({
                key: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
                preview: URL.createObjectURL(file),
                token: '',
                file,
            })),
        ]);
    };

    const removeSizeGuide = (index: number) => {
        setSizeGuides((prev) => {
            const item = prev[index];
            if (item?.file) {
                URL.revokeObjectURL(item.preview);
            }
            return prev.filter((_, itemIndex) => itemIndex !== index);
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        addFiles(files);
        e.target.value = '';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.currentTarget.contains(e.relatedTarget as Node)) return;
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
            addFiles(Array.from(e.dataTransfer.files));
        }
    };

    const removeNewImage = (index: number) => {
        setImagePreviews((prev) => {
            if (prev[index]) {
                URL.revokeObjectURL(prev[index].url);
            }
            return prev.filter((_, i) => i !== index);
        });
        form.setData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
            image_colors: prev.image_colors.filter((_, i) => i !== index),
        }));
    };

    const makeCoverImage = (index: number) => {
        if (index === 0) return;
        setImagePreviews((prev) => {
            const target = prev[index];
            if (!target) return prev;
            return [target, ...prev.filter((_, i) => i !== index)];
        });
        form.setData((prev) => {
            const targetFile = prev.images[index];
            const targetColor = prev.image_colors[index];
            if (!targetFile) return prev;
            return {
                ...prev,
                images: [targetFile, ...prev.images.filter((_, i) => i !== index)],
                image_colors: [targetColor, ...prev.image_colors.filter((_, i) => i !== index)],
            };
        });
    };

    const renderUploadTile = () => (
        <label
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition cursor-pointer min-h-[190px] h-full p-4 text-center ${
                isDragging
                    ? 'border-warm-brown bg-warm-brown/10 ring-2 ring-warm-brown/30 scale-[0.98]'
                    : 'border-[#e5e1dc] bg-[#faf8f5] hover:border-warm-brown hover:bg-stone-50'
            }`}
        >
            <div className="pointer-events-none flex flex-col items-center justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-200/70 text-stone-600 group-hover:bg-warm-brown group-hover:text-white group-hover:scale-110 transition-all mb-2 shadow-sm">
                    <Plus className="h-5 w-5" />
                </div>
                <span className="font-sans text-xs font-semibold text-stone-700 group-hover:text-stone-900">
                    Tambah Foto
                </span>
                <span className="mt-1 font-sans text-[11px] text-stone-400">
                    atau seret ke sini
                </span>
                <span className="mt-1 font-sans text-[10px] text-stone-400">
                    Maks 2MB
                </span>
            </div>
            <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg,image/*"
                multiple
                onChange={handleFileChange}
                onClick={(e) => e.stopPropagation()}
                className="sr-only"
            />
        </label>
    );

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
                                <div className="flex h-11 w-full rounded-md border border-[#e5e1dc] bg-[#faf8f5] focus-within:border-warm-brown focus-within:bg-white focus-within:ring-1 focus-within:ring-warm-brown transition-colors overflow-hidden">
                                    <span className="flex items-center justify-center bg-[#f0ede8] px-3.5 text-xs font-bold text-stone-700 border-r border-[#e5e1dc] select-none tracking-wider">
                                        Rp
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="0"
                                        value={
                                            form.data.price !== null &&
                                            form.data.price !== undefined &&
                                            String(form.data.price) !== ''
                                                ? formatNumber(Number(form.data.price))
                                                : ''
                                        }
                                        onChange={(e) => handlePriceChange(e.target.value)}
                                        readOnly={hasNamedTypes || form.data.offers.length > 0}
                                        className="flex-1 bg-transparent px-3.5 text-sm font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none read-only:text-stone-500"
                                        required
                                    />
                                </div>
                                {(hasNamedTypes || form.data.offers.length > 0) && (
                                    <p className="mt-1 text-xs text-stone-500">
                                        Harga kartu mengikuti opsi termurah.
                                    </p>
                                )}
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
                                    value={
                                        form.data.discount_percent !== null &&
                                        form.data.discount_percent !== undefined &&
                                        String(form.data.discount_percent) !== ''
                                            ? form.data.discount_percent
                                            : ''
                                    }
                                    onChange={(e) => handleDiscountChange(e.target.value)}
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

                    {form.data.components.length === 0 && !pieceEditor ? (
                        <>
                            <VariantStockMatrix
                                variants={form.data.variants}
                                colorHexes={form.data.color_hexes}
                                availableColors={variantOptions.colors}
                                availableSizes={variantOptions.sizes}
                                onChangeVariants={(updatedVariants) => form.setData('variants', updatedVariants)}
                                onChangeColorHexes={(updatedHexes) => form.setData('color_hexes', updatedHexes)}
                                error={
                                    form.errors.variants ||
                                    Object.entries(form.errors).find(([k]) => k.startsWith('variants.'))?.[1]
                                }
                            />
                            <div className="rounded-2xl border border-[#e5e1dc] bg-white p-6 shadow-sm sm:p-8">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-stone-800">
                                            Jual per tipe
                                        </h2>
                                        <p className="mt-1 font-sans text-xs text-stone-500">
                                            Untuk artikel seperti setelan tunik dan rok. Contoh: warna Dark Denim, ukuran S/M, tipe Tunik dan Rok. Setiap tipe punya stok dan harga sendiri.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setPieceEditor(true)}
                                        className="inline-flex items-center gap-1.5 rounded-md border border-[#e5e1dc] px-3 py-2 text-xs font-semibold text-stone-700 hover:border-warm-brown hover:text-warm-brown"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Tambah tipe
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <VariantCombinationTable
                            components={form.data.components}
                            offers={form.data.offers}
                            variants={form.data.variants}
                            colorHexes={form.data.color_hexes}
                            fallbackPrice={Number(form.data.price) || 0}
                            onChange={(next) => {
                                if (next.components.length === 0 && form.data.components.length > 0) {
                                    setPieceEditor(false);
                                }
                                form.setData({ ...form.data, ...next });
                            }}
                            error={
                                form.errors.components ||
                                form.errors.offers ||
                                form.errors.variants ||
                                Object.entries(form.errors).find(([key]) => key.startsWith('offers.') || key.startsWith('components.') || key.startsWith('variants.'))?.[1]
                            }
                        />
                    )}

                    <div className="space-y-6 rounded-2xl border border-[#e5e1dc] bg-white p-6 shadow-sm sm:p-8">
                        <div>
                            <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-stone-800">
                                Panduan ukuran
                            </h2>
                            <p className="mt-1 font-sans text-xs text-stone-500">
                                Unggah gambar saja. Bisa lebih dari satu. Pembeli melihatnya di popup, dengan panah kiri dan kanan.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {sizeGuides.map((item, index) => (
                                <div key={item.key} className="overflow-hidden rounded-2xl border border-[#e5e1dc] bg-white">
                                    <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                                        <img src={item.preview} alt="" className="h-full w-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeSizeGuide(index)}
                                            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-stone-900 shadow-sm"
                                            aria-label={`Hapus panduan ukuran ${index + 1}`}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                        <span className="absolute left-2 top-2 rounded-full bg-stone-950/90 px-2 py-0.5 text-[10px] text-white">
                                            {index + 1}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {sizeGuides.length < 8 && (
                                <label className="flex aspect-[3/4] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 text-stone-500 hover:border-stone-500">
                                    <Plus className="h-6 w-6" />
                                    <span className="mt-1 px-3 text-center text-sm">Tambah gambar panduan</span>
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        multiple
                                        className="hidden"
                                        onChange={(event) => {
                                            addSizeGuides(Array.from(event.target.files ?? []));
                                            event.target.value = '';
                                        }}
                                    />
                                </label>
                            )}
                        </div>
                        {(form.errors.new_size_guides || form.errors.size_guide_order) && (
                            <p className="font-sans text-xs text-red-600">
                                {form.errors.new_size_guides || form.errors.size_guide_order}
                            </p>
                        )}
                    </div>

                    {/* SECTION: PRODUCT IMAGES */}
                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
                                addFiles(Array.from(e.dataTransfer.files));
                            }
                        }}
                        className="rounded-2xl border border-[#e5e1dc] bg-white p-6 sm:p-8 shadow-sm space-y-6"
                    >
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
                                                    src={storageUrl(image.image_path)}
                                                    alt={image.color || 'Product image'}
                                                    onError={(e) => {
                                                        e.currentTarget.src = '/images/placeholder-product.svg';
                                                    }}
                                                    className="h-full w-full object-cover"
                                                />
                                                {idx === 0 && (
                                                    <span className="absolute left-2 top-2 rounded bg-stone-900/85 px-2 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wider">
                                                        Cover Utama
                                                    </span>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (confirm('Apakah Anda yakin ingin menghapus foto ini?')) {
                                                            router.delete(`/admin/products/images/${image.id}`, {
                                                                preserveScroll: true,
                                                            });
                                                        }
                                                    }}
                                                    className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-600/90 text-white shadow hover:bg-red-700 transition"
                                                    title="Hapus foto dari produk"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-medium text-stone-500 mb-1">
                                                    Tag Warna (opsional)
                                                </label>
                                                <input
                                                    type="text"
                                                    list="active-product-colors"
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
                                    {imagePreviews.length === 0 && renderUploadTile()}
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
                                            key={item.id}
                                            className="relative rounded-xl border border-warm-brown/30 bg-[#faf8f5] p-2.5 space-y-2"
                                        >
                                            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-stone-100">
                                                <img
                                                    src={item.url}
                                                    alt={`Preview ${idx + 1}`}
                                                    className="h-full w-full object-cover"
                                                />
                                                {idx === 0 ? (
                                                    <span className="absolute left-2 top-2 rounded bg-stone-900/85 px-2 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wider shadow-xs">
                                                        Cover Utama
                                                    </span>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => makeCoverImage(idx)}
                                                        className="absolute left-2 top-2 rounded bg-white/90 backdrop-blur-xs px-2 py-0.5 text-[10px] font-medium text-stone-700 hover:bg-stone-900 hover:text-white transition shadow-xs"
                                                    >
                                                        Jadikan Cover
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(idx)}
                                                    className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow hover:bg-red-700 transition"
                                                    title="Batalkan foto"
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
                                                    list="active-product-colors"
                                                    placeholder="e.g. Putih"
                                                    value={form.data.image_colors[idx] ?? ''}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        form.setData((prev) => {
                                                            const updated = [...prev.image_colors];
                                                            updated[idx] = val;
                                                            return { ...prev, image_colors: updated };
                                                        });
                                                    }}
                                                    className="h-8 w-full rounded border border-[#e5e1dc] bg-white px-2 text-xs text-stone-800 focus:border-warm-brown focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {renderUploadTile()}
                                </div>
                            </div>
                        )}

                        {/* Empty State Dropzone: Only when no existing images and no previews */}
                        {(!product?.images || product.images.length === 0) && imagePreviews.length === 0 && (
                            <label
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition cursor-pointer ${
                                    isDragging
                                        ? 'border-warm-brown bg-warm-brown/10 ring-2 ring-warm-brown/30 scale-[0.99]'
                                        : 'border-[#e5e1dc] bg-[#faf8f5]/80 hover:border-warm-brown hover:bg-[#faf8f5]'
                                }`}
                            >
                                <div className="pointer-events-none flex flex-col items-center justify-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-200/60 text-stone-600 mb-3">
                                        <Upload className="h-5 w-5" />
                                    </div>
                                    <p className="font-sans text-sm font-semibold text-stone-800">
                                        Klik untuk memilih foto atau seret foto ke sini
                                    </p>
                                    <p className="mt-1 font-sans text-xs text-stone-500">
                                        Mendukung format JPG, PNG, WEBP hingga 2MB
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/jpg,image/*"
                                    multiple
                                    onChange={handleFileChange}
                                    onClick={(e) => e.stopPropagation()}
                                    className="sr-only"
                                />
                            </label>
                        )}

                        {/* Image validation error messages */}
                        {(clientImageError ||
                            form.errors.images ||
                            Object.entries(form.errors).find(([k]) => k.startsWith('images.'))?.[1]) && (
                            <p className="text-xs text-red-500 font-medium">
                                {clientImageError ||
                                    form.errors.images ||
                                    Object.entries(form.errors).find(([k]) => k.startsWith('images.'))?.[1]}
                            </p>
                        )}
                        {(form.errors.image_colors ||
                            Object.entries(form.errors).find(([k]) => k.startsWith('image_colors.'))?.[1]) && (
                            <p className="text-xs text-red-500 font-medium">
                                {form.errors.image_colors ||
                                    Object.entries(form.errors).find(([k]) => k.startsWith('image_colors.'))?.[1]}
                            </p>
                        )}
                        {form.errors.existing_image_colors && (
                            <p className="text-xs text-red-500 font-medium">{form.errors.existing_image_colors}</p>
                        )}

                        {/* Datalist for Color Tags */}
                        <datalist id="active-product-colors">
                            {activeProductColors.map((color) => (
                                <option key={color} value={color} />
                            ))}
                        </datalist>
                    </div>

                    {/* SECTION: PRE-ORDER SETTINGS */}
                    <div className="rounded-2xl border border-[#e5e1dc] bg-white p-6 sm:p-8 shadow-sm space-y-5">
                        <div>
                            <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-stone-800">
                                SISTEM PRE-ORDER
                            </h2>
                            <p className="mt-1 font-sans text-xs text-stone-500">
                                Aktifkan jika produk ini dijual dengan sistem Pre-Order (PO).
                            </p>
                        </div>

                        <label className="flex items-start gap-3 rounded-xl border border-[#ece8e3] bg-[#faf8f5] p-4 cursor-pointer hover:bg-[#f5f3ef] transition">
                            <input
                                type="checkbox"
                                checked={form.data.is_preorder}
                                onChange={(e) => form.setData('is_preorder', e.target.checked)}
                                className="mt-1 h-4 w-4 rounded border-stone-300 text-warm-brown focus:ring-warm-brown"
                            />
                            <div>
                                <span className="block font-sans text-sm font-semibold text-stone-800">
                                    Aktifkan Mode Pre-Order untuk Produk Ini
                                </span>
                                <span className="block font-sans text-xs text-stone-500 mt-0.5">
                                    Tombol pembelian akan berubah menjadi "Pre-Order Sekarang" dan pesanan yang lunas akan masuk antrean Pre-Order / Dalam Produksi. Stok pada matriks varian akan menjadi kuota maksimal PO.
                                </span>
                            </div>
                        </label>

                        {form.data.is_preorder && (
                            <div className="space-y-4 rounded-xl border border-warm-brown/25 bg-[#faf8f5]/60 p-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* ESTIMASI HARI KERJA */}
                                    <div>
                                        <label className="block font-sans text-xs font-bold uppercase tracking-wide text-stone-700 mb-2">
                                            ESTIMASI PRODUKSI (HARI KERJA)
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="e.g. 14"
                                            value={form.data.preorder_estimate_days !== '' && form.data.preorder_estimate_days !== null && form.data.preorder_estimate_days !== undefined ? form.data.preorder_estimate_days : ''}
                                            onChange={(e) =>
                                                form.setData('preorder_estimate_days', e.target.value ? Number(e.target.value) : ('' as unknown as number))
                                            }
                                            className="flex h-11 w-full rounded-md border border-[#e5e1dc] bg-white px-3.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-warm-brown focus:outline-none focus:ring-1 focus:ring-warm-brown transition-colors"
                                        />
                                        <p className="mt-1 font-sans text-[11px] text-stone-500">
                                            Contoh: 14 (akan tampil: "Estimasi pengiriman: 14 hari kerja").
                                        </p>
                                        {form.errors.preorder_estimate_days && (
                                            <p className="mt-1 text-xs text-red-500">{form.errors.preorder_estimate_days}</p>
                                        )}
                                    </div>

                                    {/* TANGGAL RILIS SPESIFIK */}
                                    <div>
                                        <label className="block font-sans text-xs font-bold uppercase tracking-wide text-stone-700 mb-2">
                                            TANGGAL RILIS / MULAI KIRIM (OPSIONAL)
                                        </label>
                                        <input
                                            type="date"
                                            value={form.data.preorder_release_date ?? ''}
                                            onChange={(e) => form.setData('preorder_release_date', e.target.value)}
                                            className="flex h-11 w-full rounded-md border border-[#e5e1dc] bg-white px-3.5 text-sm text-stone-800 focus:border-warm-brown focus:outline-none focus:ring-1 focus:ring-warm-brown transition-colors"
                                        />
                                        <p className="mt-1 font-sans text-[11px] text-stone-500">
                                            Isi jika ada tanggal pasti (akan tampil: "Estimasi pengiriman: Mulai [Tanggal]").
                                        </p>
                                        {form.errors.preorder_release_date && (
                                            <p className="mt-1 text-xs text-red-500">{form.errors.preorder_release_date}</p>
                                        )}
                                    </div>
                                </div>

                                {/* CATATAN PO */}
                                <div>
                                    <label className="block font-sans text-xs font-bold uppercase tracking-wide text-stone-700 mb-2">
                                        CATATAN KHUSUS PRE-ORDER (OPSIONAL)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Batch 1 diproduksi terbatas, pengiriman berurutan sesuai invoice"
                                        value={form.data.preorder_note ?? ''}
                                        onChange={(e) => form.setData('preorder_note', e.target.value)}
                                        className="flex h-11 w-full rounded-md border border-[#e5e1dc] bg-white px-3.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-warm-brown focus:outline-none focus:ring-1 focus:ring-warm-brown transition-colors"
                                    />
                                    {form.errors.preorder_note && (
                                        <p className="mt-1 text-xs text-red-500">{form.errors.preorder_note}</p>
                                    )}
                                </div>
                            </div>
                        )}
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
