<script setup>
import { ref } from 'vue';

const props = defineProps({
    moderatorRelayEmail: { type: String, required: true },
    itemType: { type: String, required: true },
    itemTitle: { type: String, required: true },
    itemIdOrSlug: { type: [String, Number], required: true },
});

const expanded = ref(false);
const copied = ref(false);

async function copy() {
    if (!props.moderatorRelayEmail) return;
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(props.moderatorRelayEmail);
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = props.moderatorRelayEmail;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
        copied.value = true;
        setTimeout(() => { copied.value = false; }, 2000);
    } catch (err) {
        console.warn('Copy failed:', err);
    }
}

const subject = `Report: ${props.itemType} – ${props.itemTitle} – ${props.itemIdOrSlug}`;
const mailtoHref = `mailto:${encodeURIComponent(props.moderatorRelayEmail)}?subject=${encodeURIComponent(subject)}`;
</script>

<template>
    <div class="rounded-token-md border border-border bg-card overflow-hidden">
        <button
            type="button"
            class="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-fg hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            @click="expanded = !expanded"
            :aria-expanded="expanded"
        >
            <span>Report this {{ itemType.toLowerCase() }}</span>
            <span class="text-muted" aria-hidden="true">{{ expanded ? '▼' : '▶' }}</span>
        </button>
        <div v-show="expanded" class="border-t border-border px-4 py-4">
            <p class="text-sm text-muted">To report this item, email the city moderators using the address below. Include the subject line so they can identify the item.</p>
            <div class="mt-2 flex flex-wrap items-center gap-2">
                <code class="flex-1 min-w-0 rounded-token-sm bg-muted/30 px-2 py-1.5 text-sm text-fg">{{ moderatorRelayEmail }}</code>
                <div class="relative">
                    <button
                        type="button"
                        class="rounded-token-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-fg hover:opacity-90"
                        @click="copy"
                        :title="copied ? 'Copied to clipboard' : 'Copy address'"
                    >
                        {{ copied ? 'Copied!' : 'Copy' }}
                    </button>
                    <Transition name="fade">
                        <span
                            v-if="copied"
                            class="absolute left-1/2 top-full z-10 mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-fg px-2 py-1 text-xs text-page shadow"
                            role="status"
                        >
                            Address copied to clipboard
                        </span>
                    </Transition>
                </div>
                <a
                    :href="mailtoHref"
                    class="rounded-token-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-fg hover:opacity-90 underline"
                >
                    Email
                </a>
            </div>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
