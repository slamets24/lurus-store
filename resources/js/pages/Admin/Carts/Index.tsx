import { Head, router, usePage } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/AdminLayout';
import { formatDateTime } from '@/lib/format';
import type { AuthProps } from '@/types';

interface CartItemRow {
    id: number;
    sku?: string | null;
    quantity: number;
    size?: string | null;
    color?: string | null;
    product: {
        name: string;
        slug: string;
        category: string;
    } | null;
}

interface CartGroup {
    owner_type: 'customer' | 'guest';
    owner_name: string;
    owner_email?: string | null;
    last_activity: string | null;
    total_quantity: number;
    items: CartItemRow[];
}

interface CartsIndexProps {
    carts: CartGroup[];
    totalQuantity: number;
}

export default function CartsIndex({ carts, totalQuantity }: CartsIndexProps) {
    const { auth } = usePage<{ auth: AuthProps }>().props;
    const isSuperAdmin = auth?.isSuperAdmin ?? false;

    return (
        <AdminLayout title="Carts">
            <Head title="Carts" />

            <div className="mx-auto max-w-6xl space-y-6">
                <AdminPageHeader
                    title="Active Carts"
                    description={`${carts.length} carts · ${totalQuantity} items total`}
                />

                <div className="space-y-4">
                    {carts.map((cart, index) => (
                        <section
                            key={index}
                            className="overflow-hidden rounded-xl border border-outline-variant/15 bg-surface-container-lowest"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/10 px-4 py-3">
                                <div>
                                    <p className="font-medium">{cart.owner_name}</p>
                                    <p className="text-sm text-on-surface-variant">
                                        {cart.owner_type === 'guest' ? 'Guest session' : cart.owner_email}
                                        {cart.last_activity ? ` · ${formatDateTime(cart.last_activity)}` : ''}
                                    </p>
                                </div>
                                <span className="rounded-sm bg-warm-brown/10 px-2 py-1 text-sm font-medium text-warm-brown">
                                    {cart.total_quantity} items
                                </span>
                            </div>
                            <table className="w-full text-sm">
                                <thead className="bg-surface-container/40 text-left text-xs tracking-wider text-on-surface-variant uppercase">
                                    <tr>
                                        <th className="px-4 py-2">Product</th>
                                        <th className="px-4 py-2">SKU</th>
                                        <th className="px-4 py-2">Variant</th>
                                        <th className="px-4 py-2">Qty</th>
                                        {isSuperAdmin ? <th className="px-4 py-2 text-right">Actions</th> : null}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/10">
                                    {cart.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-3">
                                                <p className="font-medium">{item.product?.name ?? 'Unknown'}</p>
                                                <p className="text-xs text-on-surface-variant">{item.product?.category}</p>
                                            </td>
                                            <td className="px-4 py-3">{item.sku ?? '—'}</td>
                                            <td className="px-4 py-3">
                                                {[item.color, item.size].filter(Boolean).join(' / ') || '—'}
                                            </td>
                                            <td className="px-4 py-3">{item.quantity}</td>
                                            {isSuperAdmin ? (
                                                <td className="px-4 py-3 text-right">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            if (confirm('Remove this cart item?')) {
                                                                router.delete(`/admin/carts/${item.id}`, {
                                                                    preserveScroll: true,
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            ) : null}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    ))}

                    {carts.length === 0 ? (
                        <div className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-8 text-center text-on-surface-variant">
                            No active carts.
                        </div>
                    ) : null}
                </div>
            </div>
        </AdminLayout>
    );
}
