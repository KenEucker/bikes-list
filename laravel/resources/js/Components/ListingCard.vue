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
        class="block rounded-token-md border border-border bg-card p-4 shadow-sm transition hover:border-primary hover:shadow underline"
    >
        <div v-if="(listing.attachments?.length ?? 0) > 0" class="mb-2 aspect-video w-full overflow-hidden rounded-token-sm bg-muted/30">
            <img :src="listing.attachments?.[0]?.url" :alt="listing.title" class="h-full w-full object-cover" />
        </div>
        <div v-else class="mb-2 aspect-video w-full rounded-token-sm bg-muted/30 flex items-center justify-center text-muted text-sm">No photo</div>
        <h3 class="font-medium text-fg line-clamp-1">{{ listing.title }}</h3>
        <p class="mt-0.5 text-sm text-muted">
            {{ listingTypeLabel || listing.type }} · {{ listing.price != null ? `$${Number(listing.price).toLocaleString()}` : 'Free' }}
        </p>
        <div v-if="showStatus && listing.state" class="mt-2">
            <StatusChip :status="listing.state" />
        </div>
    </a>
</template>
