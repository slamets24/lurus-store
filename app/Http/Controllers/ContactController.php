<?php

namespace App\Http\Controllers;

use App\Notifications\ContactMessageNotification;
use App\Support\ContactRules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index()
    {
        return Inertia::render('Contact');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', ContactRules::email(), 'max:255'],
            'message' => ['required', 'string', 'max:2000'],
            'website' => ['prohibited'],
        ], [
            'email.email' => ContactRules::EMAIL_MESSAGE,
        ]);

        unset($validated['website']);

        $to = (string) config('services.contact.to');

        if ($to !== '') {
            Notification::route('mail', $to)
                ->notify(new ContactMessageNotification($validated));
        }

        return back()->with('success', 'Message sent successfully. We will contact you soon.');
    }
}
