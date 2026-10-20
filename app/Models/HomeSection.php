<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class HomeSection extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'type',
        'title',
        'subtitle',
        'content',
        'image_path',
        'link_url',
        'button_label',
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
        return $this->title ?: (string) $this->type;
    }

    public function items(): HasMany
    {
        return $this->hasMany(HomeSectionItem::class);
    }
}
