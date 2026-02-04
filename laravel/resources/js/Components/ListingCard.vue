<script setup>
import StatusChip from './StatusChip.vue';

defineProps({
    listing: { type: Object, required: true },
    listingTypeLabel: { type: String, default: '' },
    url: { type: String, required: true },
    showStatus: { type: Boolean, default: true },
});
</script>

<template>
    <a
        :href="url"
        class="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-600"
    >
        <div v-if="(listing.attachments?.length ?? 0) > 0" class="mb-2 aspect-video w-full overflow-hidden rounded bg-gray-100 dark:bg-gray-700">
            <img :src="listing.attachments?.[0]?.url" :alt="listing.title" class="h-full w-full object-cover" />
        </div>
        <div v-else class="mb-2 aspect-video w-full rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 text-sm">No photo</div>
        <h3 class="font-medium text-gray-900 dark:text-white line-clamp-1">{{ listing.title }}</h3>
        <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            {{ listingTypeLabel || listing.type }} · {{ listing.price != null ? `$${Number(listing.price).toLocaleString()}` : 'Free' }}
        </p>
        <div v-if="showStatus && listing.state" class="mt-2">
            <StatusChip :status="listing.state" />
        </div>
    </a>
</template>
