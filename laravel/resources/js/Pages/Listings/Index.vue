<script setup>
import { Head, Link, router } from '@inertiajs/vue3';

const props = defineProps({
    city: { type: Object, required: true },
    listings: { type: Object, required: true },
    filters: { type: Object, default: () => ({}) },
    listingTypes: { type: Object, required: true },
    homeUrl: { type: String, default: '/' },
    cityBaseUrl: { type: String, required: true },
});

const form = {
    q: props.filters.q ?? '',
    type: props.filters.type ?? '',
    min_price: props.filters.min_price ?? '',
    max_price: props.filters.max_price ?? '',
};

function search() {
    router.get(route('city.listings.index', props.city.slug), form, { preserveState: true });
}

function saveSearchUrl() {
    const params = new URLSearchParams({
        save: '1',
        city_id: props.city.id,
        name: `${props.city.name} – ${form.q || 'Listings'}`,
        ...(form.q && { 'query[q]': form.q }),
        ...(form.type && { 'query[type]': form.type }),
        ...(form.min_price && { 'query[min_price]': form.min_price }),
        ...(form.max_price && { 'query[max_price]': form.max_price }),
    });
    return props.homeUrl.replace(/\/$/, '') + '/profile/saved-searches?' + params.toString();
}
</script>

<template>
    <Head :title="`Listings – ${city.name}`" />
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <nav class="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-16 justify-between items-center">
                    <div class="flex items-center gap-6">
                        <a :href="homeUrl" class="text-xl font-semibold text-gray-800 dark:text-white">Bikes</a>
                        <span class="text-gray-500 dark:text-gray-400">/ {{ city.name }} / Listings</span>
                    </div>
                    <div class="flex items-center gap-4">
                        <Link v-if="$page.props.auth.user" :href="route('profile.edit')" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Profile</Link>
                        <Link v-else :href="route('login')" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Log in</Link>
                    </div>
                </div>
            </div>
        </nav>

        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div class="mb-6 flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <div class="flex-1 min-w-[120px]">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Search</label>
                    <input v-model="form.q" type="text" placeholder="Keywords..." class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" @keyup.enter="search" />
                </div>
                <div class="w-40">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                    <select v-model="form.type" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                        <option value="">All</option>
                        <option v-for="(config, key) in listingTypes" :key="key" :value="key">{{ config.label }}</option>
                    </select>
                </div>
                <div class="w-28">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Min $</label>
                    <input v-model="form.min_price" type="number" min="0" step="0.01" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                </div>
                <div class="w-28">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Max $</label>
                    <input v-model="form.max_price" type="number" min="0" step="0.01" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                </div>
                <button type="button" class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700" @click="search">Search</button>
                <Link v-if="$page.props.auth.user" :href="saveSearchUrl()" class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">Save search</Link>
            </div>

            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Listings</h1>
            <ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <li v-for="listing in listings.data" :key="listing.id" class="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <Link :href="`${cityBaseUrl}/listings/${listing.id}`" class="block">
                        <div class="aspect-[4/3] bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                            <span>No photo</span>
                        </div>
                        <div class="p-3">
                            <p class="font-medium text-gray-900 dark:text-white truncate">{{ listing.title }}</p>
                            <p class="text-sm text-gray-600 dark:text-gray-400">{{ listing.price != null ? `$${Number(listing.price).toLocaleString()}` : 'Free' }}</p>
                        </div>
                    </Link>
                </li>
            </ul>
            <div v-if="listings.data.length === 0" class="py-12 text-center text-gray-500 dark:text-gray-400">No listings found.</div>
            <div v-if="listings.prev_page_url || listings.next_page_url" class="mt-6 flex justify-center gap-2">
                <Link v-if="listings.prev_page_url" :href="listings.prev_page_url" class="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">Previous</Link>
                <Link v-if="listings.next_page_url" :href="listings.next_page_url" class="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">Next</Link>
            </div>
        </main>
    </div>
</template>
