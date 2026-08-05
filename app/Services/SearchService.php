<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class SearchService
{
    public function __construct(private readonly EmbeddingService $embeddings) {}

    public function search(string $query, int $perPage = 12): LengthAwarePaginator
    {
        $query = trim($query);

        if ($query === '') {
            return Product::query()->whereRaw('0 = 1')->paginate($perPage);
        }

        $embedText = implode(' ', Product::searchTerms($query)) ?: $query;
        $queryEmbedding = $this->embeddings->generateEmbedding($embedText);

        return Product::search($query, $queryEmbedding)
            ->with(['category', 'images', 'publishedVariants'])
            ->paginate($perPage)
            ->withQueryString();
    }
}
