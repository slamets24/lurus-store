<?php

use App\Support\DemoCatalogImporter;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Log;

return new class extends Migration
{
    public function up(): void
    {
        try {
            $imported = app(DemoCatalogImporter::class)->import();

            if ($imported) {
                Log::info('Demo catalog imported from database/fixtures/demo-catalog.json');
            }
        } catch (\Throwable $e) {
            Log::warning('Demo catalog import skipped: '.$e->getMessage());
        }
    }

    public function down(): void
    {
        // Demo data is intentionally kept on rollback to avoid accidental data loss on Vercel.
    }
};
