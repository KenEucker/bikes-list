<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityLayout from '@/Layouts/CityLayout.vue';

defineProps({
    city: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
    homeUrl: { type: String, default: '/' },
    counts: { type: Object, default: () => ({}) },
});
</script>

<template>
    <Head :title="`BikesList – ${city.name} – Dashboard`" />
    <CityLayout :city="city" :city-base-url="cityBaseUrl" breadcrumb="Dashboard">
        <template #nav-right>
            <gv-header-navigation-item :href="$page.props.urls?.accountSettings || '/account/settings'" text="Account" />
        </template>

        <div class="govuk-width-container govuk-!-padding-top-8 govuk-!-padding-bottom-8">
            <h1 class="govuk-heading-l">Dashboard</h1>
            <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link :href="`${cityBaseUrl}/dashboard/listings`" class="rounded-token-md border border-border bg-card p-4 no-underline">
                    <span class="font-medium text-fg">Listings</span>
                    <p class="mt-1 text-2xl font-semibold text-muted">{{ counts.listings ?? 0 }}</p>
                </Link>
                <Link :href="`${cityBaseUrl}/dashboard/events`" class="rounded-token-md border border-border bg-card p-4 no-underline">
                    <span class="font-medium text-fg">Events</span>
                    <p class="mt-1 text-2xl font-semibold text-muted">{{ counts.events ?? 0 }}</p>
                </Link>
                <Link :href="`${cityBaseUrl}/dashboard/pending`" class="rounded-token-md border border-border bg-card p-4 no-underline">
                    <span class="font-medium text-fg">Pending</span>
                    <p class="mt-1 text-2xl font-semibold text-amber-600 dark:text-amber-400">{{ (counts.pendingListings ?? 0) + (counts.pendingEvents ?? 0) + (counts.pendingPages ?? 0) }}</p>
                </Link>
                <Link :href="`${cityBaseUrl}/dashboard/pages`" class="rounded-token-md border border-border bg-card p-4 no-underline">
                    <span class="font-medium text-fg">Community pages</span>
                    <p class="mt-1 text-2xl font-semibold text-muted">{{ counts.pages ?? 0 }}</p>
                </Link>
            </div>
        </div>
    </CityLayout>
</template>
