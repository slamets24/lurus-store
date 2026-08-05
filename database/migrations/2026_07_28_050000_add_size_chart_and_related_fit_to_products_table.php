<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('size_chart_path')->nullable()->after('material');
            $table->foreignId('related_fit_product_id')
                ->nullable()
                ->after('size_chart_path')
                ->constrained('products')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropConstrainedForeignId('related_fit_product_id');
            $table->dropColumn('size_chart_path');
        });
    }
};
