<?php

namespace App\Http\Requests;

use App\Models\StoreContentSetting;
use App\Support\ContactRules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class CheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'email' => strtolower(trim((string) $this->input('email'))),
            'phone' => ContactRules::normalizePhone($this->input('phone')),
        ]);
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        $settings = StoreContentSetting::paymentSettings();
        $methods = $settings['enabled'] ? $settings['methods'] : StoreContentSetting::PAYMENT_METHODS;

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', ContactRules::email(), 'max:255'],
            'phone' => ['required', 'string', 'regex:'.ContactRules::PHONE_REGEX],
            // Honeypot: hidden field real users never fill in.
            'website' => ['prohibited'],
            'address' => ['required', 'string', 'max:1000'],
            'province' => ['required', 'string', 'max:100'],
            'city' => ['required', 'string', 'max:255'],
            'district' => ['required', 'string', 'max:255'],
            'postal_code' => ['required', 'string', 'regex:/^\d{5}$/'],
            'shipping_courier' => ['nullable', 'string', 'max:50'],
            'shipping_service' => ['nullable', 'string', 'max:50'],
            'payment_method' => ['required', Rule::in($methods)],
            'midtrans_channel' => [
                'nullable',
                'required_if:payment_method,midtrans',
                Rule::in($settings['midtrans_channels']),
            ],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'email.email' => ContactRules::EMAIL_MESSAGE,
            'phone.regex' => ContactRules::PHONE_MESSAGE,
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            if (! StoreContentSetting::paymentSettings()['enabled']) {
                $validator->errors()->add('payment_method', 'Pembayaran sedang dinonaktifkan sementara.');
            }
        });
    }
}
