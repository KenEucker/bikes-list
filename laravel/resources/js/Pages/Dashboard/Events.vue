<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityNav from '@/Components/CityNav.vue';

defineProps({
    city: { type: Object, required: true },
    events: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
    homeUrl: { type: String, default: '/' },
});
</script>

<template>
    <Head title="My events" />
    <div class="min-h-screen bg-page">
        <CityNav :city="city" :city-base-url="cityBaseUrl" :breadcrumb="['Dashboard', 'Events']">
            <template #nav-right>
                <Link :href="`${cityBaseUrl}/dashboard`" class="text-sm text-muted hover:text-fg underline">Dashboard</Link>
                <Link :href="$page.props.urls?.accountSettings || '/account/settings'" class="text-sm text-muted hover:text-fg underline">Account</Link>
            </template>
        </CityNav>
        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-fg">My events</h1>
            <div class="mt-6 overflow-hidden rounded-token-md border border-border bg-card">
                <table class="min-w-full divide-y divide-border">
                    <thead class="bg-muted/30">
                        <tr>
                            <th class="px-4 py-2 text-left text-xs font-medium text-muted uppercase">Title</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-muted uppercase">Date</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-muted uppercase">Status</th>
                            <th class="px-4 py-2 text-right text-xs font-medium text-muted uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border">
                        <tr v-for="event in events.data" :key="event.id">
                            <td class="px-4 py-2">
                                <a :href="`${cityBaseUrl}/events/${event.id}`" class="font-medium text-primary underline">{{ event.title }}</a>
                            </td>
                            <td class="px-4 py-2 text-sm text-muted">{{ event.starts_at ? new Date(event.starts_at).toLocaleDateString() : '' }}</td>
                            <td class="px-4 py-2"><StatusTag :status="event.state" /></td>
                            <td class="px-4 py-2 text-right">
                                <a :href="`${cityBaseUrl}/events/${event.id}/edit`" class="text-sm text-muted hover:text-fg underline">Edit</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    </div>
</template>
