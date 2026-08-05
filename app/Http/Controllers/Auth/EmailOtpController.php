<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\EmailOtpService;
use App\Services\GuestOrderClaimService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailOtpController extends Controller
{
    public function show(Request $request): Response|RedirectResponse
    {
        if ($request->user()->isAdmin()) {
            return redirect('/admin');
        }

        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('home'));
        }

        return Inertia::render('Auth/VerifyEmailOtp', [
            'email' => $request->user()->email,
            'status' => session('success'),
        ]);
    }

    public function verify(
        Request $request,
        EmailOtpService $otp,
        GuestOrderClaimService $claims,
    ): RedirectResponse {
        abort_if($request->user()->isAdmin(), 403);

        $validated = $request->validate([
            'code' => ['required', 'digits:6'],
        ]);

        $otp->verify($request->user(), $validated['code']);
        $claims->claim($request->user());
        $request->session()->forget('guest_order_claim_token');

        return redirect()->intended(route('home'))->with('success', 'Email verified successfully.');
    }

    public function resend(Request $request, EmailOtpService $otp): RedirectResponse
    {
        abort_if($request->user()->isAdmin(), 403);

        $otp->send($request->user());

        return back()->with('success', 'A new verification code has been sent.');
    }
}
