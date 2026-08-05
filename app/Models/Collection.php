<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Sitemap\Contracts\Sitemapable;
use Spatie\Sitemap\Tags\Url;

class Collection extends Model implements Sitemapable
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'subtitle',
        'banner_image',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class)
            ->withPivot('sort_order')
            ->orderByPivot('sort_order');
    }

    public function toSitemapTag(): Url|string|array
    {
        return Url::create(route('collections.show', $this->slug))
            ->setLastModificationDate($this->updated_at);
    }
}
