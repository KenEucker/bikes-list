<script setup>
import { usePage } from '@inertiajs/vue3';
import { computed, ref } from 'vue';

const props = defineProps({
    /** Array of 0 or 1 upload id (v-model) */
    modelValue: { type: Array, default: () => [] },
    label: { type: String, default: 'Image (optional, one image)' },
    hint: { type: String, default: 'JPEG, PNG, WebP or BMP. Max 10MB.' },
    inputId: { type: String, default: 'single_image_upload' },
});

const emit = defineEmits(['update:modelValue']);
const page = usePage();

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB
const uploadProcessing = ref(false);
const uploadError = ref(null);

const hasImage = computed(() => Array.isArray(props.modelValue) && props.modelValue.length > 0);

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
            const message = data?.errors?.file?.[0] || data?.message || 'Upload failed';
            uploadError.value = message === 'The file failed to upload.' ? 'The file failed to upload. It may be too large. Max size is 10MB.' : message;
            return;
        }
        if (data.upload_id) {
            emit('update:modelValue', [data.upload_id]);
        }
    } finally {
        uploadProcessing.value = false;
        event.target.value = '';
    }
}

function removeUpload() {
    emit('update:modelValue', []);
}
</script>

<template>
    <div class="govuk-form-group govuk-!-margin-top-4">
        <label class="govuk-label" :for="inputId">{{ label }}</label>
        <p v-if="hint" class="govuk-hint">{{ hint }}</p>
        <input
            :id="inputId"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/bmp"
            class="govuk-file-upload"
            :disabled="uploadProcessing"
            @change="onImageSelect"
        >
        <p v-if="uploadError" class="govuk-error-message govuk-!-margin-top-2">{{ uploadError }}</p>
        <p v-if="uploadProcessing" class="govuk-body govuk-!-margin-top-2">Uploading…</p>
        <p v-if="hasImage" class="govuk-body govuk-!-margin-top-2">
            <button type="button" class="govuk-link govuk-body-s" @click="removeUpload">Remove image</button>
        </p>
    </div>
</template>
