<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityLayout from '@/Layouts/CityLayout.vue';
import ModerationQueue from '@/Components/ModerationQueue.vue';

defineProps({
    city: { type: Object, required: true },
    rides: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
});
</script>

<template>
    <Head :title="`BikesList – ${city.name} – Moderation – Rides`" />
    <CityLayout :city="city" :city-base-url="cityBaseUrl" :breadcrumb="['Moderation', 'Rides']">
        <template #nav-right>
            <Link :href="`${cityBaseUrl}/moderation`" class="govuk-link">Moderation</Link>
            <Link :href="`${cityBaseUrl}/dashboard`" class="govuk-link">Dashboard</Link>
        </template>

        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="govuk-heading-l">Pending rides</h1>
            <ModerationQueue
                :items="rides.data || []"
                entity-label="rides"
                :show-url-fn="(item) => `${cityBaseUrl}/rides/${item.id}`"
                :approve-url-fn="(item) => `${cityBaseUrl}/moderation/rides/${item.id}/approve`"
                :remove-url-fn="(item) => `${cityBaseUrl}/moderation/rides/${item.id}/remove`"
                empty-message="No pending rides."
            />
        </main>
    </CityLayout>
</template>
