<?php

namespace App\Notifications;

use App\Services\EmailOtpService;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EmailOtpNotification extends Notification
{
    use Queueable;

    public function __construct(public readonly string $code) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject(config('app.name', 'Lurus Store').' Verification Code')
            ->view('emails.auth.email-otp', [
                'code' => $this->code,
                'expiresInMinutes' => EmailOtpService::EXPIRY_MINUTES,
                'user' => $notifiable,
            ]);
    }
}
