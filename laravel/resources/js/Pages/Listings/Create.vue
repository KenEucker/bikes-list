<script setup>
import { Head } from '@inertiajs/vue3';
import { ref } from 'vue';
import CreatePageLayout from '@/Components/CreatePageLayout.vue';
import ListingForm from '@/Components/Forms/ListingForm.vue';

defineProps({
    city: { type: Object, required: true },
    listingTypes: { type: Object, required: true },
    conditions: { type: Object, default: () => ({}) },
    managedCommunityPages: { type: Array, default: () => [] },
    cityBaseUrl: { type: String, required: true },
    errors: { type: Object, default: () => ({}) },
    old: { type: Object, default: () => ({}) },
});

const submitting = ref(false);
</script>

<template>
    <Head :title="`New listing – ${city.name}`" />
    <CreatePageLayout
        title="New listing"
        :head-title="`New listing – ${city.name}`"
        breadcrumb="New listing"
        :city="city"
        :city-base-url="cityBaseUrl"
        :back-url="`${cityBaseUrl}/listings`"
        back-label="Back to listings"
        :submitting="submitting"
        footer-note="Submitting for review will list this item as pending; it will be published automatically if not reviewed by a moderator."
    >
        <template #before-form>
            <p class="govuk-body">Title 6–80 characters. Description at least 20 characters. 1–4 photos (add after creating draft if needed).</p>
        </template>

        <ListingForm
            :listing="null"
            :listing-types="listingTypes"
            :conditions="conditions"
            :managed-community-pages="managedCommunityPages"
            :city-base-url="cityBaseUrl"
            :old="old"
            @update:processing="submitting = $event"
        />
    </CreatePageLayout>
</template>
