<script setup>
import StatusTag from './StatusTag.vue';

defineProps({
    event: { type: Object, required: true },
    url: { type: String, required: true },
    showStatus: { type: Boolean, default: true },
});
</script>

<template>
    <a
        :href="url"
        class="block rounded-token-md border border-border bg-card p-4 shadow-sm transition hover:border-primary hover:shadow underline"
    >
        <h3 class="font-medium text-fg line-clamp-1">{{ event.title }}</h3>
        <p class="mt-0.5 text-sm text-muted">
            {{ event.starts_at ? new Date(event.starts_at).toLocaleDateString() : '' }}
            {{ event.starts_at ? new Date(event.starts_at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '' }}
        </p>
        <div v-if="showStatus && event.state" class="mt-2">
            <StatusTag :status="event.state" />
        </div>
    </a>
</template>
