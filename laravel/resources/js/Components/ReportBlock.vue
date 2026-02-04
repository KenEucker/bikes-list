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
    <div class="rounded-token-md border border-border bg-card p-4">
        <p class="text-sm font-medium text-fg">Report this {{ itemType.toLowerCase() }}</p>
        <p class="mt-1 text-sm text-muted">To report this item, email the city moderators using the address below. Include the subject line so they can identify the item.</p>
        <div class="mt-2 flex flex-wrap items-center gap-2">
            <code class="flex-1 min-w-0 rounded-token-sm bg-muted/30 px-2 py-1.5 text-sm text-fg">{{ moderatorRelayEmail }}</code>
            <button
                type="button"
                class="rounded-token-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-fg hover:opacity-90"
                @click="copy"
            >
                {{ copied ? 'Copied!' : 'Copy' }}
            </button>
            <a
                :href="mailtoHref"
                class="rounded-token-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-fg hover:opacity-90 underline"
            >
                Open mailto
            </a>
        </div>
    </div>
</template>
