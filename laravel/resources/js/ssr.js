import 'govuk-frontend/dist/govuk/govuk-frontend.min.css';
import '../css/app.css';

import createServer from '@inertiajs/vue3/server';
import createInertiaApp from '@inertiajs/vue3';
import { renderToString } from '@vue/server-renderer';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createSSRApp, h } from 'vue';
import { GovUkVue } from 'govuk-vue';
import { ZiggyVue } from '../../vendor/tightenco/ziggy';

const appName = import.meta.env.VITE_APP_NAME || 'BikesList';

createServer(async (page) => {
    return await createInertiaApp({
        page,
        title: (title) =>
            title && title.includes(appName)
                ? title
                : title
                  ? `${title} - ${appName}`
                  : appName,
        render: renderToString,
        resolve: (name) =>
            resolvePageComponent(
                `./Pages/${name}.vue`,
                import.meta.glob('./Pages/**/*.vue'),
            ),
        setup({ App, props, plugin }) {
            return createSSRApp({ render: () => h(App, props) })
                .use(plugin)
                .use(GovUkVue)
                .use(ZiggyVue);
        },
    });
});
