<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ProductOffer extends Model
{
    protected $fillable = [
        'product_id',
        'name',
        'price',
        'sort_order',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'sort_order' => 'integer',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function components(): BelongsToMany
    {
        return $this->belongsToMany(ProductComponent::class, 'product_offer_components')
            ->withPivot('quantity')
            ->withTimestamps()
            ->orderBy('product_components.sort_order')
            ->orderBy('product_components.id');
    }
}
