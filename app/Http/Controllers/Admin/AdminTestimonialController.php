<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;

class AdminTestimonialController extends Controller
{
    public function approve(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->update(['approved_at' => now()]);

        return back()->with('success', 'Testimonial published on the homepage.');
    }

    public function reject(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->delete();

        return back()->with('success', 'Testimonial moved to restore data.');
    }
}
