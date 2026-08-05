import { Head, Link, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/layouts/AdminLayout';
import { cn } from '@/lib/utils';

interface CollectionFormData {
    id?: number;
    name: string;
    slug: string;
    description: string | null;
    subtitle: string | null;
    banner_image: string | null;
    is_active: boolean;
    sort_order: number;
}

interface CollectionsFormProps {
    collection?: CollectionFormData | null;
    products: Array<{ id: number; name: string; slug: string; price: number }>;
    assignedProductIds: number[];
}

export default function CollectionsForm({ collection, products, assignedProductIds }: CollectionsFormProps) {
    const isEdit = Boolean(collection?.id);

    const form = useForm({
        name: collection?.name ?? '',
        slug: collection?.slug ?? '',
        description: collection?.description ?? '',
        subtitle: collection?.subtitle ?? '',
        is_active: collection?.is_active ?? true,
        sort_order: collection?.sort_order ?? 0,
        banner_image: null as File | null,
        product_ids: [...assignedProductIds],
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        if (isEdit && collection?.id) {
            form.transform((data) => ({ ...data, _method: 'put' }));
            form.post(`/admin/collections/${collection.id}`, {
                forceFormData: true,
                preserveScroll: true,
            });
            return;
        }

        form.post('/admin/collections', { forceFormData: true });
    };

    const toggleProduct = (productId: number) => {
        const ids = form.data.product_ids;
        form.setData('product_ids', ids.includes(productId) ? ids.filter((id) => id !== productId) : [...ids, productId]);
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Collection' : 'New Collection'}>
            <Head title={isEdit ? 'Edit Collection' : 'New Collection'} />

            <div className="mx-auto max-w-3xl space-y-6">
                <AdminPageHeader title={isEdit ? 'Edit Collection' : 'New Collection'} />

                <form onSubmit={submit} className="space-y-6">
                    <section className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 space-y-4">
                        <Input
                            placeholder="Name"
                            value={form.data.name}
                            onChange={(event) => form.setData('name', event.target.value)}
                        />
                        <Input
                            placeholder="Slug"
                            value={form.data.slug}
                            onChange={(event) => form.setData('slug', event.target.value)}
                        />
                        <Input
                            placeholder="Subtitle"
                            value={form.data.subtitle}
                            onChange={(event) => form.setData('subtitle', event.target.value)}
                        />
                        <textarea
                            rows={4}
                            placeholder="Description"
                            value={form.data.description}
                            onChange={(event) => form.setData('description', event.target.value)}
                            className="w-full rounded-sm border border-outline-variant px-3 py-2 text-sm"
                        />
                        <Input
                            type="number"
                            placeholder="Sort order"
                            value={form.data.sort_order}
                            onChange={(event) => form.setData('sort_order', Number(event.target.value))}
                        />
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={form.data.is_active}
                                onChange={(event) => form.setData('is_active', event.target.checked)}
                            />
                            Active
                        </label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(event) => form.setData('banner_image', event.target.files?.[0] ?? null)}
                        />
                    </section>

                    <section className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6">
                        <h2 className="font-serif text-xl text-primary">Products</h2>
                        <div className="mt-4 max-h-80 space-y-2 overflow-y-auto">
                            {products.map((product) => (
                                <label
                                    key={product.id}
                                    className={cn(
                                        'flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm',
                                        form.data.product_ids.includes(product.id)
                                            ? 'border-warm-brown bg-warm-brown/5'
                                            : 'border-outline-variant/20',
                                    )}
                                >
                                    <input
                                        type="checkbox"
                                        checked={form.data.product_ids.includes(product.id)}
                                        onChange={() => toggleProduct(product.id)}
                                    />
                                    {product.name}
                                </label>
                            ))}
                        </div>
                    </section>

                    <div className="flex gap-3">
                        <Button type="submit" variant="accent" disabled={form.processing}>
                            {isEdit ? 'Update' : 'Create'}
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/admin/collections">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
