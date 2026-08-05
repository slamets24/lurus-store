<?php

$midtransProduction = filter_var(env('MIDTRANS_IS_PRODUCTION', false), FILTER_VALIDATE_BOOLEAN);

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Resend, Postmark, AWS, and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'huggingface' => [
        'key' => env('HUGGINGFACE_API_KEY'),
        'embedding_endpoint' => env('HUGGINGFACE_EMBEDDING_ENDPOINT', 'https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2'),
    ],

    'midtrans' => [
        'server_key' => env('MIDTRANS_SERVER_KEY'),
        'client_key' => env('MIDTRANS_CLIENT_KEY'),
        'is_production' => $midtransProduction,
        'snap_url' => env('MIDTRANS_SNAP_URL') ?: (
            $midtransProduction
                ? 'https://app.midtrans.com/snap/v1/transactions'
                : 'https://app.sandbox.midtrans.com/snap/v1/transactions'
        ),
        'snap_js_url' => $midtransProduction
            ? 'https://app.midtrans.com/snap/snap.js'
            : 'https://app.sandbox.midtrans.com/snap/snap.js',
        'status_url' => $midtransProduction
            ? 'https://api.midtrans.com/v2'
            : 'https://api.sandbox.midtrans.com/v2',
    ],

    'biteship' => [
        'api_key' => env('BITESHIP_API_KEY'),
        'base_url' => env('BITESHIP_BASE_URL', 'https://api.biteship.com'),
        'origin_postal_code' => env('BITESHIP_ORIGIN_POSTAL_CODE'),
        'origin_contact_name' => env('BITESHIP_ORIGIN_CONTACT_NAME', 'Lurus Store'),
        'origin_contact_phone' => env('BITESHIP_ORIGIN_CONTACT_PHONE'),
        'origin_address' => env('BITESHIP_ORIGIN_ADDRESS'),
        'couriers' => env('BITESHIP_COURIERS', 'jne,sicepat,anteraja'),
        'fallback_shipping_cost' => (int) env('BITESHIP_FALLBACK_SHIPPING_COST', 25000),
        'free_shipping_threshold' => (int) env('BITESHIP_FREE_SHIPPING_THRESHOLD', 500000),
        'item_weight_grams' => (int) env('BITESHIP_ITEM_WEIGHT_GRAMS', 300),
        'item_length_cm' => (int) env('BITESHIP_ITEM_LENGTH_CM', 25),
        'item_width_cm' => (int) env('BITESHIP_ITEM_WIDTH_CM', 20),
        'item_height_cm' => (int) env('BITESHIP_ITEM_HEIGHT_CM', 3),
        'webhook_header' => env('BITESHIP_WEBHOOK_HEADER', 'X-Biteship-Secret'),
        'webhook_secret' => env('BITESHIP_WEBHOOK_SECRET'),
        // ponytail: local UI/flow testing when Bitepoints empty; real rates need top-up even in sandbox
        'fake_rates' => (bool) env('BITESHIP_FAKE_RATES', false),
    ],

    'bank_transfer' => [
        'bank' => env('BANK_TRANSFER_BANK', 'BCA'),
        'account_number' => env('BANK_TRANSFER_ACCOUNT_NUMBER'),
        'account_name' => env('BANK_TRANSFER_ACCOUNT_NAME', 'Lurus Store'),
    ],

    'contact' => [
        'to' => env('CONTACT_TO_EMAIL', env('MAIL_FROM_ADDRESS')),
    ],

    /*
    | Google Tag (GA4 / Ads) + Search Console.
    | Tag measures site/ads; GSC verifies ownership for organic search.
    | Link GA4 ↔ Search Console in Google's UI after both IDs are set.
    */
    'google' => [
        'tag_id' => env('GOOGLE_TAG_ID'),
        'ads_id' => env('GOOGLE_ADS_ID'),
        'ads_purchase_label' => env('GOOGLE_ADS_PURCHASE_LABEL'),
        'site_verification' => env('GOOGLE_SITE_VERIFICATION'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

];
