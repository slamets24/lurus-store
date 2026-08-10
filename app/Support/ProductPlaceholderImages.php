<?php

namespace App\Support;

final class ProductPlaceholderImages
{
    /** @var list<string> */
    private const FALLBACK = [
        '30__1.webp',
        'BLACK_1_b0684104-8f8c-4154-8390-48b3b81cf314.webp',
        'CALLA_4.webp',
        'Group_1_11cbc780-d062-48ab-8669-697a1315b614.webp',
        'Group_2_adbbc24f-4dd4-456d-9972-95ee09c0c074.jpg',
        'IMGL7827.jpg',
        'IMGL7842.jpg',
        'IMGL9007.webp',
        'IMGL9014.webp',
        'SIUNSET1.webp',
        'SIUNSET4.webp',
        'SIUNSET5.webp',
        'ZIYYA_MOCCA_2.webp',
        'ZIYYA_MOCCA_3.webp',
    ];

    /** @return list<string> Public URL paths under /images/productplaceholder */
    public static function paths(): array
    {
        $dir = public_path('images/productplaceholder');
        $files = [];

        if (is_dir($dir)) {
            foreach (scandir($dir) ?: [] as $file) {
                if ($file === 'hero.jpg' || $file === 'hero.webp' || $file === 'hero.png') {
                    continue;
                }
                if (preg_match('/\.(webp|jpe?g|png)$/i', $file)) {
                    $files[] = $file;
                }
            }
            sort($files);
        }

        if ($files === []) {
            $files = self::FALLBACK;
        }

        return array_values(array_map(
            fn (string $file) => '/images/productplaceholder/'.$file,
            $files,
        ));
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
