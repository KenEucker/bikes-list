<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityNav from '@/Components/CityNav.vue';
import StatusChip from '@/Components/StatusChip.vue';

defineProps({
    city: { type: Object, required: true },
    pages: { type: Array, default: () => [] },
    cityBaseUrl: { type: String, required: true },
    homeUrl: { type: String, default: '/' },
});
</script>

<template>
    <Head title="My community pages" />
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <CityNav :city="city" :city-base-url="cityBaseUrl" :breadcrumb="['Dashboard', 'Community pages']">
            <template #nav-right>
                <Link :href="`${cityBaseUrl}/dashboard`" class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Dashboard</Link>
                <Link :href="$page.props.urls?.accountSettings || '/account/settings'" class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Account</Link>
            </template>
        </CityNav>
        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">My community pages</h1>
            <Link :href="`${cityBaseUrl}/community/new`" class="mt-4 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">New page</Link>
            <ul class="mt-6 space-y-2">
                <li v-for="page in pages" :key="page.id" class="flex items-center justify-between rounded border border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
                    <a :href="`${cityBaseUrl}/dashboard/pages/${page.slug}`" class="font-medium text-indigo-600 dark:text-indigo-400">{{ page.name }}</a>
                    <StatusChip :status="page.state" />
                </li>
            </ul>
        </main>
    </div>
</template>
