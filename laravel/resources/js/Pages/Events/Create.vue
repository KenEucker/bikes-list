<script setup>
import { Head } from '@inertiajs/vue3';
import { ref } from 'vue';
import CreatePageLayout from '@/Components/CreatePageLayout.vue';
import EventForm from '@/Components/Forms/EventForm.vue';

defineProps({
    city: { type: Object, required: true },
    guidelines: { type: Array, required: true },
    managedCommunityPages: { type: Array, default: () => [] },
    eventTags: { type: Object, default: () => ({}) },
    cityBaseUrl: { type: String, required: true },
    old: { type: Object, default: () => ({}) },
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
    >
        <EventForm
            :event="null"
            :guidelines="guidelines"
            :managed-community-pages="managedCommunityPages"
            :event-tags="eventTags"
            :city-base-url="cityBaseUrl"
            :old="old"
            @update:processing="submitting = $event"
        />
    </CreatePageLayout>
</template>
