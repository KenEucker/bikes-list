<script setup>
import { Head, Link } from '@inertiajs/vue3';
</script>

<template>
    <Head title="Privacy Policy" />
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <nav class="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-16 justify-between items-center">
                    <Link :href="route('home')" class="text-xl font-semibold text-gray-800 dark:text-white">BikesList</Link>
                    <Link :href="route('home')" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Back to home</Link>
                </div>
            </div>
        </nav>
        <main class="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
            <p class="mt-4 text-gray-600 dark:text-gray-400">Placeholder. Replace with your privacy policy content.</p>
            <Link :href="route('home')" class="mt-8 inline-block text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Back to home</Link>
        </main>
    </div>
</template>
