<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('status', 32)->default('pending')->change();
            $table->string('payment_status', 32)->default('unpaid')->change();
        });

        DB::table('orders')->where('status', 'processing')->update(['status' => 'ready_to_ship']);
    }

    public function down(): void {}
};
