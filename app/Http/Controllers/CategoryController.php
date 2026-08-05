<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with('children')
            ->whereNull('parent_id')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function show($slug)
    {
        $category = Category::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $products = $category->products()
            ->with(['images', 'publishedVariants'])
            ->where('is_active', true)
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('CategoryDetail', [
            'category' => $category,
            'products' => $products,
        ]);
    }
}
