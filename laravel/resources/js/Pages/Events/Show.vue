<script setup>
import { Head, Link } from '@inertiajs/vue3';

defineProps({
    city: { type: Object, required: true },
    event: { type: Object, required: true },
    homeUrl: { type: String, default: '/' },
    cityBaseUrl: { type: String, required: true },
});
</script>

<template>
    <Head :title="event.title" />
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <nav class="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-16 justify-between items-center">
                    <div class="flex items-center gap-6">
                        <a :href="homeUrl" class="text-xl font-semibold text-gray-800 dark:text-white">Bikes</a>
                        <span class="text-gray-500 dark:text-gray-400">/ {{ city.name }} / Events</span>
                    </div>
                    <div class="flex items-center gap-4">
                        <a :href="`${cityBaseUrl}/events`" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Back to events</a>
                        <Link v-if="$page.props.auth.user && event.user_id === $page.props.auth.user.id" :href="`${cityBaseUrl}/events/${event.id}/edit`" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Edit</Link>
                    </div>
                </div>
            </div>
        </nav>

        <main class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ event.title }}</h1>
            <p class="mt-2 text-gray-600 dark:text-gray-400">{{ new Date(event.starts_at).toLocaleString() }} – {{ new Date(event.ends_at).toLocaleString() }}</p>
            <p v-if="event.organizer_name" class="mt-1 text-sm text-gray-500 dark:text-gray-400">Organizer: {{ event.organizer_name }}{{ event.organizer_email_hidden ? '' : ` (${event.organizer_email})` }}</p>
            <div class="mt-6 prose dark:prose-invert max-w-none">
                <p class="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{{ event.description }}</p>
            </div>
            <p v-if="event.location_address" class="mt-4 text-sm text-gray-600 dark:text-gray-400">Location: {{ event.location_address }}</p>
            <p v-if="event.route_description" class="mt-2 text-sm text-gray-600 dark:text-gray-400">Route: {{ event.route_description }}</p>
        </main>
    </div>
</template>
