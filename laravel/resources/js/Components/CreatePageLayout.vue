<script setup>
import { Head } from '@inertiajs/vue3';
import CityLayout from '@/Layouts/CityLayout.vue';

defineProps({
    title: { type: String, required: true },
    headTitle: { type: String, default: null },
    breadcrumb: { type: [String, Array], required: true },
    city: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
    backUrl: { type: String, default: null },
    backLabel: { type: String, default: 'Back' },
    /** Show full-page loading overlay when true (e.g. form.processing) */
    submitting: { type: Boolean, default: false },
    /** Overlay message, e.g. "Creating…" or "Saving…" */
    submittingLabel: { type: String, default: 'Creating…' },
    footerNote: { type: String, default: '' },
    /** Max width of content area, e.g. 'max-w-4xl' for wider forms */
    contentMaxWidth: { type: String, default: 'max-w-2xl' },
});
</script>

<template>
    <Head :title="headTitle ?? title" />
    <CityLayout :city="city" :city-base-url="cityBaseUrl" :breadcrumb="breadcrumb">

        <div
            v-if="submitting"
            class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-page/90"
            aria-live="polite"
        >
            <div class="px-8 py-6 border-2 shadow-lg rounded-token-md border-primary bg-card">
                <p class="text-lg font-medium text-fg">{{ submittingLabel }}</p>
                <p class="mt-2 text-sm text-muted">Please wait, you will be redirected.</p>
            </div>
        </div>
        <div class="px-4 py-8 mx-auto sm:px-6 lg:px-8" :class="contentMaxWidth">
            <h1 class="govuk-heading-l">{{ title }}</h1>

            <slot name="before-form" />

            <slot />

            <p v-if="footerNote" class="govuk-body govuk-!-margin-top-4">{{ footerNote }}</p>
        </div>
    </CityLayout>
</template>
