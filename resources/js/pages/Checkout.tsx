import { Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { formatCurrency, storageUrl } from '@/lib/utils';
import type { CartItem, CommerceProps } from '@/types';

interface CheckoutProps {
    cartItems: CartItem[];
    pricing: {
        subtotal: number;
        discount_amount: number;
        payable: number;
    };
    shippingAddress: Record<string, string> | null;
    provinces: Array<{ id: string; name: string }>;
    defaultShippingCost: number;
    freeShippingThreshold: number;
    freeShippingEnabled: boolean;
    biteshipEnabled: boolean;
    bankTransfer: { bank: string; account_number: string; account_name: string };
    paymentSettings: {
        enabled: boolean;
        methods: string[];
        midtrans_channels: string[];
    };
}

export default function Checkout({
    cartItems,
    pricing,
    shippingAddress,
    provinces,
    defaultShippingCost,
    freeShippingEnabled,
    freeShippingThreshold,
    paymentSettings,
}: CheckoutProps) {
    const { commerce } = usePage().props as unknown as { commerce: CommerceProps };

    const { data, setData, post, processing, errors } = useForm({
        name: shippingAddress?.name ?? '',
        email: shippingAddress?.email ?? '',
        phone: shippingAddress?.phone ?? '',
        address: shippingAddress?.address ?? '',
        province: shippingAddress?.province ?? '',
        city: shippingAddress?.city ?? '',
        district: shippingAddress?.district ?? '',
        postal_code: shippingAddress?.postal_code ?? '',
        shipping_courier: '',
        shipping_service: '',
        payment_method: paymentSettings.methods[0] ?? 'bank_transfer',
        midtrans_channel: paymentSettings.midtrans_channels[0] ?? '',
        notes: '',
        website: '',
    });

    const shippingCost =
        freeShippingEnabled && pricing.payable >= freeShippingThreshold ? 0 : defaultShippingCost;
    const orderTotal = pricing.payable + shippingCost;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/checkout');
    };

    return (
        <StorefrontLayout>
            <div className="mx-auto max-w-[var(--container-max)] px-4 py-10 md:px-[var(--spacing-margin-desktop)] md:py-16">
                <h1 className="mb-10 font-serif text-4xl tracking-tight">Checkout</h1>

                <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-3">
                    <div className="space-y-8 lg:col-span-2">
                        <section className="border border-outline-variant p-6">
                            <h2 className="mb-6 font-serif text-xl">Contact & Shipping</h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className="mb-1 block text-sm">Full Name</label>
                                    <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                    {errors.name && <p className="mt-1 text-xs text-error">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm">Email</label>
                                    <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                    {errors.email && <p className="mt-1 text-xs text-error">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm">Phone</label>
                                    <Input value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                                    {errors.phone && <p className="mt-1 text-xs text-error">{errors.phone}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="mb-1 block text-sm">Address</label>
                                    <Input value={data.address} onChange={(e) => setData('address', e.target.value)} />
                                    {errors.address && <p className="mt-1 text-xs text-error">{errors.address}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm">Province</label>
                                    <select
                                        value={data.province}
                                        onChange={(e) => setData('province', e.target.value)}
                                        className="flex h-10 w-full rounded-sm border border-outline-variant bg-surface-container-lowest px-3 text-sm"
                                    >
                                        <option value="">Select province</option>
                                        {provinces.map((p) => (
                                            <option key={p.id} value={p.name}>{p.name}</option>
                                        ))}
                                    </select>
                                    {errors.province && <p className="mt-1 text-xs text-error">{errors.province}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm">City</label>
                                    <Input value={data.city} onChange={(e) => setData('city', e.target.value)} />
                                    {errors.city && <p className="mt-1 text-xs text-error">{errors.city}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm">District</label>
                                    <Input value={data.district} onChange={(e) => setData('district', e.target.value)} />
                                    {errors.district && <p className="mt-1 text-xs text-error">{errors.district}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm">Postal Code</label>
                                    <Input value={data.postal_code} onChange={(e) => setData('postal_code', e.target.value)} />
                                    {errors.postal_code && <p className="mt-1 text-xs text-error">{errors.postal_code}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="mb-1 block text-sm">Order Notes (optional)</label>
                                    <Input value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
                                </div>
                            </div>
                            <input type="text" name="website" value={data.website} onChange={(e) => setData('website', e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" />
                        </section>

                        {commerce.paymentsEnabled && (
                            <section className="border border-outline-variant p-6">
                                <h2 className="mb-6 font-serif text-xl">Payment Method</h2>
                                <div className="space-y-3">
                                    {paymentSettings.methods.map((method) => (
                                        <label key={method} className="flex cursor-pointer items-center gap-3 border border-outline-variant p-4">
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value={method}
                                                checked={data.payment_method === method}
                                                onChange={() => setData('payment_method', method)}
                                            />
                                            <span className="text-sm capitalize">{method.replace('_', ' ')}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.payment_method && <p className="mt-2 text-xs text-error">{errors.payment_method}</p>}
                            </section>
                        )}
                    </div>

                    <div className="h-fit border border-outline-variant p-6">
                        <h2 className="mb-6 font-serif text-xl">Your Order</h2>
                        <ul className="mb-6 max-h-64 space-y-4 overflow-y-auto">
                            {cartItems.map((item) => (
                                <li key={item.id} className="flex gap-3 text-sm">
                                    <img
                                        src={storageUrl(item.product.images?.[0]?.image_path ?? item.product.image)}
                                        alt=""
                                        className="h-16 w-12 object-cover"
                                    />
                                    <div className="flex-1">
                                        <p>{item.product.name}</p>
                                        <p className="text-secondary">Qty: {item.quantity}</p>
                                    </div>
                                    <p>{formatCurrency((item.unit_price ?? item.product.price) * item.quantity)}</p>
                                </li>
                            ))}
                        </ul>
                        <dl className="space-y-2 border-t border-outline-variant pt-4 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-secondary">Subtotal</dt>
                                <dd>{formatCurrency(pricing.subtotal)}</dd>
                            </div>
                            {pricing.discount_amount > 0 && (
                                <div className="flex justify-between text-warm-brown">
                                    <dt>Discount</dt>
                                    <dd>-{formatCurrency(pricing.discount_amount)}</dd>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <dt className="text-secondary">Shipping</dt>
                                <dd>{shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}</dd>
                            </div>
                            <div className="flex justify-between border-t border-outline-variant pt-3 text-base font-medium">
                                <dt>Total</dt>
                                <dd>{formatCurrency(orderTotal)}</dd>
                            </div>
                        </dl>
                        <Button type="submit" variant="accent" className="mt-6 w-full" disabled={processing}>
                            {processing ? 'Processing...' : 'Place Order'}
                        </Button>
                        <Button variant="outline" className="mt-3 w-full" asChild>
                            <Link href="/cart">Back to Cart</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </StorefrontLayout>
    );
}
