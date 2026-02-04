<script setup>
import { Head } from '@inertiajs/vue3';

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
                            class="text-xl font-semibold text-gray-800 dark:text-white"
                        >
                            Bikes
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
            <p class="mt-6 text-sm text-gray-500 dark:text-gray-500">
                This is a placeholder page for {{ city.name }}.
            </p>
            <a
                :href="homeUrl"
                class="mt-8 inline-block text-gray-600 underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
                Back to cities
            </a>
        </main>
    </div>
</template>
