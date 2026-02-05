<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityLayout from '@/Layouts/CityLayout.vue';
import ModerationQueue from '@/Components/ModerationQueue.vue';

defineProps({
    city: { type: Object, required: true },
    pages: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
});
</script>

<template>
    <Head title="Moderation – Pages" />
    <CityLayout :city="city" :city-base-url="cityBaseUrl" :breadcrumb="['Moderation', 'Pages']">
        <template #nav-right>
            <Link :href="`${cityBaseUrl}/moderation`" class="govuk-link">Back to moderation</Link>
        </template>

        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="govuk-heading-l">Pending community pages</h1>
            <ModerationQueue
                :items="pages.data || []"
                entity-label="pages"
                title-key="name"
                :show-url-fn="(item) => `${cityBaseUrl}/community/${item.slug}`"
                :approve-url-fn="(item) => `${cityBaseUrl}/moderation/pages/${item.id}/approve`"
                :remove-url-fn="(item) => `${cityBaseUrl}/moderation/pages/${item.id}/remove`"
                :subtitle-fn="(item) => `By ${item.created_by_user?.name ?? 'Unknown'}`"
                status-value="pending"
                empty-message="No pending pages."
            />
        </main>
    </CityLayout>
</template>
