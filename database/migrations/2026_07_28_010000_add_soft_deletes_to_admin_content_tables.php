<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        foreach (['products', 'categories', 'collections', 'promos', 'testimonials'] as $table) {
            Schema::table($table, fn (Blueprint $blueprint) => $blueprint->softDeletes());
        }
    }

    public function down(): void
    {
        foreach (['products', 'categories', 'collections', 'promos', 'testimonials'] as $table) {
            Schema::table($table, fn (Blueprint $blueprint) => $blueprint->dropSoftDeletes());
        }
    }
};
