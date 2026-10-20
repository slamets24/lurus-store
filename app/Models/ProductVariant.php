<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariant extends Model
{
    protected $fillable = [
        'product_id',
        'component_id',
        'sku',
        'color',
        'size',
        'stock',
        'price',
        'stock_reserved',
        'status',
    ];

    protected $casts = [
        'stock' => 'integer',
        'price' => 'decimal:2',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function component(): BelongsTo
    {
        return $this->belongsTo(ProductComponent::class, 'component_id');
    }
}
