<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Services\EmbeddingService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Koko & Kurta' => 1,
            'Gamis & Jubah' => 2,
            'Celana' => 3,
            'Sarung' => 4,
            'Peci & Kopiah' => 5,
            'Aksesori' => 6,
        ];

        $products = [
            // --- STRIERA KNIT ---
            [
                'category_id' => $categories['Koko & Kurta'],
                'name' => 'STRIERA KNIT GREY BLACK',
                'price' => 349000,
                'stock' => 0,
                'sku' => 'AAA-SKN-001',
                'colors' => ['Grey Black'],
                'sizes' => ['S', 'M', 'L', 'XL', 'XXL'],
                'material' => 'Cotton Combed 30s',
                'description' => 'Knit premium dengan bahan cotton combed 30s yang lembut dan nyaman. Desain modern dengan warna grey black elegan cocok untuk tampilan kasual sehari-hari.',
                'care_instructions' => 'Cuci dengan air dingin, setrika suhu rendah',
                'is_featured' => false,
            ],
            [
                'category_id' => $categories['Koko & Kurta'],
                'name' => 'STRIERA KNIT NAVY GREEN',
                'price' => 349000,
                'stock' => 0,
                'sku' => 'AAA-SKN-002',
                'colors' => ['Navy Green'],
                'sizes' => ['S', 'M', 'L', 'XL', 'XXL'],
                'material' => 'Cotton Combed 30s',
                'description' => 'Knit premium dengan bahan cotton combed 30s yang lembut dan nyaman. Warna navy green yang unik dan maskulin.',
                'care_instructions' => 'Cuci dengan air dingin, setrika suhu rendah',
                'is_featured' => false,
            ],
            [
                'category_id' => $categories['Koko & Kurta'],
                'name' => 'STRIERA KNIT TERRACOTTA BLACK',
                'price' => 349000,
                'stock' => 0,
                'sku' => 'AAA-SKN-003',
                'colors' => ['Terracotta Black'],
                'sizes' => ['S', 'M', 'L', 'XL', 'XXL'],
                'material' => 'Cotton Combed 30s',
                'description' => 'Knit premium dengan bahan cotton combed 30s yang lembut dan nyaman. Perpaduan warna terracotta dan black yang stylish.',
                'care_instructions' => 'Cuci dengan air dingin, setrika suhu rendah',
                'is_featured' => true,
            ],
            [
                'category_id' => $categories['Koko & Kurta'],
                'name' => 'STRIERA KNIT BLUE NAVY',
                'price' => 349000,
                'stock' => 3,
                'sku' => 'AAA-SKN-004',
                'colors' => ['Blue Navy'],
                'sizes' => ['S', 'M', 'L', 'XL', 'XXL'],
                'material' => 'Cotton Combed 30s',
                'description' => 'Knit premium dengan bahan cotton combed 30s yang lembut dan nyaman. Warna blue navy yang timeless dan mudah dipadukan.',
                'care_instructions' => 'Cuci dengan air dingin, setrika suhu rendah',
                'is_featured' => true,
            ],

            // --- POLO STRIPE SENSE ---
            [
                'category_id' => $categories['Koko & Kurta'],
                'name' => 'PLFT96-POLO STRIPE SENSE 2 STRIPE DARK BROWN',
                'price' => 349000,
                'stock' => 0,
                'sku' => 'AAA-PLS-001',
                'colors' => ['Dark Brown', 'White'],
                'sizes' => ['S', 'M', 'L', 'XL', 'XXL'],
                'material' => 'Cotton Pique Premium',
                'description' => 'Polo stripe dengan desain stripe sense 2 stripe yang modern dan stylish. Bahan cotton pique premium yang adem dan nyaman dipakai seharian.',
                'care_instructions' => 'Cuci dengan mesin mode gentle, jangan gunakan pemutih',
                'is_featured' => false,
            ],
            [
                'category_id' => $categories['Koko & Kurta'],
                'name' => 'POLO STRIPE SENSE 2 STRIPE MAROON WHITE',
                'price' => 349000,
                'stock' => 0,
                'sku' => 'AAA-PLS-002',
                'colors' => ['Maroon', 'White'],
                'sizes' => ['S', 'M', 'L', 'XL', 'XXL'],
                'material' => 'Cotton Pique Premium',
                'description' => 'Polo stripe dengan kombinasi warna maroon dan white stripe yang elegan. Cocok untuk acara semi-formal maupun kasual.',
                'care_instructions' => 'Cuci dengan mesin mode gentle, jangan gunakan pemutih',
                'is_featured' => false,
            ],
            [
                'category_id' => $categories['Koko & Kurta'],
                'name' => 'PLFT97-POLO STRIPE SENSE 2 STRIPE LIGHT BLUE WHITE',
                'price' => 349000,
                'stock' => 0,
                'sku' => 'AAA-PLS-003',
                'colors' => ['Light Blue', 'White'],
                'sizes' => ['S', 'M', 'L', 'XL', 'XXL'],
                'material' => 'Cotton Pique Premium',
                'description' => 'Polo stripe dengan warna light blue dipadu stripe putih yang segar. Tampil casual dan clean dengan bahan premium.',
                'care_instructions' => 'Cuci dengan mesin mode gentle, jangan gunakan pemutih',
                'is_featured' => false,
            ],
            [
                'category_id' => $categories['Koko & Kurta'],
                'name' => 'POLO STRIPE SENSE 2 STRIPE NAVY GREEN',
                'price' => 349000,
                'stock' => 0,
                'sku' => 'AAA-PLS-004',
                'colors' => ['Navy Green'],
                'sizes' => ['S', 'M', 'L', 'XL', 'XXL'],
                'material' => 'Cotton Pique Premium',
                'description' => 'Polo stripe dengan warna navy green yang maskulin. Desain stripe sense 2 stripe memberikan kesan modern dan berkelas.',
                'care_instructions' => 'Cuci dengan mesin mode gentle, jangan gunakan pemutih',
                'is_featured' => false,
            ],
            [
                'category_id' => $categories['Koko & Kurta'],
                'name' => 'POLO STRIPE SENSE 2 STRIPE NAVY BLUE',
                'price' => 349000,
                'stock' => 0,
                'sku' => 'AAA-PLS-005',
                'colors' => ['Navy Blue'],
                'sizes' => ['S', 'M', 'L', 'XL', 'XXL'],
                'material' => 'Cotton Pique Premium',
                'description' => 'Polo stripe klasik dengan warna navy blue pilihan. Bahan cotton pique premium membuatnya nyaman dipakai sepanjang hari.',
                'care_instructions' => 'Cuci dengan mesin mode gentle, jangan gunakan pemutih',
                'is_featured' => false,
            ],
            [
                'category_id' => $categories['Koko & Kurta'],
                'name' => 'POLO STRIPE SENSE 2 STRIPE DARK GREY BLACK',
                'price' => 349000,
                'stock' => 0,
                'sku' => 'AAA-PLS-006',
                'colors' => ['Dark Grey', 'Black'],
                'sizes' => ['S', 'M', 'L', 'XL', 'XXL'],
                'material' => 'Cotton Pique Premium',
                'description' => 'Polo stripe dengan perpaduan dark grey dan black stripe yang elegan. Warna gelap yang mudah dipadukan dengan outfit apapun.',
                'care_instructions' => 'Cuci dengan mesin mode gentle, jangan gunakan pemutih',
                'is_featured' => false,
            ],

            // --- VARIASI POLO TAMBAHAN ---
            [
                'category_id' => $categories['Koko & Kurta'],
                'name' => 'POLO STRIPE SENSE 2 STRIPE BLACK WHITE',
                'price' => 349000,
                'stock' => 0,
                'sku' => 'AAA-PLS-007',
                'colors' => ['Black', 'White'],
                'sizes' => ['S', 'M', 'L', 'XL', 'XXL'],
                'material' => 'Cotton Pique Premium',
                'description' => 'Polo stripe ikonik dengan kombinasi black dan white stripe. Pilihan tepat untuk gaya kasual yang tetap rapi.',
                'care_instructions' => 'Cuci dengan mesin mode gentle, jangan gunakan pemutih',
                'is_featured' => false,
            ],
            [
                'category_id' => $categories['Koko & Kurta'],
                'name' => 'POLO STRIPE SENSE 2 STRIPE BURGUNDY',
                'price' => 349000,
                'stock' => 0,
                'sku' => 'AAA-PLS-008',
                'colors' => ['Burgundy'],
                'sizes' => ['S', 'M', 'L', 'XL', 'XXL'],
                'material' => 'Cotton Pique Premium',
                'description' => 'Polo stripe dengan warna burgundy elegan yang memberikan kesan premium dan berani. Cocok untuk pria modern yang fashion-forward.',
                'care_instructions' => 'Cuci dengan mesin mode gentle, jangan gunakan pemutih',
                'is_featured' => true,
            ],

            // --- PREMIUM OXFORD ---
            [
                'category_id' => $categories['Koko & Kurta'],
                'name' => 'PREMIUM OXFORD SHIRT WHITE',
                'price' => 429000,
                'stock' => 0,
                'sku' => 'AAA-OXF-001',
                'colors' => ['White'],
                'sizes' => ['S', 'M', 'L', 'XL', 'XXL'],
                'material' => 'Oxford Cotton',
                'description' => 'Kemeja oxford premium berbahan oxford cotton berkualitas tinggi. Warna putih klasik yang wajib dimiliki setiap pria modern.',
                'care_instructions' => 'Cuci terpisah dengan warna gelap, setrika suhu sedang',
                'is_featured' => false,
            ],
            [
                'category_id' => $categories['Koko & Kurta'],
                'name' => 'PREMIUM OXFORD SHIRT BLUE',
                'price' => 429000,
                'stock' => 2,
                'sku' => 'AAA-OXF-002',
                'colors' => ['Blue'],
                'sizes' => ['S', 'M', 'L', 'XL', 'XXL'],
                'material' => 'Oxford Cotton',
                'description' => 'Kemeja oxford premium warna blue yang timeless. Cocok untuk ke kantor maupun acara semi-formal.',
                'care_instructions' => 'Cuci terpisah dengan warna gelap, setrika suhu sedang',
                'is_featured' => true,
            ],

            // --- LINEN CASUAL ---
            [
                'category_id' => $categories['Koko & Kurta'],
                'name' => 'LINEN CASUAL SHIRT SAND',
                'price' => 379000,
                'stock' => 0,
                'sku' => 'AAA-LIN-001',
                'colors' => ['Sand'],
                'sizes' => ['S', 'M', 'L', 'XL', 'XXL'],
                'material' => 'Linen Cotton',
                'description' => 'Kemeja casual linen dengan warna sand yang natural. Bahan linen cotton yang ringan dan adem, cocok untuk cuaca tropis.',
                'care_instructions' => 'Dry clean recommended',
                'is_featured' => false,
            ],
            [
                'category_id' => $categories['Koko & Kurta'],
                'name' => 'LINEN CASUAL SHIRT BEIGE',
                'price' => 379000,
                'stock' => 5,
                'sku' => 'AAA-LIN-002',
                'colors' => ['Beige'],
                'sizes' => ['S', 'M', 'L', 'XL', 'XXL'],
                'material' => 'Linen Cotton',
                'description' => 'Kemeja casual linen warna beige yang versatile. Bahan adem dan nyaman untuk aktivitas sehari-hari.',
                'care_instructions' => 'Dry clean recommended',
                'is_featured' => false,
            ],

            // --- BOMBER JACKET ---
            [
                'category_id' => $categories['Gamis & Jubah'],
                'name' => 'BOMBER JACKET BLACK',
                'price' => 549000,
                'stock' => 0,
                'sku' => 'AAA-BMB-001',
                'colors' => ['Black'],
                'sizes' => ['M', 'L', 'XL', 'XXL'],
                'material' => 'Polyester Cotton',
                'description' => 'Bomber jacket dengan desain minimalis modern. Warna black yang elegan cocok untuk outerwear sehari-hari.',
                'care_instructions' => 'Dry clean only',
                'is_featured' => false,
            ],
            [
                'category_id' => $categories['Gamis & Jubah'],
                'name' => 'BOMBER JACKET NAVY',
                'price' => 549000,
                'stock' => 0,
                'sku' => 'AAA-BMB-002',
                'colors' => ['Navy'],
                'sizes' => ['M', 'L', 'XL', 'XXL'],
                'material' => 'Polyester Cotton',
                'description' => 'Bomber jacket navy dengan bahan premium. Tampilan sporty-elegan yang cocok untuk pria modern.',
                'care_instructions' => 'Dry clean only',
                'is_featured' => true,
            ],

            // --- SWEATER ---
            [
                'category_id' => $categories['Koko & Kurta'],
                'name' => 'SWEATER VARSITY NAVY WHITE',
                'price' => 449000,
                'stock' => 0,
                'sku' => 'AAA-SWT-001',
                'colors' => ['Navy', 'White'],
                'sizes' => ['M', 'L', 'XL', 'XXL'],
                'material' => 'French Terry',
                'description' => 'Sweater varsity dengan perpaduan warna navy dan white. Desain casual yang tetap terlihat rapi dan berkelas.',
                'care_instructions' => 'Cuci dengan air dingin, setrika suhu rendah',
                'is_featured' => false,
            ],
            [
                'category_id' => $categories['Koko & Kurta'],
                'name' => 'SWEATER PREMIUM GREY',
                'price' => 399000,
                'stock' => 0,
                'sku' => 'AAA-SWT-002',
                'colors' => ['Grey'],
                'sizes' => ['S', 'M', 'L', 'XL', 'XXL'],
                'material' => 'French Terry',
                'description' => 'Sweater premium warna grey yang casual dan nyaman. Bahan french terry premium yang hangat dan lembut.',
                'care_instructions' => 'Cuci dengan air dingin, setrika suhu rendah',
                'is_featured' => false,
            ],
            [
                'category_id' => $categories['Koko & Kurta'],
                'name' => 'SWEATER PREMIUM CREAM',
                'price' => 399000,
                'stock' => 1,
                'sku' => 'AAA-SWT-003',
                'colors' => ['Cream'],
                'sizes' => ['S', 'M', 'L', 'XL', 'XXL'],
                'material' => 'French Terry',
                'description' => 'Sweater premium warna cream yang soft dan elegan. Cocok untuk tampilan kasual yang chic dan modern.',
                'care_instructions' => 'Cuci dengan air dingin, setrika suhu rendah',
                'is_featured' => false,
            ],

            // --- CHINO PANTS ---
            [
                'category_id' => $categories['Celana'],
                'name' => 'CHINO PANT NAVY',
                'price' => 299000,
                'stock' => 0,
                'sku' => 'AAA-CHN-001',
                'colors' => ['Navy'],
                'sizes' => ['S', 'M', 'L', 'XL', 'XXL'],
                'material' => 'Cotton Twill Premium',
                'description' => 'Celana chino navy dengan potongan modern. Bahan cotton twill premium yang nyaman dan tidak mudah kusut.',
                'care_instructions' => 'Cuci dengan mesin mode gentle, setrika suhu sedang',
                'is_featured' => false,
            ],
            [
                'category_id' => $categories['Celana'],
                'name' => 'CHINO PANT KHAKI',
                'price' => 299000,
                'stock' => 4,
                'sku' => 'AAA-CHN-002',
                'colors' => ['Khaki'],
                'sizes' => ['S', 'M', 'L', 'XL', 'XXL'],
                'material' => 'Cotton Twill Premium',
                'description' => 'Celana chino khaki yang wajib ada di lemari setiap pria. Bahan premium dengan potongan slim fit modern.',
                'care_instructions' => 'Cuci dengan mesin mode gentle, setrika suhu sedang',
                'is_featured' => true,
            ],
            [
                'category_id' => $categories['Celana'],
                'name' => 'CHINO PANT BLACK',
                'price' => 299000,
                'stock' => 0,
                'sku' => 'AAA-CHN-003',
                'colors' => ['Black'],
                'sizes' => ['S', 'M', 'L', 'XL', 'XXL'],
                'material' => 'Cotton Twill Premium',
                'description' => 'Celana chino hitam yang versatile untuk berbagai kesempatan. Potongan modern dengan bahan premium yang nyaman.',
                'care_instructions' => 'Cuci dengan mesin mode gentle, setrika suhu sedang',
                'is_featured' => false,
            ],
        ];

        $embeddings = app(EmbeddingService::class);
        $texts = [];

        foreach ($products as $product) {
            $texts[] = implode('. ', array_filter([
                $product['name'],
                $product['description'] ?? null,
                isset($product['material']) ? 'Material: '.$product['material'] : null,
                isset($product['colors']) ? 'Colors: '.implode(', ', (array) $product['colors']) : null,
            ]));
        }

        $vectors = $embeddings->generateEmbeddings($texts);

        foreach ($products as $i => $product) {
            $product['slug'] = Str::slug($product['name']);
            $product['is_active'] = true;
            $product['color_hexes'] = $this->colorHexes($product['colors']);
            $product['embedding'] = $vectors[$i] ?? $embeddings->fallbackEmbedding($texts[$i]);

            $existingProduct = Product::where('sku', $product['sku'])->first();
            if ($existingProduct) {
                continue;
            }

            $createdProduct = Product::create($product);
            $variantCount = count($product['colors']) * count($product['sizes']);
            $variantIndex = 0;

            foreach ($product['colors'] as $color) {
                foreach ($product['sizes'] as $size) {
                    ProductVariant::create([
                        'product_id' => $createdProduct->id,
                        'sku' => $this->variantSku($createdProduct->sku, $color, $size),
                        'color' => $color,
                        'size' => $size,
                        'stock' => $this->variantStock((int) $product['stock'], $variantIndex, $variantCount),
                        'status' => 'published',
                    ]);

                    $variantIndex++;
                }
            }

            for ($j = 0; $j < 2; $j++) {
                ProductImage::create([
                    'product_id' => $createdProduct->id,
                    'image_path' => 'https://placehold.co/800x800/efeee9/333333?text='.urlencode($createdProduct->name),
                    'is_primary' => $j === 0,
                    'sort_order' => $j + 1,
                ]);
            }
        }
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
