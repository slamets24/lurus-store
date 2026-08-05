<?php

namespace App\Models;

use App\Notifications\ResetPasswordNotification;
use Database\Factories\UserFactory;
use Illuminate\Auth\MustVerifyEmail as MustVerifyEmailTrait;
use Illuminate\Contracts\Auth\MustVerifyEmail as MustVerifyEmailContract;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Illuminate\Validation\ValidationException;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $role
 * @property int|null $created_by_user_id
 * @property Carbon|null $email_verified_at
 * @property string|null $email_otp_hash
 * @property Carbon|null $email_otp_expires_at
 * @property string $password
 * @property string|null $remember_token
 * @property string|null $address
 * @property string|null $city
 * @property string|null $postal_code
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'email', 'password', 'phone', 'address', 'city', 'postal_code'])]
#[Hidden(['password', 'remember_token', 'email_otp_hash'])]
class User extends Authenticatable implements MustVerifyEmailContract
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, MustVerifyEmailTrait, Notifiable;

    public const ROLE_SUPER_ADMIN = 'super-admin';

    public const ROLE_ADMIN = 'admin';

    public const ROLE_CUSTOMER = 'customer';

    private const SUPER_ADMIN_ROLES = [self::ROLE_SUPER_ADMIN, 'superadmin'];

    protected $attributes = [
        'role' => self::ROLE_CUSTOMER,
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'email_otp_expires_at' => 'datetime',
            'password' => 'hashed',
            'role' => 'string',
        ];
    }

    public function isAdmin(): bool
    {
        return in_array($this->role, [self::ROLE_SUPER_ADMIN, self::ROLE_ADMIN, 'superadmin'], true);
    }

    public function isSuperAdmin(): bool
    {
        return in_array($this->role, self::SUPER_ADMIN_ROLES, true);
    }

    public function hasVerifiedEmail(): bool
    {
        return $this->isAdmin() || $this->email_verified_at !== null;
    }

    public function sendPasswordResetNotification(#[\SensitiveParameter] $token): void
    {
        // Customer-only reset emails; admins use the admin user password flow.
        if ($this->isAdmin()) {
            return;
        }

        $this->notify(new ResetPasswordNotification($token));
    }

    protected static function booted(): void
    {
        static::saving(function (User $user): void {
            if (! $user->isSuperAdmin()) {
                return;
            }

            $query = static::whereIn('role', self::SUPER_ADMIN_ROLES);

            if ($user->exists) {
                $query->whereKeyNot($user->getKey());
            }

            if ($query->exists()) {
                throw ValidationException::withMessages([
                    'role' => 'Only one super admin is allowed.',
                ]);
            }
        });
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(self::class, 'created_by_user_id');
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function testimonials(): HasMany
    {
        return $this->hasMany(Testimonial::class);
    }
}
