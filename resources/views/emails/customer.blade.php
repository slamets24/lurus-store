@php
    $rp = fn ($v) => 'Rp '.number_format((float) $v, 0, ',', '.');
    $statusLabels = [
        \App\Models\Order::STATUS_PENDING => 'Awaiting Payment',
        \App\Models\Order::STATUS_STOCK_CONFIRMATION => 'Stock Confirmation',
        \App\Models\Order::STATUS_READY_TO_SHIP => 'Ready to Ship',
        \App\Models\Order::STATUS_SHIPPED => 'Shipped',
        \App\Models\Order::STATUS_DELIVERED => 'Delivered',
        \App\Models\Order::STATUS_CANCELLED => 'Cancelled',
    ];
    $paymentLabels = [
        \App\Models\Order::PAYMENT_METHOD_MIDTRANS => 'Online Payment (Midtrans)',
        \App\Models\Order::PAYMENT_METHOD_BANK_TRANSFER => 'Bank Transfer',
    ];
    $addr = $order->shipping_address ?? [];
@endphp
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{{ $subject }}</title>
</head>
<body style="margin:0;padding:0;background:#f5f3ef;color:#1b1b1b;font-family:Arial,Helvetica,sans-serif">
<div style="display:none;max-height:0;overflow:hidden">{{ $lines[0] ?? $subject }}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 16px">
<tr><td align="center">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px">

{{-- Header --}}
<tr><td style="background:#ffffff;border:1px solid #ded8d0;border-bottom:3px solid #1b1b1b;padding:24px 32px" align="center">
<img src="{{ url('/logo.svg') }}" alt="{{ config('app.name', 'Lurus Store') }}" width="130" style="display:block;height:auto;border:0">
</td></tr>

{{-- Body --}}
<tr><td style="background:#ffffff;border:1px solid #ded8d0;border-top:0;padding:32px">

<h1 style="margin:0 0 8px;font-size:22px;line-height:1.3">{{ $title }}</h1>
<p style="margin:0 0 20px;line-height:1.6;color:#444">Hi <strong>{{ $name }}</strong>,</p>
@foreach ($lines as $line)
<p style="margin:0 0 10px;line-height:1.6;color:#444">{{ $line }}</p>
@endforeach

{{-- Order summary --}}
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0 0;background:#faf8f5;border:1px solid #eee6da">
<tr><td style="padding:16px 20px">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:13px;line-height:1.8">
<tr>
<td style="color:#888">Order No.</td>
<td align="right" style="font-weight:bold">{{ $order->order_number }}</td>
</tr>
<tr>
<td style="color:#888">Date</td>
<td align="right">{{ $order->created_at?->timezone(config('app.timezone'))->format('d M Y, H:i') }}</td>
</tr>
<tr>
<td style="color:#888">Status</td>
<td align="right"><span style="display:inline-block;padding:2px 10px;background:#1b1b1b;color:#fff;font-size:12px;border-radius:10px">{{ $statusLabels[$order->status] ?? ucfirst($order->status) }}</span></td>
</tr>
@if ($order->payment_method)
<tr>
<td style="color:#888">Payment Method</td>
<td align="right">{{ $paymentLabels[$order->payment_method] ?? ucfirst($order->payment_method) }}</td>
</tr>
@endif
@if ($order->waybill_id)
<tr>
<td style="color:#888">Tracking No.</td>
<td align="right" style="font-weight:bold">{{ $order->waybill_id }}</td>
</tr>
@endif
</table>
</td></tr>
</table>

{{-- Order items --}}
@if ($order->items->isNotEmpty())
<h2 style="margin:28px 0 12px;font-size:15px;text-transform:uppercase;letter-spacing:1px">Order Details</h2>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:13px;border-collapse:collapse">
<tr>
<td style="padding:8px 0;border-bottom:2px solid #1b1b1b;color:#888;text-transform:uppercase;font-size:11px;letter-spacing:1px">Product</td>
<td align="center" style="padding:8px;border-bottom:2px solid #1b1b1b;color:#888;text-transform:uppercase;font-size:11px;letter-spacing:1px">Qty</td>
<td align="right" style="padding:8px 0;border-bottom:2px solid #1b1b1b;color:#888;text-transform:uppercase;font-size:11px;letter-spacing:1px">Subtotal</td>
</tr>
@foreach ($order->items as $item)
<tr>
<td style="padding:12px 0;border-bottom:1px solid #eee6da">
<strong>{{ $item->product_name }}</strong>
@if ($item->size || $item->color)
<br><span style="color:#888;font-size:12px">{{ collect([$item->size ? 'Size: '.$item->size : null, $item->color ? 'Color: '.$item->color : null])->filter()->implode(' · ') }}</span>
@endif
<br><span style="color:#888;font-size:12px">{{ $rp($item->price) }}</span>
</td>
<td align="center" style="padding:12px 8px;border-bottom:1px solid #eee6da">{{ $item->quantity }}</td>
<td align="right" style="padding:12px 0;border-bottom:1px solid #eee6da;white-space:nowrap">{{ $rp($item->price * $item->quantity) }}</td>
</tr>
@endforeach
<tr>
<td colspan="2" style="padding:12px 0 4px;color:#888">Subtotal</td>
<td align="right" style="padding:12px 0 4px;white-space:nowrap">{{ $rp($order->subtotal) }}</td>
</tr>
<tr>
<td colspan="2" style="padding:4px 0;color:#888">Shipping</td>
<td align="right" style="padding:4px 0;white-space:nowrap">{{ $rp($order->shipping_cost) }}</td>
</tr>
<tr>
<td colspan="2" style="padding:10px 0;border-top:2px solid #1b1b1b;font-weight:bold;font-size:15px">Total</td>
<td align="right" style="padding:10px 0;border-top:2px solid #1b1b1b;font-weight:bold;font-size:15px;white-space:nowrap">{{ $rp($order->total_amount) }}</td>
</tr>
</table>
@endif

{{-- Shipping address --}}
@if (! empty($addr))
<h2 style="margin:28px 0 12px;font-size:15px;text-transform:uppercase;letter-spacing:1px">Shipping Address</h2>
<p style="margin:0;line-height:1.7;color:#444;font-size:13px">
<strong>{{ $addr['name'] ?? '' }}</strong>
@if (! empty($addr['phone'])) <br>{{ $addr['phone'] }} @endif
@if (! empty($addr['address'])) <br>{{ $addr['address'] }} @endif
<br>{{ collect([$addr['district'] ?? null, $addr['city'] ?? null, $addr['province'] ?? null, $addr['postal_code'] ?? null])->filter()->implode(', ') }}
</p>
@endif

{{-- Action button --}}
@if ($actionUrl)
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:28px 0 0">
<tr><td align="center">
<a href="{{ $actionUrl }}" style="display:inline-block;padding:14px 32px;background:#1b1b1b;color:#ffffff;text-decoration:none;font-size:14px;letter-spacing:1px;text-transform:uppercase">{{ $actionText }}</a>
</td></tr>
</table>
@endif

<p style="margin:28px 0 0;padding-top:20px;border-top:1px solid #eee6da;color:#888;line-height:1.6;font-size:13px">
Questions about this order? Reply to this email or contact us through the contact page. Include order number <strong>{{ $order->order_number }}</strong> so we can help you faster.
</p>
</td></tr>

{{-- Footer --}}
<tr><td style="padding:20px 32px" align="center">
<p style="margin:0;color:#999;font-size:12px;line-height:1.6">
&copy; {{ date('Y') }} {{ config('app.name', 'Lurus Store') }}. This email was sent automatically regarding order {{ $order->order_number }}.
</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>
