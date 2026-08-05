<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminCategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with('parent')
            ->withCount('products')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(fn ($category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'image' => $category->image,
                'is_active' => $category->is_active,
                'sort_order' => $category->sort_order,
                'parent' => $category->parent ? ['id' => $category->parent->id, 'name' => $category->parent->name] : null,
                'products_count' => $category->products_count,
                'created_at' => $category->created_at->toISOString(),
            ]);

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        $parentCategories = Category::where('is_active', true)->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Categories/Form', [
            'category' => null,
            'parentCategories' => $parentCategories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|max:255',
            'slug' => 'nullable|max:255|unique:categories,slug',
            'description' => 'nullable',
            'parent_id' => 'nullable|exists:categories,id',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
            'image' => 'nullable|image|max:2048',
            'size_chart' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);
        unset($validated['size_chart']);

        $validated['slug'] = Str::slug(($validated['slug'] ?? '') ?: $validated['name']);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('categories', 'public');
        }

        if ($request->hasFile('size_chart')) {
            $validated['size_chart_path'] = $request->file('size_chart')->store('categories', 'public');
        }

        Category::create($validated);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category created successfully.');
    }

    public function edit(Category $category)
    {
        $parentCategories = Category::where('is_active', true)
            ->where('id', '!=', $category->id)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Admin/Categories/Form', [
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'image' => $category->image,
                'size_chart_url' => $category->sizeChartUrl(),
                'parent_id' => $category->parent_id,
                'is_active' => $category->is_active,
                'sort_order' => $category->sort_order,
            ],
            'parentCategories' => $parentCategories,
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|max:255',
            'slug' => 'nullable|max:255|unique:categories,slug,'.$category->id,
            'description' => 'nullable',
            'parent_id' => 'nullable|exists:categories,id',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
            'image' => 'nullable|image|max:2048',
            'size_chart' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'remove_size_chart' => 'boolean',
        ]);
        unset($validated['size_chart'], $validated['remove_size_chart']);

        $validated['slug'] = Str::slug(($validated['slug'] ?? '') ?: $validated['name']);

        if ($request->hasFile('image')) {
            if ($category->image) {
                Storage::disk('public')->delete($category->image);
            }
            $validated['image'] = $request->file('image')->store('categories', 'public');
        } else {
            unset($validated['image']);
        }

        if ($request->hasFile('size_chart')) {
            if ($category->size_chart_path) {
                Storage::disk('public')->delete($category->size_chart_path);
            }
            $validated['size_chart_path'] = $request->file('size_chart')->store('categories', 'public');
        } elseif ($request->boolean('remove_size_chart')) {
            if ($category->size_chart_path) {
                Storage::disk('public')->delete($category->size_chart_path);
            }
            $validated['size_chart_path'] = null;
        }

        $category->update($validated);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category)
    {
        if ($category->products()->count() > 0) {
            return back()->with('error', 'Cannot delete category with existing products.');
        }

        $category->delete();

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category moved to restore data.');
    }
}
