<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\StoreContentSetting;
use App\Models\Testimonial;
use App\Services\HomePageService;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HomeController extends Controller
{
    /** @var array<int, array{question: string, answer: string}> */
    private const FAQS = [
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
    ];

    public function __construct(private readonly HomePageService $homePage) {}

    public function __invoke()
    {
        $featuredProductIds = StoreContentSetting::value('featured_product_ids', []);
        $categories = Category::withCount('products')
            ->with(['products' => fn ($q) => $q->where('is_active', true)->latest()->limit(1)->with('images')])
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->take(6)
            ->get()
            ->map(fn ($category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'image' => $category->image
                    ?? $category->products->first()?->images->first()?->image_path,
                'products_count' => $category->products_count,
            ]);

        return Inertia::render('Home', [
            'categories' => $categories,
            'announcementBar' => $this->homePage->announcementBar(),
            'homeSections' => $this->homePage->sections(),
            'heroBanners' => collect(StoreContentSetting::heroBanners())
                ->filter(fn (array $banner) => ! empty($banner['desktop_image']) || ! empty($banner['mobile_image']))
                ->map(fn (array $banner) => [
                    'id' => $banner['id'],
                    'desktopImage' => ! empty($banner['desktop_image']) ? Storage::url($banner['desktop_image']) : null,
                    'mobileImage' => ! empty($banner['mobile_image']) ? Storage::url($banner['mobile_image']) : null,
                    'link' => $banner['link'] ?? null,
                    'title' => $banner['title'] ?? null,
                    'subtitle' => $banner['subtitle'] ?? null,
                    'ctaLabel' => $banner['cta_label'] ?? $banner['ctaLabel'] ?? null,
                ])
                ->values()
                ->all(),

            // Rendered in the FAQ accordion and mirrored into FAQPage JSON-LD by
            // both Home.tsx and App\Support\SeoMeta — keep it server-side so the
            // markup a crawler reads always matches the copy a visitor sees.
            'faqs' => self::FAQS,

            'featuredProducts' => $this->featuredProducts($featuredProductIds),
            'featuredCollectionCards' => $this->featuredCollectionCards(),
            'testimonials' => Testimonial::with('orderItem')
                ->whereNotNull('approved_at')
                ->latest('approved_at')
                ->limit(8)
                ->get()
                ->map(fn ($testimonial) => [
                    'id' => $testimonial->id,
                    'name' => $testimonial->customer_name,
                    'rating' => $testimonial->rating,
                    'comment' => $testimonial->comment,
                    'product_name' => $testimonial->orderItem?->product_name,
                ]),
        ]);
    }

    private function featuredProducts(array $ids)
    {
        if (empty($ids)) {
            return Product::with(['images', 'publishedVariants'])
                ->where('is_active', true)
                ->latest()
                ->limit(8)
                ->get()
                ->map(fn ($product) => $this->homePage->productCard($product));
        }

        $products = Product::with(['images', 'publishedVariants'])
            ->where('is_active', true)
            ->whereIn('id', $ids)
            ->get()
            ->keyBy('id');

        return collect($ids)
            ->map(fn ($id) => $products->get($id))
            ->filter()
            ->map(fn ($product) => $this->homePage->productCard($product))
            ->values();
    }

    private function featuredCollectionCards()
    {
        $latest = Product::with(['images', 'publishedVariants'])->where('is_active', true)->latest()->first();
        $bestSellerId = OrderItem::selectRaw('product_id, SUM(quantity) as total_sold')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->whereNotNull('product_id')
            ->where('orders.payment_status', 'paid')
            ->whereNotIn('orders.status', ['cancelled'])
            ->groupBy('product_id')
            ->orderByDesc('total_sold')
            ->value('product_id');
        $bestSeller = $bestSellerId
            ? Product::with(['images', 'publishedVariants'])->where('is_active', true)->find($bestSellerId)
            : Product::with(['images', 'publishedVariants'])->where('is_active', true)->latest()->skip(1)->first();
        $premium = Product::with(['images', 'publishedVariants'])->where('is_active', true)->orderByDesc('price')->first();

        return collect([
            ['title' => 'New Collection', 'slug' => 'new-collection', 'subtitle' => 'Latest arrivals for this season', 'product' => $latest],
            ['title' => 'Best Sellers', 'slug' => 'best-sellers', 'subtitle' => 'Most popular items', 'product' => $bestSeller],
            ['title' => 'Premium Line', 'slug' => 'premium', 'subtitle' => 'Exclusive premium quality', 'product' => $premium],
        ])->filter(fn ($card) => $card['product'])
            ->map(fn ($card) => [
                'title' => $card['title'],
                'slug' => $card['slug'],
                'subtitle' => $card['subtitle'],
                'product' => $this->homePage->productCard($card['product']),
            ])
            ->values();
    }
}
