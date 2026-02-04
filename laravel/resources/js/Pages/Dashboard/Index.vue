<script setup>
import { Head, Link, usePage } from '@inertiajs/vue3';

defineProps({
    city: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
    homeUrl: { type: String, default: '/' },
    counts: { type: Object, default: () => ({}) },
});

const page = usePage();
const accountUrl = page.props.urls?.accountSettings ?? '/account/settings';
const logo = page.props.logo || '/bikeslist.png';
const appName = page.props.appName || 'BikesList';
</script>

<template>
    <Head :title="`Dashboard – ${city.name}`" />
    <div class="min-h-screen bg-page">
        <nav class="border-b border-border bg-card">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-16 justify-between items-center">
                    <div class="flex items-center gap-6">
                        <a :href="cityBaseUrl" class="flex items-center gap-2 text-xl font-semibold text-fg no-underline">
                            <img :src="logo" :alt="appName" class="h-8 w-auto object-contain" />
                            <span>{{ appName }}</span>
                        </a>
                        <span class="text-muted">/ {{ city.name }}</span>
                    </div>
                    <div class="flex gap-4">
                        <Link :href="`${cityBaseUrl}/dashboard`" class="text-sm font-medium text-primary underline">Dashboard</Link>
                        <Link :href="accountUrl" class="text-sm text-muted hover:text-fg underline">Account</Link>
                    </div>
                </div>
            </div>
        </nav>
        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-fg">Dashboard</h1>
            <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link :href="`${cityBaseUrl}/dashboard/listings`" class="rounded-token-md border border-border bg-card p-4 no-underline">
                    <span class="font-medium text-fg">Listings</span>
                    <p class="mt-1 text-2xl font-semibold text-muted">{{ counts.listings ?? 0 }}</p>
                </Link>
                <Link :href="`${cityBaseUrl}/dashboard/events`" class="rounded-token-md border border-border bg-card p-4 no-underline">
                    <span class="font-medium text-fg">Events</span>
                    <p class="mt-1 text-2xl font-semibold text-muted">{{ counts.events ?? 0 }}</p>
                </Link>
                <Link :href="`${cityBaseUrl}/dashboard/pending`" class="rounded-token-md border border-border bg-card p-4 no-underline">
                    <span class="font-medium text-fg">Pending</span>
                    <p class="mt-1 text-2xl font-semibold text-amber-600 dark:text-amber-400">{{ (counts.pendingListings ?? 0) + (counts.pendingEvents ?? 0) + (counts.pendingPages ?? 0) }}</p>
                </Link>
                <Link :href="`${cityBaseUrl}/dashboard/pages`" class="rounded-token-md border border-border bg-card p-4 no-underline">
                    <span class="font-medium text-fg">Community pages</span>
                    <p class="mt-1 text-2xl font-semibold text-muted">{{ counts.pages ?? 0 }}</p>
                </Link>
            </div>
        </main>
    </div>
</template>
