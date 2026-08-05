<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    public function create(string $token): Response
    {
        $order = $this->order($token)->load(['items.product.images', 'items.testimonial']);

        return Inertia::render('Testimonials/Create', [
            'order' => [
                'order_number' => $order->order_number,
                'items' => $order->items->map(fn ($item) => [
                    'id' => $item->id,
                    'product_name' => $item->product_name,
                    'size' => $item->size,
                    'color' => $item->color,
                    'image' => $item->product?->images?->first()?->image_path,
                ]),
            ],
            'token' => $token,
        ]);
    }

    public function store(Request $request, string $token): RedirectResponse
    {
        $order = $this->order($token)->load('items');
        $itemIds = $order->items->pluck('id')->all();
        $validated = $request->validate([
            'reviews' => ['required', 'array', 'min:1'],
            'reviews.*.order_item_id' => ['required', 'integer', 'distinct', Rule::in($itemIds)],
            'reviews.*.rating' => ['required', 'integer', 'between:1,5'],
            'reviews.*.comment' => ['required', 'string', 'min:10', 'max:1000'],
        ]);

        if (count($validated['reviews']) !== count($itemIds)) {
            throw ValidationException::withMessages([
                'reviews' => 'Please leave a review for each product in your order.',
            ]);
        }

        DB::transaction(function () use ($order, $validated) {
            foreach ($validated['reviews'] as $review) {
                Testimonial::create([
                    'order_item_id' => $review['order_item_id'],
                    'user_id' => $order->user_id,
                    'customer_name' => $order->shipping_address['name'],
                    'rating' => $review['rating'],
                    'comment' => $review['comment'],
                ]);
            }

            $order->update(['testimonial_submitted_at' => now()]);
        });

        return redirect()->route('home')->with('success', 'Thank you, your review has been submitted.');
    }

    private function order(string $token): Order
    {
        return Order::where('testimonial_token', hash('sha256', $token))
            ->where('status', Order::STATUS_DELIVERED)
            ->whereNull('testimonial_submitted_at')
            ->firstOrFail();
    }
}
