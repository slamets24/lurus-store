<?php

namespace App\Console\Commands;

use App\Models\CartItem;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ClearProductsCommand extends Command
{
    protected $signature = 'catalog:clear-products {--force : Bypass confirmation}';

    protected $description = 'Remove all products, variants, and product images from the database';

    public function handle(): int
    {
        if (! $this->option('force') && ! $this->confirm('Are you sure you want to delete all products and variants?')) {
            $this->info('Cancelled.');

            return self::SUCCESS;
        }

        Schema::disableForeignKeyConstraints();
        CartItem::truncate();
        OrderItem::whereNotNull('product_id')->update(['product_id' => null]);
        ProductImage::truncate();
        ProductVariant::truncate();
        Product::truncate();

        try {
            DB::table('collection_product')->truncate();
        } catch (\Throwable $e) {}

        if (DB::getDriverName() === 'sqlite') {
            try {
                DB::statement('DELETE FROM products_vec');
            } catch (\Throwable $e) {}
        }

        Schema::enableForeignKeyConstraints();

        $this->info('All products, variants, and product images have been cleared successfully.');

        return self::SUCCESS;
    }
}
