import { Link } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { formatCurrency, storageUrl } from '@/lib/utils';
import type { Order } from '@/types';

interface OrdersSuccessProps {
    order: Order;
    accessToken?: string | null;
    claimUrl?: string | null;
    bankTransfer: { bank: string; account_number: string; account_name: string };
    midtransPayment?: { token: string; redirect_url: string } | null;
    midtransInstructions?: string | null;
}

export default function OrdersSuccess({
    order,
    accessToken,
    claimUrl,
    bankTransfer,
    midtransInstructions,
}: OrdersSuccessProps) {
    const orderUrl = accessToken
        ? `/orders/${order.id}?token=${accessToken}`
        : `/orders/${order.id}`;

    return (
        <StorefrontLayout>
            <div className="mx-auto max-w-2xl px-4 py-16 text-center md:py-24">
                <CheckCircle className="mx-auto mb-6 h-16 w-16 text-warm-brown" />
                <h1 className="font-serif text-4xl tracking-tight">Thank You!</h1>
                <p className="mt-4 text-secondary">
                    Your order <strong>{order.order_number}</strong> has been placed successfully.
                </p>

                <div className="mt-10 border border-outline-variant p-6 text-left text-sm">
                    <dl className="space-y-2">
                        <div className="flex justify-between">
                            <dt className="text-secondary">Order Total</dt>
                            <dd className="font-medium">{formatCurrency(order.total)}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-secondary">Payment</dt>
                            <dd className="capitalize">{order.payment_method.replace('_', ' ')}</dd>
                        </div>
                    </dl>

                    {order.payment_method === 'bank_transfer' && order.payment_status === 'unpaid' && (
                        <div className="mt-6 border-t border-outline-variant pt-6">
                            <p className="mb-3 font-medium">Complete your bank transfer:</p>
                            <p>{bankTransfer.bank} — {bankTransfer.account_number}</p>
                            <p className="text-secondary">a/n {bankTransfer.account_name}</p>
                        </div>
                    )}

                    {midtransInstructions && (
                        <div className="mt-6 border-t border-outline-variant pt-6">
                            <p className="whitespace-pre-line text-secondary">{midtransInstructions}</p>
                        </div>
                    )}
                </div>

                <ul className="mt-8 space-y-3 text-left">
                    {order.items.map((item) => (
                        <li key={item.id} className="flex gap-3 text-sm">
                            {item.product?.images?.[0] && (
                                <img src={storageUrl(item.product.images[0].image_path)} alt="" className="h-14 w-11 object-cover" />
                            )}
                            <div>
                                <p>{item.product_name}</p>
                                <p className="text-secondary">Qty: {item.quantity}</p>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button variant="accent" asChild>
                        <Link href={orderUrl}>View Order Details</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/products">Continue Shopping</Link>
                    </Button>
                </div>

                {claimUrl && (
                    <p className="mt-8 text-sm text-secondary">
                        Save your order history —{' '}
                        <Link href={claimUrl} className="text-warm-brown hover:underline">create an account</Link>
                    </p>
                )}
            </div>
        </StorefrontLayout>
    );
}
