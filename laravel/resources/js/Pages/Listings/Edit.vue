<script setup>
import { Head } from '@inertiajs/vue3';
import { ref } from 'vue';
import CityNav from '@/Components/CityNav.vue';

const props = defineProps({
    city: { type: Object, required: true },
    listing: { type: Object, required: true },
    listingTypes: { type: Object, required: true },
    conditions: { type: Object, default: () => ({}) },
    managedCommunityPages: { type: Array, default: () => [] },
    homeUrl: { type: String, default: '/' },
    cityBaseUrl: { type: String, required: true },
});

const form = ref({
    title: props.listing.title,
    description: props.listing.description,
    type: props.listing.type,
    price: props.listing.price ?? '',
    condition: props.listing.condition ?? 'good',
    location_address: props.listing.location_address ?? '',
    community_page_id: props.listing.community_page_id ?? null,
    serial_number: props.listing.serial_number ?? '',
    serial_private: props.listing.serial_private !== false,
});
</script>

<template>
    <Head :title="`Edit – ${listing.title}`" />
    <div class="min-h-screen bg-page">
        <CityNav :city="city" :city-base-url="cityBaseUrl" breadcrumb="Edit listing">
            <template #nav-right>
                <a :href="`${cityBaseUrl}/listings/${listing.id}`" class="text-sm text-muted hover:text-fg underline">Back to listing</a>
            </template>
        </CityNav>

        <main class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-fg">Edit listing</h1>
            <form :action="`${cityBaseUrl}/listings/${listing.id}`" method="post" class="mt-6 space-y-4">
                <input type="hidden" name="_token" :value="$page.props.csrf_token" />
                <input type="hidden" name="_method" value="PUT" />
                <div>
                    <label class="block text-sm font-medium text-fg">Title *</label>
                    <input v-model="form.title" type="text" name="title" required class="mt-1 block w-full rounded-token-md border border-border bg-input text-fg shadow-sm focus:border-focus focus:ring-focus" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-fg">Description *</label>
                    <textarea v-model="form.description" name="description" rows="4" required class="mt-1 block w-full rounded-token-md border border-border bg-input text-fg shadow-sm focus:border-focus focus:ring-focus"></textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-fg">Type *</label>
                    <select v-model="form.type" name="type" class="mt-1 block w-full rounded-token-md border border-border bg-input text-fg shadow-sm focus:border-focus focus:ring-focus">
                        <option v-for="(config, key) in listingTypes" :key="key" :value="key">{{ config.label }}</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-fg">Price (0 = free)</label>
                    <input v-model="form.price" type="number" name="price" min="0" step="0.01" class="mt-1 block w-full rounded-token-md border border-border bg-input text-fg shadow-sm focus:border-focus focus:ring-focus" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-fg">Condition *</label>
                    <select v-model="form.condition" name="condition" class="mt-1 block w-full rounded-token-md border border-border bg-input text-fg shadow-sm focus:border-focus focus:ring-focus">
                        <option v-for="(label, value) in conditions" :key="value" :value="value">{{ label }}</option>
                    </select>
                </div>
                <div v-if="form.type === 'full_bicycle'">
                    <label class="block text-sm font-medium text-fg">Serial number (optional)</label>
                    <input v-model="form.serial_number" type="text" name="serial_number" class="mt-1 block w-full rounded-token-md border border-border bg-input text-fg shadow-sm focus:border-focus focus:ring-focus" />
                    <label class="mt-2 flex items-center">
                        <input v-model="form.serial_private" type="checkbox" name="serial_private" value="1" class="rounded border-border text-primary focus:ring-focus" />
                        <span class="ml-2 text-sm text-muted">Keep serial private</span>
                    </label>
                </div>
                <div>
                    <label class="block text-sm font-medium text-fg">Location (optional)</label>
                    <input v-model="form.location_address" type="text" name="location_address" class="mt-1 block w-full rounded-token-md border border-border bg-input text-fg shadow-sm focus:border-focus focus:ring-focus" />
                </div>
                <div v-if="managedCommunityPages.length">
                    <label class="block text-sm font-medium text-fg">Post as (optional)</label>
                    <select v-model="form.community_page_id" name="community_page_id" class="mt-1 block w-full rounded-token-md border border-border bg-input text-fg shadow-sm focus:border-focus focus:ring-focus">
                        <option value="">My personal listing</option>
                        <option v-for="page in managedCommunityPages" :key="page.id" :value="page.id">{{ page.name }}</option>
                    </select>
                </div>
                <div class="flex gap-3">
                    <button type="submit" class="rounded-token-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:opacity-90">Save</button>
                    <a :href="`${cityBaseUrl}/listings/${listing.id}`" class="rounded-token-md border border-border bg-card px-4 py-2 text-sm font-medium text-fg hover:opacity-90">Cancel</a>
                </div>
            </form>
        </main>
    </div>
</template>
