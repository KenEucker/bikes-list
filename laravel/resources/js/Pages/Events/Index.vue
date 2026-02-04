<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityNav from '@/Components/CityNav.vue';

defineProps({
    city: { type: Object, required: true },
    events: { type: Object, required: true },
    homeUrl: { type: String, default: '/' },
    cityBaseUrl: { type: String, required: true },
});
</script>

<template>
    <Head :title="`Events – ${city.name}`" />
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <CityNav :city="city" :city-base-url="cityBaseUrl" breadcrumb="Events">
            <template #nav-right>
                <Link v-if="$page.props.auth.user" :href="`${cityBaseUrl}/events/create`" class="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700">Add event</Link>
                <Link v-if="$page.props.auth.user" :href="$page.props.urls?.accountSettings || '/account/settings'" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Profile</Link>
                <Link v-else :href="$page.props.urls?.signIn || '/account/sign-in'" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Log in</Link>
            </template>
        </CityNav>

        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Events</h1>
            <ul class="mt-4 space-y-4">
                <li v-for="event in events.data" :key="event.id" class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <Link :href="`${cityBaseUrl}/events/${event.id}`" class="block">
                        <p class="font-medium text-gray-900 dark:text-white">{{ event.title }}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ new Date(event.starts_at).toLocaleString() }} – {{ new Date(event.ends_at).toLocaleString() }}</p>
                    </Link>
                </li>
            </ul>
            <p v-if="events.data.length === 0" class="py-8 text-center text-gray-500 dark:text-gray-400">No upcoming events.</p>
        </main>
    </div>
</template>
