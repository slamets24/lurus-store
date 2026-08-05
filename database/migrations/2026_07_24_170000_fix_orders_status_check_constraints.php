<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::getConnection()->getDriverName() !== 'pgsql') {
            return;
        }

        // Postgres keeps enum-style CHECK after ->change() to string; drop stale values.
        DB::statement('ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check');
        DB::statement('ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_status_check');

        DB::table('orders')->where('status', 'processing')->update(['status' => 'ready_to_ship']);

        DB::statement("ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (status IN (
            'pending', 'stock_confirmation', 'ready_to_ship', 'shipped', 'delivered', 'cancelled'
        ))");

        DB::statement("ALTER TABLE orders ADD CONSTRAINT orders_payment_status_check CHECK (payment_status IN (
            'unpaid', 'pending_verification', 'paid', 'failed', 'expired', 'refunded'
        ))");
    }

    public function down(): void
    {
        if (Schema::getConnection()->getDriverName() !== 'pgsql') {
            return;
        }

        DB::statement('ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check');
        DB::statement('ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_status_check');

        DB::table('orders')->where('status', 'ready_to_ship')->update(['status' => 'processing']);
        DB::table('orders')->where('status', 'stock_confirmation')->update(['status' => 'processing']);
        DB::table('orders')->where('payment_status', 'pending_verification')->update(['payment_status' => 'unpaid']);
        DB::table('orders')->where('payment_status', 'expired')->update(['payment_status' => 'failed']);

        DB::statement("ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (status IN (
            'pending', 'processing', 'shipped', 'delivered', 'cancelled'
        ))");

        DB::statement("ALTER TABLE orders ADD CONSTRAINT orders_payment_status_check CHECK (payment_status IN (
            'unpaid', 'paid', 'failed', 'refunded'
        ))");
    }
};
