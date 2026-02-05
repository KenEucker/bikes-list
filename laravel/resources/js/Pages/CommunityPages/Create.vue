<script setup>
import { useForm } from '@inertiajs/vue3';
import CreatePageLayout from '@/Components/CreatePageLayout.vue';

const props = defineProps({
    city: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
    errors: { type: Object, default: () => ({}) },
    old: { type: Object, default: () => ({}) },
});

const oldInput = props.old || {};
const form = useForm({
    type: oldInput.type ?? 'bike_shop',
    name: oldInput.name ?? '',
    about: oldInput.about ?? '',
    event_info: oldInput.event_info ?? '',
    sales_info: oldInput.sales_info ?? '',
    contact_address: oldInput.contact_address ?? '',
    contact_email: oldInput.contact_email ?? '',
    contact_phone: oldInput.contact_phone ?? '',
});

function submit() {
    form.post(`${props.cityBaseUrl}/community`, {
        preserveScroll: true,
    });
}

const hasErrors = () => Object.keys(form.errors).length > 0;
</script>

<template>
    <CreatePageLayout
        title="New community page"
        :head-title="`New community page – ${city.name}`"
        breadcrumb="New page"
        :city="city"
        :city-base-url="cityBaseUrl"
        :back-url="`${cityBaseUrl}/community`"
        back-label="Back to community"
        :submitting="form.processing"
    >
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

            <div class="govuk-button-group govuk-!-margin-top-6">
                <gv-button type="submit" variant="primary" :disabled="form.processing">
                    Submit
                </gv-button>
                <a :href="`${cityBaseUrl}/community`" class="govuk-link">Cancel</a>
            </div>
        </form>
    </CreatePageLayout>
</template>
