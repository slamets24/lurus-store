<?php

use App\Support\DemoCatalogImporter;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Log;

return new class extends Migration
{
    public function up(): void
    {
        // No-op: Demo products are disabled. Use `php artisan demo:import-catalog` manually if needed.
    }

    public function down(): void
    {
        // Demo data is intentionally kept on rollback to avoid accidental data loss on Vercel.
    }
};
