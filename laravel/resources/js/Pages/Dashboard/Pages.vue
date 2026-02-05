<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityNav from '@/Components/CityNav.vue';
import StatusTag from '@/Components/StatusTag.vue';

defineProps({
    city: { type: Object, required: true },
    pages: { type: Array, default: () => [] },
    cityBaseUrl: { type: String, required: true },
    homeUrl: { type: String, default: '/' },
});
</script>

<template>
    <Head title="My community pages" />
    <div class="min-h-screen bg-page">
        <CityNav :city="city" :city-base-url="cityBaseUrl" :breadcrumb="['Dashboard', 'Community pages']">
            <template #nav-right>
                <Link :href="`${cityBaseUrl}/dashboard`" class="text-sm text-muted hover:text-fg underline">Dashboard</Link>
                <Link :href="$page.props.urls?.accountSettings || '/account/settings'" class="text-sm text-muted hover:text-fg underline">Account</Link>
            </template>
        </CityNav>
        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-fg">My community pages</h1>
            <Link :href="`${cityBaseUrl}/community/new`" class="mt-4 inline-block rounded-token-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:opacity-90 underline">New page</Link>
            <ul class="mt-6 space-y-2">
                <li v-for="page in pages" :key="page.id" class="flex items-center justify-between rounded-token-md border border-border bg-card px-4 py-2">
                    <a :href="`${cityBaseUrl}/dashboard/pages/${page.slug}`" class="font-medium text-primary underline">{{ page.name }}</a>
                    <StatusTag :status="page.state" />
                </li>
            </ul>
        </main>
    </div>
</template>
