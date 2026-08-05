<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class EmbeddingService
{
    protected string $endpoint;

    protected ?string $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.huggingface.key');
        $this->endpoint = config('services.huggingface.embedding_endpoint');
    }

    public function generateEmbedding(string $text): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => $this->apiKey ? "Bearer {$this->apiKey}" : '',
            ])->post($this->endpoint, [
                'inputs' => [$text],
                'options' => ['wait_for_model' => true],
            ]);

            if ($response->failed()) {
                Log::warning('HuggingFace API failed: '.$response->body());

                return $this->fallbackEmbedding($text);
            }

            $data = $response->json();

            return $data[0] ?? $this->fallbackEmbedding($text);
        } catch (\Exception $e) {
            Log::warning('HuggingFace API error: '.$e->getMessage());

            return $this->fallbackEmbedding($text);
        }
    }

    public function generateEmbeddings(array $texts): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => $this->apiKey ? "Bearer {$this->apiKey}" : '',
            ])->post($this->endpoint, [
                'inputs' => $texts,
                'options' => ['wait_for_model' => true],
            ]);

            if ($response->failed()) {
                Log::warning('HuggingFace API batch failed: '.$response->body());

                return array_map(fn ($t) => $this->fallbackEmbedding($t), $texts);
            }

            return $response->json() ?? array_map(fn ($t) => $this->fallbackEmbedding($t), $texts);
        } catch (\Exception $e) {
            Log::warning('HuggingFace API batch error: '.$e->getMessage());

            return array_map(fn ($t) => $this->fallbackEmbedding($t), $texts);
        }
    }

    public function fallbackEmbedding(string $text): array
    {
        $hash = md5($text);
        $vector = [];
        for ($i = 0; $i < 384; $i++) {
            $vector[] = (float) (hexdec(substr($hash, $i % 32, 2)) / 255.0 - 0.5);
        }
        $norm = sqrt(array_sum(array_map(fn ($v) => $v * $v, $vector)));

        return array_map(fn ($v) => $v / $norm, $vector);
    }
}
