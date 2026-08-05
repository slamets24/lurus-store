<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('biteship_order_id')->nullable()->unique()->after('shipping_address');
            $table->string('waybill_id')->nullable()->after('biteship_order_id');
            $table->string('shipping_status')->nullable()->after('waybill_id');
            $table->timestamp('shipped_at')->nullable()->after('shipping_status');
            $table->timestamp('delivered_at')->nullable()->after('shipped_at');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'biteship_order_id',
                'waybill_id',
                'shipping_status',
                'shipped_at',
                'delivered_at',
            ]);
        });
    }
};
