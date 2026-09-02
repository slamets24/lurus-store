<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Services\EmbeddingService;
use App\Support\ProductPlaceholderImages;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Hardcoded products removed for production launch.
        // Products should be created via Admin Panel or imported via specific catalogs.
    }

    private function variantSku(string $articleSku, string $color, string $size): string
    {
        $suffix = collect([$color, $size])
            ->map(fn ($value) => Str::upper(Str::slug($value, '')))
            ->implode('-');

        return $articleSku.'-'.$suffix;
    }

    private function colorHexes(array $colors): array
    {
        $colorMap = [
            'Beige' => '#D8C3A5',
            'Black' => '#000000',
            'Blue' => '#1E40AF',
            'Blue Navy' => '#1E3A5F',
            'Burgundy' => '#800020',
            'Cream' => '#F5E6C8',
            'Dark Brown' => '#3E2723',
            'Dark Grey' => '#374151',
            'Grey' => '#6B7280',
            'Grey Black' => '#2D2D2D',
            'Khaki' => '#C3B091',
            'Light Blue' => '#93C5FD',
            'Maroon' => '#800000',
            'Navy' => '#1B2A4A',
            'Navy Blue' => '#1E3A5F',
            'Navy Green' => '#1B4332',
            'Sand' => '#C2B280',
            'Terracotta Black' => '#4A3728',
            'White' => '#FFFFFF',
        ];

        return collect($colors)
            ->mapWithKeys(fn ($color) => [$color => $colorMap[$color] ?? '#CCCCCC'])
            ->all();
    }

    private function variantStock(int $totalStock, int $variantIndex, int $variantCount): int
    {
        if ($totalStock <= 0 || $variantCount <= 0) {
            return 0;
        }

        $baseStock = intdiv($totalStock, $variantCount);
        $remainder = $totalStock % $variantCount;

        return $baseStock + ($variantIndex < $remainder ? 1 : 0);
    }
}
