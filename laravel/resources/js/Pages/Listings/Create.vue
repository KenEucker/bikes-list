<script setup>
import { Head, useForm } from '@inertiajs/vue3';
import { nextTick } from 'vue';
import CityNav from '@/Components/CityNav.vue';

const props = defineProps({
    city: { type: Object, required: true },
    listingTypes: { type: Object, required: true },
    conditions: { type: Object, default: () => ({}) },
    managedCommunityPages: { type: Array, default: () => [] },
    homeUrl: { type: String, default: '/' },
    cityBaseUrl: { type: String, required: true },
});

const form = useForm({
    title: '',
    description: '',
    type: 'full_bicycle',
    price: null,
    condition: 'good',
    location_address: '',
    community_page_id: null,
    serial_number: '',
    serial_private: true,
    attributes: {},
    submit_for_review: false,
});

const conditionsList = () => props.conditions && typeof props.conditions === 'object' && !Array.isArray(props.conditions)
    ? Object.entries(props.conditions)
    : Object.entries({ new: 'New', like_new: 'Like new', good: 'Good', fair: 'Fair', poor: 'Poor' });

async function submit(draft) {
    form.submit_for_review = !draft;
    await nextTick();
    form.post(`${props.cityBaseUrl}/listings`, {
        forceFormData: true,
    });
}

const hasErrors = () => Object.keys(form.errors).length > 0;
</script>

<template>
    <Head :title="`New listing – ${city.name}`" />
    <div class="min-h-screen bg-page">
        <CityNav :city="city" :city-base-url="cityBaseUrl" breadcrumb="New listing">
            <template #nav-right>
                <a :href="`${cityBaseUrl}/listings`" class="govuk-link">Back to listings</a>
            </template>
        </CityNav>

        <main class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="govuk-heading-l">New listing</h1>
            <p class="govuk-body">Title 6–80 characters. Description at least 20 characters. 1–4 photos (add after creating draft if needed).</p>

            <form @submit.prevent>
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
                    label="Type"
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
                    label="Title (6–80 characters)"
                    type="text"
                    :error-message="form.errors.title"
                    maxlength="80"
                />

                <gv-textarea
                    id="description"
                    v-model="form.description"
                    label="Description (at least 20 characters)"
                    :rows="4"
                    :error-message="form.errors.description"
                />

                <gv-input
                    id="price"
                    v-model="form.price"
                    label="Price"
                    hint="Use 0 for free."
                    type="number"
                    :error-message="form.errors.price"
                />

                <gv-select
                    id="condition"
                    v-model="form.condition"
                    label="Condition"
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
                        label="Serial number (optional, private by default)"
                        type="text"
                    />
                    <gv-checkbox
                        id="serial_private"
                        v-model="form.serial_private"
                        name="serial_private"
                        label="Keep serial private"
                    />
                </template>

                <gv-input
                    id="location_address"
                    v-model="form.location_address"
                    label="Location (optional)"
                    type="text"
                />

                <gv-select
                    v-if="managedCommunityPages.length"
                    id="community_page_id"
                    v-model="form.community_page_id"
                    label="Post as (optional)"
                >
                    <gv-select-option :value="null">My personal listing</gv-select-option>
                    <gv-select-option
                        v-for="page in managedCommunityPages"
                        :key="page.id"
                        :value="page.id"
                    >
                        {{ page.name }}
                    </gv-select-option>
                </gv-select>

                <div class="govuk-button-group govuk-!-margin-top-6">
                    <gv-button
                        type="button"
                        variant="primary"
                        :disabled="form.processing"
                        @click="submit(false)"
                    >
                        Submit for review
                    </gv-button>
                    <gv-button
                        type="button"
                        variant="secondary"
                        :disabled="form.processing"
                        @click="submit(true)"
                    >
                        Save draft
                    </gv-button>
                    <a :href="`${cityBaseUrl}/listings`" class="govuk-link">Cancel</a>
                </div>
            </form>
            <p class="govuk-body govuk-!-margin-top-4">Submitting for review will list this item as pending; it will be published automatically if not reviewed by a moderator.</p>
        </main>
    </div>
</template>
