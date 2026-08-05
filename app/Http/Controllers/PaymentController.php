<?php

namespace App\Http\Controllers;

use App\Http\Requests\UploadPaymentProofRequest;
use App\Models\Order;
use App\Services\MidtransService;
use App\Services\OrderAccessService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class PaymentController extends Controller
{
    public function midtrans(
        Request $request,
        Order $order,
        OrderAccessService $access,
        MidtransService $midtrans,
    ): RedirectResponse {
        $access->authorize($request, $order);

        if ($order->payment_method !== Order::PAYMENT_METHOD_MIDTRANS) {
            abort(404);
        }

        try {
            return back()->with(
                'midtransPayment',
                $midtrans->createPayment($order, $midtrans->preferredChannel($order)),
            );
        } catch (ValidationException $exception) {
            throw $exception;
        } catch (\Throwable $exception) {
            report($exception);

            return back()->with('error', 'Unable to open Midtrans payment. Please try again.');
        }
    }

    public function notification(Request $request, MidtransService $midtrans)
    {
        $midtrans->handleNotification($request->all());

        return response()->json(['received' => true]);
    }

    public function proof(
        UploadPaymentProofRequest $request,
        Order $order,
        OrderAccessService $access,
    ): RedirectResponse {
        $access->authorize($request, $order);

        if ($order->payment_method !== Order::PAYMENT_METHOD_BANK_TRANSFER) {
            abort(404);
        }

        if ($order->payment_status === Order::PAYMENT_PAID) {
            throw ValidationException::withMessages(['proof' => 'This order has already been paid.']);
        }

        if ($order->stock_released_at || $order->payment_expires_at?->isPast()) {
            throw ValidationException::withMessages(['proof' => 'The payment deadline has passed.']);
        }

        $path = $request->file('proof')->store('payment-proofs', 'local');

        if ($order->payment_proof_path) {
            Storage::disk('local')->delete($order->payment_proof_path);
        }

        $order->forceFill([
            'payment_proof_path' => $path,
            'payment_status' => Order::PAYMENT_PENDING_VERIFICATION,
        ])->save();

        $order->notifyCustomer(
            'Transfer Proof Received — '.$order->order_number,
            [
                'We have received the transfer proof for order '.$order->order_number.'.',
                'Our team will verify your payment.',
            ],
            $order->customerOrderUrl($request->input('token')),
        );

        $order->notifyAdmin(
            'Transfer Proof — '.$order->order_number,
            [
                'Customer: '.($order->shipping_address['name'] ?? '-'),
                'Email: '.(string) $order->customer_email,
                'Total: Rp '.number_format((float) $order->total_amount, 0, ',', '.'),
                'Please verify the transfer proof in admin.',
            ],
        );

        return back()->with('success', 'Transfer proof submitted successfully.');
    }
}
