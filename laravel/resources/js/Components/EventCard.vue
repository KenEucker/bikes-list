<script setup>
import StatusChip from './StatusChip.vue';

defineProps({
    event: { type: Object, required: true },
    url: { type: String, required: true },
    showStatus: { type: Boolean, default: true },
});
</script>

<template>
    <a
        :href="url"
        class="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-600"
    >
        <h3 class="font-medium text-gray-900 dark:text-white line-clamp-1">{{ event.title }}</h3>
        <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            {{ event.starts_at ? new Date(event.starts_at).toLocaleDateString() : '' }}
            {{ event.starts_at ? new Date(event.starts_at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '' }}
        </p>
        <div v-if="showStatus && event.state" class="mt-2">
            <StatusChip :status="event.state" />
        </div>
    </a>
</template>
