<?php

namespace App\Http\Controllers;

use App\Services\BiteshipService;
use Illuminate\Http\Request;

class BiteshipWebhookController extends Controller
{
    public function __invoke(Request $request, BiteshipService $biteship)
    {
        $payload = $request->all();

        // Biteship installation ping sends empty JSON — must 200 before secret validation.
        if ($payload === []) {
            return response()->json(['ok' => true]);
        }

        $header = (string) config('services.biteship.webhook_header', 'X-Biteship-Secret');
        $biteship->assertWebhookSecret($request->header($header));
        $biteship->handleWebhook($payload);

        return response()->json(['received' => true]);
    }
}
