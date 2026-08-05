<?php

use App\Models\CartItem;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('sitemap:generate')->daily();

Schedule::call(function () {
    CartItem::whereNull('user_id')
        ->where('updated_at', '<', now()->subDays(7))
        ->delete();
})->daily();

Schedule::call(function () {
    Order::whereNull('stock_released_at')
        ->whereIn('payment_status', [Order::PAYMENT_UNPAID, Order::PAYMENT_PENDING_VERIFICATION, Order::PAYMENT_FAILED])
        ->where('payment_expires_at', '<=', now())
        ->each(fn (Order $order) => app(OrderService::class)->releaseStock($order));
})->everyMinute();
