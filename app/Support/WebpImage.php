<?php

namespace App\Support;

use GdImage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

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

    /**
     * Shrink the long edge to {@see MAX_EDGE}, then store a WebP on the public disk.
     */
    public static function store(UploadedFile $image, string $directory, string $errorKey = 'image'): string
    {
        if (! function_exists('imagewebp')) {
            throw ValidationException::withMessages([
                $errorKey => 'Server does not support WebP conversion.',
            ]);
        }

        $source = self::load($image);

        if (! $source) {
            throw ValidationException::withMessages([
                $errorKey => 'Unsupported image format.',
            ]);
        }

        imagepalettetotruecolor($source);
        imagealphablending($source, false);
        imagesavealpha($source, true);
        $source = self::constrain($source);

        $directory = trim($directory, '/');
        Storage::disk('public')->makeDirectory($directory);

        $path = $directory.'/'.Str::uuid().'.webp';
        $stored = imagewebp($source, Storage::disk('public')->path($path), 82);
        imagedestroy($source);

        if (! $stored) {
            throw ValidationException::withMessages([
                $errorKey => 'Failed to convert image to WebP.',
            ]);
        }

        return $path;
    }

    private static function load(UploadedFile $image): GdImage|false
    {
        $path = $image->getRealPath();

        if ($path === false) {
            return false;
        }

        $loaded = match ($image->getMimeType()) {
            'image/jpeg', 'image/jpg', 'image/pjpeg' => function_exists('imagecreatefromjpeg') ? imagecreatefromjpeg($path) : false,
            'image/png' => function_exists('imagecreatefrompng') ? imagecreatefrompng($path) : false,
            'image/webp' => function_exists('imagecreatefromwebp') ? imagecreatefromwebp($path) : false,
            default => false,
        };

        return $loaded instanceof GdImage ? $loaded : false;
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
