import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/layouts/AdminLayout';
import { cn } from '@/lib/utils';

interface PaymentSettings {
    enabled: boolean;
    methods: string[];
    midtrans_channels: string[];
}

interface BankTransferSettings {
    bank: string;
    account_number: string;
    account_name: string;
}

interface ShippingSettings {
    biteship_enabled: boolean;
    couriers: string[];
    flat_shipping_cost: number;
    free_shipping_enabled: boolean;
    free_shipping_threshold: number;
    free_shipping_max_subsidy: number | null;
    free_shipping_starts_at: string | null;
    free_shipping_ends_at: string | null;
}

interface SettingsIndexProps {
    paymentSettings: PaymentSettings;
    bankTransferSettings: BankTransferSettings;
    shippingSettings: ShippingSettings;
    paymentMethods: Record<string, string>;
    midtransChannels: Record<string, string>;
    couriers: Record<string, string>;
}

function toggleValue(list: string[], value: string): string[] {
    return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function CheckboxGroup({
    options,
    selected,
    onChange,
}: {
    options: Record<string, string>;
    selected: string[];
    onChange: (next: string[]) => void;
}) {
    return (
        <div className="grid gap-2 sm:grid-cols-2">
            {Object.entries(options).map(([value, label]) => (
                <label
                    key={value}
                    className={cn(
                        'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm',
                        selected.includes(value) ? 'border-warm-brown bg-warm-brown/5' : 'border-outline-variant/20',
                    )}
                >
                    <input
                        type="checkbox"
                        checked={selected.includes(value)}
                        onChange={() => onChange(toggleValue(selected, value))}
                    />
                    {label}
                </label>
            ))}
        </div>
    );
}

export default function SettingsIndex({
    paymentSettings,
    bankTransferSettings,
    shippingSettings,
    paymentMethods,
    midtransChannels,
    couriers,
}: SettingsIndexProps) {
    const paymentForm = useForm({
        section: 'payment',
        enabled: paymentSettings.enabled,
        methods: [...paymentSettings.methods],
        midtrans_channels: [...paymentSettings.midtrans_channels],
    });

    const bankForm = useForm({
        section: 'bank_transfer',
        bank: bankTransferSettings.bank,
        account_number: bankTransferSettings.account_number,
        account_name: bankTransferSettings.account_name,
    });

    const shippingForm = useForm({
        section: 'shipping',
        biteship_enabled: shippingSettings.biteship_enabled,
        couriers: [...shippingSettings.couriers],
        flat_shipping_cost: shippingSettings.flat_shipping_cost,
        free_shipping_enabled: shippingSettings.free_shipping_enabled,
        free_shipping_threshold: shippingSettings.free_shipping_threshold,
        free_shipping_max_subsidy: shippingSettings.free_shipping_max_subsidy ?? '',
        free_shipping_starts_at: shippingSettings.free_shipping_starts_at ?? '',
        free_shipping_ends_at: shippingSettings.free_shipping_ends_at ?? '',
    });

    return (
        <AdminLayout title="Settings">
            <Head title="Pengaturan Pembayaran & Pengiriman" />

            <div className="mx-auto max-w-5xl space-y-8">
                <AdminPageHeader
                    title="Pembayaran & Pengiriman"
                    description="Atur metode yang tampil di checkout."
                    eyebrow="Store Operations"
                />

                <form
                    className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 space-y-4"
                    onSubmit={(event) => {
                        event.preventDefault();
                        paymentForm.post('/admin/settings', { preserveScroll: true });
                    }}
                >
                    <div className="flex items-center justify-between">
                        <h2 className="font-serif text-xl text-primary">Pembayaran</h2>
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={paymentForm.data.enabled}
                                onChange={(event) => paymentForm.setData('enabled', event.target.checked)}
                            />
                            Aktif
                        </label>
                    </div>
                    <CheckboxGroup
                        options={paymentMethods}
                        selected={paymentForm.data.methods}
                        onChange={(methods) => paymentForm.setData('methods', methods)}
                    />
                    {paymentForm.data.methods.includes('midtrans') ? (
                        <div>
                            <p className="mb-2 text-sm font-medium text-on-surface-variant">Kanal Midtrans</p>
                            <CheckboxGroup
                                options={midtransChannels}
                                selected={paymentForm.data.midtrans_channels}
                                onChange={(channels) => paymentForm.setData('midtrans_channels', channels)}
                            />
                        </div>
                    ) : null}
                    <Button type="submit" variant="accent" disabled={paymentForm.processing}>
                        Simpan Pembayaran
                    </Button>
                </form>

                <form
                    className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 space-y-4"
                    onSubmit={(event) => {
                        event.preventDefault();
                        bankForm.post('/admin/settings', { preserveScroll: true });
                    }}
                >
                    <h2 className="font-serif text-xl text-primary">Rekening Transfer</h2>
                    <Input
                        placeholder="Bank"
                        value={bankForm.data.bank}
                        onChange={(event) => bankForm.setData('bank', event.target.value)}
                    />
                    <Input
                        placeholder="Nomor rekening"
                        value={bankForm.data.account_number}
                        onChange={(event) => bankForm.setData('account_number', event.target.value)}
                    />
                    <Input
                        placeholder="Atas nama"
                        value={bankForm.data.account_name}
                        onChange={(event) => bankForm.setData('account_name', event.target.value)}
                    />
                    <Button type="submit" variant="accent" disabled={bankForm.processing}>
                        Simpan Rekening
                    </Button>
                </form>

                <form
                    className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 space-y-4"
                    onSubmit={(event) => {
                        event.preventDefault();
                        shippingForm.post('/admin/settings', { preserveScroll: true });
                    }}
                >
                    <div className="flex items-center justify-between">
                        <h2 className="font-serif text-xl text-primary">Pengiriman</h2>
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={shippingForm.data.biteship_enabled}
                                onChange={(event) => shippingForm.setData('biteship_enabled', event.target.checked)}
                            />
                            Biteship aktif
                        </label>
                    </div>
                    <CheckboxGroup
                        options={couriers}
                        selected={shippingForm.data.couriers}
                        onChange={(next) => shippingForm.setData('couriers', next)}
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                        <label className="text-sm">
                            <span className="mb-1 block text-on-surface-variant">Flat shipping (IDR)</span>
                            <Input
                                type="number"
                                value={shippingForm.data.flat_shipping_cost}
                                onChange={(event) =>
                                    shippingForm.setData('flat_shipping_cost', Number(event.target.value))
                                }
                            />
                        </label>
                        <label className="text-sm">
                            <span className="mb-1 block text-on-surface-variant">Free shipping threshold</span>
                            <Input
                                type="number"
                                value={shippingForm.data.free_shipping_threshold}
                                onChange={(event) =>
                                    shippingForm.setData('free_shipping_threshold', Number(event.target.value))
                                }
                            />
                        </label>
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={shippingForm.data.free_shipping_enabled}
                            onChange={(event) => shippingForm.setData('free_shipping_enabled', event.target.checked)}
                        />
                        Free shipping enabled
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <Input
                            type="date"
                            value={shippingForm.data.free_shipping_starts_at}
                            onChange={(event) => shippingForm.setData('free_shipping_starts_at', event.target.value)}
                        />
                        <Input
                            type="date"
                            value={shippingForm.data.free_shipping_ends_at}
                            onChange={(event) => shippingForm.setData('free_shipping_ends_at', event.target.value)}
                        />
                    </div>
                    <Button type="submit" variant="accent" disabled={shippingForm.processing}>
                        Simpan Pengiriman
                    </Button>
                </form>
            </div>
        </AdminLayout>
    );
}
