<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->boolean('has_preorder')->default(false)->after('status')->index();
            $table->date('preorder_release_date')->nullable()->after('has_preorder');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->boolean('is_preorder')->default(false)->after('color');
            $table->string('preorder_estimate')->nullable()->after('is_preorder');
        });
    }

    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropColumn(['is_preorder', 'preorder_estimate']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['has_preorder']);
            $table->dropColumn(['has_preorder', 'preorder_release_date']);
        });
    }
};
