<script setup>
import { Head, Link } from '@inertiajs/vue3';
import { ref } from 'vue';

const props = defineProps({
    city: { type: Object, required: true },
    listing: { type: Object, required: true },
    relayEmailAddress: { type: String, default: null },
    listingTypes: { type: Object, required: true },
    homeUrl: { type: String, default: '/' },
    cityBaseUrl: { type: String, required: true },
});

const copied = ref(false);
function copyRelay() {
    if (!props.relayEmailAddress) return;
    navigator.clipboard.writeText(props.relayEmailAddress);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
}

const typeLabel = props.listingTypes[props.listing.type]?.label ?? props.listing.type;
</script>

<template>
    <Head :title="listing.title" />
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <nav class="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-16 justify-between items-center">
                    <div class="flex items-center gap-6">
                        <a :href="homeUrl" class="text-xl font-semibold text-gray-800 dark:text-white">Bikes</a>
                        <span class="text-gray-500 dark:text-gray-400">/ {{ city.name }} / Listings</span>
                    </div>
                    <div class="flex items-center gap-4">
                        <a :href="`${cityBaseUrl}/listings`" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Back to listings</a>
                        <Link v-if="$page.props.auth.user" :href="route('profile.edit')" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Profile</Link>
                        <Link v-else :href="route('login')" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Log in</Link>
                    </div>
                </div>
            </div>
        </nav>

        <main class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ listing.title }}</h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ typeLabel }} · {{ listing.price != null ? `$${Number(listing.price).toLocaleString()}` : 'Free' }}</p>

            <div v-if="listing.attachments?.length" class="mt-4 flex gap-2 overflow-x-auto">
                <img v-for="att in listing.attachments" :key="att.id" :src="att.url" :alt="att.original_name" class="h-48 w-auto rounded object-cover" />
            </div>
            <div v-else class="mt-4 aspect-video rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">No photos</div>

            <div class="mt-6 prose dark:prose-invert max-w-none">
                <p class="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{{ listing.description }}</p>
            </div>

            <div v-if="relayEmailAddress" class="mt-8 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Contact seller (email relay)</p>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Copy the address below and use your own email client. Your address is never shown to the seller.</p>
                <div class="mt-2 flex items-center gap-2">
                    <code class="flex-1 rounded bg-gray-100 px-2 py-1.5 text-sm dark:bg-gray-700">{{ relayEmailAddress }}</code>
                    <button type="button" class="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700" @click="copyRelay">
                        {{ copied ? 'Copied!' : 'Copy' }}
                    </button>
                </div>
            </div>

            <div class="mt-8 flex flex-wrap gap-3">
                <Link v-if="$page.props.auth.user && (listing.user_id === $page.props.auth.user.id || listing.community_page_id)" :href="`${cityBaseUrl}/listings/${listing.id}/edit`" class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">Edit</Link>
                <template v-if="$page.props.auth.user && (listing.user_id === $page.props.auth.user.id || listing.community_page_id)">
                    <Link v-if="listing.state === 'draft'" :href="`${cityBaseUrl}/listings/${listing.id}/publish`" method="post" as="button" class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Publish</Link>
                    <Link v-else-if="listing.state === 'published'" :href="`${cityBaseUrl}/listings/${listing.id}/sold`" method="post" as="button" class="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700">Mark sold</Link>
                </template>
                <Link v-if="$page.props.auth.user && listing.user_id !== $page.props.auth.user.id" :href="`${cityBaseUrl}/listings/${listing.id}/flag`" method="post" as="button" class="rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-600 dark:bg-gray-800 dark:text-red-400">Flag listing</Link>
            </div>
        </main>
    </div>
</template>
