<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StoreContentSetting;
use App\Services\MidtransService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AdminStoreSettingsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Settings/Index', [
            'paymentSettings' => StoreContentSetting::paymentSettings(),
            'bankTransferSettings' => StoreContentSetting::bankTransferSettings(),
            'shippingSettings' => StoreContentSetting::shippingSettings(),
            'paymentMethods' => [
                'bank_transfer' => 'Transfer Bank Manual',
                'midtrans' => 'Midtrans',
            ],
            'midtransChannels' => collect(MidtransService::CHANNELS)
                ->mapWithKeys(fn (string $channel) => [$channel => $this->channelLabel($channel)]),
            'couriers' => collect(StoreContentSetting::availableCouriers())
                ->mapWithKeys(fn (string $courier) => [$courier => StoreContentSetting::COURIERS[$courier]]),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'section' => ['required', Rule::in(['payment', 'bank_transfer', 'shipping'])],
        ]);
        $section = $request->string('section')->toString();

        if ($section === 'payment') {
            $this->updatePayment($request);
            $message = 'Pengaturan pembayaran berhasil disimpan.';
        } elseif ($section === 'bank_transfer') {
            $this->updateBankTransfer($request);
            $message = 'Rekening transfer bank berhasil disimpan.';
        } else {
            $this->updateShipping($request);
            $message = 'Pengaturan pengiriman berhasil disimpan.';
        }

        return back()->with('success', $message);
    }

    private function updatePayment(Request $request): void
    {
        $validated = $request->validate([
            'enabled' => ['required', 'boolean'],
            'methods' => ['present', 'array'],
            'methods.*' => [Rule::in(StoreContentSetting::PAYMENT_METHODS)],
            'midtrans_channels' => ['present', 'array'],
            'midtrans_channels.*' => [Rule::in(MidtransService::CHANNELS)],
        ]);

        if ($validated['enabled'] && $validated['methods'] === []) {
            throw ValidationException::withMessages([
                'methods' => 'Pilih minimal satu metode saat pembayaran aktif.',
            ]);
        }

        if (in_array('midtrans', $validated['methods'], true) && $validated['midtrans_channels'] === []) {
            throw ValidationException::withMessages([
                'midtrans_channels' => 'Pilih minimal satu kanal Midtrans.',
            ]);
        }

        StoreContentSetting::putValue('payment_settings', [
            'enabled' => $validated['enabled'],
            'methods' => array_values(array_unique($validated['methods'])),
            'midtrans_channels' => array_values(array_unique($validated['midtrans_channels'])),
        ]);
    }

    private function updateBankTransfer(Request $request): void
    {
        $validated = $request->validate([
            'bank' => ['required', 'string', 'max:50'],
            'account_number' => ['required', 'string', 'max:50', 'regex:/^[0-9\s\-]+$/'],
            'account_name' => ['required', 'string', 'max:100'],
        ]);

        StoreContentSetting::putValue('bank_transfer_settings', [
            'bank' => trim($validated['bank']),
            'account_number' => preg_replace('/\s+/', '', $validated['account_number']),
            'account_name' => trim($validated['account_name']),
        ]);
    }

    private function updateShipping(Request $request): void
    {
        $validated = $request->validate([
            'biteship_enabled' => ['required', 'boolean'],
            'couriers' => ['present', 'array'],
            'couriers.*' => [Rule::in(StoreContentSetting::availableCouriers())],
            'flat_shipping_cost' => ['required', 'integer', 'min:0', 'max:10000000'],
            'free_shipping_enabled' => ['required', 'boolean'],
            'free_shipping_threshold' => ['required', 'integer', 'min:0', 'max:100000000'],
            'free_shipping_max_subsidy' => ['nullable', 'integer', 'min:0', 'max:10000000'],
            'free_shipping_starts_at' => ['nullable', 'date_format:Y-m-d'],
            'free_shipping_ends_at' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:free_shipping_starts_at'],
        ]);

        if ($validated['biteship_enabled'] && $validated['couriers'] === []) {
            throw ValidationException::withMessages([
                'couriers' => 'Pilih minimal satu kurir saat Biteship aktif.',
            ]);
        }

        StoreContentSetting::putValue('shipping_settings', [
            'biteship_enabled' => $validated['biteship_enabled'],
            'couriers' => array_values(array_unique($validated['couriers'])),
            'flat_shipping_cost' => $validated['flat_shipping_cost'],
            'free_shipping_enabled' => $validated['free_shipping_enabled'],
            'free_shipping_threshold' => $validated['free_shipping_threshold'],
            'free_shipping_max_subsidy' => $validated['free_shipping_max_subsidy'] ?? null,
            'free_shipping_starts_at' => $validated['free_shipping_starts_at'] ?? null,
            'free_shipping_ends_at' => $validated['free_shipping_ends_at'] ?? null,
        ]);
    }

    private function channelLabel(string $channel): string
    {
        return match ($channel) {
            'bca_va' => 'Virtual Account BCA',
            'echannel' => 'Mandiri Bill',
            'bni_va' => 'Virtual Account BNI',
            'bri_va' => 'Virtual Account BRI',
            'permata_va' => 'Virtual Account Permata',
            'gopay' => 'GoPay',
            'shopeepay' => 'ShopeePay',
            'other_qris' => 'QRIS',
            'credit_card' => 'Kartu Kredit/Debit',
            default => $channel,
        };
    }
}
