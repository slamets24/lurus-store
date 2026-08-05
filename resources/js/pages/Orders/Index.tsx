import { Link } from '@inertiajs/react';
import { Pagination } from '@/components/Pagination';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { cn, formatCurrency } from '@/lib/utils';
import type { Order, Paginated } from '@/types';

interface OrdersIndexProps {
    orders: Paginated<Order>;
}

const statusLabels: Record<string, string> = {
    pending: 'Pending',
    stock_confirmation: 'Confirming Stock',
    ready_to_ship: 'Ready to Ship',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
};

const paymentLabels: Record<string, string> = {
    unpaid: 'Unpaid',
    pending_verification: 'Awaiting Verification',
    paid: 'Paid',
    failed: 'Failed',
    expired: 'Expired',
    refunded: 'Refunded',
};

export default function OrdersIndex({ orders }: OrdersIndexProps) {
    return (
        <StorefrontLayout>
            <div className="mx-auto max-w-[var(--container-max)] px-4 py-10 md:px-[var(--spacing-margin-desktop)] md:py-16">
                <h1 className="mb-10 font-serif text-4xl tracking-tight">My Orders</h1>

                {orders.data.length === 0 ? (
                    <div className="py-20 text-center">
                        <p className="mb-6 text-secondary">You haven&apos;t placed any orders yet.</p>
                        <Link href="/products" className="text-warm-brown hover:underline">Start shopping</Link>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {orders.data.map((order) => (
                                <Link
                                    key={order.id}
                                    href={`/orders/${order.id}`}
                                    className="block border border-outline-variant p-6 transition-colors hover:border-warm-brown"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div>
                                            <p className="font-medium">{order.order_number}</p>
                                            <p className="mt-1 text-xs text-secondary">
                                                {new Date(order.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{formatCurrency(order.total)}</p>
                                            <div className="mt-2 flex flex-wrap justify-end gap-2">
                                                <span className={cn('text-xs px-2 py-0.5 border border-outline-variant')}>
                                                    {statusLabels[order.status] ?? order.status}
                                                </span>
                                                <span className={cn(
                                                    'text-xs px-2 py-0.5 border',
                                                    order.payment_status === 'paid'
                                                        ? 'border-warm-brown text-warm-brown'
                                                        : 'border-outline-variant text-secondary',
                                                )}>
                                                    {paymentLabels[order.payment_status] ?? order.payment_status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-sm text-secondary">
                                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                    </p>
                                </Link>
                            ))}
                        </div>
                        <Pagination pagination={orders} className="mt-10" />
                    </>
                )}
            </div>
        </StorefrontLayout>
    );
}
