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
        class="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-600"
    >
        <h3 class="font-medium text-gray-900 dark:text-white line-clamp-1">{{ page.name }}</h3>
        <p v-if="page.type" class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{{ page.type }}</p>
        <div v-if="showStatus && page.state" class="mt-2">
            <StatusChip :status="page.state" />
        </div>
    </a>
</template>
