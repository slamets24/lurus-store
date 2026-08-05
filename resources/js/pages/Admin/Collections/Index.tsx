import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/AdminLayout';
import { formatDate } from '@/lib/format';
import type { AuthProps } from '@/types';

interface CollectionRow {
    id: number;
    name: string;
    slug: string;
    subtitle: string | null;
    is_active: boolean;
    sort_order: number;
    products_count: number;
    created_at: string;
}

interface CollectionsIndexProps {
    collections: CollectionRow[];
}

export default function CollectionsIndex({ collections }: CollectionsIndexProps) {
    const { auth } = usePage<{ auth: AuthProps }>().props;
    const isSuperAdmin = auth?.isSuperAdmin ?? false;

    return (
        <AdminLayout title="Collections">
            <Head title="Collections" />

            <div className="mx-auto max-w-6xl space-y-6">
                <AdminPageHeader
                    title="Collections"
                    description={`${collections.length} collections`}
                    action={{ label: 'Add Collection', href: '/admin/collections/create' }}
                />

                <div className="overflow-hidden rounded-xl border border-outline-variant/15 bg-surface-container-lowest">
                    <table className="w-full text-sm">
                        <thead className="border-b border-outline-variant/15 bg-surface-container/50 text-left text-xs tracking-wider text-on-surface-variant uppercase">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Subtitle</th>
                                <th className="px-4 py-3">Products</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Sort</th>
                                <th className="px-4 py-3">Created</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                            {collections.map((collection) => (
                                <tr key={collection.id} className="hover:bg-surface-container/30">
                                    <td className="px-4 py-3">
                                        <p className="font-medium">{collection.name}</p>
                                        <p className="text-xs text-on-surface-variant">{collection.slug}</p>
                                    </td>
                                    <td className="px-4 py-3">{collection.subtitle ?? '—'}</td>
                                    <td className="px-4 py-3">{collection.products_count}</td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={collection.is_active ? 'published' : 'draft'} />
                                    </td>
                                    <td className="px-4 py-3">{collection.sort_order}</td>
                                    <td className="px-4 py-3 text-on-surface-variant">{formatDate(collection.created_at)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-1">
                                            <Button asChild variant="ghost" size="icon">
                                                <Link href={`/admin/collections/${collection.id}/edit`}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            {isSuperAdmin ? (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        if (confirm(`Delete "${collection.name}"?`)) {
                                                            router.delete(`/admin/collections/${collection.id}`);
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
