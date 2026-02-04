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
    <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ label }} (email relay)</p>
        <p v-if="note" class="mt-1 text-sm text-gray-600 dark:text-gray-400">{{ note }}</p>
        <div class="mt-2 flex flex-wrap items-center gap-2">
            <code class="flex-1 min-w-0 rounded bg-gray-100 px-2 py-1.5 text-sm dark:bg-gray-700">{{ email }}</code>
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
