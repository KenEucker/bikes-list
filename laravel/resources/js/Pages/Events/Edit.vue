<script setup>
import { Head } from '@inertiajs/vue3';
import { ref } from 'vue';
import CreatePageLayout from '@/Components/CreatePageLayout.vue';
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

const submitting = ref(false);
</script>

<template>
    <Head :title="`BikesList – ${event.name} – Edit`" />
    <CreatePageLayout
        title="Edit event"
        :head-title="`BikesList – ${event.name} – Edit`"
        breadcrumb="Edit event"
        :city="city"
        :city-base-url="cityBaseUrl"
        :back-url="`${cityBaseUrl}/events/${event.id}`"
        back-label="Back to event"
        :submitting="submitting"
        submitting-label="Saving…"
        content-max-width="max-w-4xl"
    >
        <EventForm
            :event="event"
            :guidelines="guidelines"
            :managed-community-pages="managedCommunityPages"
            :audiences="audiences"
            :default-audience-id="defaultAudienceId"
            :event-tags="eventTags"
            :city-base-url="cityBaseUrl"
            :errors="errors"
            @update:processing="submitting = $event"
        />
    </CreatePageLayout>
</template>
