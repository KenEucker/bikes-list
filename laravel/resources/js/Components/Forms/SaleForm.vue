<script setup>
import { useForm, usePage } from '@inertiajs/vue3';
import { computed, ref, watch } from 'vue';

const emit = defineEmits(['update:processing']);

const props = defineProps({
    sale: { type: Object, default: null },
    saleTypes: { type: Object, required: true },
    conditions: { type: Object, default: () => ({}) },
    fullBicycleOptions: { type: Object, default: () => ({}) },
    managedCommunityPages: { type: Array, default: () => [] },
    authUser: { type: Object, default: null },
    cityBaseUrl: { type: String, required: true },
    old: { type: Object, default: () => ({}) },
});

const page = usePage();
const isEdit = computed(() => !!props.sale);
const heading = computed(() => (isEdit.value ? 'Edit sale' : 'Add new sale'));
const submitUrl = computed(() =>
    isEdit.value ? `${props.cityBaseUrl}/for-sale/${props.sale.id}` : `${props.cityBaseUrl}/for-sale`
);

const oldInput = props.old || {};
const sale = props.sale || {};
const initialUploadIds = (sale.uploads && Array.isArray(sale.uploads))
    ? sale.uploads.map((u) => u.id)
    : [];

const loggedInEmail = computed(() => props.authUser?.email ?? page.props.auth?.user?.email ?? '');

const form = useForm({
    type: oldInput.type ?? sale.type ?? 'full_bicycle',
    title: oldInput.title ?? sale.title ?? '',
    description: oldInput.description ?? sale.description ?? '',
    price: oldInput.price ?? sale.price ?? '',
    condition: oldInput.condition ?? sale.condition ?? 'good',
    location_address: oldInput.location_address ?? sale.location_address ?? '',
    community_page_id: oldInput.community_page_id ?? sale.community_page_id ?? '',
    contact_email: oldInput.contact_email ?? sale.contact_email ?? loggedInEmail.value ?? '',
    serial_number: oldInput.serial_number ?? sale.serial_number ?? '',
    /* gv-checkbox is inverted: "checked" = false, "unchecked" = true. So we store the opposite of DB value for display, and flip back on submit. */
    serial_private: (() => {
        const dbPrivate = sale.serial_private === true || sale.serial_private === 1 || sale.serial_private === '1';
        if (oldInput.serial_private !== undefined && oldInput.serial_private !== null && oldInput.serial_private !== '') {
            const oldPrivate = oldInput.serial_private !== '0' && oldInput.serial_private !== 0 && oldInput.serial_private !== false;
            return !oldPrivate; /* show checked when DB/old = private */
        }
        return !dbPrivate; /* show checked when DB wants private */
    })(),
    frame_size: oldInput.frame_size ?? sale.frame_size ?? '',
    make: oldInput.make ?? sale.make ?? '',
    model: oldInput.model ?? sale.model ?? '',
    bicycle_type: oldInput.bicycle_type ?? sale.bicycle_type ?? '',
    wheel_size: oldInput.wheel_size ?? sale.wheel_size ?? '',
    frame_material: oldInput.frame_material ?? sale.frame_material ?? '',
    suspension: oldInput.suspension ?? sale.suspension ?? '',
    handlebar_type: oldInput.handlebar_type ?? sale.handlebar_type ?? '',
    electric_assist: oldInput.electric_assist ?? sale.electric_assist ?? '',
    submit_for_review: true,
    upload_ids: initialUploadIds,
});

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB

const uploadProcessing = ref(false);
const uploadError = ref(null);

async function onImageSelect(event) {
    const file = event.target?.files?.[0];
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
        uploadError.value = 'File is too large. Max size is 10MB.';
        event.target.value = '';
        return;
    }
    uploadError.value = null;
    uploadProcessing.value = true;
    try {
        const formData = new FormData();
        formData.append('file', file);
        const csrf = page.props?.csrf_token || document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (csrf) formData.append('_token', csrf);
        const res = await fetch('/api/uploads', {
            method: 'POST',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: formData,
        });
        if (res.status === 413) {
            uploadError.value = 'File is too large. Max size is 10MB.';
            return;
        }
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            let message = data?.errors?.file?.[0] || data?.message || 'Upload failed';
            if (message === 'The file failed to upload.') {
                message = 'The file failed to upload. It may be too large. Max size is 10MB.';
            }
            uploadError.value = message;
            return;
        }
        if (data.upload_id) {
            form.upload_ids = [...(form.upload_ids || []), data.upload_id];
        }
    } finally {
        uploadProcessing.value = false;
        event.target.value = '';
    }
}

function removeUploadId(id) {
    form.upload_ids = (form.upload_ids || []).filter((uid) => uid !== id);
}

function conditionsList() {
    const c = props.conditions && typeof props.conditions === 'object' && !Array.isArray(props.conditions)
        ? props.conditions
        : { new: 'New', like_new: 'Like new', good: 'Good', fair: 'Fair', poor: 'Poor' };
    return Object.entries(c);
}

function submit(forReview) {
    /* Invert: gv-checkbox gives false when "Keep serial private" is checked, true when unchecked. We send 1 = private, 0 = not private. */
    form.serial_private = form.serial_private ? 0 : 1;
    if (isEdit.value) {
        form.put(submitUrl.value, { preserveScroll: true });
    } else {
        form.submit_for_review = forReview;
        form.post(submitUrl.value, { preserveScroll: true });
    }
}

const hasErrors = () => Object.keys(form.errors).length > 0;

const isLoggedIn = computed(() => !!props.authUser);
const contactEmailReadonly = computed(() => props.authUser != null);

const contactEmailHint = 'Potential buyers will contact you at this address using the BikesList email relay. Your email is not shown publicly.';

function optionEntries(key) {
    const opts = props.fullBicycleOptions?.[key];
    return opts && typeof opts === 'object' && !Array.isArray(opts) ? Object.entries(opts) : [];
}

const accordionListingExpanded = ref(true);
const accordionPostingExpanded = ref(true);

watch(() => form.processing, (v) => emit('update:processing', v), { immediate: true });

watch(
    loggedInEmail,
    (email) => {
        if (email && contactEmailReadonly.value && (!form.contact_email || form.contact_email === '')) {
            form.contact_email = email;
        }
    },
    { immediate: true }
);
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

        <div class="w-full max-w-5xl sale-form-grid">
            <div class="sale-form-col sale-form-col-main">
                <gv-accordion class="govuk-!-width-full">
                    <gv-accordion-section heading="Listing details" id="accordion-listing" v-model:expanded="accordionListingExpanded">
                        <gv-select
                            id="type"
                            v-model="form.type"
                            name="type"
                            label="Type"
                            required
                            :error-message="form.errors.type"
                        >
                            <gv-select-option
                                v-for="(config, key) in saleTypes"
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

                        <gv-input
                            id="location_address"
                            v-model="form.location_address"
                            name="location_address"
                            label="Location (optional)"
                            type="text"
                            class="govuk-!-width-full"
                        />

                        <template v-if="!isEdit">
                            <gv-input
                                id="contact_email"
                                v-model="form.contact_email"
                                name="contact_email"
                                label="Your email"
                                type="email"
                                :required="!isLoggedIn"
                                :readonly="contactEmailReadonly"
                                :hint="contactEmailHint"
                                :error-message="form.errors.contact_email"
                                class="govuk-!-width-full"
                            />
                        </template>

                        <gv-select
                            v-if="managedCommunityPages.length"
                            id="community_page_id"
                            v-model="form.community_page_id"
                            name="community_page_id"
                            label="Post as (optional)"
                            class="govuk-!-width-full"
                        >
                            <gv-select-option value="">My personal sale</gv-select-option>
                            <gv-select-option
                                v-for="p in managedCommunityPages"
                                :key="p.id"
                                :value="String(p.id)"
                            >
                                {{ p.name }}
                            </gv-select-option>
                        </gv-select>

                        <div class="govuk-form-group govuk-!-margin-top-4">
                            <label class="govuk-label" for="images">Images</label>
                            <p class="govuk-hint">JPEG, PNG, WebP or BMP. Max 10MB each. You can add up to several images.</p>
                            <input
                                id="images"
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/bmp"
                                class="govuk-file-upload"
                                :disabled="uploadProcessing"
                                @change="onImageSelect"
                            >
                            <p v-if="uploadError" class="govuk-error-message govuk-!-margin-top-2">{{ uploadError }}</p>
                            <p v-if="uploadProcessing" class="govuk-body govuk-!-margin-top-2">Uploading…</p>
                            <ul v-if="form.upload_ids && form.upload_ids.length" class="govuk-list govuk-!-margin-top-2">
                                <li v-for="(uid, idx) in form.upload_ids" :key="uid" class="govuk-!-margin-bottom-1">
                                    <span class="govuk-body-s">Image {{ idx + 1 }}</span>
                                    <button
                                        type="button"
                                        class="govuk-link govuk-body-s govuk-!-margin-left-2"
                                        @click="removeUploadId(uid)"
                                    >
                                        Remove
                                    </button>
                                </li>
                            </ul>
                        </div>

                    </gv-accordion-section>
                </gv-accordion>
            </div>

            <div v-if="form.type === 'full_bicycle'" class="sale-form-col sale-form-col-posting">
                <gv-accordion class="govuk-!-width-full">
                    <gv-accordion-section heading="Posting details" id="accordion-posting" v-model:expanded="accordionPostingExpanded">
                        <p class="govuk-hint govuk-!-margin-bottom-4">More information about the bike.</p>

                        <gv-input
                            id="frame_size"
                            v-model="form.frame_size"
                            name="frame_size"
                            label="Frame size"
                            type="text"
                            class="govuk-!-width-full"
                        />
                        <gv-input
                            id="make"
                            v-model="form.make"
                            name="make"
                            label="Make"
                            type="text"
                            class="govuk-!-width-full"
                        />
                        <gv-input
                            id="model"
                            v-model="form.model"
                            name="model"
                            label="Model"
                            type="text"
                            class="govuk-!-width-full"
                        />
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
                            class="govuk-!-margin-top-2"
                        />

                        <gv-select
                            id="bicycle_type"
                            v-model="form.bicycle_type"
                            name="bicycle_type"
                            label="Bicycle type"
                            class="govuk-!-width-full"
                        >
                            <gv-select-option value="">—</gv-select-option>
                            <gv-select-option v-for="[value, label] in optionEntries('bicycle_type')" :key="value" :value="value">{{ label }}</gv-select-option>
                        </gv-select>
                        <gv-select
                            id="wheel_size"
                            v-model="form.wheel_size"
                            name="wheel_size"
                            label="Wheel size"
                            class="govuk-!-width-full"
                        >
                            <gv-select-option value="">—</gv-select-option>
                            <gv-select-option v-for="[value, label] in optionEntries('wheel_size')" :key="value" :value="value">{{ label }}</gv-select-option>
                        </gv-select>
                        <gv-select
                            id="frame_material"
                            v-model="form.frame_material"
                            name="frame_material"
                            label="Frame material"
                            class="govuk-!-width-full"
                        >
                            <gv-select-option value="">—</gv-select-option>
                            <gv-select-option v-for="[value, label] in optionEntries('frame_material')" :key="value" :value="value">{{ label }}</gv-select-option>
                        </gv-select>
                        <gv-select
                            id="suspension"
                            v-model="form.suspension"
                            name="suspension"
                            label="Suspension"
                            class="govuk-!-width-full"
                        >
                            <gv-select-option value="">—</gv-select-option>
                            <gv-select-option v-for="[value, label] in optionEntries('suspension')" :key="value" :value="value">{{ label }}</gv-select-option>
                        </gv-select>
                        <gv-select
                            id="handlebar_type"
                            v-model="form.handlebar_type"
                            name="handlebar_type"
                            label="Handlebar type"
                            class="govuk-!-width-full"
                        >
                            <gv-select-option value="">—</gv-select-option>
                            <gv-select-option v-for="[value, label] in optionEntries('handlebar_type')" :key="value" :value="value">{{ label }}</gv-select-option>
                        </gv-select>
                        <gv-select
                            id="electric_assist"
                            v-model="form.electric_assist"
                            name="electric_assist"
                            label="Electric assist"
                            class="govuk-!-width-full"
                        >
                            <gv-select-option value="">—</gv-select-option>
                            <gv-select-option v-for="[value, label] in optionEntries('electric_assist')" :key="value" :value="value">{{ label }}</gv-select-option>
                        </gv-select>
                    </gv-accordion-section>
                </gv-accordion>
            </div>
        </div>

        <div class="sale-form-actions govuk-button-group govuk-!-margin-top-6">
            <template v-if="!isEdit">
                <gv-button type="submit" variant="primary" :disabled="form.processing">
                    Submit for review
                </gv-button>
                <gv-button
                    v-if="isLoggedIn"
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
            <a :href="isEdit ? `${cityBaseUrl}/for-sale/${sale.id}` : `${cityBaseUrl}/for-sale`" class="govuk-link">Cancel</a>
        </div>
    </form>
</template>

<style scoped>
.sale-form-grid {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: 1fr;
}
@media (min-width: 1024px) {
    .sale-form-grid {
        grid-template-columns: 1fr 1fr;
    }
}
.sale-form-col-main {
    min-width: 0;
}
.sale-form-col-posting {
    min-width: 0;
}
.sale-form-grid :deep(.govuk-accordion),
.sale-form-grid :deep(.govuk-accordion__section),
.sale-form-grid :deep(.govuk-accordion__section-header),
.sale-form-grid :deep(.govuk-accordion__section-content) {
    max-width: 100%;
}
/* Actions at bottom of form; full width to match grid (max-w-5xl = 64rem) */
.sale-form-actions {
    width: 100%;
    max-width: 64rem;
}
</style>
