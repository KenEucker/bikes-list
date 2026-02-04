<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityNav from '@/Components/CityNav.vue';
import StatusChip from '@/Components/StatusChip.vue';

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
    <Head title="Pending" />
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <CityNav :city="city" :city-base-url="cityBaseUrl" :breadcrumb="['Dashboard', 'Pending']">
            <template #nav-right>
                <Link :href="`${cityBaseUrl}/dashboard`" class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Dashboard</Link>
                <Link :href="$page.props.urls?.accountSettings || '/account/settings'" class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Account</Link>
            </template>
        </CityNav>
        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Pending review</h1>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">These items will be published or approved automatically if not reviewed by a moderator.</p>
            <section v-if="listings.length" class="mt-6">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Listings</h2>
                <ul class="mt-2 space-y-2">
                    <li v-for="listing in listings" :key="listing.id" class="flex items-center justify-between rounded border border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
                        <a :href="`${cityBaseUrl}/listings/${listing.id}`" class="font-medium text-indigo-600 dark:text-indigo-400">{{ listing.title }}</a>
                        <StatusChip status="pending_review" />
                    </li>
                </ul>
            </section>
            <section v-if="events.length" class="mt-6">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Events</h2>
                <ul class="mt-2 space-y-2">
                    <li v-for="event in events" :key="event.id" class="flex items-center justify-between rounded border border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
                        <a :href="`${cityBaseUrl}/events/${event.id}`" class="font-medium text-indigo-600 dark:text-indigo-400">{{ event.title }}</a>
                        <StatusChip status="pending_review" />
                    </li>
                </ul>
            </section>
            <section v-if="pages.length" class="mt-6">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Community pages</h2>
                <ul class="mt-2 space-y-2">
                    <li v-for="page in pages" :key="page.id" class="flex items-center justify-between rounded border border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
                        <a :href="`${cityBaseUrl}/community/${page.slug}`" class="font-medium text-indigo-600 dark:text-indigo-400">{{ page.name }}</a>
                        <StatusChip status="pending" />
                    </li>
                </ul>
            </section>
            <p v-if="!listings.length && !events.length && !pages.length" class="mt-6 text-gray-500 dark:text-gray-400">No pending items.</p>
        </main>
    </div>
</template>
