<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        try {
            DB::statement('CREATE SCHEMA IF NOT EXISTS extensions');
            DB::statement('CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions');
        } catch (\Throwable $e) {
            Log::warning('pgvector is not available, keeping JSON embedding fallback: '.$e->getMessage());

            return;
        }

        $vectorType = DB::selectOne("
            SELECT CASE
                WHEN to_regtype('extensions.vector') IS NOT NULL THEN 'extensions.vector'
                WHEN to_regtype('vector') IS NOT NULL THEN 'vector'
            END AS type
        ")?->type;

        if (! $vectorType) {
            Log::warning('pgvector type is not available, keeping JSON embedding fallback.');

            return;
        }

        try {
            DB::statement("
                ALTER TABLE products
                ALTER COLUMN embedding TYPE {$vectorType}(384)
                USING CASE
                    WHEN embedding IS NULL OR btrim(embedding) = '' THEN NULL
                    ELSE embedding::{$vectorType}(384)
                END
            ");
        } catch (\Throwable $e) {
            Log::warning('Could not convert products.embedding to vector: '.$e->getMessage());

            return;
        }

        $this->createVectorIndex();
    }

    public function down(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        DB::statement('DROP INDEX IF EXISTS products_embedding_hnsw_index');
        DB::statement('DROP INDEX IF EXISTS products_embedding_ivfflat_index');
        DB::statement('ALTER TABLE products ALTER COLUMN embedding TYPE text USING embedding::text');
    }

    private function createVectorIndex(): void
    {
        if ($this->supportsHnsw()) {
            try {
                DB::statement('
                    CREATE INDEX IF NOT EXISTS products_embedding_hnsw_index
                    ON products USING hnsw (embedding vector_cosine_ops)
                    WHERE embedding IS NOT NULL
                ');

                return;
            } catch (\Throwable $e) {
                Log::info('HNSW vector index unavailable: '.$e->getMessage());
            }
        }

        try {
            DB::statement('
                CREATE INDEX IF NOT EXISTS products_embedding_ivfflat_index
                ON products USING ivfflat (embedding vector_cosine_ops)
                WITH (lists = 100)
                WHERE embedding IS NOT NULL
            ');
        } catch (\Throwable $e) {
            Log::warning(
                'Could not create vector index; semantic search will use sequential scan: '.$e->getMessage()
            );
        }
    }

    private function supportsHnsw(): bool
    {
        $version = DB::selectOne("
            SELECT extversion AS version
            FROM pg_extension
            WHERE extname = 'vector'
        ")?->version;

        if (! is_string($version) || $version === '') {
            return false;
        }

        return version_compare($version, '0.5.0', '>=');
    }
};
