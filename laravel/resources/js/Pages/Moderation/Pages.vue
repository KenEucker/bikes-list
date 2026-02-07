<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityLayout from '@/Layouts/CityLayout.vue';
import ModerationQueue from '@/Components/ModerationQueue.vue';

defineProps({
    city: { type: Object, required: true },
    pages: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
    reasonCodes: { type: Object, default: () => ({}) },
});
</script>

<template>
    <Head :title="`BikesList – ${city.name} – Moderation – Pages`" />
    <CityLayout :city="city" :city-base-url="cityBaseUrl" :breadcrumb="['Moderation', 'Pages']">
        <template #nav-right>
            <gv-header-navigation-item :href="`${cityBaseUrl}/moderation`" text="Back to moderation" />
        </template>

        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="govuk-heading-l">Pending community pages</h1>
            <p class="mt-2 text-sm text-muted">Approve or remove. Every action requires a reason code.</p>
            <ModerationQueue
                :items="pages.data || []"
                entity-label="pages"
                title-key="name"
                :show-url-fn="(item) => `${cityBaseUrl}/community/${item.slug}`"
                :approve-url-fn="(item) => `${cityBaseUrl}/moderation/pages/${item.id}/approve`"
                :remove-url-fn="(item) => `${cityBaseUrl}/moderation/pages/${item.id}/remove`"
                :subtitle-fn="(item) => `By ${item.created_by_user?.name ?? 'Unknown'}`"
                status-value="pending"
                empty-message="No pending pages."
                :reason-codes="reasonCodes"
            />
        </main>
    </CityLayout>
</template>
