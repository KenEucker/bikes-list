<script setup>
import { useForm } from '@inertiajs/vue3';
import { computed, watch } from 'vue';

const emit = defineEmits(['update:processing']);

const props = defineProps({
    listing: { type: Object, default: null },
    listingTypes: { type: Object, required: true },
    conditions: { type: Object, default: () => ({}) },
    managedCommunityPages: { type: Array, default: () => [] },
    cityBaseUrl: { type: String, required: true },
    old: { type: Object, default: () => ({}) },
});

const isEdit = computed(() => !!props.listing);
const heading = computed(() => (isEdit.value ? 'Edit listing' : 'New listing'));
const submitUrl = computed(() =>
    isEdit.value ? `${props.cityBaseUrl}/listings/${props.listing.id}` : `${props.cityBaseUrl}/listings`
);

const oldInput = props.old || {};
const listing = props.listing || {};
const form = useForm({
    type: oldInput.type ?? listing.type ?? 'full_bicycle',
    title: oldInput.title ?? listing.title ?? '',
    description: oldInput.description ?? listing.description ?? '',
    price: oldInput.price ?? listing.price ?? '',
    condition: oldInput.condition ?? listing.condition ?? 'good',
    location_address: oldInput.location_address ?? listing.location_address ?? '',
    community_page_id: oldInput.community_page_id ?? listing.community_page_id ?? '',
    serial_number: oldInput.serial_number ?? listing.serial_number ?? '',
    serial_private: oldInput.serial_private !== '0' && oldInput.serial_private !== 0 && (listing.serial_private !== false),
    submit_for_review: true,
});

function conditionsList() {
    const c = props.conditions && typeof props.conditions === 'object' && !Array.isArray(props.conditions)
        ? props.conditions
        : { new: 'New', like_new: 'Like new', good: 'Good', fair: 'Fair', poor: 'Poor' };
    return Object.entries(c);
}

function submit(forReview) {
    if (isEdit.value) {
        form.put(submitUrl.value, { preserveScroll: true });
    } else {
        form.submit_for_review = forReview;
        form.post(submitUrl.value, { preserveScroll: true });
    }
}

const hasErrors = () => Object.keys(form.errors).length > 0;

watch(() => form.processing, (v) => emit('update:processing', v), { immediate: true });
</script>

<template>
    <form @submit.prevent="isEdit ? submit() : submit(true)">
        <gv-error-summary v-if="hasErrors()" title="There is a problem">
            <gv-error-link
                v-for="(message, field) in form.errors"
                :key="field"
                :target-id="field"
                :text="message"
            />
        </gv-error-summary>

        <gv-select
            id="type"
            v-model="form.type"
            name="type"
            label="Type"
            required
            :error-message="form.errors.type"
        >
            <gv-select-option
                v-for="(config, key) in listingTypes"
                :key="key"
                :value="key"
            >
                {{ config.label }}
            </gv-select-option>
        </gv-select>

        <gv-input
            id="title"
            v-model="form.title"
            name="title"
            label="Title (6–80 characters)"
            type="text"
            maxlength="80"
            required
            :error-message="form.errors.title"
            class="govuk-!-width-full"
        />

        <gv-textarea
            id="description"
            v-model="form.description"
            name="description"
            label="Description (at least 20 characters)"
            :rows="4"
            required
            :hint="`${(form.description || '').length} characters (minimum 20)`"
            :error-message="form.errors.description"
            class="govuk-!-width-full"
        />

        <gv-input
            id="price"
            v-model="form.price"
            name="price"
            label="Price"
            type="number"
            hint="Use 0 for free."
            :error-message="form.errors.price"
            class="govuk-!-width-full"
        />

        <gv-select
            id="condition"
            v-model="form.condition"
            name="condition"
            label="Condition"
            required
            :error-message="form.errors.condition"
        >
            <gv-select-option
                v-for="[value, label] in conditionsList()"
                :key="value"
                :value="value"
            >
                {{ label }}
            </gv-select-option>
        </gv-select>

        <template v-if="form.type === 'full_bicycle'">
            <gv-input
                id="serial_number"
                v-model="form.serial_number"
                name="serial_number"
                label="Serial number (optional, private by default)"
                type="text"
                class="govuk-!-width-full"
            />
            <gv-checkbox
                id="serial_private"
                v-model="form.serial_private"
                name="serial_private"
                label="Keep serial private"
                class="govuk-!-margin-top-4"
            />
        </template>

        <gv-input
            id="location_address"
            v-model="form.location_address"
            name="location_address"
            label="Location (optional)"
            type="text"
            class="govuk-!-width-full"
        />

        <gv-select
            v-if="managedCommunityPages.length"
            id="community_page_id"
            v-model="form.community_page_id"
            name="community_page_id"
            label="Post as (optional)"
            class="govuk-!-width-full"
        >
            <gv-select-option value="">My personal listing</gv-select-option>
            <gv-select-option
                v-for="page in managedCommunityPages"
                :key="page.id"
                :value="String(page.id)"
            >
                {{ page.name }}
            </gv-select-option>
        </gv-select>

        <div class="govuk-button-group govuk-!-margin-top-6">
            <template v-if="!isEdit">
                <gv-button type="submit" variant="primary" :disabled="form.processing">
                    Submit for review
                </gv-button>
                <gv-button
                    type="button"
                    variant="secondary"
                    :disabled="form.processing"
                    @click="submit(false)"
                >
                    Save draft
                </gv-button>
            </template>
            <gv-button v-else type="submit" variant="primary" :disabled="form.processing">
                Save
            </gv-button>
            <a :href="isEdit ? `${cityBaseUrl}/listings/${listing.id}` : `${cityBaseUrl}/listings`" class="govuk-link">Cancel</a>
        </div>
    </form>
</template>
