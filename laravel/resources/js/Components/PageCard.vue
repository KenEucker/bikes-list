<script setup>
import StatusChip from './StatusChip.vue';

defineProps({
    page: { type: Object, required: true },
    url: { type: String, required: true },
    showStatus: { type: Boolean, default: true },
});
</script>

<template>
    <a
        :href="url"
        class="block rounded-token-md border border-border bg-card p-4 shadow-sm transition hover:border-primary hover:shadow underline"
    >
        <h3 class="font-medium text-fg line-clamp-1">{{ page.name }}</h3>
        <p v-if="page.type" class="mt-0.5 text-sm text-muted">{{ page.type }}</p>
        <div v-if="showStatus && page.state" class="mt-2">
            <StatusChip :status="page.state" />
        </div>
    </a>
</template>
