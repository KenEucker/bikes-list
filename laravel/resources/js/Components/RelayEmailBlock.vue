<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
    email: { type: String, required: true },
    label: { type: String, default: 'Contact' },
    note: { type: String, default: 'Copy the address below and use your own email client. Your address is never shown to the recipient.' },
    mailtoSubject: { type: String, default: '' },
});

const copied = ref(false);

function copy() {
    if (!props.email) return;
    navigator.clipboard.writeText(props.email);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
}

const mailtoHref = computed(() => {
    const subject = props.mailtoSubject ? `?subject=${encodeURIComponent(props.mailtoSubject)}` : '';
    return `mailto:${encodeURIComponent(props.email)}${subject}`;
});
</script>

<template>
    <div class="rounded-token-md border border-border bg-card p-4">
        <p class="text-sm font-medium text-fg">{{ label }} (email relay)</p>
        <p v-if="note" class="mt-1 text-sm text-muted">{{ note }}</p>
        <div class="mt-2 flex flex-wrap items-center gap-2">
            <code class="flex-1 min-w-0 rounded-token-sm bg-muted/30 px-2 py-1.5 text-sm text-fg">{{ email }}</code>
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
