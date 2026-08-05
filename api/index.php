<?php

/**
 * Vercel serverless entry — forwards all requests to Laravel's public/index.php.
 *
 * The Vercel filesystem is read-only except /tmp, so writable Laravel paths
 * are redirected there before the framework boots.
 */

$tmpRoot = '/tmp/lurus-store';

$writableDirs = [
    $tmpRoot.'/storage/app/public',
    $tmpRoot.'/storage/app/private',
    $tmpRoot.'/storage/framework/cache/data',
    $tmpRoot.'/storage/framework/sessions',
    $tmpRoot.'/storage/framework/views',
    $tmpRoot.'/storage/logs',
    $tmpRoot.'/bootstrap/cache',
];

foreach ($writableDirs as $dir) {
    if (! is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}

$_ENV['LARAVEL_STORAGE_PATH'] = $tmpRoot.'/storage';
$_SERVER['LARAVEL_STORAGE_PATH'] = $tmpRoot.'/storage';
putenv('LARAVEL_STORAGE_PATH='.$tmpRoot.'/storage');

require __DIR__.'/../public/index.php';
