import path from 'path';
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';

/** Fix GOV.UK Frontend: patch invalid CSS and copy assets so /assets/* resolve at runtime */
function govukFrontendPlugin() {
    let rootDir;
    return {
        name: 'govuk-frontend',
        configResolved(config) {
            rootDir = config.root;
        },
        transform(code, id) {
            if (id.includes('govuk-frontend') && id.endsWith('.css')) {
                return {
                    code: code.replace(/screen\\0\s+and/g, 'screen and'),
                    map: null,
                };
            }
        },
        async closeBundle() {
            if (!rootDir) return;
            const { cpSync } = await import('fs');
            const src = path.resolve(rootDir, 'node_modules/govuk-frontend/dist/govuk/assets');
            const dest = path.resolve(rootDir, 'public/assets');
            try {
                cpSync(src, dest, { recursive: true });
            } catch (e) {
                console.warn('govuk-frontend: could not copy assets to public/assets:', e.message);
            }
        },
    };
}

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.js',
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        govukFrontendPlugin(),
    ],
});
