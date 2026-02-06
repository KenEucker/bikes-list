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
        :breadcrumb="['Community pages', communityPage.name, 'Edit']"
        :city="city"
        :city-base-url="cityBaseUrl"
        :back-url="`${cityBaseUrl}/community/${communityPage.slug}`"
        back-label="Back to page"
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
