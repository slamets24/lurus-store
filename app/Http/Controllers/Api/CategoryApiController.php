<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;

class CategoryApiController extends Controller
{
    public function recent()
    {
        $categories = Category::withCount('products')
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get()
            ->map(fn ($category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'image' => $category->image,
                'products_count' => $category->products_count,
            ]);

        return response()->json($categories);
    }
}
