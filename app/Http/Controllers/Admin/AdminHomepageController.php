<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\HomeSectionItemRequest;
use App\Http\Requests\Admin\HomeSectionRequest;
use App\Models\Category;
use App\Models\HomeSection;
use App\Models\HomeSectionItem;
use App\Models\Product;
use App\Models\StoreContentSetting;
use App\Services\HomePageService;
use App\Support\HomeSections;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminHomepageController extends Controller
{
    public function index(HomePageService $homePage)
    {
        $seo = StoreContentSetting::value('home_seo', []);
        $seo = is_array($seo) ? $seo : [];

        return Inertia::render('Admin/Homepage/Index', [
            'types' => HomeSections::types(),
            'sections' => HomeSection::query()
                ->where('type', '!=', 'popup')
                ->with(['items' => fn ($query) => $query->orderBy('sort_order')])
                ->orderBy('sort_order')
                ->get(),
            'homeSeo' => [
                'title' => (string) ($seo['title'] ?? ''),
                'description' => (string) ($seo['description'] ?? ''),
                'keywords' => (string) ($seo['keywords'] ?? ''),
            ],
            'settings' => [
                'hero' => StoreContentSetting::heroBanners(),
                'announcementBar' => $homePage->announcementBar(),
                'homeSections' => StoreContentSetting::value('home_sections', $this->defaultHomeSections()),
                'featuredProductIds' => StoreContentSetting::value('featured_product_ids', []),
                'socialLinks' => StoreContentSetting::value('social_links', $this->defaultSocialLinks()),
                'whatsappNumber' => StoreContentSetting::value('whatsapp_number', StoreContentSetting::DEFAULT_WHATSAPP_NUMBER),
                'promoPopup' => StoreContentSetting::promoPopupSettings(),
            ],
            'products' => Product::with(['images', 'category:id,slug'])
                ->where('is_active', true)
                ->orderBy('name')
                ->get()
                ->map(fn ($product) => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'price' => (float) $product->price,
                    'image' => $product->images->first()?->image_path,
                    'categorySlug' => $product->category?->slug,
                ]),
            'categories' => Category::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(['id', 'name', 'slug'])
                ->map(fn (Category $category) => [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                ]),
        ]);
    }

    public function update(Request $request)
    {
        $section = $request->validate([
            'section' => 'required|in:hero,announcement_bar,home_sections,featured_products,social_media,promo_popup',
        ])['section'];

        match ($section) {
            'hero' => $this->updateHero($request),
            'announcement_bar' => $this->updateAnnouncementBar($request),
            'home_sections' => $this->updateHomeSections($request),
            'featured_products' => $this->updateFeaturedProducts($request),
            'social_media' => $this->updateSocialMedia($request),
            'promo_popup' => $this->updatePromoPopup($request),
        };

        return back()->with('success', match ($section) {
            'hero' => 'Hero banner saved successfully.',
            'announcement_bar' => 'Announcement bar saved successfully.',
            'home_sections' => 'Home sections saved successfully.',
            'featured_products' => 'Featured products saved successfully.',
            'social_media' => 'Social media and WhatsApp saved successfully.',
            'promo_popup' => 'Promo popup saved successfully.',
        });
    }

    public function updateSeo(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['nullable', 'string', 'max:70'],
            'description' => ['nullable', 'string', 'max:160'],
            'keywords' => ['nullable', 'string', 'max:300'],
        ]);

        StoreContentSetting::putValue('home_seo', [
            'title' => trim((string) ($data['title'] ?? '')),
            'description' => trim((string) ($data['description'] ?? '')),
            'keywords' => trim((string) ($data['keywords'] ?? '')),
        ]);

        return back()->with('success', 'SEO beranda disimpan.');
    }

    public function storeSection(HomeSectionRequest $request): RedirectResponse
    {
        HomeSection::query()->create([
            ...$request->safe()->only(['type', 'title', 'subtitle', 'content', 'image_path', 'link_url', 'button_label', 'sort_order', 'is_active']),
            'image_path' => $this->imagePath($request),
            'sort_order' => $request->integer('sort_order'),
            'config_json' => $request->sectionConfig(),
        ]);

        return back()->with('success', 'Bagian beranda disimpan.');
    }

    public function updateSection(HomeSectionRequest $request, HomeSection $homeSection): RedirectResponse
    {
        $homeSection->update([
            ...$request->safe()->only(['type', 'title', 'subtitle', 'content', 'image_path', 'link_url', 'button_label', 'sort_order', 'is_active']),
            'image_path' => $this->imagePath($request),
            'sort_order' => $request->integer('sort_order'),
            'config_json' => $request->sectionConfig() ?? $homeSection->config_json,
        ]);

        return back()->with('success', 'Bagian beranda diperbarui.');
    }

    public function destroySection(HomeSection $homeSection): RedirectResponse
    {
        $homeSection->delete();

        return back()->with('success', 'Bagian beranda dipindahkan ke arsip.');
    }

    public function storeItem(HomeSectionItemRequest $request, HomeSection $homeSection): RedirectResponse
    {
        $homeSection->items()->create([
            ...$request->safe()->only(['item_type', 'product_id', 'category_id', 'title', 'subtitle', 'image_path', 'link_url', 'sort_order', 'is_active']),
            'image_path' => $this->imagePath($request, 'image', 'image_path'),
            'sort_order' => $request->integer('sort_order'),
            'config_json' => $this->itemConfig($request),
        ]);

        return back()->with('success', 'Isi bagian disimpan.');
    }

    public function updateItem(HomeSectionItemRequest $request, HomeSectionItem $item): RedirectResponse
    {
        $item->update([
            ...$request->safe()->only(['item_type', 'product_id', 'category_id', 'title', 'subtitle', 'image_path', 'link_url', 'sort_order', 'is_active']),
            'image_path' => $this->imagePath($request, 'image', 'image_path'),
            'sort_order' => $request->integer('sort_order'),
            'config_json' => $this->itemConfig($request),
        ]);

        return back()->with('success', 'Isi bagian diperbarui.');
    }

    public function destroyItem(HomeSectionItem $item): RedirectResponse
    {
        $item->delete();

        return back()->with('success', 'Isi bagian dipindahkan ke arsip.');
    }

    /**
     * @return array<string, mixed>|null
     */
    private function itemConfig(HomeSectionItemRequest $request): ?array
    {
        $config = $request->itemConfig();

        if ($request->string('item_type')->toString() !== 'slide' || ! is_array($config)) {
            return $config;
        }

        $config['mobile_image'] = $this->imagePath($request, 'mobile_image', 'mobile_image_path');

        return $config;
    }

    private function imagePath(HomeSectionRequest|HomeSectionItemRequest $request, string $fileKey = 'image', string $pathKey = 'image_path'): ?string
    {
        if ($request->hasFile($fileKey)) {
            return $request->file($fileKey)->store('home', 'public');
        }

        $path = $request->input($pathKey);

        return is_string($path) && $path !== '' ? $path : null;
    }

    private function updateHero(Request $request): void
    {
        $action = $request->validate([
            'hero_action' => 'required|in:save,delete,reorder',
        ])['hero_action'];

        if ($action === 'delete') {
            abort_unless($request->user()?->isSuperAdmin(), 403);
        }

        match ($action) {
            'delete' => $this->deleteHeroBanner($request),
            'reorder' => $this->reorderHeroBanners($request),
            'save' => $this->saveHeroBanner($request),
        };
    }

    private function saveHeroBanner(Request $request): void
    {
        $banners = StoreContentSetting::heroBanners();
        $id = $request->input('hero_id');
        $existing = $id ? collect($banners)->firstWhere('id', $id) : null;

        $validated = $request->validate([
            'hero_id' => 'nullable|string|max:64',
            'hero_link' => ['nullable', 'string', 'max:255', 'regex:#^(https?://|/(?!/))#i'],
            'hero_desktop_image' => [Rule::requiredIf(! $existing || empty($existing['desktop_image'])), 'image', 'dimensions:width=1920,height=800', 'max:4096'],
            'hero_mobile_image' => [Rule::requiredIf(! $existing || empty($existing['mobile_image'])), 'image', 'dimensions:width=1619,height=971', 'max:4096'],
        ]);

        $banner = $existing ?? [
            'id' => (string) Str::uuid(),
            'link' => null,
            'desktop_image' => null,
            'mobile_image' => null,
        ];

        $banner['link'] = $validated['hero_link'] ?? null;

        if ($request->hasFile('hero_desktop_image')) {
            if (! empty($banner['desktop_image'])) {
                Storage::disk('public')->delete($banner['desktop_image']);
            }
            $banner['desktop_image'] = $request->file('hero_desktop_image')->store('store-content', 'public');
        }

        if ($request->hasFile('hero_mobile_image')) {
            if (! empty($banner['mobile_image'])) {
                Storage::disk('public')->delete($banner['mobile_image']);
            }
            $banner['mobile_image'] = $request->file('hero_mobile_image')->store('store-content', 'public');
        }

        if ($existing) {
            $banners = array_map(fn (array $item) => $item['id'] === $banner['id'] ? $banner : $item, $banners);
        } else {
            $banners[] = $banner;
        }

        StoreContentSetting::putValue('hero', array_values($banners));
    }

    private function deleteHeroBanner(Request $request): void
    {
        $id = $request->validate([
            'hero_id' => 'required|string|max:64',
        ])['hero_id'];

        $banners = StoreContentSetting::heroBanners();
        $remaining = [];

        foreach ($banners as $banner) {
            if ($banner['id'] === $id) {
                if (! empty($banner['desktop_image'])) {
                    Storage::disk('public')->delete($banner['desktop_image']);
                }
                if (! empty($banner['mobile_image'])) {
                    Storage::disk('public')->delete($banner['mobile_image']);
                }

                continue;
            }
            $remaining[] = $banner;
        }

        StoreContentSetting::putValue('hero', $remaining);
    }

    private function reorderHeroBanners(Request $request): void
    {
        $order = $request->validate([
            'hero_order' => 'required|array|min:1',
            'hero_order.*' => 'string|max:64',
        ])['hero_order'];

        $byId = collect(StoreContentSetting::heroBanners())->keyBy('id');
        $reordered = collect($order)
            ->map(fn (string $id) => $byId->get($id))
            ->filter()
            ->values()
            ->all();

        // Keep any banners missing from order at the end
        foreach ($byId as $id => $banner) {
            if (! in_array($id, $order, true)) {
                $reordered[] = $banner;
            }
        }

        StoreContentSetting::putValue('hero', $reordered);
    }

    private function updateAnnouncementBar(Request $request): void
    {
        $validated = $request->validate([
            'enabled' => ['required', 'boolean'],
            'text' => ['required', 'string', 'max:255'],
            'link' => ['nullable', 'string', 'max:255', 'regex:#^(https?://|/(?!/))#i'],
        ]);

        StoreContentSetting::putValue('announcement_bar', [
            'enabled' => $request->boolean('enabled'),
            'text' => $validated['text'],
            'link' => filled($validated['link'] ?? null) ? $validated['link'] : null,
        ]);
    }

    private function updateHomeSections(Request $request): void
    {
        $validated = $request->validate([
            'sections' => ['required', 'array', 'min:1', 'max:8'],
            'sections.*.key' => ['nullable', 'string', 'max:64'],
            'sections.*.label' => ['required', 'string', 'max:80'],
            'sections.*.category_slugs' => ['required', 'array', 'min:1'],
            'sections.*.category_slugs.*' => [
                'required',
                'string',
                'max:120',
                Rule::exists('categories', 'slug')->where(fn ($query) => $query->where('is_active', true)->whereNull('deleted_at')),
            ],
        ]);

        $sections = collect($validated['sections'])
            ->map(function (array $section) {
                $label = trim($section['label']);
                $key = trim((string) ($section['key'] ?? ''));

                if ($key === '') {
                    $key = Str::slug($label) ?: 'section';
                }

                return [
                    'key' => $key,
                    'label' => $label,
                    'category_slugs' => array_values(array_unique($section['category_slugs'])),
                ];
            })
            ->values()
            ->all();

        StoreContentSetting::putValue('home_sections', $sections);
    }

    private function updateFeaturedProducts(Request $request): void
    {
        $validated = $request->validate([
            'featured_product_ids' => 'nullable|array',
            'featured_product_ids.*' => 'exists:products,id',
        ]);

        StoreContentSetting::putValue('featured_product_ids', $validated['featured_product_ids'] ?? []);
    }

    private function updateSocialMedia(Request $request): void
    {
        $validated = $request->validate([
            'whatsapp_number' => ['required', 'string', 'regex:/^[0-9]{8,20}$/'],
            'social_links' => 'nullable|array',
            'social_links.*.name' => 'nullable|string|max:50',
            'social_links.*.url' => 'nullable|string|max:255|url:http,https',
        ]);

        StoreContentSetting::putValue('whatsapp_number', $validated['whatsapp_number']);
        StoreContentSetting::putValue('social_links', collect($validated['social_links'] ?? [])
            ->filter(fn ($link) => filled($link['name'] ?? null) && filled($link['url'] ?? null))
            ->values()
            ->all());
    }

    private function updatePromoPopup(Request $request): void
    {
        $existing = StoreContentSetting::promoPopupSettings();

        $validated = $request->validate([
            'title' => 'required|string|max:120',
            'subtitle' => 'nullable|string|max:255',
            'cta_text' => 'required|string|max:60',
            'cta_url' => ['required', 'string', 'max:255', 'regex:#^(https?://|/(?!/))#i'],
            'image' => [
                Rule::requiredIf($existing['image'] === null),
                'nullable',
                'image',
                'max:4096',
            ],
        ]);

        $image = $existing['image'];

        if ($request->hasFile('image')) {
            if ($image) {
                Storage::disk('public')->delete($image);
            }
            $image = $request->file('image')->store('store-content', 'public');
        }

        StoreContentSetting::putValue('promo_popup', [
            'enabled' => $request->boolean('enabled'),
            'image' => $image,
            'title' => $validated['title'],
            'subtitle' => $validated['subtitle'] ?? '',
            'cta_text' => $validated['cta_text'],
            'cta_url' => $validated['cta_url'],
            'version' => $existing['version'] + 1,
        ]);
    }

    private function defaultSocialLinks(): array
    {
        return [
            ['name' => 'Instagram', 'url' => '#'],
            ['name' => 'Twitter', 'url' => '#'],
            ['name' => 'TikTok', 'url' => '#'],
        ];
    }

    /** @return list<array{key: string, label: string, category_slugs: list<string>}> */
    private function defaultHomeSections(): array
    {
        return [
            [
                'key' => 'apparels',
                'label' => 'Apparels',
                'category_slugs' => ['blouse', 'dress', 'skirt', 'pants', 'koko'],
            ],
            [
                'key' => 'essentials',
                'label' => 'Essentials',
                'category_slugs' => ['scarves', 'shoes', 'bag', 'accessories', 'prayer-set'],
            ],
        ];
    }
}
