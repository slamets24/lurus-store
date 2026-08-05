<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Promo extends Model
{
    use SoftDeletes;

    public const TYPE_BXGY = 'bxgy';

    public const TYPE_BUNDLE = 'bundle';

    public const SCOPE_PRODUCTS = 'products';

    public const SCOPE_CATEGORIES = 'categories';

    public const SCOPE_ALL = 'all';

    public const FREE_PICK_CHEAPEST = 'cheapest';

    public const FREE_PICK_SAME_SKU = 'same_sku';

    protected $fillable = [
        'name',
        'type',
        'is_active',
        'scope',
        'buy_qty',
        'free_qty',
        'free_pick',
        'min_unit_price',
        'package_price',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'buy_qty' => 'integer',
        'free_qty' => 'integer',
        'min_unit_price' => 'decimal:2',
        'package_price' => 'decimal:2',
    ];

    public function targets(): HasMany
    {
        return $this->hasMany(PromoTarget::class);
    }

    public function components(): HasMany
    {
        return $this->hasMany(PromoComponent::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
