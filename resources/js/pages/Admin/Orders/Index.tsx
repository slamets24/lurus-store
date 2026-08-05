import { Head, Link, router } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { PaginationLinks } from '@/components/admin/PaginationLinks';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/AdminLayout';
import { formatDate, formatPrice } from '@/lib/format';
import {
    ORDER_STATUS_LABELS,
    PAYMENT_METHOD_LABELS,
    PAYMENT_STATUS_LABELS,
    type AdminOrder,
    type Paginated,
} from '@/types/admin';

interface OrdersIndexProps {
    orders: Paginated<AdminOrder>;
    filters: { status?: string; payment_status?: string; page?: string };
}

export default function OrdersIndex({ orders, filters }: OrdersIndexProps) {
    const [status, setStatus] = useState(filters.status ?? '');
    const [paymentStatus, setPaymentStatus] = useState(filters.payment_status ?? '');

    const applyFilters = () => {
        router.get(
            '/admin/orders',
            {
                status: status || undefined,
                payment_status: paymentStatus || undefined,
            },
            { preserveState: true },
        );
    };

    return (
        <AdminLayout title="Orders">
            <Head title="Orders" />

            <div className="mx-auto max-w-7xl space-y-6">
                <AdminPageHeader title="Orders" description={`${orders.total} orders`} />

                <div className="flex flex-wrap gap-3 rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-4">
                    <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        className="h-10 rounded-sm border border-outline-variant px-3 text-sm"
                    >
                        <option value="">All statuses</option>
                        {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                    <select
                        value={paymentStatus}
                        onChange={(event) => setPaymentStatus(event.target.value)}
                        className="h-10 rounded-sm border border-outline-variant px-3 text-sm"
                    >
                        <option value="">All payment statuses</option>
                        {Object.entries(PAYMENT_STATUS_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                    <Button type="button" variant="accent" onClick={applyFilters}>
                        Filter
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border border-outline-variant/15 bg-surface-container-lowest">
                    <table className="w-full text-sm">
                        <thead className="border-b border-outline-variant/15 bg-surface-container/50 text-left text-xs tracking-wider text-on-surface-variant uppercase">
                            <tr>
                                <th className="px-4 py-3">Order</th>
                                <th className="px-4 py-3">Customer</th>
                                <th className="px-4 py-3">Total</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Payment</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                            {orders.data.map((order) => (
                                <tr key={order.id} className="hover:bg-surface-container/30">
                                    <td className="px-4 py-3">
                                        <p className="font-medium">{order.order_number}</p>
                                        <p className="text-xs text-on-surface-variant">{order.items_count} items</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p>{order.customer?.name ?? '—'}</p>
                                        <p className="text-xs text-on-surface-variant">
                                            {order.customer?.is_guest ? 'Guest' : order.customer?.email}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3 font-medium">{formatPrice(order.total_amount)}</td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={order.status} label={ORDER_STATUS_LABELS[order.status]} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="space-y-1">
                                            <StatusBadge
                                                status={order.payment_status ?? 'pending'}
                                                label={PAYMENT_STATUS_LABELS[order.payment_status ?? 'pending']}
                                            />
                                            {order.payment_method ? (
                                                <p className="text-xs text-on-surface-variant">
                                                    {PAYMENT_METHOD_LABELS[order.payment_method] ?? order.payment_method}
                                                </p>
                                            ) : null}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-on-surface-variant">{formatDate(order.created_at)}</td>
                                    <td className="px-4 py-3 text-right">
                                        <Button asChild variant="ghost" size="icon">
                                            <Link href={`/admin/orders/${order.id}`}>
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="px-4 pb-4">
                        <PaginationLinks paginator={orders} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
