<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityLayout from '@/Layouts/CityLayout.vue';

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
    <Head :title="`BikesList – ${city.name} – Moderation`" />
    <CityLayout :city="city" :city-base-url="cityBaseUrl" breadcrumb="Moderation">
        <template #nav-right>
            <li v-if="moderatedCities.length > 1" class="govuk-header__navigation-item">
                <select
                    class="govuk-select govuk-!-width-auto"
                    :value="city.slug"
                    @change="(e) => window.location.href = cityModUrl(e.target.value)"
                >
                    <option v-for="c in moderatedCities" :key="c.id" :value="c.slug">{{ c.name }}</option>
                </select>
            </li>
            <gv-header-navigation-item :href="cityBaseUrl" text="Back to city" />
        </template>

        <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="govuk-heading-l">Moderation</h1>
            <p class="govuk-body">Review and approve or remove pending content.</p>
            <div class="govuk-button-group govuk-!-margin-top-6">
                <Link :href="`${cityBaseUrl}/moderation/sales`" class="govuk-button" role="button">Sales queue</Link>
                <Link :href="`${cityBaseUrl}/moderation/rides`" class="govuk-button" role="button">Rides queue</Link>
                <Link :href="`${cityBaseUrl}/moderation/pages`" class="govuk-button" role="button">Pages queue</Link>
            </div>
        </div>
    </CityLayout>
</template>
