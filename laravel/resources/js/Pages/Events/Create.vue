<script setup>
import { usePage, useForm } from '@inertiajs/vue3';
import CreatePageLayout from '@/Components/CreatePageLayout.vue';

const page = usePage();
const props = defineProps({
    city: { type: Object, required: true },
    guidelines: { type: Array, required: true },
    managedCommunityPages: { type: Array, default: () => [] },
    eventTags: { type: Object, default: () => ({}) },
    cityBaseUrl: { type: String, required: true },
    errors: { type: Object, default: () => ({}) },
    old: { type: Object, default: () => ({}) },
});

const oldInput = props.old || {};
const form = useForm({
    title: oldInput.title ?? '',
    description: oldInput.description ?? '',
    organizer_name: oldInput.organizer_name ?? (page.props.auth?.user?.name ?? ''),
    organizer_email_hidden: oldInput.organizer_email_hidden === '1' || oldInput.organizer_email_hidden === true,
    location_address: oldInput.location_address ?? '',
    route_description: oldInput.route_description ?? '',
    route_link: oldInput.route_link ?? '',
    external_link: oldInput.external_link ?? '',
    event_type: oldInput.event_type ?? '',
    community_page_id: oldInput.community_page_id ?? '',
    starts_at: oldInput.starts_at ?? '',
    ends_at: oldInput.ends_at ?? '',
    timezone: oldInput.timezone ?? (typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : ''),
    is_recurring: oldInput.is_recurring === '1' || oldInput.is_recurring === true,
    recurrence_ends_at: oldInput.recurrence_ends_at ?? '',
    tags: oldInput.tags ?? [],
    guidelines_accepted: oldInput.guidelines_accepted === '1' || oldInput.guidelines_accepted === true,
    guideline_ids: oldInput.guideline_ids ?? props.guidelines.map((g) => g.id),
});

function submit() {
    form.post(`${props.cityBaseUrl}/events`, {
        preserveScroll: true,
    });
}

const hasErrors = () => Object.keys(form.errors).length > 0;
</script>

<template>
    <CreatePageLayout
        title="New event"
        :head-title="`New event – ${city.name}`"
        breadcrumb="New event"
        :city="city"
        :city-base-url="cityBaseUrl"
        :back-url="`${cityBaseUrl}/events`"
        back-label="Back to events"
        :submitting="form.processing"
    >
        <template #before-form>
            <div v-if="guidelines.length" class="mt-4 rounded-token-md border border-border bg-card p-4">
                <h2 class="font-medium text-fg">Event community guidelines</h2>
                <div class="mt-2 space-y-2 text-sm text-fg prose dark:prose-invert max-w-none">
                    <div v-for="g in guidelines" :key="g.id" class="whitespace-pre-wrap">{{ g.body }}</div>
                </div>
            </div>
        </template>

        <form @submit.prevent="submit">
            <gv-error-summary v-if="hasErrors()" title="There is a problem">
                <gv-error-link
                    v-for="(message, field) in form.errors"
                    :key="field"
                    :target-id="field"
                    :text="message"
                />
            </gv-error-summary>

            <gv-input
                id="title"
                v-model="form.title"
                name="title"
                label="Title *"
                type="text"
                required
                :error-message="form.errors.title"
                class="govuk-!-width-full"
            />

            <gv-textarea
                id="description"
                v-model="form.description"
                name="description"
                label="Description *"
                :rows="4"
                required
                :error-message="form.errors.description"
                class="govuk-!-width-full"
            />

            <gv-input
                id="organizer_name"
                v-model="form.organizer_name"
                name="organizer_name"
                label="Organizer name *"
                type="text"
                required
                :error-message="form.errors.organizer_name"
                class="govuk-!-width-full"
            />

            <gv-checkbox
                id="organizer_email_hidden"
                v-model="form.organizer_email_hidden"
                name="organizer_email_hidden"
                label="Hide my email from public"
                class="govuk-!-margin-top-4"
            />

            <gv-input
                id="location_address"
                v-model="form.location_address"
                name="location_address"
                label="Location (optional)"
                type="text"
                :error-message="form.errors.location_address"
                class="govuk-!-width-full"
            />

            <gv-select
                v-if="managedCommunityPages.length"
                id="community_page_id"
                v-model="form.community_page_id"
                name="community_page_id"
                label="Host as"
                class="govuk-!-width-full"
            >
                <gv-select-option value="">Me (personal)</gv-select-option>
                <gv-select-option
                    v-for="p in managedCommunityPages"
                    :key="p.id"
                    :value="p.id"
                >
                    {{ p.name }}
                </gv-select-option>
            </gv-select>

            <gv-textarea
                id="route_description"
                v-model="form.route_description"
                name="route_description"
                label="Route description (optional)"
                :rows="2"
                class="govuk-!-width-full"
            />

            <gv-input
                id="route_link"
                v-model="form.route_link"
                name="route_link"
                label="Route link URL (optional)"
                type="url"
                placeholder="https://..."
                :error-message="form.errors.route_link"
                class="govuk-!-width-full"
            />

            <gv-input
                id="external_link"
                v-model="form.external_link"
                name="external_link"
                label="External link (optional)"
                type="url"
                :error-message="form.errors.external_link"
                class="govuk-!-width-full"
            />

            <gv-input
                id="event_type"
                v-model="form.event_type"
                name="event_type"
                label="Event type (optional)"
                type="text"
                class="govuk-!-width-full"
            />

            <div class="govuk-form-group">
                <div class="grid grid-cols-2 gap-4">
                    <gv-input
                        id="starts_at"
                        v-model="form.starts_at"
                        name="starts_at"
                        label="Starts at *"
                        type="datetime-local"
                        required
                        :error-message="form.errors.starts_at"
                        class="govuk-!-width-full"
                    />
                    <gv-input
                        id="ends_at"
                        v-model="form.ends_at"
                        name="ends_at"
                        label="Ends at *"
                        type="datetime-local"
                        required
                        :error-message="form.errors.ends_at"
                        class="govuk-!-width-full"
                    />
                </div>
            </div>

            <gv-checkbox
                id="guidelines_accepted"
                v-model="form.guidelines_accepted"
                name="guidelines_accepted"
                label="I agree to the event community guidelines above *"
                required
                class="govuk-!-margin-top-4"
            />

            <div class="govuk-button-group govuk-!-margin-top-6">
                <gv-button type="submit" variant="primary" :disabled="form.processing">
                    Submit event
                </gv-button>
                <a :href="`${cityBaseUrl}/events`" class="govuk-link">Cancel</a>
            </div>
        </form>
    </CreatePageLayout>
</template>
