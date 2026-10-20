<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class HomeSectionItem extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'home_section_id',
        'item_type',
        'product_id',
        'category_id',
        'title',
        'subtitle',
        'image_path',
        'link_url',
        'config_json',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'config_json' => 'array',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function getNameAttribute(): string
    {
        return $this->title ?: (string) $this->item_type;
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(HomeSection::class, 'home_section_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
