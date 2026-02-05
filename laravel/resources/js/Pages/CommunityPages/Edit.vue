<script setup>
import { Head } from '@inertiajs/vue3';
import CityLayout from '@/Layouts/CityLayout.vue';
import CommunityPageForm from '@/Components/Forms/CommunityPageForm.vue';

defineProps({
    city: { type: Object, required: true },
    communityPage: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
});
</script>

<template>
    <Head :title="`Edit – ${communityPage.name}`" />
    <CityLayout :city="city" :city-base-url="cityBaseUrl" :breadcrumb="['Community pages', 'Edit']">
        <template #nav-right>
            <a :href="`${cityBaseUrl}/community/${communityPage.slug}`" class="govuk-link">Back to page</a>
        </template>

        <div class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="govuk-heading-l">Edit {{ communityPage.name }}</h1>
            <CommunityPageForm
                :community-page="communityPage"
                :city-base-url="cityBaseUrl"
            />
        </div>
    </CityLayout>
</template>
