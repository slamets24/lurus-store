import { Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { formatCurrency, storageUrl } from '@/lib/utils';
import type { Order } from '@/types';

interface OrdersShowProps {
    order: Order;
    accessToken?: string | null;
    bankTransfer: { bank: string; account_number: string; account_name: string };
    midtransInstructions?: string | null;
    testimonialUrl?: string | null;
}

const statusLabels: Record<string, string> = {
    pending: 'Pending',
    stock_confirmation: 'Confirming Stock',
    ready_to_ship: 'Ready to Ship',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
};

export default function OrdersShow({
    order,
    accessToken,
    bankTransfer,
    midtransInstructions,
    testimonialUrl,
}: OrdersShowProps) {
    const orderUrl = accessToken ? `/orders/${order.id}?token=${accessToken}` : `/orders/${order.id}`;
    const proofForm = useForm<{ payment_proof: File | null }>({ payment_proof: null });

    return (
        <StorefrontLayout>
            <div className="mx-auto max-w-[var(--container-max)] px-4 py-10 md:px-[var(--spacing-margin-desktop)] md:py-16">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="font-serif text-3xl tracking-tight">Order {order.order_number}</h1>
                        <p className="mt-1 text-sm text-secondary">
                            Placed on {new Date(order.created_at).toLocaleDateString('id-ID')}
                        </p>
                    </div>
                    <span className="border border-outline-variant px-3 py-1 text-sm">
                        {statusLabels[order.status] ?? order.status}
                    </span>
                </div>

                <div className="grid gap-10 lg:grid-cols-3">
                    <div className="space-y-8 lg:col-span-2">
                        <section className="border border-outline-variant p-6">
                            <h2 className="mb-4 font-serif text-xl">Items</h2>
                            <ul className="divide-y divide-outline-variant">
                                {order.items.map((item) => (
                                    <li key={item.id} className="flex gap-4 py-4">
                                        {item.product?.images?.[0] && (
                                            <img
                                                src={storageUrl(item.product.images[0].image_path)}
                                                alt=""
                                                className="h-20 w-16 object-cover"
                                            />
                                        )}
                                        <div className="flex-1">
                                            {item.product ? (
                                                <Link href={`/products/${item.product.slug}`} className="text-sm font-medium hover:text-warm-brown">
                                                    {item.product_name}
                                                </Link>
                                            ) : (
                                                <p className="text-sm font-medium">{item.product_name}</p>
                                            )}
                                            {(item.size || item.color) && (
                                                <p className="text-xs text-secondary">
                                                    {[item.color, item.size].filter(Boolean).join(' / ')}
                                                </p>
                                            )}
                                            <p className="mt-1 text-sm">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm">{formatCurrency(item.unit_price * item.quantity)}</p>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {order.payment_status === 'unpaid' && order.payment_method === 'bank_transfer' && (
                            <section className="border border-outline-variant p-6">
                                <h2 className="mb-4 font-serif text-xl">Bank Transfer</h2>
                                <dl className="space-y-2 text-sm">
                                    <div className="flex justify-between"><dt className="text-secondary">Bank</dt><dd>{bankTransfer.bank}</dd></div>
                                    <div className="flex justify-between"><dt className="text-secondary">Account</dt><dd>{bankTransfer.account_number}</dd></div>
                                    <div className="flex justify-between"><dt className="text-secondary">Name</dt><dd>{bankTransfer.account_name}</dd></div>
                                    <div className="flex justify-between font-medium"><dt>Amount</dt><dd>{formatCurrency(order.total)}</dd></div>
                                </dl>
                                <form
                                    className="mt-6"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        proofForm.post(`/orders/${order.id}/payment-proof${accessToken ? `?token=${accessToken}` : ''}`, {
                                            forceFormData: true,
                                        });
                                    }}
                                >
                                    <label className="mb-2 block text-sm">Upload Payment Proof</label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => proofForm.setData('payment_proof', e.target.files?.[0] ?? null)}
                                    />
                                    <Button type="submit" variant="accent" size="sm" className="mt-3" disabled={proofForm.processing}>
                                        Submit Proof
                                    </Button>
                                </form>
                            </section>
                        )}

                        {midtransInstructions && (
                            <section className="border border-outline-variant p-6 text-sm">
                                <h2 className="mb-4 font-serif text-xl">Payment Instructions</h2>
                                <p className="whitespace-pre-line text-secondary">{midtransInstructions}</p>
                            </section>
                        )}
                    </div>

                    <div className="space-y-6">
                        <section className="border border-outline-variant p-6">
                            <h2 className="mb-4 font-serif text-xl">Summary</h2>
                            <dl className="space-y-2 text-sm">
                                <div className="flex justify-between"><dt className="text-secondary">Subtotal</dt><dd>{formatCurrency(order.subtotal)}</dd></div>
                                {order.discount_amount > 0 && (
                                    <div className="flex justify-between text-warm-brown"><dt>Discount</dt><dd>-{formatCurrency(order.discount_amount)}</dd></div>
                                )}
                                <div className="flex justify-between"><dt className="text-secondary">Shipping</dt><dd>{formatCurrency(order.shipping_cost)}</dd></div>
                                <div className="flex justify-between border-t border-outline-variant pt-3 font-medium"><dt>Total</dt><dd>{formatCurrency(order.total)}</dd></div>
                            </dl>
                        </section>

                        <section className="border border-outline-variant p-6 text-sm">
                            <h2 className="mb-4 font-serif text-xl">Shipping</h2>
                            <p className="font-medium">{order.shipping_address.name}</p>
                            <p className="mt-2 text-secondary">{order.shipping_address.address}</p>
                            <p className="text-secondary">
                                {[order.shipping_address.district, order.shipping_address.city, order.shipping_address.province].filter(Boolean).join(', ')}
                            </p>
                            <p className="text-secondary">{order.shipping_address.postal_code}</p>
                            {order.waybill && (
                                <p className="mt-4">Tracking: <span className="font-medium">{order.waybill}</span></p>
                            )}
                        </section>

                        {testimonialUrl && (
                            <Button variant="accent" className="w-full" asChild>
                                <a href={testimonialUrl}>Leave a Review</a>
                            </Button>
                        )}

                        <Link href={orderUrl} className="block text-center text-sm text-warm-brown hover:underline">
                            Refresh order status
                        </Link>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
