<?php

namespace App\Http\Controllers;

use App\Services\SearchService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function __invoke(Request $request, SearchService $search)
    {
        $query = trim((string) $request->get('q', ''));

        return Inertia::render('Search', [
            'query' => $query,
            'products' => $search->search($query),
        ]);
    }
}
