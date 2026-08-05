<?php

namespace App\Models;

use App\Notifications\OrderAdminNotification;
use App\Notifications\OrderCustomerNotification;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Notification;

class Order extends Model
{
    use SoftDeletes;

    public ?string $guestAccessToken = null;

    public const STATUS_PENDING = 'pending';

    public const STATUS_READY_TO_SHIP = 'ready_to_ship';

    public const STATUS_STOCK_CONFIRMATION = 'stock_confirmation';

    public const STATUS_SHIPPED = 'shipped';

    public const STATUS_DELIVERED = 'delivered';

    public const STATUS_CANCELLED = 'cancelled';

    public const PAYMENT_UNPAID = 'unpaid';

    public const PAYMENT_PENDING_VERIFICATION = 'pending_verification';

    public const PAYMENT_PAID = 'paid';

    public const PAYMENT_FAILED = 'failed';

    public const PAYMENT_EXPIRED = 'expired';

    public const PAYMENT_REFUNDED = 'refunded';

    public const PAYMENT_METHOD_MIDTRANS = 'midtrans';

    public const PAYMENT_METHOD_BANK_TRANSFER = 'bank_transfer';

    protected $fillable = [
        'user_id',
        'order_number',
        'guest_token',
        'customer_email',
        'customer_phone',
        'subtotal',
        'discount_amount',
        'shipping_cost',
        'total_amount',
        'status',
        'shipping_address',
        'biteship_order_id',
        'waybill_id',
        'shipping_status',
        'shipping_history',
        'shipped_at',
        'delivered_at',
        'payment_method',
        'payment_channel',
        'payment_status',
        'payment_reference',
        'payment_url',
        'payment_proof_path',
        'payment_expires_at',
        'payment_verified_at',
        'stock_released_at',
        'testimonial_token',
        'testimonial_requested_at',
        'testimonial_submitted_at',
        'notes',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'shipping_address' => 'array',
        'shipping_history' => 'array',
        'payment_expires_at' => 'datetime',
        'payment_verified_at' => 'datetime',
        'stock_released_at' => 'datetime',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
        'testimonial_requested_at' => 'datetime',
        'testimonial_submitted_at' => 'datetime',
    ];

    protected $hidden = [
        'guest_token',
        'payment_proof_path',
        'testimonial_token',
    ];

    public function getRouteKeyName(): string
    {
        return 'order_number';
    }

    public function resolveRouteBinding($value, $field = null)
    {
        $query = $this->where($field ?? $this->getRouteKeyName(), $value);

        if ($field === null && ctype_digit((string) $value)) {
            $query->orWhere($this->getQualifiedKeyName(), $value);
        }

        return $query->first();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function testimonialAccessToken(): string
    {
        return hash_hmac('sha256', 'testimonial:'.$this->getKey(), (string) config('app.key'));
    }

    /**
     * @param  list<string>  $lines
     */
    public function notifyCustomer(string $subject, array $lines, ?string $actionUrl = null, ?string $actionText = null): void
    {
        if (! $this->customer_email) {
            return;
        }

        Notification::route('mail', $this->customer_email)
            ->notify(new OrderCustomerNotification($this, $subject, $lines, $actionUrl, $actionText));
    }

    /**
     * Store owner inbox — same address as contact form (`CONTACT_TO_EMAIL`).
     *
     * @param  list<string>  $lines
     */
    public function notifyAdmin(string $subject, array $lines): void
    {
        $to = (string) config('services.contact.to');

        if ($to === '') {
            return;
        }

        Notification::route('mail', $to)
            ->notify(new OrderAdminNotification($this, $subject, $lines));
    }

    public function customerOrderUrl(?string $guestToken = null): ?string
    {
        if ($this->user_id) {
            return route('orders.show', $this);
        }

        $token = $guestToken ?? $this->guestAccessToken;

        return $token
            ? route('orders.show', ['order' => $this, 'token' => $token])
            : null;
    }
}
