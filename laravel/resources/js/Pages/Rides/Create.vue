<script setup>
import { Head } from '@inertiajs/vue3';
import { ref } from 'vue';
import CreatePageLayout from '@/Components/CreatePageLayout.vue';
import RideForm from '@/Components/Forms/RideForm.vue';

defineProps({
    city: { type: Object, required: true },
    guidelines: { type: Array, required: true },
    managedCommunityPages: { type: Array, default: () => [] },
    audiences: { type: Object, default: () => ({}) },
    defaultAudienceId: { type: [String, Number], default: null },
    rideTags: { type: Object, default: () => ({}) },
    cityBaseUrl: { type: String, required: true },
    old: { type: Object, default: () => ({}) },
    errors: { type: Object, default: () => ({}) },
});

const submitting = ref(false);
</script>

<template>
    <Head :title="`BikesList – ${city.name} – New ride`" />
    <CreatePageLayout
        title="New ride"
        :head-title="`BikesList – ${city.name} – New ride`"
        :breadcrumb="[{ label: 'Rides', href: `${cityBaseUrl}/rides` }, 'New ride']"
        :city="city"
        :city-base-url="cityBaseUrl"
        :submitting="submitting"
        content-max-width="max-w-4xl"
    >
        <RideForm
            :ride="null"
            :guidelines="guidelines"
            :managed-community-pages="managedCommunityPages"
            :audiences="audiences"
            :default-audience-id="defaultAudienceId"
            :ride-tags="rideTags"
            :city-base-url="cityBaseUrl"
            :old="old"
            :errors="errors"
            @update:processing="submitting = $event"
        />
    </CreatePageLayout>
</template>
