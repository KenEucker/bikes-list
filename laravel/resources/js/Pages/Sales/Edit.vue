<script setup>
import { Head } from '@inertiajs/vue3';
import { ref } from 'vue';
import CreatePageLayout from '@/Components/CreatePageLayout.vue';
import SaleForm from '@/Components/Forms/SaleForm.vue';

defineProps({
    city: { type: Object, required: true },
    sale: { type: Object, required: true },
    saleTypes: { type: Object, required: true },
    conditions: { type: Object, default: () => ({}) },
    managedCommunityPages: { type: Array, default: () => [] },
    cityBaseUrl: { type: String, required: true },
});

const submitting = ref(false);
</script>

<template>
    <Head :title="`BikesList – ${sale.title} – Edit`" />
    <CreatePageLayout
        title="Edit sale"
        :head-title="`BikesList – ${sale.title} – Edit`"
        breadcrumb="Edit sale"
        :city="city"
        :city-base-url="cityBaseUrl"
        :back-url="`${cityBaseUrl}/for-sale/${sale.id}`"
        back-label="Back to sale"
        :submitting="submitting"
        submitting-label="Saving…"
    >
        <SaleForm
            :sale="sale"
            :sale-types="saleTypes"
            :conditions="conditions"
            :managed-community-pages="managedCommunityPages"
            :city-base-url="cityBaseUrl"
            @update:processing="submitting = $event"
        />
    </CreatePageLayout>
</template>
