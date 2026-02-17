<script setup>
import { Head, Link } from '@inertiajs/vue3';
</script>

<template>
    <Head title="Magic link" />
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4">
        <div class="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
            <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Magic link</h1>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Request a sign-in link to be sent to your email. This feature can be configured later.
            </p>
            <Link
                :href="$page.props.urls?.accountSettings || '/account/settings'"
                class="mt-4 inline-block text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
                Back to account settings
            </Link>
        </div>
    </div>
</template>
