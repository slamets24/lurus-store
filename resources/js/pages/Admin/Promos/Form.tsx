import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/layouts/AdminLayout';
import { cn } from '@/lib/utils';

interface PromoFormData {
    id?: number;
    name: string;
    type: 'bxgy' | 'bundle';
    is_active: boolean;
    scope: 'products' | 'categories' | 'all';
    buy_qty: number | null;
    free_qty: number | null;
    free_pick?: string;
    min_unit_price?: number | null;
    package_price: number | null;
    target_ids: number[];
    components: Array<{ product_id: number; quantity: number }>;
}

interface PromosFormProps {
    promo?: PromoFormData | null;
    products: Array<{ id: number; name: string; price: number; effective_price?: number }>;
    categories: Array<{ id: number; name: string }>;
}

export default function PromosForm({ promo, products, categories }: PromosFormProps) {
    const isEdit = Boolean(promo?.id);

    const form = useForm({
        name: promo?.name ?? '',
        type: promo?.type ?? 'bxgy',
        is_active: promo?.is_active ?? true,
        scope: promo?.scope ?? 'all',
        buy_qty: promo?.buy_qty ?? 2,
        free_qty: promo?.free_qty ?? 1,
        free_pick: promo?.free_pick ?? 'cheapest',
        min_unit_price: promo?.min_unit_price ?? '',
        package_price: promo?.package_price ?? '',
        target_ids: promo?.target_ids ?? [],
        components: promo?.components?.length ? promo.components : [{ product_id: products[0]?.id ?? 0, quantity: 1 }],
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        if (isEdit && promo?.id) {
            form.put(`/admin/promos/${promo.id}`);
            return;
        }

        form.post('/admin/promos');
    };

    const toggleTarget = (id: number) => {
        const ids = form.data.target_ids;
        form.setData('target_ids', ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]);
    };

    const targetOptions = form.data.scope === 'categories' ? categories : products;

    return (
        <AdminLayout title={isEdit ? 'Edit Promo' : 'New Promo'}>
            <Head title={isEdit ? 'Edit Promo' : 'New Promo'} />

            <div className="mx-auto max-w-3xl space-y-6">
                <AdminPageHeader title={isEdit ? 'Edit Promo' : 'New Promo'} />

                <form onSubmit={submit} className="space-y-6">
                    <section className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 space-y-4">
                        <Input
                            placeholder="Promo name"
                            value={form.data.name}
                            onChange={(event) => form.setData('name', event.target.value)}
                        />
                        <div className="grid gap-3 sm:grid-cols-2">
                            <select
                                value={form.data.type}
                                onChange={(event) => form.setData('type', event.target.value as 'bxgy' | 'bundle')}
                                className="h-10 rounded-sm border border-outline-variant px-3 text-sm"
                            >
                                <option value="bxgy">Buy X Get Y</option>
                                <option value="bundle">Bundle</option>
                            </select>
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={form.data.is_active}
                                    onChange={(event) => form.setData('is_active', event.target.checked)}
                                />
                                Active
                            </label>
                        </div>
                    </section>

                    {form.data.type === 'bxgy' ? (
                        <section className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 space-y-4">
                            <h2 className="font-serif text-xl text-primary">Buy X Get Y</h2>
                            <div className="grid gap-3 sm:grid-cols-3">
                                <Input
                                    type="number"
                                    placeholder="Buy qty"
                                    value={form.data.buy_qty}
                                    onChange={(event) => form.setData('buy_qty', Number(event.target.value))}
                                />
                                <Input
                                    type="number"
                                    placeholder="Free qty"
                                    value={form.data.free_qty}
                                    onChange={(event) => form.setData('free_qty', Number(event.target.value))}
                                />
                                <select
                                    value={form.data.scope}
                                    onChange={(event) =>
                                        form.setData('scope', event.target.value as PromoFormData['scope'])
                                    }
                                    className="h-10 rounded-sm border border-outline-variant px-3 text-sm"
                                >
                                    <option value="all">All products</option>
                                    <option value="products">Specific products</option>
                                    <option value="categories">Categories</option>
                                </select>
                            </div>
                            {form.data.scope !== 'all' ? (
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {targetOptions.map((option) => (
                                        <label
                                            key={option.id}
                                            className={cn(
                                                'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm',
                                                form.data.target_ids.includes(option.id)
                                                    ? 'border-warm-brown bg-warm-brown/5'
                                                    : 'border-outline-variant/20',
                                            )}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={form.data.target_ids.includes(option.id)}
                                                onChange={() => toggleTarget(option.id)}
                                            />
                                            {option.name}
                                        </label>
                                    ))}
                                </div>
                            ) : null}
                        </section>
                    ) : (
                        <section className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 space-y-4">
                            <h2 className="font-serif text-xl text-primary">Bundle</h2>
                            <Input
                                type="number"
                                placeholder="Package price"
                                value={form.data.package_price}
                                onChange={(event) => form.setData('package_price', Number(event.target.value))}
                            />
                            {form.data.components.map((component, index) => (
                                <div key={index} className="grid gap-2 sm:grid-cols-[1fr_120px_auto]">
                                    <select
                                        value={component.product_id}
                                        onChange={(event) => {
                                            const components = [...form.data.components];
                                            components[index] = {
                                                ...components[index],
                                                product_id: Number(event.target.value),
                                            };
                                            form.setData('components', components);
                                        }}
                                        className="h-10 rounded-sm border border-outline-variant px-3 text-sm"
                                    >
                                        {products.map((product) => (
                                            <option key={product.id} value={product.id}>
                                                {product.name}
                                            </option>
                                        ))}
                                    </select>
                                    <Input
                                        type="number"
                                        value={component.quantity}
                                        onChange={(event) => {
                                            const components = [...form.data.components];
                                            components[index] = {
                                                ...components[index],
                                                quantity: Number(event.target.value),
                                            };
                                            form.setData('components', components);
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            form.setData(
                                                'components',
                                                form.data.components.filter((_, rowIndex) => rowIndex !== index),
                                            )
                                        }
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    form.setData('components', [
                                        ...form.data.components,
                                        { product_id: products[0]?.id ?? 0, quantity: 1 },
                                    ])
                                }
                            >
                                <Plus className="mr-1 h-4 w-4" /> Add Item
                            </Button>
                        </section>
                    )}

                    <div className="flex gap-3">
                        <Button type="submit" variant="accent" disabled={form.processing}>
                            {isEdit ? 'Update Promo' : 'Create Promo'}
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/admin/promos">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
