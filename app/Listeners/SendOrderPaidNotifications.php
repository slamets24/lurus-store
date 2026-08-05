<?php

namespace App\Listeners;

use App\Events\OrderPaid;
use App\Models\Order;
use App\Notifications\StockConfirmationNeededNotification;
use Illuminate\Support\Facades\Notification;

class SendOrderPaidNotifications
{
    public function handle(OrderPaid $event): void
    {
        $order = $event->order->fresh(['items']);
        if (! $order || $order->payment_status !== Order::PAYMENT_PAID) {
            return;
        }

        if ($order->status === Order::STATUS_READY_TO_SHIP) {
            $order->notifyCustomer(
                'Payment Received — '.$order->order_number,
                [
                    'We have received payment for order '.$order->order_number.'.',
                    'Your order is being prepared for shipping.',
                    'Total: Rp '.number_format((float) $order->total_amount, 0, ',', '.'),
                ],
                $order->customerOrderUrl(),
            );

            if ($event->notifyAdmin) {
                $order->notifyAdmin(
                    'Payment Received — '.$order->order_number,
                    [
                        'Customer: '.($order->shipping_address['name'] ?? '-'),
                        'Email: '.(string) $order->customer_email,
                        'Total: Rp '.number_format((float) $order->total_amount, 0, ',', '.'),
                        'Status: ready to ship',
                    ],
                );
            }

            return;
        }

        if ($order->status === Order::STATUS_STOCK_CONFIRMATION && $order->customer_email) {
            Notification::route('mail', $order->customer_email)
                ->notify(new StockConfirmationNeededNotification($order));

            if ($event->notifyAdmin) {
                $order->notifyAdmin(
                    'Payment Received (Stock Confirm) — '.$order->order_number,
                    [
                        'Customer: '.($order->shipping_address['name'] ?? '-'),
                        'Email: '.(string) $order->customer_email,
                        'Total: Rp '.number_format((float) $order->total_amount, 0, ',', '.'),
                        'Status: stock confirmation needed',
                    ],
                );
            }
        }
    }
}
