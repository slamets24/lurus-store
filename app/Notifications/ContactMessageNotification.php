<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContactMessageNotification extends Notification
{
    use Queueable;

    /**
     * @param  array{name: string, email: string, message: string}  $payload
     */
    public function __construct(public readonly array $payload) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New contact message — '.$this->payload['name'])
            ->replyTo($this->payload['email'], $this->payload['name'])
            ->line('Name: '.$this->payload['name'])
            ->line('Email: '.$this->payload['email'])
            ->line('Message:')
            ->line($this->payload['message'])
            ->salutation(config('app.name', 'Lurus Store').' Contact Form');
    }
}
