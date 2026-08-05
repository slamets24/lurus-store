<?php

namespace App\Enums;

enum UserRole: string
{
    case Customer = 'customer';
    case Admin = 'admin';
    case SuperAdmin = 'super-admin';

    public function isAdmin(): bool
    {
        return in_array($this, [self::Admin, self::SuperAdmin], true);
    }

    public function isSuperAdmin(): bool
    {
        return $this === self::SuperAdmin;
    }

    public static function fromLegacy(string $role): self
    {
        return match ($role) {
            'superadmin', 'super-admin' => self::SuperAdmin,
            'admin' => self::Admin,
            default => self::Customer,
        };
    }
}
