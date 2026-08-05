<?php

namespace App\Http\Controllers;

use App\Support\ContactRules;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Account');
    }

    public function update(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $request->merge([
            'email' => strtolower(trim((string) $request->input('email'))),
            'phone' => ContactRules::normalizePhone($request->input('phone')),
        ]);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', ContactRules::email(), 'max:255', 'unique:users,email,' . $user->id],
            'phone' => ['nullable', 'string', 'regex:'.ContactRules::PHONE_REGEX],
            'address' => ['nullable', 'string', 'max:500'],
            'city' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:10'],
        ], [
            'email.email' => ContactRules::EMAIL_MESSAGE,
            'phone.regex' => ContactRules::PHONE_MESSAGE,
        ]);

        $user->update($validated);

        return back()->with('success', 'Profile updated successfully.');
    }
}
