<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('is_preorder')->default(false)->after('is_featured')->index();
            $table->unsignedSmallInteger('preorder_estimate_days')->nullable()->after('is_preorder');
            $table->date('preorder_release_date')->nullable()->after('preorder_estimate_days');
            $table->string('preorder_note')->nullable()->after('preorder_release_date');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['is_preorder']);
            $table->dropColumn([
                'is_preorder',
                'preorder_estimate_days',
                'preorder_release_date',
                'preorder_note',
            ]);
        });
    }
};
