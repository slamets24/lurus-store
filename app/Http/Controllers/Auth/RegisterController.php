<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Services\CartService;
use App\Services\EmailOtpService;
use App\Support\ContactRules;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class RegisterController extends Controller
{
    public function create(Request $request): Response
    {
        $redirect = $request->query('redirect');

        if (is_string($redirect) && str_starts_with($redirect, '/') && ! str_starts_with($redirect, '//')) {
            $request->session()->put('url.intended', url($redirect));
        }

        $claim = $request->query('claim');

        if (is_string($claim) && Order::whereNull('user_id')->where('guest_token', hash('sha256', $claim))->exists()) {
            $request->session()->put('guest_order_claim_token', $claim);
        }

        return Inertia::render('Auth/Register');
    }

    public function store(
        Request $request,
        CartService $carts,
        EmailOtpService $otp,
    ): RedirectResponse {
        $request->merge([
            'email' => strtolower(trim((string) $request->input('email'))),
            'phone' => ContactRules::normalizePhone($request->input('phone')),
        ]);
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', ContactRules::email(), 'max:255', 'unique:users'],
            'phone' => ['nullable', 'string', 'regex:'.ContactRules::PHONE_REGEX],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'website' => ['prohibited'],
        ], [
            'email.email' => ContactRules::EMAIL_MESSAGE,
            'phone.regex' => ContactRules::PHONE_MESSAGE,
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => strtolower($validated['email']),
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
        ]);

        Auth::login($user);
        $request->session()->regenerate();
        $adjusted = $carts->mergeGuestCart($request, $user);
        $otp->send($user, enforceCooldown: false);

        return redirect()->route('verification.notice')->with(
            $adjusted ? 'message' : 'success',
            $adjusted
                ? 'Your cart was merged and quantities were adjusted to available stock.'
                : 'A verification code has been sent to your email.',
        );
    }
}
