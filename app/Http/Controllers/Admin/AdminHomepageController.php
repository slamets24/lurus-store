<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\StoreContentSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminHomepageController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Homepage/Index', [
            'settings' => [
                'hero' => StoreContentSetting::heroBanners(),
                'featuredProductIds' => StoreContentSetting::value('featured_product_ids', []),
                'socialLinks' => StoreContentSetting::value('social_links', $this->defaultSocialLinks()),
                'whatsappNumber' => StoreContentSetting::value('whatsapp_number', StoreContentSetting::DEFAULT_WHATSAPP_NUMBER),
                'promoPopup' => StoreContentSetting::promoPopupSettings(),
            ],
            'products' => Product::with('images')
                ->where('is_active', true)
                ->orderBy('name')
                ->get()
                ->map(fn ($product) => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'price' => (float) $product->price,
                    'image' => $product->images->first()?->image_path,
                ]),
        ]);
    }

    public function update(Request $request)
    {
        $section = $request->validate([
            'section' => 'required|in:hero,featured_products,social_media,promo_popup',
        ])['section'];

        match ($section) {
            'hero' => $this->updateHero($request),
            'featured_products' => $this->updateFeaturedProducts($request),
            'social_media' => $this->updateSocialMedia($request),
            'promo_popup' => $this->updatePromoPopup($request),
        };

        return back()->with('success', match ($section) {
            'hero' => 'Hero banner saved successfully.',
            'featured_products' => 'Featured products saved successfully.',
            'social_media' => 'Social media and WhatsApp saved successfully.',
            'promo_popup' => 'Promo popup saved successfully.',
        });
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
}
