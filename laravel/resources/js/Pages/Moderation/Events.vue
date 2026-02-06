<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityLayout from '@/Layouts/CityLayout.vue';
import ModerationQueue from '@/Components/ModerationQueue.vue';

defineProps({
    city: { type: Object, required: true },
    events: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
});
</script>

<template>
    <Head :title="`BikesList – ${city.name} – Moderation – Events`" />
    <CityLayout :city="city" :city-base-url="cityBaseUrl" :breadcrumb="['Moderation', 'Events']">
        <template #nav-right>
            <Link :href="`${cityBaseUrl}/moderation`" class="govuk-link">Back to moderation</Link>
        </template>

        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="govuk-heading-l">Pending events</h1>
            <ModerationQueue
                :items="events.data || []"
                entity-label="events"
                title-key="title"
                :show-url-fn="(item) => `${cityBaseUrl}/events/${item.id}`"
                :approve-url-fn="(item) => `${cityBaseUrl}/moderation/events/${item.id}/approve`"
                :remove-url-fn="(item) => `${cityBaseUrl}/moderation/events/${item.id}/remove`"
                :subtitle-fn="(item) => `By ${item.user?.name ?? 'Unknown'} · ${item.starts_at ? new Date(item.starts_at).toLocaleDateString() : ''}`"
                status-value="pending_review"
                empty-message="No pending events."
            />
        </main>
    </CityLayout>
</template>
