<script setup>
import { Link } from '@inertiajs/vue3';
import StatusTag from '@/Components/StatusTag.vue';

defineProps({
    items: { type: Array, required: true },
    entityLabel: { type: String, required: true },
    titleKey: { type: String, default: 'title' },
    showUrlFn: { type: Function, required: true },
    approveUrlFn: { type: Function, required: true },
    removeUrlFn: { type: Function, required: true },
    subtitleFn: { type: Function, default: null },
    statusValue: { type: String, required: true },
    emptyMessage: { type: String, default: 'No pending items.' },
    confirmRemove: { type: Boolean, default: true },
});
</script>

<template>
    <ul class="mt-6 space-y-4">
        <li v-for="item in items" :key="item.id" class="rounded-token-md border border-border bg-card p-4">
            <a :href="showUrlFn(item)" class="font-medium text-primary underline">{{ item[titleKey] }}</a>
            <p v-if="subtitleFn" class="mt-1 text-sm text-muted">{{ subtitleFn(item) }}</p>
            <StatusTag :status="statusValue" class="mt-2" />
            <div class="mt-3 govuk-button-group">
                <Link :href="approveUrlFn(item)" method="post" as="button" class="govuk-button">
                    {{ statusValue === 'pending' ? 'Approve' : 'Approve / Publish' }}
                </Link>
                <form
                    :action="removeUrlFn(item)"
                    method="post"
                    class="inline govuk-!-display-inline"
                    @submit.prevent="(e) => { if (!confirmRemove || confirm('Remove this item? Note is required.')) { e.target.submit(); } }"
                >
                    <input type="hidden" name="_token" :value="$page.props.csrf_token" />
                    <input type="text" name="note" required placeholder="Reason (required)" class="govuk-input govuk-!-width-one-third govuk-!-margin-right-2" />
                    <gv-button type="submit" variant="warning">Remove</gv-button>
                </form>
            </div>
        </li>
    </ul>
    <p v-if="!items.length" class="mt-6 text-muted">{{ emptyMessage }}</p>
</template>
