<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Collection;
use App\Models\Order;
use App\Models\Product;
use App\Models\Promo;
use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminRestoreController extends Controller
{
    private const TYPES = [
        'products' => Product::class,
        'categories' => Category::class,
        'collections' => Collection::class,
        'promos' => Promo::class,
        'testimonials' => Testimonial::class,
        'orders' => Order::class,
    ];

    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'type' => ['nullable', Rule::in(array_keys(self::TYPES))],
        ]);
        $type = $validated['type'] ?? 'products';
        $model = self::TYPES[$type];
        $records = $model::onlyTrashed()
            ->latest('deleted_at')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (Model $record) => [
                'id' => $record->getKey(),
                'name' => $record->name ?? $record->order_number ?? $record->customer_name ?? 'Data #'.$record->getKey(),
                'detail' => $record->slug ?? $record->customer_email ?? $record->comment ?? null,
                'deleted_at' => $record->deleted_at?->toISOString(),
            ]);

        return Inertia::render('Admin/Restore/Index', [
            'activeType' => $type,
            'counts' => collect(self::TYPES)->map(fn (string $class) => $class::onlyTrashed()->count()),
            'records' => $records,
        ]);
    }

    public function restore(string $type, int $id): RedirectResponse
    {
        abort_unless(isset(self::TYPES[$type]), 404);

        $record = self::TYPES[$type]::onlyTrashed()->findOrFail($id);
        $record->restore();

        return back()->with('success', 'Data restored successfully.');
    }

    public function destroy(string $type, int $id): RedirectResponse
    {
        abort_unless(isset(self::TYPES[$type]), 404);

        $record = self::TYPES[$type]::onlyTrashed()->findOrFail($id);

        if ($record instanceof Order && $record->payment_proof_path) {
            Storage::disk('local')->delete($record->payment_proof_path);
        }

        $record->forceDelete();

        return back()->with('success', 'Data permanently deleted.');
    }
}
