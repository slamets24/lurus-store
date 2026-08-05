import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/AdminLayout';
import { formatDate } from '@/lib/format';
import type { AuthProps } from '@/types';

interface CategoryRow {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    is_active: boolean;
    sort_order: number | null;
    parent: { id: number; name: string } | null;
    products_count: number;
    created_at: string;
}

interface CategoriesIndexProps {
    categories: CategoryRow[];
}

export default function CategoriesIndex({ categories }: CategoriesIndexProps) {
    const { auth } = usePage<{ auth: AuthProps }>().props;
    const isSuperAdmin = auth?.isSuperAdmin ?? false;

    return (
        <AdminLayout title="Categories">
            <Head title="Categories" />

            <div className="mx-auto max-w-6xl space-y-6">
                <AdminPageHeader
                    title="Categories"
                    description={`${categories.length} categories`}
                    action={{ label: 'Add Category', href: '/admin/categories/create' }}
                />

                <div className="overflow-hidden rounded-xl border border-outline-variant/15 bg-surface-container-lowest">
                    <table className="w-full text-sm">
                        <thead className="border-b border-outline-variant/15 bg-surface-container/50 text-left text-xs tracking-wider text-on-surface-variant uppercase">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Parent</th>
                                <th className="px-4 py-3">Products</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Sort</th>
                                <th className="px-4 py-3">Created</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                            {categories.map((category) => (
                                <tr key={category.id} className="hover:bg-surface-container/30">
                                    <td className="px-4 py-3">
                                        <p className="font-medium">{category.name}</p>
                                        <p className="text-xs text-on-surface-variant">{category.slug}</p>
                                    </td>
                                    <td className="px-4 py-3">{category.parent?.name ?? '—'}</td>
                                    <td className="px-4 py-3">{category.products_count}</td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={category.is_active ? 'published' : 'draft'} />
                                    </td>
                                    <td className="px-4 py-3">{category.sort_order ?? '—'}</td>
                                    <td className="px-4 py-3 text-on-surface-variant">{formatDate(category.created_at)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-1">
                                            <Button asChild variant="ghost" size="icon">
                                                <Link href={`/admin/categories/${category.id}/edit`}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            {isSuperAdmin ? (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        if (category.products_count > 0) {
                                                            alert('Cannot delete category with existing products.');
                                                            return;
                                                        }
                                                        if (confirm(`Delete "${category.name}"?`)) {
                                                            router.delete(`/admin/categories/${category.id}`);
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
