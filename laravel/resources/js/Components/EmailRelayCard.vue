<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
    email: { type: String, required: true },
    label: { type: String, default: 'Contact' },
    note: { type: String, default: '' },
    mailtoSubject: { type: String, default: '' },
});

const expanded = ref(false);
const copied = ref(false);

async function copy() {
    if (!props.email) return;
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(props.email);
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = props.email;
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

const mailtoHref = computed(() => {
    const subject = props.mailtoSubject ? `?subject=${encodeURIComponent(props.mailtoSubject)}` : '';
    return `mailto:${encodeURIComponent(props.email)}${subject}`;
});
</script>

<template>
    <div class="rounded-token-md border border-border bg-card overflow-hidden">
        <button
            type="button"
            class="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-fg hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            :aria-expanded="expanded"
            @click="expanded = !expanded"
        >
            <span>{{ label }}</span>
            <span class="text-muted" aria-hidden="true">{{ expanded ? '▼' : '▶' }}</span>
        </button>
        <div v-show="expanded" class="border-t border-border px-4 py-4">
            <p v-if="note" class="text-sm text-muted">{{ note }}</p>
            <div class="mt-2 flex flex-wrap items-center gap-2">
                <code class="flex-1 min-w-0 rounded-token-sm bg-muted/30 px-2 py-1.5 text-sm text-fg">{{ email }}</code>
                <gv-button type="button" variant="primary" :title="copied ? 'Copied to clipboard' : 'Copy address'" @click="copy">
                    {{ copied ? 'Copied!' : 'Copy' }}
                </gv-button>
                <a :href="mailtoHref" class="govuk-link govuk-link--no-visited-state" target="_blank" rel="noopener">
                    Email
                </a>
            </div>
        </div>
    </div>
</template>
