<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('home_sections', function (Blueprint $table) {
            $table->id();
            $table->string('type')->index();
            $table->string('title')->nullable();
            $table->text('subtitle')->nullable();
            $table->text('content')->nullable();
            $table->text('image_path')->nullable();
            $table->text('link_url')->nullable();
            $table->string('button_label')->nullable();
            $table->json('config_json')->nullable();
            $table->unsignedInteger('sort_order')->default(0)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('home_section_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('home_section_id')->constrained()->cascadeOnDelete();
            $table->string('item_type')->index();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title')->nullable();
            $table->text('subtitle')->nullable();
            $table->text('image_path')->nullable();
            $table->text('link_url')->nullable();
            $table->json('config_json')->nullable();
            $table->unsignedInteger('sort_order')->default(0)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
            $table->softDeletes();
        });

        $this->seedFromExistingSettings();
    }

    public function down(): void
    {
        Schema::dropIfExists('home_section_items');
        Schema::dropIfExists('home_sections');
    }

    private function seedFromExistingSettings(): void
    {
        if (! Schema::hasTable('store_content_settings')) {
            return;
        }

        $now = now();
        $settings = DB::table('store_content_settings')->pluck('value', 'key');
        $decode = function (?string $value): mixed {
            if ($value === null || $value === '') {
                return null;
            }

            return json_decode($value, true);
        };

        $announcement = $decode($settings['announcement_bar'] ?? null);
        $messages = filled($announcement['text'] ?? null)
            ? [trim((string) $announcement['text'])]
            : ["Don't wait — shop now"];

        $announcementId = DB::table('home_sections')->insertGetId([
            'type' => 'announcement',
            'title' => 'Pengumuman',
            'link_url' => $announcement['link'] ?? null,
            'config_json' => json_encode(['messages' => $messages]),
            'sort_order' => 0,
            'is_active' => (bool) ($announcement['enabled'] ?? true),
            'created_at' => $now,
            'updated_at' => $now,
        ]);
        unset($announcementId);

        $heroId = DB::table('home_sections')->insertGetId([
            'type' => 'hero',
            'title' => 'Hero',
            'link_url' => '/products',
            'sort_order' => 10,
            'is_active' => true,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $hero = $decode($settings['hero'] ?? null);
        $banners = [];
        if (is_array($hero) && $hero !== []) {
            $banners = array_is_list($hero) ? $hero : [$hero];
        }

        foreach (array_values($banners) as $index => $banner) {
            if (! is_array($banner)) {
                continue;
            }

            DB::table('home_section_items')->insert([
                'home_section_id' => $heroId,
                'item_type' => 'slide',
                'title' => $banner['title'] ?? null,
                'subtitle' => $banner['cta_label'] ?? $banner['ctaLabel'] ?? null,
                'image_path' => $banner['desktop_image'] ?? null,
                'link_url' => $banner['link'] ?? '/products',
                'config_json' => json_encode([
                    'x' => 50,
                    'y' => 50,
                    'mobile_image' => $banner['mobile_image'] ?? null,
                ]),
                'sort_order' => $index * 10,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        DB::table('home_sections')->insert([
            'type' => 'product_rail',
            'title' => 'Latest Release',
            'subtitle' => 'Busana muslimah pilihan',
            'link_url' => '/products',
            'button_label' => 'Lihat Semua',
            'config_json' => json_encode(['source' => 'latest', 'limit' => 8]),
            'sort_order' => 20,
            'is_active' => true,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $configured = $decode($settings['home_sections'] ?? null);
        $rails = is_array($configured) && $configured !== [] ? $configured : [
            ['label' => 'Apparels', 'category_slugs' => ['blouse', 'dress', 'skirt', 'pants', 'koko']],
            ['label' => 'Essentials', 'category_slugs' => ['scarves', 'shoes', 'bag', 'accessories', 'prayer-set']],
        ];

        foreach (array_values($rails) as $index => $rail) {
            if (! is_array($rail)) {
                continue;
            }

            $sectionId = DB::table('home_sections')->insertGetId([
                'type' => 'collection_tabs',
                'title' => $rail['label'] ?? 'Koleksi',
                'sort_order' => 30 + ($index * 10),
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            foreach (array_values($rail['category_slugs'] ?? []) as $tabIndex => $slug) {
                $categoryId = DB::table('categories')->where('slug', $slug)->value('id');

                DB::table('home_section_items')->insert([
                    'home_section_id' => $sectionId,
                    'item_type' => 'tab',
                    'category_id' => $categoryId,
                    'title' => $categoryId
                        ? DB::table('categories')->where('id', $categoryId)->value('name')
                        : (string) $slug,
                    'link_url' => '/categories/'.$slug,
                    'config_json' => json_encode([
                        'source' => 'category',
                        'limit' => 4,
                        'product_ids' => [],
                    ]),
                    'sort_order' => $tabIndex * 10,
                    'is_active' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }

        $tilesId = DB::table('home_sections')->insertGetId([
            'type' => 'category_tiles',
            'title' => 'Shop by Category',
            'subtitle' => 'Pilihan busana muslimah',
            'sort_order' => 50,
            'is_active' => true,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        if (Schema::hasTable('categories')) {
            $categories = DB::table('categories')
                ->where('is_active', true)
                ->whereNull('deleted_at')
                ->orderBy('sort_order')
                ->limit(6)
                ->get(['id', 'name']);

            foreach ($categories as $tileIndex => $category) {
                DB::table('home_section_items')->insert([
                    'home_section_id' => $tilesId,
                    'item_type' => 'tile',
                    'category_id' => $category->id,
                    'title' => $category->name,
                    'sort_order' => $tileIndex * 10,
                    'is_active' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }

        DB::table('home_sections')->insert([
            [
                'type' => 'editorial',
                'title' => 'Lurus Store — Destinasi Modest Fashion',
                'subtitle' => 'Keanggunan Dalam Kesederhanaan',
                'content' => 'Hadir untuk melengkapi kebutuhan muslimah modern yang mendambakan penampilan santun, berkelas, dan nyaman dalam balutan busana berkualitas tinggi.',
                'link_url' => '/products',
                'button_label' => 'Belanja sekarang',
                'config_json' => null,
                'sort_order' => 60,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'type' => 'faq',
                'title' => 'Pertanyaan Umum',
                'subtitle' => 'Panduan belanja',
                'content' => null,
                'link_url' => null,
                'button_label' => null,
                'config_json' => json_encode(['items' => [
                    [
                        'question' => 'Bahan apa saja yang digunakan pada busana muslimah Lurus Store?',
                        'answer' => 'Lurus Store mengutamakan kenyamanan dengan material pilihan berkualitas tinggi seperti katun premium alami, serat linen breathable, rayon adem, dan silk blend. Seluruh kain dipilih secara cermat agar sejuk, lembut di kulit, tahan lama, dan tidak menerawang saat dikenakan.',
                    ],
                    [
                        'question' => 'Bagaimana panduan memilih ukuran yang tepat di Lurus Store?',
                        'answer' => 'Setiap produk dilengkapi dengan panduan size chart detail (lingkar dada, panjang baju, lingkar pinggang, dan panjang lengan). Anda juga dapat membaca panduan pada halaman Size Guide atau berkonsultasi langsung melalui customer service kami untuk rekomendasi ukuran terbaik.',
                    ],
                    [
                        'question' => 'Apakah Lurus Store melayani pengiriman ke seluruh Indonesia?',
                        'answer' => 'Ya, kami melayani pengiriman ke seluruh wilayah Indonesia dengan mitra ekspedisi terpercaya. Setiap pesanan dilengkapi nomor resi pelacakan real-time agar Anda dapat memantau pesanan dengan aman.',
                    ],
                    [
                        'question' => 'Bagaimana kebijakan penukaran jika ukuran tidak pas?',
                        'answer' => 'Kami menyediakan garansi penukaran ukuran dalam waktu 7 hari kerja setelah paket diterima. Ketentuannya adalah produk belum dicuci, label/tag masih terpasang rapi, dan kondisi produk masih sama seperti saat diterima.',
                    ],
                ]]),
                'sort_order' => 70,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }
};
