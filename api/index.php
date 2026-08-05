<?php

/**
 * Vercel serverless entry — same pattern as sweing-pay.
 * Writable Laravel paths live under /tmp (read-only FS except /tmp).
 */

$tmpRoot = '/tmp/lurus-store';

foreach ([
    $tmpRoot.'/storage/app/public',
    $tmpRoot.'/storage/app/private',
    $tmpRoot.'/storage/framework/cache/data',
    $tmpRoot.'/storage/framework/sessions',
    $tmpRoot.'/storage/framework/views',
    $tmpRoot.'/storage/logs',
    $tmpRoot.'/bootstrap/cache',
] as $dir) {
    if (! is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}

$_ENV['LARAVEL_STORAGE_PATH'] = $tmpRoot.'/storage';
$_SERVER['LARAVEL_STORAGE_PATH'] = $tmpRoot.'/storage';
putenv('LARAVEL_STORAGE_PATH='.$tmpRoot.'/storage');

require __DIR__.'/../public/index.php';
