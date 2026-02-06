<script setup>
import { useForm, usePage } from '@inertiajs/vue3';
import { computed, ref, watch } from 'vue';

const emit = defineEmits(['update:processing']);

const props = defineProps({
    sale: { type: Object, default: null },
    saleTypes: { type: Object, required: true },
    conditions: { type: Object, default: () => ({}) },
    managedCommunityPages: { type: Array, default: () => [] },
    cityBaseUrl: { type: String, required: true },
    old: { type: Object, default: () => ({}) },
});

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

const form = useForm({
    type: oldInput.type ?? sale.type ?? 'full_bicycle',
    title: oldInput.title ?? sale.title ?? '',
    description: oldInput.description ?? sale.description ?? '',
    price: oldInput.price ?? sale.price ?? '',
    condition: oldInput.condition ?? sale.condition ?? 'good',
    location_address: oldInput.location_address ?? sale.location_address ?? '',
    community_page_id: oldInput.community_page_id ?? sale.community_page_id ?? '',
    serial_number: oldInput.serial_number ?? sale.serial_number ?? '',
    serial_private: oldInput.serial_private !== '0' && oldInput.serial_private !== 0 && (sale.serial_private !== false),
    submit_for_review: true,
    upload_ids: initialUploadIds,
});

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB

const uploadProcessing = ref(false);
const uploadError = ref(null);
const page = usePage();

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
            <gv-select-option value="">My personal sale</gv-select-option>
            <gv-select-option
                v-for="page in managedCommunityPages"
                :key="page.id"
                :value="String(page.id)"
            >
                {{ page.name }}
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
            <a :href="isEdit ? `${cityBaseUrl}/for-sale/${sale.id}` : `${cityBaseUrl}/for-sale`" class="govuk-link">Cancel</a>
        </div>
    </form>
</template>
