import { Head, Link, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/layouts/AdminLayout';

interface CategoryFormData {
    id?: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    size_chart_url?: string | null;
    parent_id: number | null;
    is_active: boolean;
    sort_order: number | null;
}

interface CategoriesFormProps {
    category?: CategoryFormData | null;
    parentCategories: Array<{ id: number; name: string }>;
}

export default function CategoriesForm({ category, parentCategories }: CategoriesFormProps) {
    const isEdit = Boolean(category?.id);

    const form = useForm({
        name: category?.name ?? '',
        slug: category?.slug ?? '',
        description: category?.description ?? '',
        parent_id: category?.parent_id ?? '',
        is_active: category?.is_active ?? true,
        sort_order: category?.sort_order ?? 0,
        image: null as File | null,
        size_chart: null as File | null,
        remove_size_chart: false,
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        if (isEdit && category?.id) {
            form.transform((data) => ({ ...data, _method: 'put' }));
            form.post(`/admin/categories/${category.id}`, {
                forceFormData: true,
                preserveScroll: true,
            });
            return;
        }

        form.post('/admin/categories', { forceFormData: true });
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Category' : 'New Category'}>
            <Head title={isEdit ? 'Edit Category' : 'New Category'} />

            <div className="mx-auto max-w-2xl space-y-6">
                <AdminPageHeader title={isEdit ? 'Edit Category' : 'New Category'} />

                <form onSubmit={submit} className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 space-y-4">
                    <Input
                        placeholder="Name"
                        value={form.data.name}
                        onChange={(event) => form.setData('name', event.target.value)}
                    />
                    <Input
                        placeholder="Slug (optional)"
                        value={form.data.slug}
                        onChange={(event) => form.setData('slug', event.target.value)}
                    />
                    <textarea
                        rows={4}
                        placeholder="Description"
                        value={form.data.description}
                        onChange={(event) => form.setData('description', event.target.value)}
                        className="w-full rounded-sm border border-outline-variant px-3 py-2 text-sm"
                    />
                    <select
                        value={form.data.parent_id}
                        onChange={(event) => form.setData('parent_id', event.target.value)}
                        className="h-10 w-full rounded-sm border border-outline-variant px-3 text-sm"
                    >
                        <option value="">No parent</option>
                        {parentCategories.map((parent) => (
                            <option key={parent.id} value={parent.id}>
                                {parent.name}
                            </option>
                        ))}
                    </select>
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
                    <label className="block text-sm">
                        <span className="mb-1 block text-on-surface-variant">Category image</span>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(event) => form.setData('image', event.target.files?.[0] ?? null)}
                        />
                    </label>
                    <label className="block text-sm">
                        <span className="mb-1 block text-on-surface-variant">Size chart</span>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(event) => form.setData('size_chart', event.target.files?.[0] ?? null)}
                        />
                    </label>
                    {category?.size_chart_url ? (
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={form.data.remove_size_chart}
                                onChange={(event) => form.setData('remove_size_chart', event.target.checked)}
                            />
                            Remove existing size chart
                        </label>
                    ) : null}

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" variant="accent" disabled={form.processing}>
                            {isEdit ? 'Update' : 'Create'}
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/admin/categories">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
