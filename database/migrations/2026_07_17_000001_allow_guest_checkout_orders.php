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
        if (! Schema::hasColumn('orders', 'guest_token')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->string('guest_token', 64)->nullable()->unique()->after('order_number');
            });
        }

        if (in_array(DB::getDriverName(), ['mysql', 'mariadb', 'pgsql'], true)) {
            Schema::table('orders', function (Blueprint $table) {
                $table->dropForeign(['user_id']);
            });

            Schema::table('orders', function (Blueprint $table) {
                $table->foreignId('user_id')->nullable()->change();
                $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (in_array(DB::getDriverName(), ['mysql', 'mariadb', 'pgsql'], true)) {
            Schema::table('orders', function (Blueprint $table) {
                $table->dropForeign(['user_id']);
                $table->foreignId('user_id')->nullable(false)->change();
                $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            });
        }

        if (Schema::hasColumn('orders', 'guest_token')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->dropColumn('guest_token');
            });
        }
    }
};
