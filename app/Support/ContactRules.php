<?php

namespace App\Support;

/**
 * Shared validation for customer contact fields. Order/account notifications
 * are delivered by email, so the address must at least have a real domain,
 * and phone numbers must look like a dialable (international) number.
 */
final class ContactRules
{
    // E.164-ish: optional +, 8-15 digits. Applied after normalize().
    public const PHONE_REGEX = '/^\+?[0-9]{8,15}$/';

    public const PHONE_MESSAGE = 'Enter a valid phone number, e.g. 08123456789 or +6281234567890.';

    public const EMAIL_MESSAGE = 'Enter a valid, active email address — order updates are sent there.';

    /** Strict email rule; skips the DNS lookup while testing (offline CI). */
    public static function email(): string
    {
        return app()->environment('testing') ? 'email:rfc' : 'email:rfc,dns';
    }

    /** Strip spaces, dashes, dots, and parentheses so the regex sees digits only. */
    public static function normalizePhone(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $value = (string) preg_replace('/[\s\-().]/', '', $value);

        return $value === '' ? null : $value;
    }
}
