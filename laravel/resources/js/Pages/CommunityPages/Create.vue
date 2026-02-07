<script setup>
import { Head } from '@inertiajs/vue3';
import { ref } from 'vue';
import CreatePageLayout from '@/Components/CreatePageLayout.vue';
import CommunityPageForm from '@/Components/Forms/CommunityPageForm.vue';

defineProps({
    city: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
    old: { type: Object, default: () => ({}) },
});

const submitting = ref(false);
</script>

<template>
    <Head :title="`BikesList – ${city.name} – New community page`" />
    <CreatePageLayout
        title="New community page"
        :head-title="`BikesList – ${city.name} – New community page`"
        :breadcrumb="[{ label: 'Community', href: `${cityBaseUrl}/community` }, 'New page']"
        :city="city"
        :city-base-url="cityBaseUrl"
        :submitting="submitting"
        footer-note="Submitting for review will list this item as pending; it will be published automatically if not reviewed by a moderator."
    >
        <CommunityPageForm
            :community-page="null"
            :city-base-url="cityBaseUrl"
            :old="old"
            @update:processing="submitting = $event"
        />
    </CreatePageLayout>
</template>
