import { Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FreeShippingHint } from '@/components/FreeShippingHint';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { csrfHeaders, formatCurrency, storageUrl } from '@/lib/utils';
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

interface ShippingRate {
    courier_code: string;
    courier_name: string;
    courier_service_code: string;
    courier_service_name: string;
    duration: string;
    price: number;
    original_price?: number;
}

export default function Checkout({
    cartItems,
    pricing,
    shippingAddress,
    provinces,
    defaultShippingCost,
    freeShippingEnabled,
    freeShippingThreshold,
    biteshipEnabled,
    paymentSettings,
}: CheckoutProps) {
    const { commerce } = usePage().props as unknown as { commerce: CommerceProps };
    const [rates, setRates] = useState<ShippingRate[]>([]);
    const [ratesError, setRatesError] = useState<string | null>(null);
    const [loadingRates, setLoadingRates] = useState(false);

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

    useEffect(() => {
        if (!biteshipEnabled || !/^\d{5}$/.test(data.postal_code)) {
            setRates([]);
            setRatesError(null);
            return;
        }

        const controller = new AbortController();
        setLoadingRates(true);
        setRatesError(null);

        fetch('/checkout/shipping-rates', {
            method: 'POST',
            headers: csrfHeaders(),
            credentials: 'same-origin',
            signal: controller.signal,
            body: JSON.stringify({ postal_code: data.postal_code }),
        })
            .then(async (response) => {
                const payload = await response.json().catch(() => ({}));

                if (!response.ok) {
                    const message = payload.errors?.shipping_courier?.[0]
                        ?? payload.message
                        ?? 'Could not load shipping rates.';
                    throw new Error(message);
                }

                return payload.rates as ShippingRate[];
            })
            .then((nextRates) => {
                setRates(nextRates ?? []);
                const first = nextRates?.[0];
                if (first) {
                    setData('shipping_courier', first.courier_code);
                    setData('shipping_service', first.courier_service_code);
                }
            })
            .catch((error: Error) => {
                if (error.name === 'AbortError') {
                    return;
                }
                setRates([]);
                setRatesError(error.message);
            })
            .finally(() => setLoadingRates(false));

        return () => controller.abort();
    }, [biteshipEnabled, data.postal_code]);

    const selectedRate = useMemo(
        () =>
            rates.find(
                (rate) =>
                    rate.courier_code === data.shipping_courier &&
                    rate.courier_service_code === data.shipping_service,
            ),
        [data.shipping_courier, data.shipping_service, rates],
    );

    const shippingCost = selectedRate
        ? selectedRate.price
        : freeShippingEnabled && pricing.payable >= freeShippingThreshold
            ? 0
            : defaultShippingCost;
    const orderTotal = pricing.payable + shippingCost;
    const showFreeShipping = commerce.freeShippingEnabled || freeShippingEnabled;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/checkout');
    };

    return (
        <StorefrontLayout>
            <div className="mx-auto max-w-[var(--container-max)] px-4 py-10 pb-28 md:px-[var(--spacing-margin-desktop)] md:py-16 md:pb-16">
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

                        {biteshipEnabled && (
                            <section className="border border-outline-variant p-6">
                                <h2 className="mb-6 font-serif text-xl">Shipping</h2>
                                {!/^\d{5}$/.test(data.postal_code) && (
                                    <p className="text-sm text-secondary">Enter a 5-digit postal code to see courier options.</p>
                                )}
                                {loadingRates && <p className="text-sm text-secondary">Loading rates…</p>}
                                {ratesError && <p className="text-xs text-error">{ratesError}</p>}
                                <div className="space-y-3">
                                    {rates.map((rate) => {
                                        const selected =
                                            data.shipping_courier === rate.courier_code &&
                                            data.shipping_service === rate.courier_service_code;

                                        return (
                                            <label
                                                key={`${rate.courier_code}-${rate.courier_service_code}`}
                                                className="flex cursor-pointer items-center gap-3 border border-outline-variant p-4"
                                            >
                                                <input
                                                    type="radio"
                                                    name="shipping_rate"
                                                    checked={selected}
                                                    onChange={() => {
                                                        setData('shipping_courier', rate.courier_code);
                                                        setData('shipping_service', rate.courier_service_code);
                                                    }}
                                                />
                                                <span className="flex-1 text-sm">
                                                    {rate.courier_name} {rate.courier_service_name}
                                                    <span className="mt-0.5 block text-xs text-secondary">{rate.duration}</span>
                                                </span>
                                                <span className="text-sm">
                                                    {rate.price === 0 ? 'Free' : formatCurrency(rate.price)}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                                {errors.shipping_courier && (
                                    <p className="mt-2 text-xs text-error">{errors.shipping_courier}</p>
                                )}
                            </section>
                        )}

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
                                <dd>
                                    {biteshipEnabled && !selectedRate && loadingRates
                                        ? '…'
                                        : shippingCost === 0
                                            ? 'Free'
                                            : formatCurrency(shippingCost)}
                                </dd>
                            </div>
                            <div className="flex justify-between border-t border-outline-variant pt-3 text-base font-medium">
                                <dt>Total</dt>
                                <dd>{formatCurrency(orderTotal)}</dd>
                            </div>
                        </dl>
                        <div className="mt-4">
                            <FreeShippingHint
                                total={pricing.payable}
                                enabled={showFreeShipping}
                                threshold={freeShippingThreshold}
                            />
                        </div>
                        <Button type="submit" variant="accent" className="mt-6 hidden w-full md:inline-flex" disabled={processing}>
                            {processing ? 'Processing...' : 'Place Order'}
                        </Button>
                        <Button variant="outline" className="mt-3 w-full" asChild>
                            <Link href="/cart">Back to Cart</Link>
                        </Button>
                    </div>

                    <div
                        className="fixed inset-x-0 z-40 border-t border-outline-variant bg-background/95 px-4 py-3 backdrop-blur-sm md:hidden"
                        style={{ bottom: 'calc(3.5rem + env(safe-area-inset-bottom))' }}
                    >
                        <div className="flex items-center gap-3">
                            <div>
                                <p className="text-sm font-medium">{formatCurrency(orderTotal)}</p>
                                <p className="text-[11px] text-secondary">
                                    Shipping {shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}
                                </p>
                            </div>
                            <Button type="submit" variant="accent" className="ml-auto" disabled={processing}>
                                {processing ? 'Processing...' : 'Place Order'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </StorefrontLayout>
    );
}
