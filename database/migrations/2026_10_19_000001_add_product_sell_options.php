<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_components', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['product_id', 'sort_order']);
        });

        Schema::create('product_offers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->decimal('price', 12, 2);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['product_id', 'sort_order']);
        });

        Schema::create('product_offer_components', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_offer_id')->constrained('product_offers')->cascadeOnDelete();
            $table->foreignId('product_component_id')->constrained('product_components')->cascadeOnDelete();
            $table->unsignedInteger('quantity')->default(1);
            $table->timestamps();

            $table->unique(['product_offer_id', 'product_component_id'], 'offer_component_unique');
        });

        Schema::table('product_variants', function (Blueprint $table) {
            $table->dropUnique(['product_id', 'color', 'size']);
            $table->foreignId('component_id')
                ->nullable()
                ->after('product_id')
                ->constrained('product_components')
                ->cascadeOnDelete();
        });

        $driver = Schema::getConnection()->getDriverName();
        $component = $driver === 'sqlite' ? 'IFNULL(component_id, 0)' : 'COALESCE(component_id, 0)';
        $color = $driver === 'sqlite' ? "IFNULL(color, '')" : "COALESCE(color, '')";
        $size = $driver === 'sqlite' ? "IFNULL(size, '')" : "COALESCE(size, '')";

        DB::statement("CREATE UNIQUE INDEX product_variants_piece_unique ON product_variants (product_id, {$component}, {$color}, {$size})");

        Schema::table('cart_items', function (Blueprint $table) {
            $table->foreignId('product_offer_id')->nullable()->after('product_variant_id')->constrained('product_offers')->nullOnDelete();
            $table->json('selections')->nullable()->after('color');
            $table->string('selection_key')->nullable()->after('selections');
            $table->index(['product_id', 'product_offer_id']);
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->foreignId('product_offer_id')->nullable()->after('product_variant_id')->constrained('product_offers')->nullOnDelete();
            $table->json('selections')->nullable()->after('color');
        });
    }

    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropConstrainedForeignId('product_offer_id');
            $table->dropColumn('selections');
        });

        Schema::table('cart_items', function (Blueprint $table) {
            $table->dropIndex(['product_id', 'product_offer_id']);
            $table->dropConstrainedForeignId('product_offer_id');
            $table->dropColumn(['selections', 'selection_key']);
        });

        DB::statement('DROP INDEX IF EXISTS product_variants_piece_unique');

        Schema::table('product_variants', function (Blueprint $table) {
            $table->dropConstrainedForeignId('component_id');
            $table->unique(['product_id', 'color', 'size']);
        });

        Schema::dropIfExists('product_offer_components');
        Schema::dropIfExists('product_offers');
        Schema::dropIfExists('product_components');
    }
};
