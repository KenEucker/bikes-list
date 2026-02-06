<script setup>
import { computed } from 'vue';
import StatusTag from './StatusTag.vue';

const props = defineProps({
    listing: { type: Object, required: true },
    listingTypeLabel: { type: String, default: '' },
    url: { type: String, required: true },
    showStatus: { type: Boolean, default: true },
});

/** First photo: prefer uploads (lg_url/sm_url), fallback to Orchid attachments */
const listingThumbUrl = computed(() => {
    const listing = props.listing;
    const firstUpload = listing.uploads?.[0];
    if (firstUpload?.status === 'ready' && (firstUpload.lg_url || firstUpload.sm_url)) {
        return firstUpload.lg_url || firstUpload.sm_url;
    }
    return listing.attachments?.[0]?.url ?? null;
});
</script>

<template>
    <a
        :href="url"
        class="block rounded-token-md border border-border bg-card p-4 shadow-sm transition hover:border-primary hover:shadow underline"
    >
        <div v-if="listingThumbUrl" class="mb-2 aspect-video w-full overflow-hidden rounded-token-sm bg-muted/30">
            <img :src="listingThumbUrl" :alt="listing.title" class="h-full w-full object-cover" />
        </div>
        <div v-else class="mb-2 aspect-video w-full rounded-token-sm bg-muted/30 flex items-center justify-center text-muted text-sm">No photo</div>
        <h3 class="font-medium text-fg line-clamp-1">{{ listing.title }}</h3>
        <p class="mt-0.5 text-sm text-muted">
            {{ listingTypeLabel || listing.type }} · {{ listing.price != null ? `$${Number(listing.price).toLocaleString()}` : 'Free' }}
        </p>
        <div v-if="showStatus && listing.state" class="mt-2">
            <StatusTag :status="listing.state" />
        </div>
    </a>
</template>
