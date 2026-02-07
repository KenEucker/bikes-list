<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityLayout from '@/Layouts/CityLayout.vue';

const props = defineProps({
    city: { type: Object, required: true },
    moderatedCities: { type: Array, default: () => [] },
    cityBaseUrl: { type: String, required: true },
    homeUrl: { type: String, default: '/' },
    newItems: { type: Array, default: () => [] },
});

function cityModUrl(slug) {
    if (typeof window === 'undefined') return '';
    const host = window.location.host;
    const protocol = window.location.protocol;
    const port = window.location.port ? ':' + window.location.port : '';
    const baseHost = host.replace(/^[^.]+\./, '') || host;
    return `${protocol}//${slug}.${baseHost}${port}/moderation`;
}

function goToCityModeration(slug) {
    const url = cityModUrl(slug);
    if (url && typeof window !== 'undefined') window.location.href = url;
}

function formatDate(iso) {
    if (!iso) return '';
    try {
        const d = new Date(iso);
        return d.toLocaleDateString(undefined, { dateStyle: 'short' });
    } catch {
        return iso;
    }
}
</script>

<template>
    <Head :title="`BikesList – ${city.name} – Moderation`" />
    <CityLayout :city="city" :city-base-url="cityBaseUrl" breadcrumb="Moderation">

        <div class="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div v-if="moderatedCities.length > 1" class="govuk-!-margin-bottom-6">
                <label class="govuk-label govuk-label--s" for="moderation-city-select">Change City</label>
                <select
                    id="moderation-city-select"
                    class="govuk-select govuk-!-width-auto"
                    :value="city.slug"
                    @change="(e) => goToCityModeration(e.target?.value)"
                >
                    <option v-for="c in moderatedCities" :key="c.id" :value="c.slug">{{ c.name }}</option>
                </select>
            </div>
            <h1 class="govuk-heading-l">Moderation</h1>
            <p class="govuk-body">Review and approve or remove pending content.</p>

            <section v-if="newItems.length" class="govuk-!-margin-top-6 govuk-!-margin-bottom-6">
                <h2 class="govuk-heading-m">New items (created in the last 7 days)</h2>
                <ul class="govuk-list govuk-list--bullet">
                    <li v-for="item in newItems" :key="`${item.type}-${item.id}`" class="govuk-!-margin-bottom-1">
                        <a :href="item.url" class="govuk-link">{{ item.title }}</a>
                        <span class="text-muted text-sm govuk-!-margin-left-2">{{ item.type }} · {{ formatDate(item.created_at) }}</span>
                        <a :href="item.queue_url" class="govuk-link govuk-link--no-visited-state govuk-!-margin-left-2">→ queue</a>
                    </li>
                </ul>
            </section>

            <div class="govuk-button-group govuk-!-margin-top-6">
                <Link :href="`${cityBaseUrl}/moderation/sales`" class="govuk-button" role="button">Sales queue</Link>
                <Link :href="`${cityBaseUrl}/moderation/rides`" class="govuk-button" role="button">Rides queue</Link>
                <Link :href="`${cityBaseUrl}/moderation/pages`" class="govuk-button" role="button">Pages queue</Link>
                <Link :href="`${cityBaseUrl}/moderation/claims`" class="govuk-button govuk-button--secondary" role="button">Claim requests</Link>
            </div>
        </div>
    </CityLayout>
</template>
