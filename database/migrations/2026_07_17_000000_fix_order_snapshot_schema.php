<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasColumn('order_items', 'product_name')) {
            Schema::table('order_items', function (Blueprint $table) {
                $table->string('product_name')->after('product_id');
            });
        }

        if (DB::getDriverName() === 'mysql') {
            DB::table('orders')->where('payment_status', 'pending')->update(['payment_status' => 'unpaid']);
            DB::statement("ALTER TABLE orders MODIFY payment_status ENUM('unpaid', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'unpaid'");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::table('orders')->where('payment_status', 'unpaid')->update(['payment_status' => 'pending']);
            DB::statement("ALTER TABLE orders MODIFY payment_status ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending'");
        }

        // product_name is part of the corrected baseline schema.
    }
};
