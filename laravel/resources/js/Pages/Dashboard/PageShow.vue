<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityNav from '@/Components/CityNav.vue';
import StatusChip from '@/Components/StatusChip.vue';

defineProps({
    city: { type: Object, required: true },
    page: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
    homeUrl: { type: String, default: '/' },
});
</script>

<template>
    <Head :title="`${page.name} – Dashboard`" />
    <div class="min-h-screen bg-page">
        <CityNav :city="city" :city-base-url="cityBaseUrl" :breadcrumb="['Dashboard', 'Community pages', page.name]">
            <template #nav-right>
                <Link :href="`${cityBaseUrl}/dashboard/pages`" class="text-sm text-muted hover:text-fg underline">Back to pages</Link>
                <Link :href="`${cityBaseUrl}/dashboard`" class="text-sm text-muted hover:text-fg underline">Dashboard</Link>
            </template>
        </CityNav>
        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-fg">{{ page.name }}</h1>
            <StatusChip :status="page.state" class="mt-2" />
            <div class="mt-6 flex gap-2 border-b border-border">
                <button
                    v-for="t in ['Overview', 'Profile', 'Team', 'Listings', 'Events']"
                    :key="t"
                    class="border-b-2 px-2 py-2 text-sm font-medium border-transparent text-muted"
                >
                    {{ t }}
                </button>
            </div>
            <div class="mt-6">
                <p class="text-muted">Overview and management for this community page. Profile, team, listings, and events tabs can be wired to edit views.</p>
                <Link :href="`${cityBaseUrl}/community/${page.slug}/edit`" class="mt-4 inline-block text-primary underline">Edit page</Link>
            </div>
        </main>
    </div>
</template>
