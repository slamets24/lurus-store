<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PromoTarget extends Model
{
    public const TYPE_PRODUCT = 'product';

    public const TYPE_CATEGORY = 'category';

    protected $fillable = [
        'promo_id',
        'target_type',
        'target_id',
    ];

    public function promo(): BelongsTo
    {
        return $this->belongsTo(Promo::class);
    }
}
