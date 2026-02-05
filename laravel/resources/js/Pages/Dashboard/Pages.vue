<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityLayout from '@/Layouts/CityLayout.vue';
import StatusTag from '@/Components/StatusTag.vue';

defineProps({
    city: { type: Object, required: true },
    pages: { type: Array, default: () => [] },
    cityBaseUrl: { type: String, required: true },
});
</script>

<template>
    <Head title="My community pages" />
    <CityLayout :city="city" :city-base-url="cityBaseUrl" :breadcrumb="['Dashboard', 'Community pages']">
        <template #nav-right>
            <Link :href="`${cityBaseUrl}/dashboard`" class="govuk-link">Dashboard</Link>
            <Link :href="$page.props.urls?.accountSettings || '/account/settings'" class="govuk-link">Account</Link>
        </template>

        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="govuk-heading-l">My community pages</h1>
            <Link :href="`${cityBaseUrl}/community/new`" class="mt-4 inline-block govuk-button">New page</Link>
            <ul class="mt-6 space-y-2">
                <li v-for="page in pages" :key="page.id" class="flex items-center justify-between rounded-token-md border border-border bg-card px-4 py-2">
                    <a :href="`${cityBaseUrl}/dashboard/pages/${page.slug}`" class="font-medium text-primary underline">{{ page.name }}</a>
                    <StatusTag :status="page.state" />
                </li>
            </ul>
        </main>
    </CityLayout>
</template>
