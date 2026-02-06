<script setup>
import { useForm } from '@inertiajs/vue3';
import { computed, watch } from 'vue';
import SingleImageUpload from '@/Components/SingleImageUpload.vue';

const props = defineProps({
    communityPage: { type: Object, default: null },
    cityBaseUrl: { type: String, required: true },
    old: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['update:processing']);
const isEdit = computed(() => !!props.communityPage);
const submitUrl = computed(() =>
    isEdit.value
        ? `${props.cityBaseUrl}/community/${props.communityPage.slug}`
        : `${props.cityBaseUrl}/community`
);

const oldInput = props.old || {};
const cp = props.communityPage || {};
const initialUploadIds = (cp.uploads && Array.isArray(cp.uploads) && cp.uploads.length)
    ? [cp.uploads[0].id]
    : (oldInput.upload_ids && Array.isArray(oldInput.upload_ids) ? oldInput.upload_ids : []);
const form = useForm({
    type: oldInput.type ?? cp.type ?? 'bike_shop',
    name: oldInput.name ?? cp.name ?? '',
    about: oldInput.about ?? cp.about ?? '',
    event_info: oldInput.event_info ?? cp.event_info ?? '',
    sales_info: oldInput.sales_info ?? cp.sales_info ?? '',
    contact_address: oldInput.contact_address ?? cp.contact_address ?? '',
    contact_email: oldInput.contact_email ?? cp.contact_email ?? '',
    contact_phone: oldInput.contact_phone ?? cp.contact_phone ?? '',
    upload_ids: initialUploadIds,
});

function submit() {
    emit('update:processing', true);
    if (isEdit.value) {
        form.put(submitUrl.value, { preserveScroll: true });
    } else {
        form.post(submitUrl.value, { preserveScroll: true });
    }
}

const hasErrors = () => Object.keys(form.errors).length > 0;
watch(() => form.processing, (v) => emit('update:processing', v), { immediate: true });
</script>

<template>
    <form @submit.prevent="submit">
        <gv-error-summary v-if="hasErrors()" title="There is a problem">
            <gv-error-link
                v-for="(message, field) in form.errors"
                :key="field"
                :target-id="field"
                :text="message"
            />
        </gv-error-summary>

        <gv-select
            v-if="!isEdit"
            id="type"
            v-model="form.type"
            name="type"
            label="Type *"
            required
            :error-message="form.errors.type"
        >
            <gv-select-option value="bike_shop">Bike shop</gv-select-option>
            <gv-select-option value="club">Club</gv-select-option>
            <gv-select-option value="recurring_event">Recurring event</gv-select-option>
        </gv-select>

        <gv-input
            id="name"
            v-model="form.name"
            name="name"
            label="Name *"
            type="text"
            required
            :error-message="form.errors.name"
            class="govuk-!-width-full"
        />

        <gv-textarea
            id="about"
            v-model="form.about"
            name="about"
            label="About"
            :rows="4"
            class="govuk-!-width-full"
        />

        <gv-textarea
            id="event_info"
            v-model="form.event_info"
            name="event_info"
            label="Event info"
            :rows="2"
            class="govuk-!-width-full"
        />

        <gv-textarea
            id="sales_info"
            v-model="form.sales_info"
            name="sales_info"
            label="Sales info"
            :rows="2"
            class="govuk-!-width-full"
        />

        <gv-input
            id="contact_address"
            v-model="form.contact_address"
            name="contact_address"
            label="Contact address"
            type="text"
            class="govuk-!-width-full"
        />

        <gv-input
            id="contact_email"
            v-model="form.contact_email"
            name="contact_email"
            label="Contact email"
            type="email"
            :error-message="form.errors.contact_email"
            class="govuk-!-width-full"
        />

        <gv-input
            id="contact_phone"
            v-model="form.contact_phone"
            name="contact_phone"
            label="Contact phone"
            type="text"
            class="govuk-!-width-full"
        />

        <SingleImageUpload
            v-model="form.upload_ids"
            input-id="community_page_image"
            label="Page image (optional, one image)"
            hint="JPEG, PNG, WebP or BMP. Max 10MB."
        />

        <div class="govuk-button-group govuk-!-margin-top-6">
            <gv-button type="submit" variant="primary" :disabled="form.processing">
                {{ isEdit ? 'Save' : 'Submit' }}
            </gv-button>
            <a :href="isEdit ? `${cityBaseUrl}/community/${communityPage.slug}` : `${cityBaseUrl}/community`" class="govuk-link">Cancel</a>
        </div>
    </form>
</template>
