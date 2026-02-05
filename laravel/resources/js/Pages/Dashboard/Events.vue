<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityLayout from '@/Layouts/CityLayout.vue';
import DashboardTable from '@/Components/DashboardTable.vue';

defineProps({
    city: { type: Object, required: true },
    events: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
});

const columns = [
    { key: 'title', label: 'Title' },
    { key: 'starts_at', label: 'Date', format: (e) => (e.starts_at ? new Date(e.starts_at).toLocaleDateString() : '') },
    { key: 'state', label: 'Status' },
    { key: '_actions', label: 'Actions' },
];
</script>

<template>
    <Head title="My events" />
    <CityLayout :city="city" :city-base-url="cityBaseUrl" :breadcrumb="['Dashboard', 'Events']">
        <template #nav-right>
            <Link :href="`${cityBaseUrl}/dashboard`" class="govuk-link">Dashboard</Link>
            <Link :href="$page.props.urls?.accountSettings || '/account/settings'" class="govuk-link">Account</Link>
        </template>

        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="govuk-heading-l">My events</h1>
            <DashboardTable
                :items="events.data || []"
                :columns="columns"
                :show-url-fn="(item) => `${cityBaseUrl}/events/${item.id}`"
                :edit-url-fn="(item) => `${cityBaseUrl}/events/${item.id}/edit`"
                status-key="state"
            />
        </main>
    </CityLayout>
</template>
