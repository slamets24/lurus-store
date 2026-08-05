import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ExternalLink, Printer } from 'lucide-react';
import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/layouts/AdminLayout';
import { formatDateTime, formatPrice } from '@/lib/format';
import type { AuthProps } from '@/types';
import {
    ORDER_STATUS_LABELS,
    PAYMENT_METHOD_LABELS,
    PAYMENT_STATUS_LABELS,
    type AdminOrder,
} from '@/types/admin';

interface OrdersShowProps {
    order: AdminOrder;
}

export default function OrdersShow({ order }: OrdersShowProps) {
    const { auth } = usePage<{ auth: AuthProps }>().props;
    const isSuperAdmin = auth?.isSuperAdmin ?? false;
    const [status, setStatus] = useState(order.status);

    const statusForm = useForm({ status });
    const waybillForm = useForm({ waybill_id: order.waybill_id ?? '' });
    const shipmentForm = useForm({
        courier_code: '',
        courier_service_code: '',
        collection_method: 'pickup',
    });

    const address = (order.shipping_address ?? {}) as Record<string, string | Record<string, string>>;
    const courier = (address.courier ?? {}) as Record<string, string>;

    const updateStatus = () => {
        statusForm.setData('status', status);
        statusForm.patch(`/admin/orders/${order.id}/status`, { preserveScroll: true });
    };

    return (
        <AdminLayout title={`Order ${order.order_number}`}>
            <Head title={`Order ${order.order_number}`} />

            <div className="mx-auto max-w-6xl space-y-6">
                <AdminPageHeader
                    title={order.order_number}
                    description={`Placed ${formatDateTime(order.created_at)}`}
                >
                    <Button asChild variant="outline" size="sm">
                        <Link href="/admin/orders">Back to Orders</Link>
                    </Button>
                </AdminPageHeader>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <section className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6">
                            <h2 className="font-serif text-xl text-primary">Items</h2>
                            <ul className="mt-4 divide-y divide-outline-variant/10">
                                {order.items?.map((item) => (
                                    <li key={item.id} className="flex gap-4 py-4">
                                        {item.image ? (
                                            <img
                                                src={`/storage/${item.image}`}
                                                alt=""
                                                className="h-16 w-16 rounded-sm object-cover"
                                            />
                                        ) : (
                                            <div className="h-16 w-16 rounded-sm bg-surface-container" />
                                        )}
                                        <div className="flex-1">
                                            <p className="font-medium">{item.product_name}</p>
                                            <p className="text-sm text-on-surface-variant">
                                                {item.sku} · Qty {item.quantity}
                                                {item.color || item.size
                                                    ? ` · ${[item.color, item.size].filter(Boolean).join(' / ')}`
                                                    : ''}
                                            </p>
                                            <p className="mt-1 font-medium">{formatPrice(item.price * item.quantity)}</p>
                                            {item.testimonial ? (
                                                <p className="mt-2 text-sm text-on-surface-variant">
                                                    Review: {'★'.repeat(item.testimonial.rating)} — {item.testimonial.comment}
                                                </p>
                                            ) : null}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6">
                            <h2 className="font-serif text-xl text-primary">Shipping</h2>
                            <div className="mt-4 space-y-2 text-sm">
                                <p>{String(address.name ?? '')}</p>
                                <p className="text-on-surface-variant">{String(address.address ?? '')}</p>
                                <p className="text-on-surface-variant">
                                    {[address.city, address.postal_code].filter(Boolean).join(', ')}
                                </p>
                                <p className="text-on-surface-variant">
                                    Courier: {courier.courier_name ?? courier.courier_code ?? '—'}
                                </p>
                                {order.waybill_id ? (
                                    <p className="font-medium">Tracking: {order.waybill_id}</p>
                                ) : null}
                            </div>

                            {order.shipping_history?.length ? (
                                <ul className="mt-4 space-y-2 border-t border-outline-variant/10 pt-4 text-sm">
                                    {order.shipping_history.map((entry, index) => (
                                        <li key={index} className="text-on-surface-variant">
                                            <span className="font-medium text-on-surface">{entry.status}</span>
                                            {entry.note ? ` — ${entry.note}` : ''}
                                            {entry.updated_at ? ` · ${formatDateTime(entry.updated_at)}` : ''}
                                        </li>
                                    ))}
                                </ul>
                            ) : null}
                        </section>
                    </div>

                    <div className="space-y-6">
                        <section className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 space-y-3">
                            <h2 className="font-serif text-xl text-primary">Summary</h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-on-surface-variant">Subtotal</span>
                                    <span>{formatPrice(order.subtotal ?? 0)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-on-surface-variant">Discount</span>
                                    <span>{formatPrice(order.discount_amount ?? 0)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-on-surface-variant">Shipping</span>
                                    <span>{formatPrice(order.shipping_cost ?? 0)}</span>
                                </div>
                                <div className="flex justify-between border-t border-outline-variant/10 pt-2 font-semibold">
                                    <span>Total</span>
                                    <span>{formatPrice(order.total_amount)}</span>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 space-y-4">
                            <h2 className="font-serif text-xl text-primary">Status</h2>
                            <div className="flex flex-wrap gap-2">
                                <StatusBadge status={order.status} label={ORDER_STATUS_LABELS[order.status]} />
                                <StatusBadge
                                    status={order.payment_status ?? 'pending'}
                                    label={PAYMENT_STATUS_LABELS[order.payment_status ?? 'pending']}
                                />
                            </div>
                            <p className="text-sm text-on-surface-variant">
                                {PAYMENT_METHOD_LABELS[order.payment_method ?? ''] ?? order.payment_method}
                                {order.payment_channel ? ` · ${order.payment_channel}` : ''}
                            </p>

                            <select
                                value={status}
                                onChange={(event) => setStatus(event.target.value)}
                                className="h-10 w-full rounded-sm border border-outline-variant px-3 text-sm"
                            >
                                {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                            <Button
                                type="button"
                                variant="accent"
                                className="w-full"
                                disabled={statusForm.processing || status === order.status}
                                onClick={updateStatus}
                            >
                                Update Status
                            </Button>

                            {order.payment_status === 'pending_verification' ? (
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="accent"
                                        className="flex-1"
                                        onClick={() => router.patch(`/admin/orders/${order.id}/payment/approve`)}
                                    >
                                        Approve Payment
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => router.patch(`/admin/orders/${order.id}/payment/reject`)}
                                    >
                                        Reject
                                    </Button>
                                </div>
                            ) : null}

                            {order.payment_proof_url ? (
                                <Button asChild variant="outline" className="w-full">
                                    <a href={order.payment_proof_url} target="_blank" rel="noreferrer">
                                        <ExternalLink className="mr-2 h-4 w-4" /> View Payment Proof
                                    </a>
                                </Button>
                            ) : null}
                        </section>

                        <section className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 space-y-4">
                            <h2 className="font-serif text-xl text-primary">Fulfillment</h2>

                            {order.can_create_biteship_shipment ? (
                                <form
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        shipmentForm.post(`/admin/orders/${order.id}/biteship-shipment`, {
                                            preserveScroll: true,
                                        });
                                    }}
                                    className="space-y-2"
                                >
                                    <Input
                                        placeholder="Courier code (optional)"
                                        value={shipmentForm.data.courier_code}
                                        onChange={(event) => shipmentForm.setData('courier_code', event.target.value)}
                                    />
                                    <Input
                                        placeholder="Service code (optional)"
                                        value={shipmentForm.data.courier_service_code}
                                        onChange={(event) =>
                                            shipmentForm.setData('courier_service_code', event.target.value)
                                        }
                                    />
                                    <Button type="submit" variant="accent" className="w-full" disabled={shipmentForm.processing}>
                                        Create Biteship Shipment
                                    </Button>
                                </form>
                            ) : null}

                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    waybillForm.patch(`/admin/orders/${order.id}/waybill`, { preserveScroll: true });
                                }}
                                className="space-y-2"
                            >
                                <Input
                                    placeholder="Waybill / tracking number"
                                    value={waybillForm.data.waybill_id}
                                    onChange={(event) => waybillForm.setData('waybill_id', event.target.value)}
                                />
                                <Button type="submit" variant="outline" className="w-full" disabled={waybillForm.processing}>
                                    Save Tracking Number
                                </Button>
                            </form>

                            {order.can_print_shipping_label ? (
                                <Button asChild variant="outline" className="w-full">
                                    <a href={`/admin/orders/${order.id}/shipping-label`} target="_blank" rel="noreferrer">
                                        <Printer className="mr-2 h-4 w-4" /> Print Label
                                    </a>
                                </Button>
                            ) : null}

                            {order.can_send_testimonial ? (
                                <Button asChild variant="outline" className="w-full">
                                    <Link href={`/admin/orders/${order.id}/testimonial-reminder`} method="post" as="button">
                                        Send Testimonial Reminder
                                    </Link>
                                </Button>
                            ) : null}

                            {isSuperAdmin ? (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full text-error"
                                    onClick={() => {
                                        if (confirm('Move this order to restore data?')) {
                                            router.delete(`/admin/orders/${order.id}`);
                                        }
                                    }}
                                >
                                    Delete Order
                                </Button>
                            ) : null}
                        </section>

                        <section className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 text-sm">
                            <h2 className="font-serif text-xl text-primary">Customer</h2>
                            <p className="mt-3 font-medium">{order.customer?.name}</p>
                            <p className="text-on-surface-variant">{order.customer?.email}</p>
                            <p className="text-on-surface-variant">{order.customer?.phone}</p>
                            {order.customer?.is_guest ? (
                                <p className="mt-2 text-xs text-warm-brown">Guest checkout</p>
                            ) : null}
                        </section>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
