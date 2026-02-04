<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityNav from '@/Components/CityNav.vue';

const props = defineProps({
    city: { type: Object, required: true },
    moderatedCities: { type: Array, default: () => [] },
    cityBaseUrl: { type: String, required: true },
    homeUrl: { type: String, default: '/' },
});

function cityModUrl(slug) {
    const host = typeof window !== 'undefined' ? window.location.host : '';
    const protocol = typeof window !== 'undefined' ? window.location.protocol : 'https:';
    const port = typeof window !== 'undefined' && window.location.port ? ':' + window.location.port : '';
    return `${protocol}//${slug}.${host}${port}/moderation`;
}
</script>

<template>
    <Head :title="`Moderation – ${city.name}`" />
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <CityNav :city="city" :city-base-url="cityBaseUrl" breadcrumb="Moderation">
            <template #nav-right>
                <select
                    v-if="moderatedCities.length > 1"
                    class="rounded border-gray-300 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    :value="city.slug"
                    @change="(e) => window.location.href = cityModUrl(e.target.value)"
                >
                    <option v-for="c in moderatedCities" :key="c.id" :value="c.slug">{{ c.name }}</option>
                </select>
                <a :href="cityBaseUrl" class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Back to city</a>
            </template>
        </CityNav>
        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Moderation</h1>
            <p class="mt-2 text-gray-600 dark:text-gray-400">Review and approve or remove pending content.</p>
            <nav class="mt-6 flex gap-4">
                <Link :href="`${cityBaseUrl}/moderation/listings`" class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Listings queue</Link>
                <Link :href="`${cityBaseUrl}/moderation/events`" class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Events queue</Link>
                <Link :href="`${cityBaseUrl}/moderation/pages`" class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Pages queue</Link>
            </nav>
        </main>
    </div>
</template>
