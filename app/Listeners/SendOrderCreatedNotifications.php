<?php

namespace App\Listeners;

use App\Events\OrderCreated;

class SendOrderCreatedNotifications
{
    public function handle(OrderCreated $event): void
    {
        $order = $event->order->fresh(['items']);
        if (! $order) {
            return;
        }

        $orderUrl = $order->customerOrderUrl($event->guestToken);
        $paymentHint = $order->payment_method === 'midtrans'
            ? 'Please complete your Midtrans payment before the deadline.'
            : 'Please transfer to our bank account and upload payment proof on the order page.';

        $order->notifyCustomer(
            'Order Received — '.$order->order_number,
            [
                'Order '.$order->order_number.' has been created.',
                'Total: Rp '.number_format((float) $order->total_amount, 0, ',', '.'),
                $paymentHint,
                'Payment deadline: '.($order->payment_expires_at?->timezone(config('app.timezone'))->format('d M Y H:i') ?? '-'),
            ],
            $orderUrl,
        );

        $order->notifyAdmin(
            'New Order — '.$order->order_number,
            [
                'Customer: '.($order->shipping_address['name'] ?? '-'),
                'Email: '.(string) $order->customer_email,
                'Total: Rp '.number_format((float) $order->total_amount, 0, ',', '.'),
                'Payment: '.$order->payment_method,
            ],
        );
    }
}
