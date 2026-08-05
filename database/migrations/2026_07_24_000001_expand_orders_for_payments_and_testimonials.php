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

        Schema::table('orders', function (Blueprint $table) {
            $table->string('customer_email')->nullable()->after('guest_token')->index();
            $table->string('customer_phone', 32)->nullable()->after('customer_email');
            $table->string('payment_reference')->nullable()->after('payment_status')->index();
            $table->text('payment_url')->nullable()->after('payment_reference');
            $table->string('payment_proof_path')->nullable()->after('payment_url');
            $table->timestamp('payment_expires_at')->nullable()->after('payment_proof_path')->index();
            $table->timestamp('payment_verified_at')->nullable()->after('payment_expires_at');
            $table->timestamp('stock_released_at')->nullable()->after('payment_verified_at');
            $table->string('testimonial_token', 64)->nullable()->after('stock_released_at')->unique();
            $table->timestamp('testimonial_requested_at')->nullable()->after('testimonial_token');
            $table->timestamp('testimonial_submitted_at')->nullable()->after('testimonial_requested_at');
        });

        DB::table('orders')
            ->select(['id', 'shipping_address'])
            ->whereNull('customer_email')
            ->orderBy('id')
            ->chunkById(100, function ($orders) {
                foreach ($orders as $order) {
                    $address = is_string($order->shipping_address)
                        ? json_decode($order->shipping_address, true)
                        : (array) $order->shipping_address;

                    DB::table('orders')->where('id', $order->id)->update([
                        'customer_email' => isset($address['email']) ? strtolower($address['email']) : null,
                        'customer_phone' => $address['phone'] ?? null,
                    ]);
                }
            });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'customer_email',
                'customer_phone',
                'payment_reference',
                'payment_url',
                'payment_proof_path',
                'payment_expires_at',
                'payment_verified_at',
                'stock_released_at',
                'testimonial_token',
                'testimonial_requested_at',
                'testimonial_submitted_at',
            ]);
        });
    }
};
