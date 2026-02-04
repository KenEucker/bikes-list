<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityNav from '@/Components/CityNav.vue';
import StatusChip from '@/Components/StatusChip.vue';

defineProps({
    city: { type: Object, required: true },
    listings: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
    homeUrl: { type: String, default: '/' },
});
</script>

<template>
    <Head title="My listings" />
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <CityNav :city="city" :city-base-url="cityBaseUrl" :breadcrumb="['Dashboard', 'Listings']">
            <template #nav-right>
                <Link :href="`${cityBaseUrl}/dashboard`" class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Dashboard</Link>
                <Link :href="$page.props.urls?.accountSettings || '/account/settings'" class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Account</Link>
            </template>
        </CityNav>
        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">My listings</h1>
            <div class="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Title</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                            <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                        <tr v-for="listing in listings.data" :key="listing.id">
                            <td class="px-4 py-2">
                                <a :href="`${cityBaseUrl}/listings/${listing.id}`" class="font-medium text-indigo-600 dark:text-indigo-400">{{ listing.title }}</a>
                            </td>
                            <td class="px-4 py-2"><StatusChip :status="listing.state" /></td>
                            <td class="px-4 py-2 text-right">
                                <a :href="`${cityBaseUrl}/listings/${listing.id}/edit`" class="text-sm text-gray-600 dark:text-gray-400">Edit</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    </div>
</template>
