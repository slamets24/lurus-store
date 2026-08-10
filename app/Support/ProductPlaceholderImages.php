<?php

namespace App\Support;

final class ProductPlaceholderImages
{
    /** @return list<string> Public URL paths under /images/productplaceholder */
    public static function paths(): array
    {
        $dir = public_path('images/productplaceholder');
        if (! is_dir($dir)) {
            return [];
        }

        $paths = [];
        foreach (scandir($dir) ?: [] as $file) {
            if (preg_match('/\.(webp|jpe?g|png)$/i', $file)) {
                $paths[] = '/images/productplaceholder/'.$file;
            }
        }

        sort($paths);

        return $paths;
    }

    /** @return list<string> */
    public static function forProduct(int $productId, int $count = 2): array
    {
        $paths = self::paths();
        if ($paths === [] || $count < 1) {
            return [];
        }

        $picked = [];
        $start = ($productId - 1) % count($paths);

        for ($i = 0; $i < $count; $i++) {
            $picked[] = $paths[($start + $i) % count($paths)];
        }

        return $picked;
    }
}
