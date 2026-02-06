<script setup>
import { computed } from 'vue';

const props = defineProps({
    show: { type: Boolean, default: false },
    /** e.g. "sale", "ride", "page" — used in copy */
    resourceLabel: { type: String, default: 'item' },
});

const message = computed(() =>
    `This ${props.resourceLabel} is pending review. It is not visible to the public yet. A moderator will review it; when approved, it will be published.`
);
</script>

<template>
    <gv-notification-banner
        v-if="show"
        type="warning"
        title="Pending review"
        class="rounded-none border-x-0 border-t-0 border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800"
    >
        <p class="govuk-body">{{ message }}</p>
    </gv-notification-banner>
</template>
