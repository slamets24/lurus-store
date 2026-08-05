<?php

namespace App\Models;

use App\Support\WebpImage;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductImage extends Model
{
    protected $fillable = [
        'product_id',
        'image_path',
        'color',
        'is_primary',
        'sort_order',
    ];

    protected $appends = [
        'thumb_path',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function getImagePathAttribute(string $value): string
    {
        return Str::startsWith($value, ['http://', 'https://', '/'])
            ? $value
            : Storage::url($value);
    }

    public function getThumbPathAttribute(): string
    {
        return $this->thumbUrl();
    }

    public function thumbUrl(int $maxEdge = WebpImage::THUMB_EDGE): string
    {
        $raw = $this->getRawOriginal('image_path');

        if (! is_string($raw) || $raw === '' || Str::startsWith($raw, ['http://', 'https://', '/'])) {
            return $this->image_path;
        }

        $disk = Storage::disk('public');
        $thumbRel = 'products/thumbs/'.pathinfo($raw, PATHINFO_FILENAME).'_e'.$maxEdge.'.webp';

        if (! $disk->exists($thumbRel)) {
            WebpImage::writeThumb($disk->path($raw), $disk->path($thumbRel), $maxEdge);
        }

        return $disk->exists($thumbRel) ? $disk->url($thumbRel) : $this->image_path;
    }
}
