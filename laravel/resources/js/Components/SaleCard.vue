<script setup>
import { computed } from 'vue';
import StatusTag from './StatusTag.vue';

const props = defineProps({
    sale: { type: Object, required: true },
    saleTypeLabel: { type: String, default: '' },
    url: { type: String, required: true },
    showStatus: { type: Boolean, default: true },
});

/** First photo: prefer uploads (lg_url/sm_url), fallback to Orchid attachments */
const saleThumbUrl = computed(() => {
    const sale = props.sale;
    const firstUpload = sale.uploads?.[0];
    if (firstUpload?.status === 'ready' && (firstUpload.lg_url || firstUpload.sm_url)) {
        return firstUpload.lg_url || firstUpload.sm_url;
    }
    return sale.attachments?.[0]?.url ?? null;
});
</script>

<template>
    <a
        :href="url"
        class="block rounded-token-md border border-border bg-card p-4 shadow-sm transition hover:border-primary hover:shadow underline"
    >
        <div v-if="saleThumbUrl" class="mb-2 aspect-video w-full overflow-hidden rounded-token-sm bg-muted/30">
            <img :src="saleThumbUrl" :alt="sale.title" class="h-full w-full object-cover" />
        </div>
        <div v-else class="mb-2 aspect-video w-full rounded-token-sm bg-muted/30 flex items-center justify-center text-muted text-sm">No photo</div>
        <h3 class="font-medium text-fg line-clamp-1">{{ sale.title }}</h3>
        <p class="mt-0.5 text-sm text-muted">
            {{ saleTypeLabel || sale.type }} · {{ sale.price != null ? `$${Number(sale.price).toLocaleString()}` : 'Free' }}
        </p>
        <div v-if="showStatus && sale.state" class="mt-2">
            <StatusTag :status="sale.state" />
        </div>
    </a>
</template>
