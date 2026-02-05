<script setup>
import { Head } from '@inertiajs/vue3';
import CityLayout from '@/Layouts/CityLayout.vue';
import ListingForm from '@/Components/Forms/ListingForm.vue';

defineProps({
    city: { type: Object, required: true },
    listing: { type: Object, required: true },
    listingTypes: { type: Object, required: true },
    conditions: { type: Object, default: () => ({}) },
    managedCommunityPages: { type: Array, default: () => [] },
    cityBaseUrl: { type: String, required: true },
});
</script>

<template>
    <Head :title="`Edit – ${listing.title}`" />
    <CityLayout :city="city" :city-base-url="cityBaseUrl" breadcrumb="Edit listing">
        <template #nav-right>
            <a :href="`${cityBaseUrl}/listings/${listing.id}`" class="govuk-link">Back to listing</a>
        </template>

        <div class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="govuk-heading-l">Edit listing</h1>
            <ListingForm
                :listing="listing"
                :listing-types="listingTypes"
                :conditions="conditions"
                :managed-community-pages="managedCommunityPages"
                :city-base-url="cityBaseUrl"
            />
        </div>
    </CityLayout>
</template>
