<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\CartService;
use App\Services\EmailOtpService;
use App\Services\GuestOrderClaimService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    public function create(Request $request): Response
    {
        $redirect = $request->query('redirect');

        if (is_string($redirect) && str_starts_with($redirect, '/') && ! str_starts_with($redirect, '//')) {
            $request->session()->put('url.intended', url($redirect));
        }

        return Inertia::render('Auth/Login', [
            'status' => session('status'),
        ]);
    }

    public function store(
        Request $request,
        CartService $carts,
        EmailOtpService $otp,
        GuestOrderClaimService $claims,
    ): RedirectResponse {
        $request->merge(['email' => strtolower((string) $request->input('email'))]);
        $credentials = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'password' => ['required', 'max:1024'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $adjusted = $carts->mergeGuestCart($request, $request->user());
            $request->session()->regenerate();

            if ($request->user()->isAdmin()) {
                return redirect('/admin');
            }

            if (! $request->user()->hasVerifiedEmail()) {
                if (! $request->user()->email_otp_expires_at?->isFuture()) {
                    $otp->send($request->user(), enforceCooldown: false);
                }

                return redirect()->route('verification.notice');
            }

            $claims->claim($request->user());
            $request->session()->forget('guest_order_claim_token');

            return redirect()->intended(route('home'))->with(
                $adjusted ? 'message' : 'success',
                $adjusted
                    ? 'Your cart was merged and quantities were adjusted to available stock.'
                    : 'Welcome back.',
            );
        }

        return back()->withErrors([
            'email' => 'Email or password is incorrect.',
        ]);
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
