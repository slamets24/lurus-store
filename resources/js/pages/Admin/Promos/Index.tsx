import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/AdminLayout';
import { formatDate, formatPrice } from '@/lib/format';
import type { AuthProps } from '@/types';

interface PromoRow {
    id: number;
    name: string;
    type: string;
    is_active: boolean;
    scope: string;
    buy_qty: number | null;
    free_qty: number | null;
    package_price: number | null;
    targets_count: number;
    components_count: number;
    created_at: string | null;
}

interface PromosIndexProps {
    promos: PromoRow[];
}

export default function PromosIndex({ promos }: PromosIndexProps) {
    const { auth } = usePage<{ auth: AuthProps }>().props;
    const isSuperAdmin = auth?.isSuperAdmin ?? false;

    return (
        <AdminLayout title="Promos">
            <Head title="Promos" />

            <div className="mx-auto max-w-6xl space-y-6">
                <AdminPageHeader
                    title="Promos"
                    description={`${promos.length} promotions`}
                    action={{ label: 'Add Promo', href: '/admin/promos/create' }}
                />

                <div className="overflow-hidden rounded-xl border border-outline-variant/15 bg-surface-container-lowest">
                    <table className="w-full text-sm">
                        <thead className="border-b border-outline-variant/15 bg-surface-container/50 text-left text-xs tracking-wider text-on-surface-variant uppercase">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Scope</th>
                                <th className="px-4 py-3">Details</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Created</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                            {promos.map((promo) => (
                                <tr key={promo.id} className="hover:bg-surface-container/30">
                                    <td className="px-4 py-3 font-medium">{promo.name}</td>
                                    <td className="px-4 py-3 uppercase">{promo.type}</td>
                                    <td className="px-4 py-3">{promo.scope.replace(/_/g, ' ')}</td>
                                    <td className="px-4 py-3 text-on-surface-variant">
                                        {promo.type === 'bxgy'
                                            ? `Buy ${promo.buy_qty} get ${promo.free_qty} · ${promo.targets_count} targets`
                                            : `${formatPrice(promo.package_price ?? 0)} · ${promo.components_count} items`}
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={promo.is_active ? 'published' : 'draft'} />
                                    </td>
                                    <td className="px-4 py-3 text-on-surface-variant">
                                        {promo.created_at ? formatDate(promo.created_at) : '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-1">
                                            <Button asChild variant="ghost" size="icon">
                                                <Link href={`/admin/promos/${promo.id}/edit`}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            {isSuperAdmin ? (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        if (confirm(`Delete "${promo.name}"?`)) {
                                                            router.delete(`/admin/promos/${promo.id}`);
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            ) : null}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
