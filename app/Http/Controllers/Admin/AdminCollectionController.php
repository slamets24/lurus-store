<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminCollectionController extends Controller
{
    public function index()
    {
        $collections = Collection::withCount('products')
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'slug' => $c->slug,
                'subtitle' => $c->subtitle,
                'is_active' => $c->is_active,
                'sort_order' => $c->sort_order,
                'products_count' => $c->products_count,
                'created_at' => $c->created_at->toISOString(),
            ]);

        return Inertia::render('Admin/Collections/Index', [
            'collections' => $collections,
        ]);
    }

    public function create()
    {
        $products = Product::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'price']);

        return Inertia::render('Admin/Collections/Form', [
            'collection' => null,
            'products' => $products,
            'assignedProductIds' => [],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|max:255',
            'slug' => 'nullable|max:255|unique:collections,slug',
            'description' => 'nullable',
            'subtitle' => 'nullable|max:255',
            'banner_image' => 'nullable|image|max:2048',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
            'product_ids' => 'nullable|array',
            'product_ids.*' => 'exists:products,id',
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);

        if ($request->hasFile('banner_image')) {
            $validated['banner_image'] = $request->file('banner_image')->store('collections', 'public');
        }

        $collection = Collection::create($validated);

        if (! empty($validated['product_ids'])) {
            $sync = [];
            foreach ($validated['product_ids'] as $i => $id) {
                $sync[$id] = ['sort_order' => $i];
            }
            $collection->products()->sync($sync);
        }

        return redirect()->route('admin.collections.index')
            ->with('success', 'Collection created successfully.');
    }

    public function edit(Collection $collection)
    {
        $collection->load('products');

        $products = Product::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'price']);

        $assignedProductIds = $collection->products->pluck('id')->toArray();

        return Inertia::render('Admin/Collections/Form', [
            'collection' => [
                'id' => $collection->id,
                'name' => $collection->name,
                'slug' => $collection->slug,
                'description' => $collection->description,
                'subtitle' => $collection->subtitle,
                'banner_image' => $collection->banner_image,
                'is_active' => $collection->is_active,
                'sort_order' => $collection->sort_order,
            ],
            'products' => $products,
            'assignedProductIds' => $assignedProductIds,
        ]);
    }

    public function update(Request $request, Collection $collection)
    {
        $validated = $request->validate([
            'name' => 'required|max:255',
            'slug' => 'nullable|max:255|unique:collections,slug,'.$collection->id,
            'description' => 'nullable',
            'subtitle' => 'nullable|max:255',
            'banner_image' => 'nullable|image|max:2048',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
            'product_ids' => 'nullable|array',
            'product_ids.*' => 'exists:products,id',
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);

        if ($request->hasFile('banner_image')) {
            $validated['banner_image'] = $request->file('banner_image')->store('collections', 'public');
        } else {
            unset($validated['banner_image']);
        }

        $collection->update($validated);

        if ($request->has('product_ids')) {
            $sync = [];
            foreach ($validated['product_ids'] as $i => $id) {
                $sync[$id] = ['sort_order' => $i];
            }
            $collection->products()->sync($sync);
        }

        return redirect()->route('admin.collections.index')
            ->with('success', 'Collection updated successfully.');
    }

    public function destroy(Collection $collection)
    {
        $collection->delete();

        return redirect()->route('admin.collections.index')
            ->with('success', 'Collection moved to restore data.');
    }
}
