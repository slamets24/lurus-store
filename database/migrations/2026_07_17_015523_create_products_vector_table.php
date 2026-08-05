<?php

use App\Models\Product;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() !== 'sqlite' || ! app()->bound('sqlite-vec.connection')) {
            return;
        }

        $vecDb = app()->make('sqlite-vec.connection');
        if (! $vecDb instanceof PDO) {
            return;
        }

        $vecDb->exec('CREATE VIRTUAL TABLE IF NOT EXISTS products_vec USING vec0(embedding float[384] distance_metric=cosine)');

        $synced = Product::batchSyncVec0();
        if ($synced > 0) {
            echo "Synced {$synced} existing embeddings to products_vec.\n";
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() !== 'sqlite' || ! app()->bound('sqlite-vec.connection')) {
            return;
        }

        $vecDb = app()->make('sqlite-vec.connection');
        if (! $vecDb instanceof PDO) {
            return;
        }

        $vecDb->exec('DROP TABLE IF EXISTS products_vec');
    }
};
