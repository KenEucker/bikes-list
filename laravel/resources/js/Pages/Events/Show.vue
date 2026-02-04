<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityNav from '@/Components/CityNav.vue';
import RelayEmailBlock from '@/Components/RelayEmailBlock.vue';
import ReportBlock from '@/Components/ReportBlock.vue';

defineProps({
    city: { type: Object, required: true },
    event: { type: Object, required: true },
    organizerRelayEmail: { type: String, default: null },
    moderatorRelayEmail: { type: String, default: '' },
    homeUrl: { type: String, default: '/' },
    cityBaseUrl: { type: String, required: true },
});
</script>

<template>
    <Head :title="event.title" />
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <CityNav :city="city" :city-base-url="cityBaseUrl" :breadcrumb="['Events', event.title]">
            <template #nav-right>
                <a :href="`${cityBaseUrl}/events`" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Back to events</a>
                <Link v-if="$page.props.auth.user && (event.user_id === $page.props.auth.user.id || event.community_page_id)" :href="`${cityBaseUrl}/events/${event.id}/edit`" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Edit</Link>
            </template>
        </CityNav>

        <main class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ event.title }}</h1>
            <p class="mt-2 text-gray-600 dark:text-gray-400">{{ new Date(event.starts_at).toLocaleString() }} – {{ new Date(event.ends_at).toLocaleString() }}</p>
            <p v-if="event.organizer_name" class="mt-1 text-sm text-gray-500 dark:text-gray-400">Organizer: {{ event.organizer_name }}{{ event.organizer_email_hidden ? ' (contact via relay below)' : '' }}</p>
            <div class="mt-6 prose dark:prose-invert max-w-none">
                <p class="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{{ event.description }}</p>
            </div>
            <p v-if="event.location_address" class="mt-4 text-sm text-gray-600 dark:text-gray-400">Location: {{ event.location_address }}</p>
            <p v-if="event.route_description" class="mt-2 text-sm text-gray-600 dark:text-gray-400">Route: {{ event.route_description }}</p>
            <a v-if="event.route_link" :href="event.route_link" target="_blank" rel="noopener noreferrer" class="mt-2 block text-sm text-indigo-600 dark:text-indigo-400">View route link</a>

            <div v-if="organizerRelayEmail" class="mt-8">
                <RelayEmailBlock
                    :email="organizerRelayEmail"
                    label="Contact organizer"
                    :mailto-subject="`Re: Event – ${event.title} – ${event.id}`"
                />
            </div>

            <div v-if="moderatorRelayEmail" class="mt-8">
                <ReportBlock
                    :moderator-relay-email="moderatorRelayEmail"
                    item-type="Event"
                    :item-title="event.title"
                    :item-id-or-slug="event.id"
                />
            </div>
        </main>
    </div>
</template>
