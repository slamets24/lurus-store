<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderCustomerNotification extends Notification
{
    use Queueable;

    /**
     * @param  list<string>  $lines
     */
    public function __construct(
        public readonly Order $order,
        public readonly string $subject,
        public readonly array $lines,
        public readonly ?string $actionUrl = null,
        public readonly ?string $actionText = null,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $this->order->loadMissing('items');

        return (new MailMessage)
            ->subject($this->subject)
            ->view('emails.customer', [
                'order' => $this->order,
                'subject' => $this->subject,
                'title' => $this->subject,
                'name' => $this->order->shipping_address['name'] ?? 'Customer',
                'lines' => $this->lines,
                'actionUrl' => $this->actionUrl,
                'actionText' => $this->actionText ?? 'View Order',
            ]);
    }
}
