<?php

namespace App\Models;

use App\Services\MidtransService;
use Illuminate\Database\Eloquent\Model;

class StoreContentSetting extends Model
{
    public const DEFAULT_WHATSAPP_NUMBER = '6281234567890';

    public const PAYMENT_METHODS = ['bank_transfer', 'midtrans'];

    public const COURIERS = [
        'jne' => 'JNE',
        'sicepat' => 'SiCepat',
        'anteraja' => 'AnterAja',
        'jnt' => 'J&T Express',
        'tiki' => 'TIKI',
        'pos' => 'Pos Indonesia',
        'ninja' => 'Ninja Xpress',
        'lion' => 'Lion Parcel',
        'idexpress' => 'ID Express',
        'sap' => 'SAP Express',
        'paxel' => 'Paxel',
        'wahana' => 'Wahana',
        'rpx' => 'RPX',
        'jdl' => 'JDL',
        'gojek' => 'GoSend',
        'grab' => 'GrabExpress',
        'rara' => 'Rara Delivery',
        'borzo' => 'Borzo',
        'lalamove' => 'Lalamove',
        'deliveree' => 'Deliveree',
        'sentralcargo' => 'Sentral Cargo',
        'dash_express' => 'Dash Express',
    ];

    protected $fillable = ['key', 'value'];

    protected $casts = [
        'value' => 'array',
    ];

    public static function value(string $key, mixed $default = null): mixed
    {
        return self::where('key', $key)->first()?->value ?? $default;
    }

    public static function putValue(string $key, mixed $value): void
    {
        self::updateOrCreate(['key' => $key], ['value' => $value]);
    }

    /** @return array{enabled: bool, methods: list<string>, midtrans_channels: list<string>} */
    public static function paymentSettings(): array
    {
        $settings = self::value('payment_settings', []);
        $settings = is_array($settings) ? $settings : [];

        return [
            'enabled' => (bool) ($settings['enabled'] ?? true),
            'methods' => self::allowedList($settings['methods'] ?? self::PAYMENT_METHODS, self::PAYMENT_METHODS),
            'midtrans_channels' => self::allowedList(
                $settings['midtrans_channels'] ?? MidtransService::CHANNELS,
                MidtransService::CHANNELS,
            ),
        ];
    }

    /** @return array{bank: string, account_number: string, account_name: string} */
    public static function bankTransferSettings(): array
    {
        $settings = self::value('bank_transfer_settings');
        $fallback = config('services.bank_transfer', []);

        if (! is_array($settings)) {
            $settings = [];
        }

        return [
            'bank' => trim((string) ($settings['bank'] ?? $fallback['bank'] ?? 'BCA')),
            'account_number' => trim((string) ($settings['account_number'] ?? $fallback['account_number'] ?? '')),
            'account_name' => trim((string) ($settings['account_name'] ?? $fallback['account_name'] ?? config('app.name', 'Lurus Store'))),
        ];
    }

    /**
     * @return array{
     *     biteship_enabled: bool,
     *     couriers: list<string>,
     *     flat_shipping_cost: int,
     *     free_shipping_enabled: bool,
     *     free_shipping_threshold: int,
     *     free_shipping_max_subsidy: ?int,
     *     free_shipping_starts_at: ?string,
     *     free_shipping_ends_at: ?string
     * }
     */
    public static function shippingSettings(): array
    {
        $available = self::availableCouriers();
        $settings = self::value('shipping_settings', []);
        $settings = is_array($settings) ? $settings : [];
        $maxSubsidy = $settings['free_shipping_max_subsidy'] ?? null;

        return [
            'biteship_enabled' => (bool) ($settings['biteship_enabled'] ?? true),
            'couriers' => self::allowedList(
                $settings['couriers'] ?? self::configuredCouriers(),
                $available,
            ),
            'flat_shipping_cost' => max(0, (int) (
                $settings['flat_shipping_cost']
                ?? config('services.biteship.fallback_shipping_cost')
            )),
            'free_shipping_enabled' => (bool) ($settings['free_shipping_enabled'] ?? true),
            'free_shipping_threshold' => max(0, (int) (
                $settings['free_shipping_threshold']
                ?? config('services.biteship.free_shipping_threshold')
            )),
            // null = unlimited (customer pays Rp0); e.g. 30000 → store covers max 30k
            'free_shipping_max_subsidy' => $maxSubsidy === null || $maxSubsidy === ''
                ? null
                : max(0, (int) $maxSubsidy),
            'free_shipping_starts_at' => self::nullableDate($settings['free_shipping_starts_at'] ?? null),
            'free_shipping_ends_at' => self::nullableDate($settings['free_shipping_ends_at'] ?? null),
        ];
    }

    /** Customer pays Rp0; store still pays Biteship on real shipment create. */
    public static function qualifiesForFreeShipping(float $subtotal, ?\Carbon\CarbonInterface $now = null): bool
    {
        $settings = self::shippingSettings();

        if (! $settings['free_shipping_enabled'] || ! $settings['biteship_enabled']) {
            return false;
        }

        if ($subtotal <= (float) $settings['free_shipping_threshold']) {
            return false;
        }

        return self::freeShippingWindowOpen($now, $settings);
    }

    /**
     * @param  array{
     *     free_shipping_starts_at: ?string,
     *     free_shipping_ends_at: ?string
     * }|null  $settings
     */
    public static function freeShippingWindowOpen(?\Carbon\CarbonInterface $now = null, ?array $settings = null): bool
    {
        $settings ??= self::shippingSettings();
        $today = ($now ?? now())->toDateString();
        $starts = $settings['free_shipping_starts_at'] ?? null;
        $ends = $settings['free_shipping_ends_at'] ?? null;

        if (is_string($starts) && $starts !== '' && $today < $starts) {
            return false;
        }

        if (is_string($ends) && $ends !== '' && $today > $ends) {
            return false;
        }

        return true;
    }

    private static function nullableDate(mixed $value): ?string
    {
        if (! is_string($value) || $value === '') {
            return null;
        }

        return preg_match('/^\d{4}-\d{2}-\d{2}$/', $value) === 1 ? $value : null;
    }

    /** @return list<string> */
    public static function availableCouriers(): array
    {
        return array_keys(self::COURIERS);
    }

    /** @return list<string> */
    private static function configuredCouriers(): array
    {
        $configured = array_values(array_filter(array_map(
            'trim',
            explode(',', (string) config('services.biteship.couriers')),
        )));

        return self::allowedList($configured, array_keys(self::COURIERS));
    }

    /**
     * @return array{
     *     enabled: bool,
     *     image: ?string,
     *     title: string,
     *     subtitle: string,
     *     cta_text: string,
     *     cta_url: string,
     *     version: int
     * }
     */
    public static function promoPopupSettings(): array
    {
        $settings = self::value('promo_popup', []);
        $settings = is_array($settings) ? $settings : [];

        return [
            'enabled' => (bool) ($settings['enabled'] ?? false),
            'image' => isset($settings['image']) && is_string($settings['image']) && $settings['image'] !== ''
                ? $settings['image']
                : null,
            'title' => (string) ($settings['title'] ?? ''),
            'subtitle' => (string) ($settings['subtitle'] ?? ''),
            'cta_text' => (string) ($settings['cta_text'] ?? 'Belanja Sekarang'),
            'cta_url' => (string) ($settings['cta_url'] ?? '/products'),
            'version' => max(1, (int) ($settings['version'] ?? 1)),
        ];
    }

    /**
     * Storefront payload — null when the popup should not render.
     *
     * @return array{
     *     image: string,
     *     title: string,
     *     subtitle: ?string,
     *     cta_text: string,
     *     cta_url: string,
     *     version: int
     * }|null
     */
    public static function promoPopup(): ?array
    {
        $settings = self::promoPopupSettings();

        if (
            ! $settings['enabled']
            || $settings['image'] === null
            || $settings['title'] === ''
            || $settings['cta_text'] === ''
            || $settings['cta_url'] === ''
        ) {
            return null;
        }

        return [
            'image' => $settings['image'],
            'title' => $settings['title'],
            'subtitle' => $settings['subtitle'] !== '' ? $settings['subtitle'] : null,
            'cta_text' => $settings['cta_text'],
            'cta_url' => $settings['cta_url'],
            'version' => $settings['version'],
        ];
    }

    /** @return list<array{id: string, link: ?string, desktop_image: ?string, mobile_image: ?string}> */
    public static function heroBanners(): array
    {
        $hero = self::value('hero', []);

        if (! is_array($hero) || $hero === []) {
            return [];
        }

        // Legacy single-banner object → list
        if (! array_is_list($hero)) {
            $hero = [[
                'id' => $hero['id'] ?? 'legacy',
                'link' => $hero['link'] ?? null,
                'desktop_image' => $hero['desktop_image'] ?? null,
                'mobile_image' => $hero['mobile_image'] ?? null,
            ]];
        }

        return array_values(array_map(fn (array $banner) => [
            'id' => (string) ($banner['id'] ?? uniqid('hero_', true)),
            'link' => $banner['link'] ?? null,
            'desktop_image' => $banner['desktop_image'] ?? null,
            'mobile_image' => $banner['mobile_image'] ?? null,
        ], $hero));
    }

    /**
     * @param  list<string>  $allowed
     * @return list<string>
     */
    private static function allowedList(mixed $values, array $allowed): array
    {
        if (! is_array($values)) {
            return [];
        }

        return array_values(array_intersect($allowed, $values));
    }
}
