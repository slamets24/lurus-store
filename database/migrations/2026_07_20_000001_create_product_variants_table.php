<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('sku')->unique();
            $table->string('color')->nullable();
            $table->string('size')->nullable();
            $table->integer('stock')->default(0);
            $table->string('status')->default('draft');
            $table->timestamps();

            $table->unique(['product_id', 'color', 'size']);
            $table->index(['product_id', 'status']);
        });

        Schema::table('cart_items', function (Blueprint $table) {
            $table->foreignId('product_variant_id')->nullable()->after('product_id')->constrained('product_variants')->nullOnDelete();
            $table->index('product_variant_id');
        });

        DB::table('products')->orderBy('id')->chunk(100, function ($products) {
            foreach ($products as $product) {
                $colors = json_decode($product->colors ?? '[]', true) ?: [null];
                $sizes = json_decode($product->sizes ?? '[]', true) ?: [null];

                foreach ($colors as $color) {
                    foreach ($sizes as $size) {
                        $suffix = collect([$color, $size])->filter()->map(fn ($value) => Str::upper(Str::slug($value, '')))->implode('-');

                        DB::table('product_variants')->insert([
                            'product_id' => $product->id,
                            'sku' => trim($product->sku.($suffix ? '-'.$suffix : '')),
                            'color' => $color,
                            'size' => $size,
                            'stock' => $product->stock,
                            'status' => $product->is_active ? 'published' : 'draft',
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->foreignId('product_variant_id')->nullable()->after('product_id')->constrained('product_variants')->nullOnDelete();
            $table->string('sku')->nullable()->after('product_name');
            $table->index('product_variant_id');
        });
    }

    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropConstrainedForeignId('product_variant_id');
            $table->dropColumn('sku');
        });

        Schema::table('cart_items', function (Blueprint $table) {
            $table->dropConstrainedForeignId('product_variant_id');
        });

        Schema::dropIfExists('product_variants');
    }
};
