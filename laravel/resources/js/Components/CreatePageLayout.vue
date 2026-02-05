<script setup>
import { Head } from '@inertiajs/vue3';
import CityLayout from '@/Layouts/CityLayout.vue';

defineProps({
    title: { type: String, required: true },
    headTitle: { type: String, default: null },
    breadcrumb: { type: [String, Array], required: true },
    city: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
    backUrl: { type: String, required: true },
    backLabel: { type: String, default: 'Back' },
    /** Show full-page loading overlay when true (e.g. form.processing) */
    submitting: { type: Boolean, default: false },
    footerNote: { type: String, default: '' },
});
</script>

<template>
    <Head :title="headTitle ?? title" />
    <CityLayout :city="city" :city-base-url="cityBaseUrl" :breadcrumb="breadcrumb">
        <template #nav-right>
            <a :href="backUrl" class="govuk-link">{{ backLabel }}</a>
        </template>

        <div
            v-if="submitting"
            class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-page/90"
            aria-live="polite"
        >
            <div class="rounded-token-md border-2 border-primary bg-card px-8 py-6 shadow-lg">
                <p class="text-lg font-medium text-fg">Creating…</p>
                <p class="mt-2 text-sm text-muted">Please wait, you will be redirected.</p>
            </div>
        </div>
        <div class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="govuk-heading-l">{{ title }}</h1>

            <slot name="before-form" />

            <slot />

            <p v-if="footerNote" class="govuk-body govuk-!-margin-top-4">{{ footerNote }}</p>
        </div>
    </CityLayout>
</template>
