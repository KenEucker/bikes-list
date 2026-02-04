<script setup>
import { Head, usePage } from '@inertiajs/vue3';

defineProps({
    city: {
        type: Object,
        required: true,
    },
    homeUrl: {
        type: String,
        default: '/',
    },
});

const logo = usePage().props.logo || '/bikeslist.png';
</script>

<template>
    <Head :title="city.name" />
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <nav class="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-16 justify-between">
                    <div class="flex items-center gap-6">
                        <a
                            :href="homeUrl"
                            class="flex items-center gap-2 text-xl font-semibold text-gray-800 dark:text-white"
                        >
                            <img :src="logo" alt="BikesList" class="h-8 w-auto object-contain" />
                            <span>BikesList</span>
                        </a>
                        <span class="text-gray-500 dark:text-gray-400">/ {{ city.name }}</span>
                    </div>
                </div>
            </div>
        </nav>

        <main class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ city.name }}</h1>
            <p v-if="city.description" class="mt-4 text-gray-600 dark:text-gray-400">
                {{ city.description }}
            </p>
            <nav class="mt-8 flex flex-wrap gap-4">
                <a
                    :href="cityBaseUrl + '/listings'"
                    class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                    Listings
                </a>
                <a
                    :href="cityBaseUrl + '/events'"
                    class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                    Events
                </a>
                <a
                    :href="cityBaseUrl + '/community'"
                    class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                    Community (shops &amp; clubs)
                </a>
            </nav>
            <section v-if="upcomingEvents.length" class="mt-8">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Upcoming events</h2>
                <ul class="mt-2 space-y-2">
                    <li v-for="event in upcomingEvents" :key="event.id">
                        <a :href="cityBaseUrl + '/events/' + event.id" class="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">{{ event.title }}</a>
                        <span class="text-sm text-gray-500 dark:text-gray-400"> – {{ new Date(event.starts_at).toLocaleDateString() }}</span>
                    </li>
                </ul>
                <a :href="cityBaseUrl + '/events'" class="mt-2 inline-block text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">View all events</a>
            </section>
            <a
                :href="homeUrl"
                class="mt-8 inline-block text-gray-600 underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
                Back to cities
            </a>
        </main>
    </div>
</template>
