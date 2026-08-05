<?php

namespace App\Console\Commands;

use App\Support\StorefrontSitemap;
use Illuminate\Console\Command;

class GenerateSitemap extends Command
{
    protected $signature = 'sitemap:generate';

    protected $description = 'Generate the public storefront sitemap.xml';

    public function handle(): int
    {
        StorefrontSitemap::write();

        $this->info('Sitemap written to '.StorefrontSitemap::path());

        return self::SUCCESS;
    }
}
