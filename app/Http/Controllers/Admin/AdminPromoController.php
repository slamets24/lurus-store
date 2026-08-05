<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Promo;
use App\Models\PromoComponent;
use App\Models\PromoTarget;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminPromoController extends Controller
{
    public function index()
    {
        $promos = Promo::query()
            ->withCount(['targets', 'components'])
            ->latest()
            ->get()
            ->map(fn (Promo $promo) => [
                'id' => $promo->id,
                'name' => $promo->name,
                'type' => $promo->type,
                'is_active' => $promo->is_active,
                'scope' => $promo->scope,
                'buy_qty' => $promo->buy_qty,
                'free_qty' => $promo->free_qty,
                'package_price' => $promo->package_price !== null ? (float) $promo->package_price : null,
                'targets_count' => $promo->targets_count,
                'components_count' => $promo->components_count,
                'created_at' => $promo->created_at?->toISOString(),
            ]);

        return Inertia::render('Admin/Promos/Index', [
            'promos' => $promos,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Promos/Form', [
            'promo' => null,
            ...$this->formOptions(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validated($request);

        DB::transaction(function () use ($validated) {
            $promo = Promo::create($this->promoPayload($validated));
            $this->syncRelations($promo, $validated);
        });

        return redirect()->route('admin.promos.index')->with('success', 'Promo created.');
    }

    public function edit(Promo $promo)
    {
        $promo->load(['targets', 'components']);

        return Inertia::render('Admin/Promos/Form', [
            'promo' => [
                'id' => $promo->id,
                'name' => $promo->name,
                'type' => $promo->type,
                'is_active' => $promo->is_active,
                'scope' => $promo->scope,
                'buy_qty' => $promo->buy_qty,
                'free_qty' => $promo->free_qty,
                'free_pick' => $promo->free_pick,
                'min_unit_price' => $promo->min_unit_price !== null ? (float) $promo->min_unit_price : null,
                'package_price' => $promo->package_price !== null ? (float) $promo->package_price : null,
                'target_ids' => $promo->targets->pluck('target_id')->map(fn ($id) => (int) $id)->values(),
                'components' => $promo->components->map(fn ($row) => [
                    'product_id' => (int) $row->product_id,
                    'quantity' => (int) $row->quantity,
                ])->values(),
            ],
            ...$this->formOptions(),
        ]);
    }

    public function update(Request $request, Promo $promo)
    {
        $validated = $this->validated($request);

        DB::transaction(function () use ($promo, $validated) {
            $promo->update($this->promoPayload($validated));
            $this->syncRelations($promo, $validated);
        });

        return redirect()->route('admin.promos.index')->with('success', 'Promo updated.');
    }

    public function destroy(Promo $promo)
    {
        $promo->delete();

        return redirect()->route('admin.promos.index')->with('success', 'Promo moved to restore data.');
    }

    private function validated(Request $request): array
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::in([Promo::TYPE_BXGY, Promo::TYPE_BUNDLE])],
            'is_active' => ['boolean'],
            'scope' => ['required', Rule::in([Promo::SCOPE_PRODUCTS, Promo::SCOPE_CATEGORIES, Promo::SCOPE_ALL])],
            'buy_qty' => ['nullable', 'integer', 'min:1', 'max:100'],
            'free_qty' => ['nullable', 'integer', 'min:1', 'max:100'],
            'free_pick' => ['nullable', Rule::in([Promo::FREE_PICK_CHEAPEST, Promo::FREE_PICK_SAME_SKU])],
            'min_unit_price' => ['nullable', 'numeric', 'min:0'],
            'package_price' => ['nullable', 'numeric', 'min:0'],
            'target_ids' => ['nullable', 'array'],
            'target_ids.*' => ['integer'],
            'components' => ['nullable', 'array'],
            'components.*.product_id' => ['required_with:components', 'integer', 'exists:products,id'],
            'components.*.quantity' => ['required_with:components', 'integer', 'min:1', 'max:100'],
        ]);

        if ($validated['type'] === Promo::TYPE_BXGY) {
            $request->validate([
                'buy_qty' => ['required', 'integer', 'min:1'],
                'free_qty' => ['required', 'integer', 'min:1'],
            ]);
            if (in_array($validated['scope'], [Promo::SCOPE_PRODUCTS, Promo::SCOPE_CATEGORIES], true)) {
                $request->validate([
                    'target_ids' => ['required', 'array', 'min:1'],
                ]);
            }
        }

        if ($validated['type'] === Promo::TYPE_BUNDLE) {
            $request->validate([
                'package_price' => ['required', 'numeric', 'min:0'],
                'components' => ['required', 'array', 'min:1'],
            ]);
        }

        return $validated;
    }

    private function promoPayload(array $validated): array
    {
        return [
            'name' => $validated['name'],
            'type' => $validated['type'],
            'is_active' => (bool) ($validated['is_active'] ?? true),
            'scope' => $validated['type'] === Promo::TYPE_BUNDLE ? Promo::SCOPE_PRODUCTS : $validated['scope'],
            'buy_qty' => $validated['type'] === Promo::TYPE_BXGY ? (int) $validated['buy_qty'] : null,
            'free_qty' => $validated['type'] === Promo::TYPE_BXGY ? (int) $validated['free_qty'] : null,
            'free_pick' => $validated['type'] === Promo::TYPE_BXGY
                ? ($validated['free_pick'] ?? Promo::FREE_PICK_CHEAPEST)
                : Promo::FREE_PICK_CHEAPEST,
            'min_unit_price' => $validated['type'] === Promo::TYPE_BXGY
                ? ($validated['min_unit_price'] ?? null)
                : null,
            'package_price' => $validated['type'] === Promo::TYPE_BUNDLE
                ? $validated['package_price']
                : null,
        ];
    }

    private function syncRelations(Promo $promo, array $validated): void
    {
        $promo->targets()->delete();
        $promo->components()->delete();

        if ($validated['type'] === Promo::TYPE_BXGY
            && in_array($validated['scope'], [Promo::SCOPE_PRODUCTS, Promo::SCOPE_CATEGORIES], true)) {
            $targetType = $validated['scope'] === Promo::SCOPE_CATEGORIES
                ? PromoTarget::TYPE_CATEGORY
                : PromoTarget::TYPE_PRODUCT;

            foreach ($validated['target_ids'] ?? [] as $targetId) {
                PromoTarget::create([
                    'promo_id' => $promo->id,
                    'target_type' => $targetType,
                    'target_id' => (int) $targetId,
                ]);
            }
        }

        if ($validated['type'] === Promo::TYPE_BUNDLE) {
            foreach ($validated['components'] ?? [] as $row) {
                PromoComponent::create([
                    'promo_id' => $promo->id,
                    'product_id' => (int) $row['product_id'],
                    'quantity' => (int) $row['quantity'],
                ]);
            }
        }
    }

    private function formOptions(): array
    {
        return [
            'products' => Product::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'price', 'discount_percent'])
                ->map(fn (Product $product) => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => (float) $product->price,
                    'effective_price' => $product->effectiveUnitPrice(),
                ]),
            'categories' => Category::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name']),
        ];
    }
}
