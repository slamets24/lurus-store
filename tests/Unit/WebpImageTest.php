<?php

namespace Tests\Unit;

use App\Support\WebpImage;
use PHPUnit\Framework\TestCase;

class WebpImageTest extends TestCase
{
    public function test_constrain_shrinks_long_edge_to_max(): void
    {
        $source = imagecreatetruecolor(3000, 1500);
        $result = WebpImage::constrain($source, 2000);

        $this->assertSame(2000, imagesx($result));
        $this->assertSame(1000, imagesy($result));
        imagedestroy($result);
    }

    public function test_constrain_leaves_small_images_alone(): void
    {
        $source = imagecreatetruecolor(800, 600);
        $result = WebpImage::constrain($source, 2000);

        $this->assertSame(800, imagesx($result));
        $this->assertSame(600, imagesy($result));
        imagedestroy($result);
    }

    public function test_write_thumb_creates_smaller_webp(): void
    {
        $dir = sys_get_temp_dir().'/webp-thumb-'.uniqid();
        mkdir($dir);
        $sourcePath = $dir.'/source.webp';
        $thumbPath = $dir.'/thumb.webp';

        $source = imagecreatetruecolor(1200, 1500);
        imagewebp($source, $sourcePath, 82);
        imagedestroy($source);

        $this->assertTrue(WebpImage::writeThumb($sourcePath, $thumbPath, 400));
        $this->assertFileExists($thumbPath);

        $thumb = imagecreatefromwebp($thumbPath);
        $this->assertNotFalse($thumb);
        $this->assertSame(400, max(imagesx($thumb), imagesy($thumb)));
        $this->assertSame(320, min(imagesx($thumb), imagesy($thumb)));
        imagedestroy($thumb);

        @unlink($sourcePath);
        @unlink($thumbPath);
        @rmdir($dir);
    }
}
