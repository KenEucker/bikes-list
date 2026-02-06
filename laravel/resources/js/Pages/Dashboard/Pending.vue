<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityLayout from '@/Layouts/CityLayout.vue';
import StatusTag from '@/Components/StatusTag.vue';

defineProps({
    city: { type: Object, required: true },
    listings: { type: Array, default: () => [] },
    events: { type: Array, default: () => [] },
    pages: { type: Array, default: () => [] },
    cityBaseUrl: { type: String, required: true },
    homeUrl: { type: String, default: '/' },
});
</script>

<template>
    <Head :title="`BikesList – ${city.name} – Pending`" />
    <CityLayout :city="city" :city-base-url="cityBaseUrl" :breadcrumb="['Dashboard', 'Pending']">
        <template #nav-right>
            <Link :href="`${cityBaseUrl}/dashboard`" class="govuk-link">Dashboard</Link>
            <Link :href="$page.props.urls?.accountSettings || '/account/settings'" class="govuk-link">Account</Link>
        </template>

        <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-fg">Pending review</h1>
            <p class="mt-2 text-sm text-muted">These items will be published or approved automatically if not reviewed by a moderator.</p>
            <section v-if="listings.length" class="mt-6">
                <h2 class="text-lg font-semibold text-fg">Listings</h2>
                <ul class="mt-2 space-y-2">
                    <li v-for="listing in listings" :key="listing.id" class="flex items-center justify-between rounded-token-md border border-border bg-card px-4 py-2">
                        <a :href="`${cityBaseUrl}/listings/${listing.id}`" class="font-medium text-primary underline">{{ listing.title }}</a>
                        <StatusTag status="pending_review" />
                    </li>
                </ul>
            </section>
            <section v-if="events.length" class="mt-6">
                <h2 class="text-lg font-semibold text-fg">Events</h2>
                <ul class="mt-2 space-y-2">
                    <li v-for="event in events" :key="event.id" class="flex items-center justify-between rounded-token-md border border-border bg-card px-4 py-2">
                        <a :href="`${cityBaseUrl}/events/${event.id}`" class="font-medium text-primary underline">{{ event.title }}</a>
                        <StatusTag status="pending_review" />
                    </li>
                </ul>
            </section>
            <section v-if="pages.length" class="mt-6">
                <h2 class="text-lg font-semibold text-fg">Community pages</h2>
                <ul class="mt-2 space-y-2">
                    <li v-for="page in pages" :key="page.id" class="flex items-center justify-between rounded-token-md border border-border bg-card px-4 py-2">
                        <a :href="`${cityBaseUrl}/community/${page.slug}`" class="font-medium text-primary underline">{{ page.name }}</a>
                        <StatusTag status="pending" />
                    </li>
                </ul>
            </section>
            <p v-if="!listings.length && !events.length && !pages.length" class="mt-6 text-muted">No pending items.</p>
        </div>
    </CityLayout>
</template>
