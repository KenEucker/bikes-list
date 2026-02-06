<script setup>
import { Head } from '@inertiajs/vue3';
import CityLayout from '@/Layouts/CityLayout.vue';
import EventForm from '@/Components/Forms/EventForm.vue';

defineProps({
    city: { type: Object, required: true },
    event: { type: Object, required: true },
    guidelines: { type: Array, default: () => [] },
    managedCommunityPages: { type: Array, default: () => [] },
    audiences: { type: Object, default: () => ({}) },
    defaultAudienceId: { type: [String, Number], default: null },
    eventTags: { type: Object, default: () => ({}) },
    cityBaseUrl: { type: String, required: true },
    errors: { type: Object, default: () => ({}) },
});
</script>

<template>
    <Head :title="`BikesList – ${event.name} – Edit`" />
    <CityLayout :city="city" :city-base-url="cityBaseUrl" breadcrumb="Edit event">
        <template #nav-right>
            <a :href="`${cityBaseUrl}/events/${event.id}`" class="govuk-link">Back to event</a>
        </template>

        <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="govuk-heading-l">Edit event</h1>
            <EventForm
                :event="event"
                :guidelines="guidelines"
                :managed-community-pages="managedCommunityPages"
                :audiences="audiences"
                :default-audience-id="defaultAudienceId"
                :event-tags="eventTags"
                :city-base-url="cityBaseUrl"
                :errors="errors"
            />
        </div>
    </CityLayout>
</template>
