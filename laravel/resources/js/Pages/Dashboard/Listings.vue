<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityNav from '@/Components/CityNav.vue';
import StatusChip from '@/Components/StatusChip.vue';

defineProps({
    city: { type: Object, required: true },
    listings: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
    homeUrl: { type: String, default: '/' },
});
</script>

<template>
    <Head title="My listings" />
    <div class="min-h-screen bg-page">
        <CityNav :city="city" :city-base-url="cityBaseUrl" :breadcrumb="['Dashboard', 'Listings']">
            <template #nav-right>
                <Link :href="`${cityBaseUrl}/dashboard`" class="text-sm text-muted hover:text-fg underline">Dashboard</Link>
                <Link :href="$page.props.urls?.accountSettings || '/account/settings'" class="text-sm text-muted hover:text-fg underline">Account</Link>
            </template>
        </CityNav>
        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-fg">My listings</h1>
            <div class="mt-6 overflow-hidden rounded-token-md border border-border bg-card">
                <table class="min-w-full divide-y divide-border">
                    <thead class="bg-muted/30">
                        <tr>
                            <th class="px-4 py-2 text-left text-xs font-medium text-muted uppercase">Title</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-muted uppercase">Status</th>
                            <th class="px-4 py-2 text-right text-xs font-medium text-muted uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border">
                        <tr v-for="listing in listings.data" :key="listing.id">
                            <td class="px-4 py-2">
                                <a :href="`${cityBaseUrl}/listings/${listing.id}`" class="font-medium text-primary underline">{{ listing.title }}</a>
                            </td>
                            <td class="px-4 py-2"><StatusChip :status="listing.state" /></td>
                            <td class="px-4 py-2 text-right">
                                <a :href="`${cityBaseUrl}/listings/${listing.id}/edit`" class="text-sm text-muted hover:text-fg underline">Edit</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    </div>
</template>
