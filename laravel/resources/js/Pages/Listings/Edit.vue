<script setup>
import { Head } from '@inertiajs/vue3';
import { ref } from 'vue';
import CreatePageLayout from '@/Components/CreatePageLayout.vue';
import ListingForm from '@/Components/Forms/ListingForm.vue';

defineProps({
    city: { type: Object, required: true },
    listing: { type: Object, required: true },
    listingTypes: { type: Object, required: true },
    conditions: { type: Object, default: () => ({}) },
    managedCommunityPages: { type: Array, default: () => [] },
    cityBaseUrl: { type: String, required: true },
});

const submitting = ref(false);
</script>

<template>
    <Head :title="`BikesList – ${listing.title} – Edit`" />
    <CreatePageLayout
        title="Edit listing"
        :head-title="`BikesList – ${listing.title} – Edit`"
        breadcrumb="Edit listing"
        :city="city"
        :city-base-url="cityBaseUrl"
        :back-url="`${cityBaseUrl}/listings/${listing.id}`"
        back-label="Back to listing"
        :submitting="submitting"
        submitting-label="Saving…"
    >
        <ListingForm
            :listing="listing"
            :listing-types="listingTypes"
            :conditions="conditions"
            :managed-community-pages="managedCommunityPages"
            :city-base-url="cityBaseUrl"
            @update:processing="submitting = $event"
        />
    </CreatePageLayout>
</template>
