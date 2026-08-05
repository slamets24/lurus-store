<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use PDO;
use Pdo\Sqlite;
use Spatie\Sitemap\Contracts\Sitemapable;
use Spatie\Sitemap\Tags\Url;
use SqliteVec\SqliteVec;

class Product extends Model implements Sitemapable
{
    use SoftDeletes;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'discount_percent',
        'stock',
        'stock_reserved',
        'sku',
        'sizes',
        'colors',
        'color_hexes',
        'material',
        'related_fit_product_id',
        'care_instructions',
        'shopee_url',
        'tokopedia_url',
        'tiktok_url',
        'is_active',
        'is_featured',
        'embedding',
    ];

    protected $hidden = [
        'embedding',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount_percent' => 'decimal:2',
        'stock' => 'integer',
        'sizes' => 'array',
        'colors' => 'array',
        'color_hexes' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'embedding' => 'array',
    ];

    private static ?string $pgvectorType = null;

    protected static function booted(): void
    {
        static::saved(function (Product $product) {
            if (! $product->embedding || ! is_array($product->embedding)) {
                return;
            }
            $product->syncEmbeddingToVec0();
        });

        static::deleted(function (Product $product) {
            if (! $product->isForceDeleting()) {
                return;
            }

            if (! self::isVec0Available()) {
                return;
            }
            try {
                $vecDb = self::vecDb();
                $stmt = $vecDb->prepare('DELETE FROM products_vec WHERE rowid = ?');
                $stmt->bindValue(1, $product->id, PDO::PARAM_INT);
                $stmt->execute();
            } catch (\Throwable $e) {
                Log::warning('Failed to delete from products_vec: '.$e->getMessage());
            }
        });
    }

    public function syncEmbeddingToVec0(): void
    {
        if (! self::isVec0Available() || ! $this->embedding || ! is_array($this->embedding)) {
            return;
        }
        try {
            $vecDb = self::vecDb();
            $binary = SqliteVec::serializeFloat32($this->embedding);
            $stmt = $vecDb->prepare('INSERT OR REPLACE INTO products_vec(rowid, embedding) VALUES (?, ?)');
            $stmt->bindValue(1, $this->id, PDO::PARAM_INT);
            $stmt->bindValue(2, $binary, PDO::PARAM_LOB);
            $stmt->execute();
        } catch (\Throwable $e) {
            Log::warning('Failed to sync embedding to products_vec: '.$e->getMessage());
        }
    }

    public static function batchSyncVec0(): int
    {
        if (! self::isVec0Available()) {
            return 0;
        }
        try {
            $vecDb = self::vecDb();
            $products = self::whereNotNull('embedding')->get(['id', 'embedding']);
            $count = 0;

            foreach ($products as $product) {
                if (! $product->embedding || ! is_array($product->embedding)) {
                    continue;
                }
                $binary = SqliteVec::serializeFloat32($product->embedding);
                $stmt = $vecDb->prepare('INSERT OR REPLACE INTO products_vec(rowid, embedding) VALUES (?, ?)');
                $stmt->bindValue(1, $product->id, PDO::PARAM_INT);
                $stmt->bindValue(2, $binary, PDO::PARAM_LOB);
                $stmt->execute();
                $count++;
            }

            return $count;
        } catch (\Throwable $e) {
            Log::warning('Failed to batch sync embeddings: '.$e->getMessage());

            return 0;
        }
    }

    public function effectiveUnitPrice(): float
    {
        $percent = min(100.0, max(0.0, (float) ($this->discount_percent ?? 0)));

        return round((float) $this->price * (1 - ($percent / 100)), 2);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function collections(): BelongsToMany
    {
        return $this->belongsToMany(Collection::class)
            ->withPivot('sort_order')
            ->orderByPivot('sort_order');
    }

    public function relatedFitProduct(): BelongsTo
    {
        return $this->belongsTo(self::class, 'related_fit_product_id');
    }

    public function toSitemapTag(): Url|string|array
    {
        return Url::create(route('products.show', $this->slug))
            ->setLastModificationDate($this->updated_at);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)
            ->orderByDesc('is_primary')
            ->orderBy('sort_order')
            ->orderBy('id');
    }

    public function primaryImage(): HasMany
    {
        return $this->hasMany(ProductImage::class)->where('is_primary', true);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function publishedVariants(): HasMany
    {
        return $this->hasMany(ProductVariant::class)->where('status', 'published');
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function toEmbeddingText(): string
    {
        $this->loadMissing('category');

        $parts = array_filter([
            $this->name,
            $this->description,
            $this->material ? 'Material: '.$this->material : null,
            $this->colors ? 'Colors: '.implode(', ', (array) $this->colors) : null,
            $this->category?->name ? 'Category: '.$this->category->name : null,
        ]);

        return implode('. ', $parts);
    }

    /**
     * Hybrid search: keyword (+ ID synonyms) first, then vector neighbors.
     */
    public function scopeSearch($query, string $q, array $queryEmbedding)
    {
        $ids = array_values(array_unique([
            ...self::keywordSearchIds($q),
            ...self::vectorSearchIds($queryEmbedding),
        ]));

        return $this->applyOrderedIds($query, $ids);
    }

    public function scopeSearchByVector($query, array $queryEmbedding)
    {
        return $this->applyOrderedIds($query, self::vectorSearchIds($queryEmbedding));
    }

    /** @return list<int> */
    public static function keywordSearchIds(string $q): array
    {
        $terms = self::searchTerms($q);
        if ($terms === []) {
            return [];
        }

        $likeOp = DB::getDriverName() === 'pgsql' ? 'ilike' : 'like';

        $candidates = static::query()
            ->where('is_active', true)
            ->where(function ($builder) use ($terms, $likeOp) {
                foreach ($terms as $term) {
                    $like = '%'.$term.'%';
                    $builder->orWhere(function ($inner) use ($like, $likeOp) {
                        $inner->where('name', $likeOp, $like)
                            ->orWhere('description', $likeOp, $like)
                            ->orWhere('material', $likeOp, $like)
                            ->orWhere('sku', $likeOp, $like);

                        if (DB::getDriverName() === 'pgsql') {
                            $inner->orWhereRaw('colors::text ilike ?', [$like]);
                        } else {
                            $inner->orWhere('colors', 'like', $like);
                        }
                    });
                }
            })
            ->get(['id', 'name', 'description', 'material', 'colors', 'sku']);

        return $candidates
            ->map(function (self $product) use ($terms) {
                $name = strtolower((string) $product->name);
                $haystack = strtolower(implode(' ', array_filter([
                    $product->name,
                    $product->description,
                    $product->material,
                    $product->sku,
                    is_array($product->colors) ? implode(' ', $product->colors) : (string) $product->colors,
                ])));

                $score = 0;
                foreach ($terms as $term) {
                    $needle = strtolower($term);
                    if (str_contains($name, $needle)) {
                        $score += 3;
                    } elseif (str_contains($haystack, $needle)) {
                        $score += 1;
                    }
                }

                return ['id' => (int) $product->id, 'score' => $score];
            })
            ->filter(fn (array $row) => $row['score'] > 0)
            ->sortByDesc('score')
            ->pluck('id')
            ->values()
            ->all();
    }

    /** @return list<string> */
    public static function searchTerms(string $q): array
    {
        // ponytail: tiny ID↔EN map for catalog search; swap for full synonym service if locale grows
        $synonyms = [
            'kaos' => ['tshirt', 't-shirt', 'tee', 'knit'],
            'baju' => ['shirt', 'knit', 'polo', 'tee'],
            'kemeja' => ['shirt', 'oxford', 'linen'],
            'polo' => ['polo'],
            'celana' => ['pant', 'pants', 'chino'],
            'jaket' => ['jacket', 'bomber'],
            'jacket' => ['jacket', 'bomber'],
            'sweater' => ['sweater', 'varsity'],
            'hitam' => ['black'],
            'putih' => ['white'],
            'abu' => ['grey', 'gray'],
            'navy' => ['navy'],
            'krem' => ['cream', 'beige', 'sand'],
            'coklat' => ['brown', 'maroon', 'burgundy'],
        ];

        $tokens = preg_split('/[\s,]+/u', mb_strtolower(trim($q))) ?: [];
        $terms = [];

        foreach ($tokens as $token) {
            $token = trim($token);
            if ($token === '' || mb_strlen($token) < 2) {
                continue;
            }

            $terms[] = $token;
            foreach ($synonyms[$token] ?? [] as $syn) {
                $terms[] = $syn;
            }
        }

        return array_values(array_unique($terms));
    }

    /** @return list<int> */
    private static function vectorSearchIds(array $queryEmbedding): array
    {
        if (self::isPgvectorAvailable()) {
            return self::vectorSearchIdsPgvector($queryEmbedding);
        }

        if (self::isVec0Available()) {
            return self::vectorSearchIdsVec0($queryEmbedding);
        }

        return self::vectorSearchIdsPhp($queryEmbedding);
    }

    /** @return list<int> */
    private static function vectorSearchIdsPgvector(array $queryEmbedding): array
    {
        try {
            return DB::table('products')
                ->where('is_active', true)
                ->whereNotNull('embedding')
                ->orderByRaw(
                    'embedding::'.self::pgvectorType().' <=> ?::'.self::pgvectorType(),
                    [self::vectorLiteral($queryEmbedding)],
                )
                ->limit(50)
                ->pluck('id')
                ->map(fn ($id) => (int) $id)
                ->all();
        } catch (\Throwable $e) {
            Log::warning('pgvector query failed, using PHP fallback: '.$e->getMessage());

            return self::vectorSearchIdsPhp($queryEmbedding);
        }
    }

    /** @return list<int> */
    private static function vectorSearchIdsVec0(array $queryEmbedding): array
    {
        try {
            $vecDb = self::vecDb();
            $binary = SqliteVec::serializeFloat32($queryEmbedding);

            $stmt = $vecDb->prepare('SELECT rowid, distance FROM products_vec WHERE embedding MATCH ? ORDER BY distance LIMIT ?');
            $stmt->bindValue(1, $binary, PDO::PARAM_LOB);
            $stmt->bindValue(2, 50, PDO::PARAM_INT);
            $stmt->execute();

            return array_map('intval', $stmt->fetchAll(PDO::FETCH_COLUMN, 0));
        } catch (\Throwable $e) {
            Log::warning('sqlite-vec query failed, using PHP fallback: '.$e->getMessage());

            return self::vectorSearchIdsPhp($queryEmbedding);
        }
    }

    /** @return list<int> */
    private static function vectorSearchIdsPhp(array $queryEmbedding): array
    {
        return static::query()
            ->where('is_active', true)
            ->whereNotNull('embedding')
            ->get(['id', 'embedding'])
            ->map(function (self $product) use ($queryEmbedding) {
                $productEmbedding = $product->embedding;
                if (! $productEmbedding || ! is_array($productEmbedding)) {
                    return null;
                }

                return [
                    'id' => (int) $product->id,
                    'similarity' => self::cosineSimilarity($queryEmbedding, $productEmbedding),
                ];
            })
            ->filter()
            ->sortByDesc('similarity')
            ->take(50)
            ->pluck('id')
            ->values()
            ->all();
    }

    /** @param  list<int>  $ids */
    private function applyOrderedIds($query, array $ids)
    {
        $ids = array_slice(array_values(array_unique(array_map('intval', $ids))), 0, 50);

        if ($ids === []) {
            return $query->whereRaw('0 = 1');
        }

        $caseSql = collect($ids)->map(fn ($id, $i) => 'WHEN id = '.$id.' THEN '.$i)->implode(' ');

        return $query->where('is_active', true)
            ->whereIn('id', $ids)
            ->orderByRaw("CASE {$caseSql} END");
    }

    public static function cosineSimilarity(array $a, array $b): float
    {
        $dot = 0;
        $normA = 0;
        $normB = 0;

        $count = count($a);
        for ($i = 0; $i < $count; $i++) {
            $dot += $a[$i] * $b[$i];
            $normA += $a[$i] * $a[$i];
            $normB += $b[$i] * $b[$i];
        }

        $denom = sqrt($normA) * sqrt($normB);

        return $denom === 0.0 ? 0.0 : $dot / $denom;
    }

    private static function isVec0Available(): bool
    {
        try {
            return app()->bound('sqlite-vec.available') && app()->make('sqlite-vec.available');
        } catch (\Throwable) {
            return false;
        }
    }

    private static function isPgvectorAvailable(): bool
    {
        if (DB::getDriverName() !== 'pgsql') {
            return false;
        }

        try {
            return self::pgvectorType() !== null;
        } catch (\Throwable) {
            return false;
        }
    }

    private static function pgvectorType(): ?string
    {
        if (self::$pgvectorType !== null) {
            return self::$pgvectorType;
        }

        $type = DB::selectOne("
            SELECT CASE
                WHEN to_regtype('extensions.vector') IS NOT NULL THEN 'extensions.vector'
                WHEN to_regtype('vector') IS NOT NULL THEN 'vector'
            END AS type
        ")->type ?? null;

        return self::$pgvectorType = $type;
    }

    private static function vectorLiteral(array $embedding): string
    {
        return '['.implode(',', array_map(fn ($value) => (string) (float) $value, $embedding)).']';
    }

    private static function vecDb(): Sqlite
    {
        return app()->make('sqlite-vec.connection');
    }
}
