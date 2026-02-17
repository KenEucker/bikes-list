<script setup>
import { Head } from '@inertiajs/vue3';
import { ref } from 'vue';
import CreatePageLayout from '@/Components/CreatePageLayout.vue';
import CommunityPageForm from '@/Components/Forms/CommunityPageForm.vue';

defineProps({
    city: { type: Object, required: true },
    communityPage: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
});

const submitting = ref(false);
</script>

<template>
    <Head :title="`BikesList – ${communityPage.name} – Edit`" />
    <CreatePageLayout
        :title="`Edit ${communityPage.name}`"
        :head-title="`BikesList – ${communityPage.name} – Edit`"
        :breadcrumb="[{ label: 'Community', href: `${cityBaseUrl}/community` }, { label: communityPage.name, href: `${cityBaseUrl}/community/${communityPage.slug}` }, 'Edit']"
        :city="city"
        :city-base-url="cityBaseUrl"
        :submitting="submitting"
        submitting-label="Saving…"
    >
        <CommunityPageForm
            :community-page="communityPage"
            :city-base-url="cityBaseUrl"
            @update:processing="submitting = $event"
        />
    </CreatePageLayout>
</template>
