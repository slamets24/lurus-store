import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
        category_id: product?.category_id ?? '',
        category_name: product?.category_name ?? product?.category?.name ?? '',
        material: product?.material ?? '',
        shopee_url: product?.shopee_url ?? '',
        tokopedia_url: product?.tokopedia_url ?? '',
        tiktok_url: product?.tiktok_url ?? '',
        related_fit_product_id: product?.related_fit_product_id ?? '',
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

    return (
        <AdminLayout title={isEdit ? 'Edit Product' : 'New Product'}>
            <Head title={isEdit ? 'Edit Product' : 'New Product'} />

            <div className="mx-auto max-w-4xl space-y-6">
                <AdminPageHeader
                    title={isEdit ? 'Edit Product' : 'New Product'}
                    description={isEdit ? product?.name : 'Create a new product listing.'}
                />

                <form onSubmit={submit} className="space-y-6">
                    <section className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 space-y-4">
                        <h2 className="font-serif text-xl text-primary">Basic Info</h2>
                        <Input
                            placeholder="Product name"
                            value={form.data.name}
                            onChange={(event) => form.setData('name', event.target.value)}
                        />
                        {form.errors.name ? <p className="text-sm text-error">{form.errors.name}</p> : null}

                        <textarea
                            rows={5}
                            placeholder="Description (HTML allowed)"
                            value={form.data.description}
                            onChange={(event) => form.setData('description', event.target.value)}
                            className="w-full rounded-sm border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm"
                        />

                        <div className="grid gap-3 sm:grid-cols-2">
                            <Input
                                type="number"
                                placeholder="Price"
                                value={form.data.price}
                                onChange={(event) => form.setData('price', Number(event.target.value))}
                            />
                            <Input
                                type="number"
                                placeholder="Discount %"
                                value={form.data.discount_percent}
                                onChange={(event) => form.setData('discount_percent', Number(event.target.value))}
                            />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <Input
                                placeholder="SKU"
                                value={form.data.sku}
                                onChange={(event) => form.setData('sku', event.target.value)}
                            />
                            <Input
                                placeholder="Material"
                                value={form.data.material}
                                onChange={(event) => form.setData('material', event.target.value)}
                            />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <label className="text-sm">
                                <span className="mb-1 block text-on-surface-variant">Category</span>
                                <select
                                    value={form.data.category_id}
                                    onChange={(event) => {
                                        const id = event.target.value;
                                        const selected = categories.find((cat) => String(cat.id) === id);
                                        form.setData({
                                            ...form.data,
                                            category_id: id,
                                            category_name: selected?.name ?? form.data.category_name,
                                        });
                                    }}
                                    className="h-10 w-full rounded-sm border border-outline-variant bg-surface-container-lowest px-3"
                                >
                                    <option value="">Select category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <Input
                                placeholder="Or new category name"
                                value={form.data.category_name}
                                onChange={(event) => form.setData('category_name', event.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={form.data.is_active}
                                    onChange={(event) => form.setData('is_active', event.target.checked)}
                                />
                                Published
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={form.data.is_featured}
                                    onChange={(event) => form.setData('is_featured', event.target.checked)}
                                />
                                Featured
                            </label>
                        </div>
                    </section>

                    <section className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-serif text-xl text-primary">Variants</h2>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => form.setData('variants', [...form.data.variants, emptyVariant()])}
                            >
                                <Plus className="mr-1 h-4 w-4" /> Add Variant
                            </Button>
                        </div>

                        {form.data.variants.map((variant, index) => (
                            <div key={index} className="grid gap-2 rounded-lg border border-outline-variant/20 p-3 sm:grid-cols-4">
                                <Input
                                    list="color-options"
                                    placeholder="Color"
                                    value={variant.color}
                                    onChange={(event) => updateVariant(index, 'color', event.target.value)}
                                />
                                <Input
                                    list="size-options"
                                    placeholder="Size"
                                    value={variant.size}
                                    onChange={(event) => updateVariant(index, 'size', event.target.value)}
                                />
                                <Input
                                    type="number"
                                    placeholder="Stock"
                                    value={variant.stock}
                                    onChange={(event) => updateVariant(index, 'stock', Number(event.target.value))}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    disabled={form.data.variants.length <= 1}
                                    onClick={() =>
                                        form.setData(
                                            'variants',
                                            form.data.variants.filter((_, rowIndex) => rowIndex !== index),
                                        )
                                    }
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}

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
                    </section>

                    <section className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 space-y-4">
                        <h2 className="font-serif text-xl text-primary">Marketplace Links</h2>
                        <Input
                            placeholder="Shopee URL"
                            value={form.data.shopee_url}
                            onChange={(event) => form.setData('shopee_url', event.target.value)}
                        />
                        <Input
                            placeholder="Tokopedia URL"
                            value={form.data.tokopedia_url}
                            onChange={(event) => form.setData('tokopedia_url', event.target.value)}
                        />
                        <Input
                            placeholder="TikTok URL"
                            value={form.data.tiktok_url}
                            onChange={(event) => form.setData('tiktok_url', event.target.value)}
                        />
                        <select
                            value={form.data.related_fit_product_id}
                            onChange={(event) => form.setData('related_fit_product_id', event.target.value)}
                            className="h-10 w-full rounded-sm border border-outline-variant bg-surface-container-lowest px-3 text-sm"
                        >
                            <option value="">Related fit product (optional)</option>
                            {fitProductOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    </section>

                    <section className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 space-y-4">
                        <h2 className="font-serif text-xl text-primary">Images</h2>
                        {product?.images?.length ? (
                            <div className="grid gap-3 sm:grid-cols-3">
                                {product.images.map((image) => (
                                    <div key={image.id} className="rounded-lg border border-outline-variant/20 p-2">
                                        <img
                                            src={`/storage/${image.image_path}`}
                                            alt=""
                                            className="aspect-square w-full rounded-sm object-cover"
                                        />
                                        <Input
                                            placeholder="Color tag"
                                            className="mt-2"
                                            value={form.data.existing_image_colors[image.id] ?? ''}
                                            onChange={(event) =>
                                                form.setData('existing_image_colors', {
                                                    ...form.data.existing_image_colors,
                                                    [image.id]: event.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : null}
                        <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(event) => {
                                const files = Array.from(event.target.files ?? []);
                                form.setData('images', files);
                                form.setData('image_colors', files.map(() => ''));
                            }}
                        />
                    </section>

                    <div className="flex gap-3">
                        <Button type="submit" variant="accent" disabled={form.processing}>
                            {isEdit ? 'Update Product' : 'Create Product'}
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/admin/products">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
