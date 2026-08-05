import { Head, router } from '@inertiajs/react';
import { RotateCcw, Trash2 } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { PaginationLinks } from '@/components/admin/PaginationLinks';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/AdminLayout';
import { formatDateTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Paginated } from '@/types/admin';

interface RestoreRecord {
    id: number;
    name: string;
    detail: string | null;
    deleted_at: string | null;
}

interface RestoreIndexProps {
    activeType: string;
    counts: Record<string, number>;
    records: Paginated<RestoreRecord>;
}

const TYPE_LABELS: Record<string, string> = {
    products: 'Products',
    categories: 'Categories',
    collections: 'Collections',
    promos: 'Promos',
    testimonials: 'Testimonials',
    orders: 'Orders',
};

export default function RestoreIndex({ activeType, counts, records }: RestoreIndexProps) {
    const switchType = (type: string) => {
        router.get('/admin/restore', { type }, { preserveState: true });
    };

    return (
        <AdminLayout title="Restore Data">
            <Head title="Restore Data" />

            <div className="mx-auto max-w-6xl space-y-6">
                <AdminPageHeader
                    title="Restore Data"
                    description="Recover or permanently delete soft-deleted records."
                    eyebrow="Super Admin"
                />

                <div className="flex flex-wrap gap-2">
                    {Object.entries(TYPE_LABELS).map(([type, label]) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => switchType(type)}
                            className={cn(
                                'rounded-sm px-4 py-2 text-sm transition-colors',
                                activeType === type
                                    ? 'bg-warm-brown text-white'
                                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface',
                            )}
                        >
                            {label} ({counts[type] ?? 0})
                        </button>
                    ))}
                </div>

                <div className="overflow-hidden rounded-xl border border-outline-variant/15 bg-surface-container-lowest">
                    <table className="w-full text-sm">
                        <thead className="border-b border-outline-variant/15 bg-surface-container/50 text-left text-xs tracking-wider text-on-surface-variant uppercase">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Detail</th>
                                <th className="px-4 py-3">Deleted</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                            {records.data.map((record) => (
                                <tr key={record.id} className="hover:bg-surface-container/30">
                                    <td className="px-4 py-3 font-medium">{record.name}</td>
                                    <td className="px-4 py-3 text-on-surface-variant">{record.detail ?? '—'}</td>
                                    <td className="px-4 py-3 text-on-surface-variant">
                                        {record.deleted_at ? formatDateTime(record.deleted_at) : '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    router.post(`/admin/restore/${activeType}/${record.id}`, {}, {
                                                        preserveScroll: true,
                                                    })
                                                }
                                            >
                                                <RotateCcw className="mr-1 h-4 w-4" /> Restore
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    if (
                                                        confirm(
                                                            `Permanently delete "${record.name}"? This cannot be undone.`,
                                                        )
                                                    ) {
                                                        router.delete(`/admin/restore/${activeType}/${record.id}`, {
                                                            preserveScroll: true,
                                                        });
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4 text-error" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {records.data.length === 0 ? (
                        <div className="p-8 text-center text-on-surface-variant">No deleted records in this category.</div>
                    ) : null}

                    <div className="px-4 pb-4">
                        <PaginationLinks paginator={records} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
