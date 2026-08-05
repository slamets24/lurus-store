<?php

namespace App\Support;

use GdImage;

final class WebpImage
{
    /** Match resources/js/lib/optimizeImageToWebp.ts DEFAULT_MAX_EDGE */
    public const MAX_EDGE = 2000;

    /** Card / gallery-thumb display size (CSS ~72–400px, 2x DPR). */
    public const THUMB_EDGE = 400;

    public static function constrain(GdImage $source, int $maxEdge = self::MAX_EDGE): GdImage
    {
        $width = imagesx($source);
        $height = imagesy($source);

        if ($width <= $maxEdge && $height <= $maxEdge) {
            return $source;
        }

        $scale = $maxEdge / max($width, $height);
        $newW = (int) round($width * $scale);
        $newH = (int) round($height * $scale);
        $resized = imagecreatetruecolor($newW, $newH);
        imagealphablending($resized, false);
        imagesavealpha($resized, true);
        imagecopyresampled($resized, $source, 0, 0, 0, 0, $newW, $newH, $width, $height);
        imagedestroy($source);

        return $resized;
    }

    /** Write a WebP thumb next to the source; returns false if GD/source unavailable. */
    public static function writeThumb(string $sourcePath, string $destPath, int $maxEdge = self::THUMB_EDGE, int $quality = 78): bool
    {
        if (! function_exists('imagecreatefromwebp') || ! function_exists('imagewebp') || ! is_file($sourcePath)) {
            return false;
        }

        $source = @imagecreatefromwebp($sourcePath);
        if (! $source) {
            return false;
        }

        imagepalettetotruecolor($source);
        imagealphablending($source, false);
        imagesavealpha($source, true);
        $thumb = self::constrain($source, $maxEdge);

        $dir = dirname($destPath);
        if (! is_dir($dir) && ! mkdir($dir, 0755, true) && ! is_dir($dir)) {
            imagedestroy($thumb);

            return false;
        }

        $ok = imagewebp($thumb, $destPath, $quality);
        imagedestroy($thumb);

        return (bool) $ok;
    }
}
