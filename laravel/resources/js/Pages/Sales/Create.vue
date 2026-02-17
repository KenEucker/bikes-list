<script setup>
import { Head } from '@inertiajs/vue3';
import { ref } from 'vue';
import CreatePageLayout from '@/Components/CreatePageLayout.vue';
import SaleForm from '@/Components/Forms/SaleForm.vue';

defineProps({
    city: { type: Object, required: true },
    saleTypes: { type: Object, required: true },
    conditions: { type: Object, default: () => ({}) },
    fullBicycleOptions: { type: Object, default: () => ({}) },
    managedCommunityPages: { type: Array, default: () => [] },
    authUser: { type: Object, default: null },
    cityBaseUrl: { type: String, required: true },
    errors: { type: Object, default: () => ({}) },
    old: { type: Object, default: () => ({}) },
});

const submitting = ref(false);
</script>

<template>
    <Head :title="`BikesList – ${city.name} – Add new sale`" />
    <CreatePageLayout
        title="Add new sale"
        :head-title="`BikesList – ${city.name} – Add new sale`"
        :breadcrumb="[{ label: 'For Sale', href: `${cityBaseUrl}/for-sale` }, 'Add new sale']"
        :city="city"
        :city-base-url="cityBaseUrl"
        :submitting="submitting"
        footer-note="Submitting for review will list this item as pending; it will be published automatically if not reviewed by a moderator."
    >
        <template #before-form>
            <p class="govuk-body">Title 6–80 characters. Description at least 20 characters. 1–4 photos (add after creating draft if needed).</p>
        </template>

        <SaleForm
            :sale="null"
            :sale-types="saleTypes"
            :conditions="conditions"
            :full-bicycle-options="fullBicycleOptions"
            :managed-community-pages="managedCommunityPages"
            :auth-user="authUser"
            :city-base-url="cityBaseUrl"
            :old="old"
            @update:processing="submitting = $event"
        />
    </CreatePageLayout>
</template>
