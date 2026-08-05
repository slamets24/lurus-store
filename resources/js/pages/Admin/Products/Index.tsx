import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { PaginationLinks } from '@/components/admin/PaginationLinks';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/layouts/AdminLayout';
import { formatDate, formatPrice } from '@/lib/format';
import type { AuthProps } from '@/types';
import type { AdminCategory, AdminProduct, Paginated } from '@/types/admin';

interface ProductsIndexProps {
    products: Paginated<AdminProduct>;
    filters: { search?: string; category?: string; page?: string };
    categories: AdminCategory[];
}

export default function ProductsIndex({ products, filters, categories }: ProductsIndexProps) {
    const { auth } = usePage<{ auth: AuthProps }>().props;
    const isSuperAdmin = auth?.isSuperAdmin ?? false;
    const [search, setSearch] = useState(filters.search ?? '');
    const [category, setCategory] = useState(filters.category ?? '');

    const applyFilters = () => {
        router.get('/admin/products', { search: search || undefined, category: category || undefined }, { preserveState: true });
    };

    return (
        <AdminLayout title="Products">
            <Head title="Products" />

            <div className="mx-auto max-w-7xl space-y-6">
                <AdminPageHeader
                    title="Products"
                    description={`${products.total} products`}
                    action={{ label: 'Add Product', href: '/admin/products/create' }}
                />

                <div className="flex flex-wrap gap-3 rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-4">
                    <Input
                        placeholder="Search name, SKU, slug..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        onKeyDown={(event) => event.key === 'Enter' && applyFilters()}
                        className="max-w-xs"
                    />
                    <select
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        className="h-10 rounded-sm border border-outline-variant bg-surface-container-lowest px-3 text-sm"
                    >
                        <option value="">All categories</option>
                        {categories.map((item) => (
                            <option key={item.id} value={String(item.id)}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                    <Button type="button" variant="accent" onClick={applyFilters}>
                        Filter
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border border-outline-variant/15 bg-surface-container-lowest">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px] text-sm">
                            <thead className="border-b border-outline-variant/15 bg-surface-container/50 text-left text-xs tracking-wider text-on-surface-variant uppercase">
                                <tr>
                                    <th className="px-4 py-3">Product</th>
                                    <th className="px-4 py-3">Category</th>
                                    <th className="px-4 py-3">Price</th>
                                    <th className="px-4 py-3">Stock</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Created</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/10">
                                {products.data.map((product) => (
                                    <tr key={product.id} className="hover:bg-surface-container/30">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {product.images?.[0] ? (
                                                    <img
                                                        src={`/storage/${product.images[0].image_path}`}
                                                        alt=""
                                                        className="h-10 w-10 rounded-sm object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-sm bg-surface-container" />
                                                )}
                                                <div>
                                                    <p className="font-medium">{product.name}</p>
                                                    <p className="text-xs text-on-surface-variant">{product.sku}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">{product.category?.name ?? '—'}</td>
                                        <td className="px-4 py-3">
                                            {formatPrice(product.effective_price ?? product.price)}
                                            {product.discount_percent ? (
                                                <span className="ml-1 text-xs text-error">-{product.discount_percent}%</span>
                                            ) : null}
                                        </td>
                                        <td className="px-4 py-3">{product.stock}</td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={product.is_active ? 'published' : 'draft'} />
                                        </td>
                                        <td className="px-4 py-3 text-on-surface-variant">
                                            {product.created_at ? formatDate(product.created_at) : '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-1">
                                                <Button asChild variant="ghost" size="icon">
                                                    <Link href={`/admin/products/${product.id}/edit`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                {isSuperAdmin ? (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            if (confirm(`Delete "${product.name}"?`)) {
                                                                router.delete(`/admin/products/${product.id}`);
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
                    <div className="px-4 pb-4">
                        <PaginationLinks paginator={products} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
