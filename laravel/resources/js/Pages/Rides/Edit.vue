<script setup>
import { Head } from '@inertiajs/vue3';
import { ref } from 'vue';
import CreatePageLayout from '@/Components/CreatePageLayout.vue';
import RideForm from '@/Components/Forms/RideForm.vue';

defineProps({
    city: { type: Object, required: true },
    ride: { type: Object, required: true },
    guidelines: { type: Array, default: () => [] },
    managedCommunityPages: { type: Array, default: () => [] },
    audiences: { type: Object, default: () => ({}) },
    defaultAudienceId: { type: [String, Number], default: null },
    rideTags: { type: Object, default: () => ({}) },
    cityBaseUrl: { type: String, required: true },
    errors: { type: Object, default: () => ({}) },
});

const submitting = ref(false);
</script>

<template>
    <Head :title="`BikesList – ${ride.name} – Edit`" />
    <CreatePageLayout
        title="Edit ride"
        :head-title="`BikesList – ${ride.name} – Edit`"
        breadcrumb="Edit ride"
        :city="city"
        :city-base-url="cityBaseUrl"
        :back-url="`${cityBaseUrl}/rides/${ride.id}`"
        back-label="Back to ride"
        :submitting="submitting"
        submitting-label="Saving…"
        content-max-width="max-w-4xl"
    >
        <RideForm
            :ride="ride"
            :guidelines="guidelines"
            :managed-community-pages="managedCommunityPages"
            :audiences="audiences"
            :default-audience-id="defaultAudienceId"
            :ride-tags="rideTags"
            :city-base-url="cityBaseUrl"
            :errors="errors"
            @update:processing="submitting = $event"
        />
    </CreatePageLayout>
</template>
