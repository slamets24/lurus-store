<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class StockConfirmationNeededNotification extends Notification
{
    use Queueable;

    public function __construct(public readonly Order $order) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $subject = 'Payment Received, Stock Being Confirmed';

        return (new MailMessage)
            ->subject($subject)
            ->view('emails.customer', [
                'subject' => $subject,
                'title' => $subject,
                'name' => $this->order->shipping_address['name'] ?? 'Customer',
                'lines' => [
                    'We have received payment for order '.$this->order->order_number.'.',
                    'Product stock is currently being confirmed by our team because available stock changed when payment completed.',
                    'Our team will contact you to confirm, offer product replacements, or process a refund if needed.',
                ],
                'actionUrl' => null,
                'actionText' => null,
            ]);
    }
}
