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
    <div class="min-h-screen bg-page">
        <CityNav :city="city" :city-base-url="cityBaseUrl" breadcrumb="Moderation">
            <template #nav-right>
                <select
                    v-if="moderatedCities.length > 1"
                    class="rounded-token-md border border-border bg-input text-fg text-sm focus:border-focus focus:ring-focus"
                    :value="city.slug"
                    @change="(e) => window.location.href = cityModUrl(e.target.value)"
                >
                    <option v-for="c in moderatedCities" :key="c.id" :value="c.slug">{{ c.name }}</option>
                </select>
                <a :href="cityBaseUrl" class="text-sm text-muted hover:text-fg underline">Back to city</a>
            </template>
        </CityNav>
        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-fg">Moderation</h1>
            <p class="mt-2 text-muted">Review and approve or remove pending content.</p>
            <nav class="mt-6 flex gap-4">
                <Link :href="`${cityBaseUrl}/moderation/listings`" class="rounded-token-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:opacity-90 underline">Listings queue</Link>
                <Link :href="`${cityBaseUrl}/moderation/events`" class="rounded-token-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:opacity-90 underline">Events queue</Link>
                <Link :href="`${cityBaseUrl}/moderation/pages`" class="rounded-token-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:opacity-90 underline">Pages queue</Link>
            </nav>
        </main>
    </div>
</template>
