import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'child_process';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import path from 'path';
import { defineConfig, type PluginOption } from 'vite';

function canRunWayfinder(): boolean {
    // Pre-generated actions/routes are committed; skip when PHP is unavailable (e.g. Vercel Node build).
    if (process.env.WAYFINDER_SKIP === '1' || process.env.VERCEL === '1') {
        return false;
    }

    try {
        execSync('php -v', { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

const plugins: PluginOption[] = [
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
];

if (canRunWayfinder()) {
    plugins.push(wayfinder({ formVariants: true }));
}

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
        },
    },
    plugins,
});
