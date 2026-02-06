<script setup>
import { useForm, usePage } from '@inertiajs/vue3';
import { computed, nextTick, ref, watch } from 'vue';
import SingleImageUpload from '@/Components/SingleImageUpload.vue';

const props = defineProps({
    event: { type: Object, default: null },
    guidelines: { type: Array, default: () => [] },
    managedCommunityPages: { type: Array, default: () => [] },
    audiences: { type: Object, default: () => ({}) },
    defaultAudienceId: { type: [String, Number], default: null },
    eventTags: { type: Object, default: () => ({}) },
    cityBaseUrl: { type: String, required: true },
    old: { type: Object, default: () => ({}) },
    /** Server-side validation errors (from redirect after failed submit). Used to show errors and expand accordions. */
    errors: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['update:processing']);
const page = usePage();
const isEdit = computed(() => !!props.event);
const isGuest = computed(() => !page.props.auth?.user);
const submitUrl = computed(() =>
    isEdit.value ? `${props.cityBaseUrl}/events/${props.event.id}` : `${props.cityBaseUrl}/events`
);

const oldInput = props.old || {};
const ev = props.event || {};
const dt = (v) => (v ? String(v).slice(0, 16) : '');
const hasExistingEnd = !!(ev.ends_at || oldInput.ends_at);
const useSpecificEndDate = ref(hasExistingEnd);
const durationHours = ref(oldInput.duration_hours ?? '');

const initialUploadIds = (ev.uploads && Array.isArray(ev.uploads) && ev.uploads.length)
    ? [ev.uploads[0].id]
    : [];

const form = useForm({
    name: oldInput.name ?? ev.name ?? '',
    description: oldInput.description ?? ev.description ?? '',
    audience_id: oldInput.audience_id ?? ev.audience_id ?? (props.defaultAudienceId != null ? String(props.defaultAudienceId) : ''),
    tags: oldInput.tags ?? ev.tags ?? [],
    organizer_name: oldInput.organizer_name ?? ev.organizer_name ?? (page.props.auth?.user?.name ?? ''),
    organizer_email: oldInput.organizer_email ?? ev.organizer_email ?? (page.props.auth?.user?.email ?? ''),
    organizer_email_hidden: oldInput.organizer_email_hidden === '1' || oldInput.organizer_email_hidden === true || ev.organizer_email_hidden === true,
    location_name: oldInput.location_name ?? ev.location_name ?? '',
    location_address: oldInput.location_address ?? ev.location_address ?? '',
    location_details: oldInput.location_details ?? ev.location_details ?? '',
    route_description: oldInput.route_description ?? ev.route_description ?? '',
    route_link: oldInput.route_link ?? ev.route_link ?? '',
    route_length: oldInput.route_length ?? ev.route_length ?? '',
    is_loop: oldInput.is_loop === '1' || oldInput.is_loop === true || ev.is_loop === true,
    external_link: oldInput.external_link ?? ev.external_link ?? '',
    community_page_id: oldInput.community_page_id ?? ev.community_page_id ?? '',
    starts_at: oldInput.starts_at ?? dt(ev.starts_at) ?? '',
    ends_at: oldInput.ends_at ?? dt(ev.ends_at) ?? '',
    duration_hours: oldInput.duration_hours ?? '',
    timezone: oldInput.timezone ?? ev.timezone ?? (typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : ''),
    time_details: oldInput.time_details ?? ev.time_details ?? '',
    is_recurring: oldInput.is_recurring === '1' || oldInput.is_recurring === true || ev.is_recurring === true,
    recurrence_ends_at: oldInput.recurrence_ends_at ?? (ev.recurrence_ends_at ? String(ev.recurrence_ends_at).slice(0, 10) : '') ?? '',
    guidelines_accepted: oldInput.guidelines_accepted === '1' || oldInput.guidelines_accepted === true,
    guideline_ids: oldInput.guideline_ids ?? props.guidelines.map((g) => g.id),
    upload_ids: initialUploadIds,
});

function computeEndFromDuration() {
    const start = form.starts_at;
    const hours = parseFloat(durationHours.value);
    if (!start || Number.isNaN(hours) || hours <= 0) return;
    const d = new Date(start);
    if (Number.isNaN(d.getTime())) return;
    d.setTime(d.getTime() + hours * 60 * 60 * 1000);
    form.ends_at = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + 'T' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
}

watch([() => form.starts_at, durationHours], () => {
    if (!useSpecificEndDate.value && durationHours.value) computeEndFromDuration();
}, { immediate: true });

function submit() {
    form.duration_hours = durationHours.value || null;
    form.audience_id = form.audience_id || null;
    form.community_page_id = form.community_page_id || null;
    if (useSpecificEndDate.value) {
        form.ends_at = form.ends_at || null;
    } else {
        const hours = parseFloat(durationHours.value);
        if (form.starts_at && !Number.isNaN(hours) && hours > 0) {
            computeEndFromDuration();
        } else {
            form.ends_at = null;
        }
    }
    // Expand all accordions first so required fields are visible. If we triggered native
    // form submit, the browser would validate and try to focus the first invalid field,
    // which is inside a collapsed accordion and not focusable -> "not focusable" errors.
    accordionDescriptionExpanded.value = true;
    accordionDatetimeExpanded.value = true;
    accordionLocationExpanded.value = true;
    accordionRideExpanded.value = true;
    accordionContactExpanded.value = true;
    accordionAgreementsExpanded.value = true;
    nextTick(() => {
        if (isEdit.value) {
            form.put(submitUrl.value, { preserveScroll: true });
        } else {
            form.post(submitUrl.value, { preserveScroll: true });
        }
    });
}

const effectiveErrors = computed(() => {
    const serverErrors = props.errors && typeof props.errors === 'object' ? props.errors : {};
    const formErrs = form.errors || {};
    const formErrorKeys = Object.keys(formErrs);
    const raw = formErrorKeys.length > 0 ? formErrs : serverErrors;
    if (Object.keys(raw).length === 0) return {};
    const out = {};
    for (const [key, val] of Object.entries(raw)) {
        out[key] = Array.isArray(val) ? val[0] : val;
    }
    return out;
});
const hasErrors = () => Object.keys(effectiveErrors.value).length > 0;

const accordionDescriptionExpanded = ref(true);
const accordionDatetimeExpanded = ref(true);
const accordionLocationExpanded = ref(true);
const accordionRideExpanded = ref(true);
const accordionContactExpanded = ref(true);
const accordionAgreementsExpanded = ref(true);

watch(() => form.processing, (v) => emit('update:processing', v), { immediate: true });

function toggleTag(slug) {
    const tags = [...(form.tags || [])];
    const idx = tags.indexOf(slug);
    if (idx >= 0) tags.splice(idx, 1);
    else tags.push(slug);
    form.tags = tags;
}

const eventTagsList = computed(() => Object.entries(props.eventTags || {}));
</script>

<template>
    <form @submit.prevent>
        <gv-error-summary v-if="hasErrors()" title="There is a problem">
            <gv-error-link
                v-for="(message, field) in effectiveErrors"
                :key="field"
                :target-id="field"
                :text="message"
            />
        </gv-error-summary>

        <div class="event-form-accordion-wrapper w-full max-w-4xl">
        <gv-accordion class="govuk-!-width-full">
            <gv-accordion-section heading="Description" id="accordion-description" v-model:expanded="accordionDescriptionExpanded">
                <gv-input
                    id="name"
                    v-model="form.name"
                    name="name"
                    label="Event name *"
                    type="text"
                    required
                    :error-message="effectiveErrors.name"
                    class="govuk-!-width-full"
                />
                <gv-textarea
                    id="description"
                    v-model="form.description"
                    name="description"
                    label="Description *"
                    :rows="4"
                    required
                    :error-message="effectiveErrors.description"
                    class="govuk-!-width-full"
                />
                <gv-select
                    v-if="Object.keys(audiences).length"
                    id="audience_id"
                    v-model="form.audience_id"
                    name="audience_id"
                    label="Audience"
                    class="govuk-!-width-full"
                >
                    <gv-select-option
                        v-for="(label, id) in audiences"
                        :key="id"
                        :value="String(id)"
                    >
                        {{ label }}
                    </gv-select-option>
                </gv-select>
                <div v-if="eventTagsList.length" class="govuk-form-group">
                    <label class="govuk-label">Tags (optional)</label>
                    <div class="govuk-checkboxes govuk-checkboxes--small">
                        <div
                            v-for="[slug, label] in eventTagsList"
                            :key="slug"
                            class="govuk-checkboxes__item"
                        >
                            <input
                                :id="`tag-${slug}`"
                                type="checkbox"
                                class="govuk-checkboxes__input"
                                :checked="(form.tags || []).includes(slug)"
                                @change="toggleTag(slug)"
                            >
                            <label :for="`tag-${slug}`" class="govuk-label govuk-checkboxes__label">{{ label }}</label>
                        </div>
                    </div>
                </div>
                <SingleImageUpload
                    v-if="page.props.auth?.user"
                    v-model="form.upload_ids"
                    input-id="event_image"
                    label="Event image (optional, one image)"
                    hint="JPEG, PNG, WebP or BMP. Max 10MB."
                />
            </gv-accordion-section>

            <gv-accordion-section heading="Date and time" id="accordion-datetime" v-model:expanded="accordionDatetimeExpanded">
                <div class="govuk-form-group">
                    <label class="govuk-label" for="starts_at">Starts at *</label>
                    <gv-input
                        id="starts_at"
                        v-model="form.starts_at"
                        name="starts_at"
                        type="datetime-local"
                        required
                        :error-message="effectiveErrors.starts_at"
                        class="govuk-!-width-full govuk-!-margin-bottom-2"
                    />
                </div>
                <div class="govuk-form-group">
                    <gv-input
                        id="duration_hours"
                        v-model="durationHours"
                        name="duration_hours"
                        label="Ride duration (hours, optional)"
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="e.g. 2 or 1.5"
                        :error-message="form.errors.duration_hours"
                        class="govuk-!-width-one-quarter"
                    />
                    <p class="govuk-hint govuk-!-margin-top-1">Decimal allowed (e.g. 1.5 for 1 hour 30 min). If set, end time is calculated from start.</p>
                </div>
                <div class="govuk-form-group">
                    <gv-checkbox
                        id="use_specific_end_date"
                        v-model="useSpecificEndDate"
                        name="use_specific_end_date"
                        label="Set specific end date"
                        class="govuk-!-margin-bottom-2"
                    />
                    <div v-show="useSpecificEndDate" class="govuk-!-margin-top-2">
                        <gv-input
                            id="ends_at"
                            v-model="form.ends_at"
                            name="ends_at"
                            label="Ends at (optional)"
                            type="datetime-local"
                            :error-message="effectiveErrors.ends_at"
                            class="govuk-!-width-full"
                        />
                    </div>
                </div>
                <gv-textarea
                    id="time_details"
                    v-model="form.time_details"
                    name="time_details"
                    label="Time details (optional)"
                    :rows="2"
                    hint="Keep it short. Example: Meet at 5pm, ride starts at 530pm."
                    :error-message="form.errors.time_details"
                    class="govuk-!-width-full"
                />
            </gv-accordion-section>

            <gv-accordion-section heading="Location" id="accordion-location" v-model:expanded="accordionLocationExpanded">
                <gv-input
                    id="location_name"
                    v-model="form.location_name"
                    name="location_name"
                    label="Location name *"
                    type="text"
                    required
                    :error-message="effectiveErrors.location_name"
                    class="govuk-!-width-full"
                />
                <gv-input
                    id="location_address"
                    v-model="form.location_address"
                    name="location_address"
                    label="Address *"
                    type="text"
                    required
                    hint="You can enter 'TBA' if the address is not yet known. A mapable address is encouraged."
                    :error-message="form.errors.location_address"
                    class="govuk-!-width-full"
                />
                <gv-textarea
                    id="location_details"
                    v-model="form.location_details"
                    name="location_details"
                    label="Location details (optional)"
                    :rows="2"
                    :error-message="effectiveErrors.location_details"
                    class="govuk-!-width-full"
                />
            </gv-accordion-section>

            <gv-accordion-section heading="Ride details" id="accordion-ride" v-model:expanded="accordionRideExpanded">
                <gv-input
                    id="route_length"
                    v-model="form.route_length"
                    name="route_length"
                    label="Length of ride (optional)"
                    type="text"
                    placeholder="e.g. 10 miles"
                    :error-message="form.errors.route_length"
                    class="govuk-!-width-full"
                />
                <gv-textarea
                    id="route_description"
                    v-model="form.route_description"
                    name="route_description"
                    label="Route description (optional)"
                    :rows="2"
                    :error-message="effectiveErrors.route_description"
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
                <gv-checkbox
                    id="is_loop"
                    v-model="form.is_loop"
                    name="is_loop"
                    label="Ride is a loop"
                    class="govuk-!-margin-top-4"
                />
                <p class="govuk-hint govuk-!-margin-top-1">Does your ride end at the same location where it began?</p>
            </gv-accordion-section>

            <gv-accordion-section heading="Contact" id="accordion-contact" v-model:expanded="accordionContactExpanded">
                <gv-input
                    id="organizer_name"
                    v-model="form.organizer_name"
                    name="organizer_name"
                    label="Organizer name *"
                    type="text"
                    required
                    :error-message="effectiveErrors.organizer_name"
                    class="govuk-!-width-full"
                />
                <template v-if="isGuest">
                    <gv-input
                        id="organizer_email"
                        v-model="form.organizer_email"
                        name="organizer_email"
                        label="Your email address *"
                        type="email"
                        required
                        :error-message="form.errors.organizer_email"
                        class="govuk-!-width-full"
                    />
                    <p class="govuk-body govuk-!-margin-top-2">
                        Your email is required so we can contact you about this event. You can choose to hide it from the public listing below.
                    </p>
                </template>
                <gv-checkbox
                    id="organizer_email_hidden"
                    v-model="form.organizer_email_hidden"
                    name="organizer_email_hidden"
                    label="Hide my email from the public listing"
                    class="govuk-!-margin-top-4"
                />
                <gv-select
                    v-if="managedCommunityPages.length"
                    id="community_page_id"
                    v-model="form.community_page_id"
                    name="community_page_id"
                    label="Host as"
                    class="govuk-!-width-full govuk-!-margin-top-4"
                >
                    <gv-select-option value="">Me (personal)</gv-select-option>
                    <gv-select-option
                        v-for="p in managedCommunityPages"
                        :key="p.id"
                        :value="String(p.id)"
                    >
                        {{ p.name }}
                    </gv-select-option>
                </gv-select>
                <gv-input
                    id="external_link"
                    v-model="form.external_link"
                    name="external_link"
                    label="External link (optional)"
                    type="url"
                    :error-message="effectiveErrors.external_link"
                    class="govuk-!-width-full govuk-!-margin-top-4"
                />
            </gv-accordion-section>

            <gv-accordion-section v-if="!isEdit && guidelines.length" heading="Agreements" id="accordion-agreements" v-model:expanded="accordionAgreementsExpanded">
                <div class="rounded-token-md border border-border bg-card p-4">
                    <h2 class="font-medium text-fg">Event community guidelines</h2>
                    <div class="mt-2 space-y-2 text-sm text-fg prose dark:prose-invert max-w-none">
                        <div v-for="g in guidelines" :key="g.id" class="whitespace-pre-wrap">{{ g.body }}</div>
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
            </gv-accordion-section>
        </gv-accordion>
        </div>

        <div class="govuk-button-group govuk-!-margin-top-6">
            <gv-button type="button" variant="primary" :disabled="form.processing" @click="submit">
                {{ isEdit ? 'Save' : 'Submit event' }}
            </gv-button>
            <a :href="isEdit ? `${cityBaseUrl}/events/${event.id}` : `${cityBaseUrl}/events`" class="govuk-link">Cancel</a>
        </div>
    </form>
</template>

<style scoped>
.event-form-accordion-wrapper :deep(.govuk-accordion),
.event-form-accordion-wrapper :deep(.govuk-accordion__section),
.event-form-accordion-wrapper :deep(.govuk-accordion__section-header),
.event-form-accordion-wrapper :deep(.govuk-accordion__section-content) {
    width: 100%;
    min-width: 100%;
    box-sizing: border-box;
}
</style>
