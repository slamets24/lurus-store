<?php

namespace App\Console\Commands;

use App\Models\Order;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class SimulateBiteshipWebhook extends Command
{
    protected $signature = 'biteship:simulate-webhook
        {order : Order number}
        {status=delivered : Biteship status (confirmed, in_transit, delivered, ...)}
        {--url= : Full webhook URL (default APP_URL/webhooks/biteship)}';

    protected $description = 'Simulate a Biteship order.status webhook for local / ngrok testing';

    public function handle(): int
    {
        $order = Order::where('order_number', $this->argument('order'))->first();
        if (! $order) {
            $this->error('Order not found.');

            return self::FAILURE;
        }

        $url = rtrim((string) ($this->option('url') ?: config('app.url')), '/').'/webhooks/biteship';
        $header = (string) config('services.biteship.webhook_header', 'X-Biteship-Secret');
        $secret = (string) config('services.biteship.webhook_secret');
        $status = (string) $this->argument('status');

        $payload = [
            'event' => 'order.status',
            'order_id' => $order->biteship_order_id ?: 'local-'.$order->id,
            'reference_id' => $order->order_number,
            'status' => $status,
            'note' => app(\App\Services\BiteshipService::class)->customerFacingNote($status),
            'courier' => [
                'waybill_id' => $order->waybill_id ?: 'LOCAL-SIM',
            ],
        ];

        $request = Http::acceptJson()->asJson();
        if ($secret !== '') {
            $request = $request->withHeaders([$header => $secret]);
        }

        $response = $request->post($url, $payload);

        $this->info("POST {$url}");
        $this->line('status='.$response->status().' body='.$response->body());

        return $response->successful() ? self::SUCCESS : self::FAILURE;
    }
}
