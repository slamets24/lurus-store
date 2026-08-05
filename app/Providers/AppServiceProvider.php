<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use PDO;
use Pdo\Sqlite;
use SqliteVec\SqliteVec;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $storagePath = $_ENV['LARAVEL_STORAGE_PATH']
            ?? $_SERVER['LARAVEL_STORAGE_PATH']
            ?? getenv('LARAVEL_STORAGE_PATH')
            ?: null;

        if (is_string($storagePath) && $storagePath !== '') {
            $this->app->useStoragePath($storagePath);
        }

        $this->app->instance('sqlite-vec.available', false);
        $this->app->singleton('sqlite-vec.connection', fn () => null);
    }

    public function boot(): void
    {
        $this->configureDefaults();
        $this->loadVectorExtension();
    }

    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        if ($this->app->isProduction()) {
            URL::forceScheme('https');
        }

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }

    protected function loadVectorExtension(): void
    {
        if (DB::getDriverName() !== 'sqlite') {
            return;
        }

        try {
            $dbPath = config('database.connections.sqlite.database', database_path('database.sqlite'));

            if (! file_exists($dbPath)) {
                throw new \RuntimeException("Database file not found: {$dbPath}");
            }

            $vecDb = new Sqlite("sqlite:{$dbPath}");
            $vecDb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            SqliteVec::load($vecDb);

            $this->app->instance('sqlite-vec.available', true);
            $this->app->instance('sqlite-vec.connection', $vecDb);

            Log::info('sqlite-vec extension loaded: '.SqliteVec::vecVersion($vecDb));
        } catch (\Throwable $e) {
            $this->app->instance('sqlite-vec.available', false);
            Log::warning('sqlite-vec not available, using PHP fallback: '.$e->getMessage());
        }
    }
}
