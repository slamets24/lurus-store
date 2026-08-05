import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
        },
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
            fonts: [
                bunny('Manrope', {
                    weights: [400, 500, 600, 700],
                    preload: [{ weight: 400 }, { weight: 600 }],
                }),
                bunny('Libre Caslon Text', {
                    weights: [400, 700],
                    styles: ['normal'],
                    preload: [{ weight: 400 }],
                }),
            ],
        }),
        inertia({ ssr: { enabled: false } }),
        tailwindcss(),
        react(),
        wayfinder({ formVariants: true }),
    ],
});
