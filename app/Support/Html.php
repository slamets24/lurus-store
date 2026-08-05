<?php

namespace App\Support;

class Html
{
    private const ALLOWED_TAGS = '<p><br><strong><b><em><i><u><s><ul><ol><li><a><h1><h2><h3><h4><blockquote><span>';

    /**
     * Sanitize rich-text HTML (Quill output) before storing.
     *
     * ponytail: allowlist strip_tags + attribute stripping, not a full HTML parser.
     * Upgrade path: symfony/html-sanitizer if admins ever need richer markup.
     */
    public static function sanitize(?string $html): ?string
    {
        if ($html === null || $html === '') {
            return $html;
        }

        $html = strip_tags($html, self::ALLOWED_TAGS);
        $html = str_replace("\0", '', $html);

        // Rebuild <a> keeping only a safe href; drop javascript: and friends.
        $html = preg_replace_callback('/<a\b[^>]*>/i', function (array $m): string {
            if (preg_match('/href\s*=\s*(["\'])(.*?)\1/is', $m[0], $href)
                && preg_match('#^(https?://|/(?!/)|mailto:)#i', trim($href[2]))) {
                return '<a href="'.htmlspecialchars(trim($href[2]), ENT_QUOTES).'" rel="noopener noreferrer" target="_blank">';
            }

            return '<a>';
        }, $html);

        // Strip all attributes (onclick, style, etc.) from every other tag.
        return preg_replace('/<(?!a\b)([a-z0-9]+)\b[^>]*>/i', '<$1>', $html);
    }
}
