<script setup>
import StatusTag from '@/Components/StatusTag.vue';

const props = defineProps({
    items: { type: Array, required: true },
    entityLabel: { type: String, required: true },
    titleKey: { type: String, default: 'title' },
    showUrlFn: { type: Function, required: true },
    approveUrlFn: { type: Function, default: null },
    removeUrlFn: { type: Function, required: true },
    revertUrlFn: { type: Function, default: null },
    subtitleFn: { type: Function, default: null },
    statusValue: { type: String, required: true },
    emptyMessage: { type: String, default: 'No pending items.' },
    confirmRemove: { type: Boolean, default: false },
    reasonCodes: { type: Object, default: () => ({}) },
});

function syncReasonToForm(itemId, form) {
    const sel = document.getElementById(`reason-${itemId}`);
    const input = form.querySelector('input[name="reason_code"]');
    if (sel && input) input.value = sel.value;
}

function onApproveSubmit(itemId, form) {
    const sel = document.getElementById(`reason-${itemId}`);
    if (sel && !sel.value) return false;
    syncReasonToForm(itemId, form);
    return true;
}

function onRemoveSubmit(itemId, form) {
    const sel = document.getElementById(`reason-${itemId}`);
    if (sel && !sel.value) return false;
    syncReasonToForm(itemId, form);
    return true;
}

function onRevertSubmit(itemId, form) {
    syncReasonToForm(itemId, form);
}
</script>

<template>
    <ul class="govuk-list mt-6" style="list-style: none; padding-left: 0;">
        <li
            v-for="item in items"
            :key="item.id"
            class="govuk-!-margin-bottom-6 rounded-token-md border border-border bg-card p-4"
        >
            <a :href="showUrlFn(item)" class="govuk-link govuk-link--no-visited-state font-medium">
                {{ item[titleKey] }}
            </a>
            <p v-if="subtitleFn" class="govuk-body-s govuk-!-margin-top-1 text-muted">
                {{ subtitleFn(item) }}
            </p>
            <StatusTag :status="statusValue" class="govuk-!-margin-top-2" />

            <!-- One reason code + all action buttons in one row -->
            <div class="govuk-!-margin-top-4 flex flex-wrap items-end gap-3">
                <div class="govuk-form-group govuk-!-margin-bottom-0">
                    <label :for="`reason-${item.id}`" class="govuk-label govuk-label--s govuk-!-margin-bottom-1">
                        Reason code
                    </label>
                    <select
                        :id="`reason-${item.id}`"
                        class="govuk-select"
                        style="min-width: 14rem; width: 14rem;"
                    >
                        <option value="">Select reason</option>
                        <option v-for="(label, code) in reasonCodes" :key="code" :value="code">
                            {{ label }}
                        </option>
                    </select>
                </div>
                <div class="govuk-button-group govuk-!-margin-bottom-0 flex flex-wrap gap-2" style="align-items: flex-end;">
                    <form
                        v-if="approveUrlFn"
                        :action="approveUrlFn(item)"
                        method="post"
                        class="govuk-!-margin-0"
                        style="display: inline-block; margin-bottom: 0;"
                        @submit="(e) => { if (!onApproveSubmit(item.id, e.target)) e.preventDefault(); }"
                    >
                        <input type="hidden" name="_token" :value="$page.props.csrf_token" />
                        <input type="hidden" name="reason_code" value="" />
                        <button type="submit" class="govuk-button govuk-!-margin-bottom-0">
                            {{ statusValue === 'pending' || statusValue === 'pending_review' ? 'Approve / Publish' : 'Approve' }}
                        </button>
                    </form>
                    <form
                        :action="removeUrlFn(item)"
                        method="post"
                        class="govuk-!-margin-0"
                        style="display: inline-block; margin-bottom: 0;"
                        @submit="(e) => { e.preventDefault(); if (onRemoveSubmit(item.id, e.target)) e.target.submit(); }"
                    >
                        <input type="hidden" name="_token" :value="$page.props.csrf_token" />
                        <input type="hidden" name="reason_code" value="" />
                        <button type="submit" class="govuk-button govuk-button--warning govuk-!-margin-bottom-0">
                            Remove
                        </button>
                    </form>
                    <!-- Single revert form: button on this row, note textarea below (same form) -->
                    <form
                        v-if="revertUrlFn"
                        :action="revertUrlFn(item)"
                        method="post"
                        class="govuk-!-margin-0 flex flex-wrap gap-3"
                        style="display: inline-flex; flex-wrap: wrap; align-items: flex-end; margin-bottom: 0;"
                        @submit="(e) => { onRevertSubmit(item.id, e.target); }"
                    >
                        <input type="hidden" name="_token" :value="$page.props.csrf_token" />
                        <input type="hidden" name="reason_code" value="" />
                        <button type="submit" class="govuk-button govuk-button--secondary govuk-!-margin-bottom-0">
                            Revert to draft
                        </button>
                        <div class="w-full govuk-!-margin-top-3" style="min-width: 100%;">
                            <label class="govuk-label govuk-label--s govuk-!-margin-bottom-1">Note to creator (required)</label>
                            <textarea
                                name="moderation_note"
                                class="govuk-textarea"
                                rows="3"
                                required
                                maxlength="2000"
                                placeholder="Required"
                                style="max-width: 28rem;"
                            ></textarea>
                        </div>
                    </form>
                </div>
            </div>
        </li>
    </ul>
    <p v-if="!items.length" class="govuk-body text-muted govuk-!-margin-top-6">
        {{ emptyMessage }}
    </p>
</template>
