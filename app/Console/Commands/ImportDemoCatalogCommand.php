<?php

namespace App\Console\Commands;

use App\Support\DemoCatalogImporter;
use Illuminate\Console\Command;

class ImportDemoCatalogCommand extends Command
{
    protected $signature = 'demo:import-catalog {--force : Import even when products already exist}';

    protected $description = 'Import demo catalog from database/fixtures/demo-catalog.json';

    public function handle(DemoCatalogImporter $importer): int
    {
        $imported = $importer->import(force: (bool) $this->option('force'));

        if (! $imported) {
            $this->warn('Skipped: products already exist. Use --force to re-import.');

            return self::SUCCESS;
        }

        $this->info('Demo catalog imported successfully.');

        return self::SUCCESS;
    }
}
