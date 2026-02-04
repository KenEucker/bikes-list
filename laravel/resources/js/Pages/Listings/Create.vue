<script setup>
import { Head, Link } from '@inertiajs/vue3';
import { ref } from 'vue';

const props = defineProps({
    city: { type: Object, required: true },
    listingTypes: { type: Object, required: true },
    managedCommunityPages: { type: Array, default: () => [] },
    homeUrl: { type: String, default: '/' },
    cityBaseUrl: { type: String, required: true },
});

const form = ref({
    title: '',
    description: '',
    type: 'full_bicycle',
    price: '',
    location_address: '',
    community_page_id: '',
    attributes: {},
});
</script>

<template>
    <Head :title="`New listing – ${city.name}`" />
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <nav class="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-16 justify-between items-center">
                    <div class="flex items-center gap-6">
                        <a :href="homeUrl" class="text-xl font-semibold text-gray-800 dark:text-white">Bikes</a>
                        <span class="text-gray-500 dark:text-gray-400">/ {{ city.name }} / New listing</span>
                    </div>
                </div>
            </div>
        </nav>

        <main class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">New listing</h1>
            <form :action="`${cityBaseUrl}/listings`" method="post" class="mt-6 space-y-4">
                <input type="hidden" name="_token" :value="$page.props.csrf_token" />
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Title *</label>
                    <input v-model="form.title" type="text" name="title" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Description *</label>
                    <textarea v-model="form.description" name="description" rows="4" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"></textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Type *</label>
                    <select v-model="form.type" name="type" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                        <option v-for="(config, key) in listingTypes" :key="key" :value="key">{{ config.label }}</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Price (leave empty for free)</label>
                    <input v-model="form.price" type="number" name="price" min="0" step="0.01" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Location (optional)</label>
                    <input v-model="form.location_address" type="text" name="location_address" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                </div>
                <div v-if="managedCommunityPages.length">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Post as (optional)</label>
                    <select v-model="form.community_page_id" name="community_page_id" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                        <option value="">My personal listing</option>
                        <option v-for="page in managedCommunityPages" :key="page.id" :value="page.id">{{ page.name }}</option>
                    </select>
                </div>
                <div class="flex gap-3">
                    <button type="submit" class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Create draft</button>
                    <a :href="`${cityBaseUrl}/listings`" class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">Cancel</a>
                </div>
            </form>
        </main>
    </div>
</template>
