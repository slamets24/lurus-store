<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderAdminNotification extends Notification
{
    use Queueable;

    /**
     * @param  list<string>  $lines
     */
    public function __construct(
        public readonly Order $order,
        public readonly string $subject,
        public readonly array $lines,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $mail = (new MailMessage)->subject($this->subject);

        foreach ($this->lines as $line) {
            $mail->line($line);
        }

        return $mail
            ->action('Open in Admin', route('admin.orders.show', $this->order))
            ->salutation(config('app.name', 'Lurus Store').' Orders');
    }
}
