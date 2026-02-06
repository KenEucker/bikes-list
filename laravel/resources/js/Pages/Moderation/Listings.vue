<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityLayout from '@/Layouts/CityLayout.vue';
import ModerationQueue from '@/Components/ModerationQueue.vue';

defineProps({
    city: { type: Object, required: true },
    listings: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
});
</script>

<template>
    <Head :title="`BikesList – ${city.name} – Moderation – Listings`" />
    <CityLayout :city="city" :city-base-url="cityBaseUrl" :breadcrumb="['Moderation', 'Listings']">
        <template #nav-right>
            <Link :href="`${cityBaseUrl}/moderation`" class="govuk-link">Back to moderation</Link>
        </template>

        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="govuk-heading-l">Pending listings</h1>
            <p class="mt-2 text-sm text-muted">Approve/publish or remove with a note. Actions will be implemented via backend.</p>
            <ModerationQueue
                :items="listings.data || []"
                entity-label="listings"
                title-key="title"
                :show-url-fn="(item) => `${cityBaseUrl}/listings/${item.id}`"
                :approve-url-fn="(item) => `${cityBaseUrl}/moderation/listings/${item.id}/approve`"
                :remove-url-fn="(item) => `${cityBaseUrl}/moderation/listings/${item.id}/remove`"
                :subtitle-fn="(item) => `By ${item.user?.name ?? 'Unknown'}`"
                status-value="pending_review"
                empty-message="No pending listings."
                :confirm-remove="true"
            />
        </main>
    </CityLayout>
</template>
