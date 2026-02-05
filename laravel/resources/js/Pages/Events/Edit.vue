<script setup>
import { Head } from '@inertiajs/vue3';
import CityLayout from '@/Layouts/CityLayout.vue';
import EventForm from '@/Components/Forms/EventForm.vue';

defineProps({
    city: { type: Object, required: true },
    event: { type: Object, required: true },
    guidelines: { type: Array, default: () => [] },
    eventTags: { type: Object, default: () => ({}) },
    cityBaseUrl: { type: String, required: true },
});
</script>

<template>
    <Head :title="`Edit – ${event.title}`" />
    <CityLayout :city="city" :city-base-url="cityBaseUrl" breadcrumb="Edit event">
        <template #nav-right>
            <a :href="`${cityBaseUrl}/events/${event.id}`" class="govuk-link">Back to event</a>
        </template>

        <div class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="govuk-heading-l">Edit event</h1>
            <EventForm
                :event="event"
                :guidelines="guidelines"
                :managed-community-pages="managedCommunityPages"
                :event-tags="eventTags"
                :city-base-url="cityBaseUrl"
            />
        </div>
    </CityLayout>
</template>
