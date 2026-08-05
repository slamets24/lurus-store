<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promos', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type', 32); // bxgy | bundle
            $table->boolean('is_active')->default(true);
            $table->string('scope', 32)->default('products'); // products | categories | all
            $table->unsignedInteger('buy_qty')->nullable();
            $table->unsignedInteger('free_qty')->nullable();
            $table->string('free_pick', 32)->default('cheapest'); // cheapest | same_sku
            $table->decimal('min_unit_price', 10, 2)->nullable();
            $table->decimal('package_price', 10, 2)->nullable();
            $table->timestamps();
        });

        Schema::create('promo_targets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('promo_id')->constrained()->cascadeOnDelete();
            $table->string('target_type', 32); // product | category
            $table->unsignedBigInteger('target_id');
            $table->timestamps();

            $table->index(['promo_id', 'target_type', 'target_id']);
        });

        Schema::create('promo_components', function (Blueprint $table) {
            $table->id();
            $table->foreignId('promo_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('quantity')->default(1);
            $table->timestamps();

            $table->unique(['promo_id', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promo_components');
        Schema::dropIfExists('promo_targets');
        Schema::dropIfExists('promos');
    }
};
