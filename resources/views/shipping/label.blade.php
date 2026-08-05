<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Label {{ $waybill }} — {{ $order->order_number }}</title>
    <style>
        @page { size: 100mm 150mm; margin: 0; }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            color: #111;
            background: #e8e8e8;
        }
        .sheet {
            width: 100mm;
            min-height: 150mm;
            margin: 12px auto;
            background: #fff;
            border: 1px solid #222;
            padding: 4mm;
        }
        .row { display: flex; gap: 3mm; }
        .col { flex: 1; }
        .bar {
            border: 2px solid #111;
            padding: 2.5mm;
            margin-bottom: 2.5mm;
        }
        .courier {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 2mm;
        }
        .courier-name {
            font-size: 16px;
            font-weight: 800;
            letter-spacing: 0.04em;
            text-transform: uppercase;
        }
        .service {
            font-size: 11px;
            font-weight: 700;
            margin-top: 1mm;
        }
        .routing {
            font-size: 10px;
            text-align: right;
            line-height: 1.3;
        }
        .waybill-title {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-bottom: 1.5mm;
        }
        .waybill {
            font-size: 18px;
            font-weight: 800;
            letter-spacing: 0.08em;
            text-align: center;
        }
        #barcode {
            display: block;
            margin: 2mm auto 0;
            max-width: 100%;
            height: 42px;
        }
        .section-title {
            font-size: 8px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            border-bottom: 1px solid #111;
            padding-bottom: 1mm;
            margin-bottom: 2mm;
        }
        .name { font-size: 12px; font-weight: 800; }
        .meta { font-size: 10px; line-height: 1.35; margin-top: 1mm; }
        .pkg { font-size: 10px; line-height: 1.4; }
        .note {
            font-size: 9px;
            margin-top: 2mm;
            border-top: 1px dashed #666;
            padding-top: 2mm;
        }
        .footer {
            margin-top: 2.5mm;
            font-size: 8px;
            display: flex;
            justify-content: space-between;
            color: #444;
        }
        .actions {
            max-width: 100mm;
            margin: 12px auto 0;
            display: flex;
            gap: 8px;
            justify-content: center;
        }
        .actions button, .actions a {
            font: inherit;
            font-size: 12px;
            padding: 8px 14px;
            border: 1px solid #111;
            background: #111;
            color: #fff;
            text-decoration: none;
            cursor: pointer;
        }
        .actions a.secondary { background: #fff; color: #111; }
        @media print {
            body { background: #fff; }
            .sheet { margin: 0; border: 0; width: 100%; min-height: auto; }
            .actions { display: none !important; }
        }
    </style>
</head>
<body>
    <div class="actions">
        <button type="button" onclick="window.print()">Print Label</button>
        <a class="secondary" href="{{ route('admin.orders.show', $order) }}">Back</a>
    </div>

    <div class="sheet">
        <div class="bar courier">
            <div>
                <div class="courier-name">{{ $courierName }}</div>
                <div class="service">{{ $serviceName }}</div>
            </div>
            <div class="routing">
                @if ($routingCode)
                    <div>Routing</div>
                    <div><strong>{{ $routingCode }}</strong></div>
                @endif
                <div style="margin-top:1mm">Ref: {{ $order->order_number }}</div>
            </div>
        </div>

        <div class="bar">
            <div class="waybill-title">Tracking Number / Waybill</div>
            <div class="waybill">{{ $waybill }}</div>
            <svg id="barcode"></svg>
        </div>

        <div class="row" style="margin-bottom:2.5mm">
            <div class="col bar">
                <div class="section-title">Sender</div>
                <div class="name">{{ $senderName }}</div>
                <div class="meta">
                    {{ $senderPhone }}<br>
                    {{ $senderAddress }}
                </div>
            </div>
            <div class="col bar">
                <div class="section-title">Recipient</div>
                <div class="name">{{ $recipientName }}</div>
                <div class="meta">
                    {{ $recipientPhone }}<br>
                    {{ $recipientAddress }}<br>
                    {{ $recipientCity }} {{ $recipientPostal }}
                </div>
            </div>
        </div>

        <div class="bar">
            <div class="section-title">Package</div>
            <div class="pkg">
                Weight: {{ $weightGrams }} g ·
                Dimensions: {{ $lengthCm }}×{{ $widthCm }}×{{ $heightCm }} cm ·
                Service: {{ $serviceName }}
            </div>
            @if ($itemsSummary !== '')
                <div class="pkg" style="margin-top:1.5mm">Contents: {{ $itemsSummary }}</div>
            @endif
            @if ($notes !== '')
                <div class="note"><strong>Notes:</strong> {{ $notes }}</div>
            @endif
        </div>

        <div class="footer">
            <span>{{ config('app.name', 'Lurus Store') }} Shipping Label</span>
            <span>Field layout follows Biteship standards</span>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"></script>
    <script>
        try {
            JsBarcode('#barcode', @json($waybill), {
                format: 'CODE128',
                displayValue: false,
                margin: 0,
                height: 42,
                width: 1.4,
            });
        } catch (e) {}
    </script>
</body>
</html>
