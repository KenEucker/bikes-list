<script setup>
import { Head } from '@inertiajs/vue3';
import { ref } from 'vue';
import CreatePageLayout from '@/Components/CreatePageLayout.vue';
import EventForm from '@/Components/Forms/EventForm.vue';

defineProps({
    city: { type: Object, required: true },
    guidelines: { type: Array, required: true },
    managedCommunityPages: { type: Array, default: () => [] },
    audiences: { type: Object, default: () => ({}) },
    defaultAudienceId: { type: [String, Number], default: null },
    eventTags: { type: Object, default: () => ({}) },
    cityBaseUrl: { type: String, required: true },
    old: { type: Object, default: () => ({}) },
    errors: { type: Object, default: () => ({}) },
});

const submitting = ref(false);
</script>

<template>
    <Head :title="`BikesList – ${city.name} – New event`" />
    <CreatePageLayout
        title="New event"
        :head-title="`BikesList – ${city.name} – New event`"
        breadcrumb="New event"
        :city="city"
        :city-base-url="cityBaseUrl"
        :back-url="`${cityBaseUrl}/events`"
        back-label="Back to events"
        :submitting="submitting"
        content-max-width="max-w-4xl"
    >
        <EventForm
            :event="null"
            :guidelines="guidelines"
            :managed-community-pages="managedCommunityPages"
            :audiences="audiences"
            :default-audience-id="defaultAudienceId"
            :event-tags="eventTags"
            :city-base-url="cityBaseUrl"
            :old="old"
            :errors="errors"
            @update:processing="submitting = $event"
        />
    </CreatePageLayout>
</template>
