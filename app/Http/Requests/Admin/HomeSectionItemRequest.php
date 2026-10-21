<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class HomeSectionItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $ids = $this->input('product_ids', []);

        if (is_string($ids)) {
            $ids = preg_split('/\s*,\s*/', $ids) ?: [];
        }

        $this->merge([
            'is_active' => $this->boolean('is_active'),
            'product_id' => $this->filled('product_id') ? $this->integer('product_id') : null,
            'category_id' => $this->filled('category_id') ? $this->integer('category_id') : null,
            'product_ids' => collect(is_array($ids) ? $ids : [])
                ->map(fn ($id) => (int) $id)
                ->filter()
                ->values()
                ->all(),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'item_type' => ['required', Rule::in(['slide', 'tile', 'tab', 'product'])],
            'product_id' => ['nullable', 'integer', 'exists:products,id'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'title' => ['nullable', 'string', 'max:160'],
            'subtitle' => ['nullable', 'string', 'max:300'],
            'image_path' => ['nullable', 'string', 'max:500'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:8192'],
            'mobile_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:8192'],
            'mobile_image_path' => ['nullable', 'string', 'max:500'],
            'link_url' => ['nullable', 'string', 'max:300'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:999'],
            'is_active' => ['boolean'],
            'source' => ['nullable', Rule::in(['latest', 'featured', 'manual', 'category'])],
            'limit' => ['nullable', 'integer', 'min:1', 'max:24'],
            'product_ids' => ['array'],
            'product_ids.*' => ['integer', 'exists:products,id'],
            'x' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'y' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'image.uploaded' => 'Foto gagal diunggah. Perkecil ukuran file lalu coba lagi.',
            'image.image' => 'File harus berupa foto JPG, PNG, atau WebP.',
            'image.mimes' => 'File harus berupa foto JPG, PNG, atau WebP.',
            'image.max' => 'Foto maksimal 8 MB.',
            'mobile_image.uploaded' => 'Foto mobile gagal diunggah. Perkecil ukuran file lalu coba lagi.',
            'mobile_image.image' => 'Foto mobile harus berupa JPG, PNG, atau WebP.',
            'mobile_image.mimes' => 'Foto mobile harus berupa JPG, PNG, atau WebP.',
            'mobile_image.max' => 'Foto mobile maksimal 8 MB.',
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    public function itemConfig(): ?array
    {
        return match ($this->string('item_type')->toString()) {
            'tab' => [
                'source' => $this->input('source', 'latest'),
                'limit' => (int) ($this->input('limit') ?: 8),
                'product_ids' => $this->input('product_ids', []),
            ],
            'slide' => [
                'x' => self::percent($this->input('x'), 50),
                'y' => self::percent($this->input('y'), 50),
            ],
            default => null,
        };
    }

    private static function percent(mixed $value, float $fallback): float
    {
        $number = is_numeric($value) ? (float) $value : $fallback;

        return round(min(100, max(0, $number)), 1);
    }
}
