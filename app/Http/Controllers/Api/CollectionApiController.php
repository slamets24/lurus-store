<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Collection;

class CollectionApiController extends Controller
{
    public function index()
    {
        $collections = Collection::where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($c) => [
                'name' => $c->name,
                'slug' => $c->slug,
                'description' => $c->description,
                'subtitle' => $c->subtitle,
                'banner_image' => $c->banner_image ? '/storage/' . $c->banner_image : null,
            ]);

        return response()->json($collections);
    }
}
