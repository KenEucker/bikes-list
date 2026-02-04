<script setup>
import { Head, useForm } from '@inertiajs/vue3';
import { nextTick } from 'vue';
import CityNav from '@/Components/CityNav.vue';

const props = defineProps({
    city: { type: Object, required: true },
    listingTypes: { type: Object, required: true },
    conditions: { type: Object, default: () => ({}) },
    managedCommunityPages: { type: Array, default: () => [] },
    homeUrl: { type: String, default: '/' },
    cityBaseUrl: { type: String, required: true },
});

const form = useForm({
    title: '',
    description: '',
    type: 'full_bicycle',
    price: null,
    condition: 'good',
    location_address: '',
    community_page_id: null,
    serial_number: '',
    serial_private: true,
    attributes: {},
    submit_for_review: false,
});

const conditionsList = () => props.conditions && typeof props.conditions === 'object' && !Array.isArray(props.conditions)
    ? Object.entries(props.conditions)
    : Object.entries({ new: 'New', like_new: 'Like new', good: 'Good', fair: 'Fair', poor: 'Poor' });

async function submit(draft) {
    form.submit_for_review = !draft;
    await nextTick();
    form.post(`${props.cityBaseUrl}/listings`, {
        forceFormData: true,
    });
}
</script>

<template>
    <Head :title="`New listing – ${city.name}`" />
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <CityNav :city="city" :city-base-url="cityBaseUrl" breadcrumb="New listing">
            <template #nav-right>
                <a :href="`${cityBaseUrl}/listings`" class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Back to listings</a>
            </template>
        </CityNav>

        <main class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">New listing</h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Title 6–80 characters. Description at least 20 characters. 1–4 photos (add after creating draft if needed).</p>

            <form @submit.prevent class="mt-6 space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Type *</label>
                    <select v-model="form.type" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                        <option v-for="(config, key) in listingTypes" :key="key" :value="key">{{ config.label }}</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Title * (6–80 chars)</label>
                    <input v-model="form.title" type="text" maxlength="80" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                    <p v-if="form.errors.title" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ form.errors.title }}</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Description * (min 20 chars)</label>
                    <textarea v-model="form.description" rows="4" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"></textarea>
                    <p v-if="form.errors.description" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ form.errors.description }}</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Price (0 = free)</label>
                    <input v-model="form.price" type="number" min="0" step="0.01" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Condition *</label>
                    <select v-model="form.condition" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                        <option v-for="[value, label] in conditionsList()" :key="value" :value="value">{{ label }}</option>
                    </select>
                </div>
                <div v-if="form.type === 'full_bicycle'">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Serial number (optional, private by default)</label>
                    <input v-model="form.serial_number" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                    <label class="mt-2 flex items-center">
                        <input v-model="form.serial_private" type="checkbox" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700" />
                        <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">Keep serial private</span>
                    </label>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Location (optional)</label>
                    <input v-model="form.location_address" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                </div>
                <div v-if="managedCommunityPages.length">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Post as (optional)</label>
                    <select v-model="form.community_page_id" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                        <option :value="null">My personal listing</option>
                        <option v-for="page in managedCommunityPages" :key="page.id" :value="page.id">{{ page.name }}</option>
                    </select>
                </div>
                <div class="flex flex-wrap gap-3 pt-4">
                    <button type="button" class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50" :disabled="form.processing" @click="submit(false)">
                        Submit for review
                    </button>
                    <button type="button" class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 disabled:opacity-50" :disabled="form.processing" @click="submit(true)">
                        Save draft
                    </button>
                    <a :href="`${cityBaseUrl}/listings`" class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">Cancel</a>
                </div>
            </form>
            <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">Submitting for review will list this item as pending; it will be published automatically if not reviewed by a moderator.</p>
        </main>
    </div>
</template>
