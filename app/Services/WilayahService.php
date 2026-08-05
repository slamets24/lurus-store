<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class WilayahService
{
    private const SOURCE = 'https://emsifa.github.io/api-wilayah-indonesia/api';

    /**
     * @return list<array{id: string, name: string}>
     */
    public function provinces(): array
    {
        return Cache::remember('wilayah.provinces', now()->addWeek(), function () {
            $path = resource_path('data/wilayah/provinces.json');
            $rows = is_file($path)
                ? json_decode((string) file_get_contents($path), true)
                : Http::timeout(10)->acceptJson()->get(self::SOURCE.'/provinces.json')->json();

            return $this->mapRows(is_array($rows) ? $rows : []);
        });
    }

    /**
     * @return list<array{id: string, name: string}>
     */
    public function cities(string $provinceId): array
    {
        $provinceId = preg_replace('/\D+/', '', $provinceId) ?? '';

        if ($provinceId === '') {
            return [];
        }

        // ponytail: 1w cache from static wilayah host; swap to local JSON dump if that host dies
        return Cache::remember("wilayah.cities.{$provinceId}", now()->addWeek(), function () use ($provinceId) {
            $rows = Http::timeout(10)
                ->acceptJson()
                ->get(self::SOURCE."/regencies/{$provinceId}.json")
                ->json();

            return $this->mapRows(is_array($rows) ? $rows : []);
        });
    }

    /**
     * @return list<array{id: string, name: string}>
     */
    public function districts(string $cityId): array
    {
        $cityId = preg_replace('/\D+/', '', $cityId) ?? '';

        if ($cityId === '') {
            return [];
        }

        return Cache::remember("wilayah.districts.{$cityId}", now()->addWeek(), function () use ($cityId) {
            $rows = Http::timeout(10)
                ->acceptJson()
                ->get(self::SOURCE."/districts/{$cityId}.json")
                ->json();

            return $this->mapRows(is_array($rows) ? $rows : []);
        });
    }

    /**
     * @param  list<mixed>  $rows
     * @return list<array{id: string, name: string}>
     */
    private function mapRows(array $rows): array
    {
        return collect($rows)
            ->filter(fn ($row) => is_array($row) && isset($row['id'], $row['name']))
            ->map(fn (array $row) => [
                'id' => (string) $row['id'],
                'name' => Str::title(mb_strtolower((string) $row['name'])),
            ])
            ->values()
            ->all();
    }
}
