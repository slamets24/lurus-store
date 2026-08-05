<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'pgsql') {
            // Idempotent: production may still have the old enum CHECK after status→string.
            DB::statement('ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check');
            DB::statement('ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_status_check');

            DB::table('orders')->where('status', 'processing')->update(['status' => 'ready_to_ship']);

            DB::statement("ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (status IN (
                'pending', 'stock_confirmation', 'ready_to_ship', 'shipped', 'delivered', 'cancelled'
            ))");

            DB::statement("ALTER TABLE orders ADD CONSTRAINT orders_payment_status_check CHECK (payment_status IN (
                'unpaid', 'pending_verification', 'paid', 'failed', 'expired', 'refunded'
            ))");

            return;
        }

        if (in_array($driver, ['mysql', 'mariadb'], true)) {
            DB::statement("ALTER TABLE orders MODIFY status VARCHAR(32) NOT NULL DEFAULT 'pending'");
            DB::statement("ALTER TABLE orders MODIFY payment_status VARCHAR(32) NOT NULL DEFAULT 'unpaid'");
            DB::table('orders')->where('status', 'processing')->update(['status' => 'ready_to_ship']);
        }
    }

    public function down(): void
    {
        //
    }
};
