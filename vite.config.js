import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import lucidePreprocess from 'vite-plugin-lucide-preprocess';
import adapter from '@sveltejs/adapter-static';
import { heyApiPlugin } from '@hey-api/vite-plugin';

// @ts-expect-error type error without @types/node package
import process from 'node:process';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const host = process.env.TAURI_DEV_HOST;

export default defineConfig(() => ({
    plugins: [
        tailwindcss(),
        sveltekit({
            preprocess: vitePreprocess(),
            adapter: adapter({ fallback: 'index.html' }),
        }),
        lucidePreprocess(),
        heyApiPlugin({
            config: {
                input: 'https://api.mywayline.com/api/api-docs',
                output: 'src/lib/api/generated',
                runtimeConfigPath: './src/lib/config/hey-api-config.ts',
            },
            vite: {
                apply: 'serve',
            },
        }),
    ],

    clearScreen: false,
    server: {
        port: 1420,
        strictPort: true,
        host: host || '127.0.0.1',
        hmr: host ? { protocol: 'ws', host, port: 1421 } : undefined,
        watch: {
            ignored: ['**/src-tauri/**'],
        },
    },
}));
