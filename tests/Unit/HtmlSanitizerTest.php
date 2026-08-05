<?php

namespace Tests\Unit;

use App\Support\Html;
use PHPUnit\Framework\TestCase;

class HtmlSanitizerTest extends TestCase
{
    public function test_strips_scripts_and_event_handlers(): void
    {
        $dirty = '<p onclick="alert(1)">Hi</p><script>alert(1)</script><img src=x onerror=alert(1)>';
        $this->assertSame('<p>Hi</p>alert(1)', Html::sanitize($dirty));
    }

    public function test_keeps_safe_links_and_drops_javascript_hrefs(): void
    {
        $this->assertStringContainsString(
            'href="https://example.com"',
            Html::sanitize('<a href="https://example.com">ok</a>'),
        );
        $this->assertStringNotContainsString(
            'javascript',
            Html::sanitize('<a href="javascript:alert(1)">bad</a>'),
        );
    }

    public function test_passes_through_null_and_plain_text(): void
    {
        $this->assertNull(Html::sanitize(null));
        $this->assertSame('<p>Hello <strong>world</strong></p>', Html::sanitize('<p>Hello <strong>world</strong></p>'));
    }
}
