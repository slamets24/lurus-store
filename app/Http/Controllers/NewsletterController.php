<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscriber;
use App\Support\ContactRules;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', ContactRules::email(), 'max:255'],
            'website' => ['prohibited'],
        ], [
            'email.email' => ContactRules::EMAIL_MESSAGE,
        ]);

        NewsletterSubscriber::firstOrCreate([
            'email' => strtolower(trim($validated['email'])),
        ]);

        return back()->with('success', 'Thanks for subscribing.');
    }
}
