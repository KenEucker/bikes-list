<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityLayout from '@/Layouts/CityLayout.vue';
import DashboardTable from '@/Components/DashboardTable.vue';

defineProps({
    city: { type: Object, required: true },
    sales: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
});

const columns = [
    { key: 'title', label: 'Title' },
    { key: 'state', label: 'Status' },
    { key: '_actions', label: 'Actions' },
];
</script>

<template>
    <Head :title="`BikesList – ${city.name} – My sales`" />
    <CityLayout :city="city" :city-base-url="cityBaseUrl" :breadcrumb="['Dashboard', 'For Sale']">
        <template #nav-right>
            <Link :href="`${cityBaseUrl}/dashboard`" class="govuk-link">Dashboard</Link>
            <Link :href="$page.props.urls?.accountSettings || '/account/settings'" class="govuk-link">Account</Link>
        </template>

        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="govuk-heading-l">My sales</h1>
            <DashboardTable
                :items="sales.data || []"
                :columns="columns"
                :show-url-fn="(item) => `${cityBaseUrl}/for-sale/${item.id}`"
                :edit-url-fn="(item) => `${cityBaseUrl}/for-sale/${item.id}/edit`"
                status-key="state"
            />
        </main>
    </CityLayout>
</template>
