<script setup>
import { ref } from 'vue';

const props = defineProps({
    moderatorRelayEmail: { type: String, required: true },
    itemType: { type: String, required: true },
    itemTitle: { type: String, required: true },
    itemIdOrSlug: { type: [String, Number], required: true },
});

const copied = ref(false);

function copy() {
    if (!props.moderatorRelayEmail) return;
    navigator.clipboard.writeText(props.moderatorRelayEmail);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
}

const subject = `Report: ${props.itemType} – ${props.itemTitle} – ${props.itemIdOrSlug}`;
const mailtoHref = `mailto:${encodeURIComponent(props.moderatorRelayEmail)}?subject=${encodeURIComponent(subject)}`;
</script>

<template>
    <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Report this {{ itemType.toLowerCase() }}</p>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">To report this item, email the city moderators using the address below. Include the subject line so they can identify the item.</p>
        <div class="mt-2 flex flex-wrap items-center gap-2">
            <code class="flex-1 min-w-0 rounded bg-gray-100 px-2 py-1.5 text-sm dark:bg-gray-700">{{ moderatorRelayEmail }}</code>
            <button
                type="button"
                class="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
                @click="copy"
            >
                {{ copied ? 'Copied!' : 'Copy' }}
            </button>
            <a
                :href="mailtoHref"
                class="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
            >
                Open mailto
            </a>
        </div>
    </div>
</template>
