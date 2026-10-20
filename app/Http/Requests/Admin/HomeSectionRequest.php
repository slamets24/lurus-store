<?php

namespace App\Http\Requests\Admin;

use App\Support\HomeSections;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class HomeSectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $messages = $this->input('messages');

        if (is_string($messages)) {
            $messages = preg_split('/\r\n|\r|\n/', $messages) ?: [];
        }

        $this->merge([
            'is_active' => $this->boolean('is_active'),
            'messages' => is_array($messages)
                ? array_values(array_filter(array_map(fn ($message) => trim((string) $message), $messages)))
                : [],
            'faqs' => collect($this->input('faqs', []))
                ->filter(fn ($faq) => is_array($faq) && filled($faq['question'] ?? null))
                ->map(fn ($faq) => [
                    'question' => trim((string) $faq['question']),
                    'answer' => trim((string) ($faq['answer'] ?? '')),
                ])
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
            'type' => ['required', Rule::in(array_keys(HomeSections::types()))],
            'title' => ['nullable', 'string', 'max:160'],
            'subtitle' => ['nullable', 'string', 'max:300'],
            'content' => ['nullable', 'string', 'max:2000'],
            'image_path' => ['nullable', 'string', 'max:500'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:8192'],
            'link_url' => ['nullable', 'string', 'max:300'],
            'button_label' => ['nullable', 'string', 'max:40'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:999'],
            'is_active' => ['boolean'],
            'messages' => ['array'],
            'messages.*' => ['string', 'max:180'],
            'source' => ['nullable', Rule::in(['latest', 'featured', 'manual', 'category'])],
            'limit' => ['nullable', 'integer', 'min:1', 'max:24'],
            'faqs' => ['array'],
            'faqs.*.question' => ['required', 'string', 'max:200'],
            'faqs.*.answer' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    public function sectionConfig(): ?array
    {
        return match ($this->string('type')->toString()) {
            'announcement' => ['messages' => $this->input('messages', [])],
            'product_rail' => [
                'source' => $this->input('source', 'latest'),
                'limit' => (int) ($this->input('limit') ?: 8),
            ],
            'faq' => ['items' => $this->input('faqs', [])],
            default => null,
        };
    }
}
