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

const encodedEmail = computed(() => encodeURIComponent(props.email));
const encodedSubject = computed(() => encodeURIComponent(props.mailtoSubject || ''));

const webmailLinks = computed(() => [
    { name: 'Gmail', url: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedEmail.value}&su=${encodedSubject.value}` },
    { name: 'Yahoo Mail', url: `https://compose.mail.yahoo.com/?to=${encodedEmail.value}&subject=${encodedSubject.value}` },
    { name: 'Outlook', url: `https://outlook.live.com/mail/0/deeplink/compose?to=${encodedEmail.value}&subject=${encodedSubject.value}` },
    { name: 'AOL Mail', url: `https://mail.aol.com/webmail-std/en-us/send?to=${encodedEmail.value}&subject=${encodedSubject.value}` },
]);
</script>

<template>
    <div class="overflow-hidden border rounded-token-md border-border bg-card">
        <button
            type="button"
            class="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-left text-fg hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            :aria-expanded="expanded"
            @click="expanded = !expanded"
        >
            <span>{{ label }}</span>
            <span class="text-muted" aria-hidden="true">{{ expanded ? '▼' : '▶' }}</span>
        </button>
        <div v-show="expanded" class="px-4 py-4 border-t border-border">
            <p v-if="note" class="text-sm text-muted">{{ note }}</p>
            <div class="email-relay-row">
                <code class="email-relay-address">{{ email }}</code>
                <gv-button type="button" variant="primary" class="email-relay-copy" :title="copied ? 'Copied to clipboard' : 'Copy address'" @click="copy">
                    {{ copied ? 'Copied!' : 'Copy' }}
                </gv-button>
            </div>
            <p class="govuk-body-s govuk-!-margin-top-3 govuk-!-margin-bottom-1">Reply via webmail:</p>
            <ul class="govuk-list govuk-list--inline">
                <li key="email-app" class="govuk-!-display-inline">
                    <a :href="mailtoHref" class="govuk-link govuk-link--no-visited-state" target="_blank" rel="noopener">Email App</a><span class="govuk-!-margin-left-1 govuk-!-margin-right-1" aria-hidden="true">|</span>
                </li>
                <li v-for="(link, i) in webmailLinks" :key="link.name" class="govuk-!-display-inline">
                    <a :href="link.url" class="govuk-link govuk-link--no-visited-state" target="_blank" rel="noopener">{{ link.name }}</a><span v-if="i < webmailLinks.length - 1" class="govuk-!-margin-left-1 govuk-!-margin-right-1" aria-hidden="true">|</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.email-relay-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.email-relay-address {
    flex: 1;
    min-width: 0;
    margin: 0;
    padding: 0.5rem 0.625rem;
    min-height: 2.5rem;
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    line-height: 1.25;
    background: rgb(var(--muted) / 0.3);
    color: rgb(var(--fg));
    border-radius: 0.25rem;
    word-break: break-all;
    box-sizing: border-box;
}

.email-relay-copy {
    flex-shrink: 0;
    min-height: 2.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
</style>
