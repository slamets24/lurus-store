<?php

namespace App\Console\Commands;

use App\Models\Product;
use App\Services\EmbeddingService;
use Illuminate\Console\Command;

class GenerateProductEmbeddings extends Command
{
    protected $signature = 'products:generate-embeddings {--force : Regenerate existing embeddings}';

    protected $description = 'Generate vector embeddings for all product descriptions';

    public function handle(EmbeddingService $embeddings): void
    {
        $query = Product::with('category');
        if (! $this->option('force')) {
            $query->whereNull('embedding');
        }

        $products = $query->get();
        if ($products->isEmpty()) {
            $this->info('No products need embeddings.');

            return;
        }

        $bar = $this->output->createProgressBar($products->count());
        $bar->start();

        foreach ($products as $product) {
            $embedding = $embeddings->generateEmbedding($product->toEmbeddingText());
            $product->update(['embedding' => $embedding]);
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("Generated embeddings for {$products->count()} products.");
    }
}
