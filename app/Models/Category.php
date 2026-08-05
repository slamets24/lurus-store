<?php

namespace App\Models;

use Database\Factories\CategoryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Spatie\Sitemap\Contracts\Sitemapable;
use Spatie\Sitemap\Tags\Url;

class Category extends Model implements Sitemapable
{
    /** @use HasFactory<CategoryFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'image',
        'size_chart_path',
        'parent_id',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function sizeChartUrl(): ?string
    {
        $raw = $this->attributes['size_chart_path'] ?? null;

        if (! is_string($raw) || $raw === '') {
            return null;
        }

        return str_starts_with($raw, 'http://')
            || str_starts_with($raw, 'https://')
            || str_starts_with($raw, '/')
            ? $raw
            : Storage::url($raw);
    }

    public function toSitemapTag(): Url|string|array
    {
        return Url::create(route('categories.show', $this->slug))
            ->setLastModificationDate($this->updated_at);
    }
}
