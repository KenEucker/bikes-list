<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityNav from '@/Components/CityNav.vue';
import StatusChip from '@/Components/StatusChip.vue';

defineProps({
    city: { type: Object, required: true },
    pages: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
    homeUrl: { type: String, default: '/' },
});
</script>

<template>
    <Head title="Moderation – Pages" />
    <div class="min-h-screen bg-page">
        <CityNav :city="city" :city-base-url="cityBaseUrl" :breadcrumb="['Moderation', 'Pages']">
            <template #nav-right>
                <Link :href="`${cityBaseUrl}/moderation`" class="text-sm text-muted hover:text-fg underline">Back to moderation</Link>
            </template>
        </CityNav>
        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-fg">Pending community pages</h1>
            <ul class="mt-6 space-y-4">
                <li v-for="page in pages.data" :key="page.id" class="rounded-token-md border border-border bg-card p-4">
                    <a :href="`${cityBaseUrl}/community/${page.slug}`" class="font-medium text-primary underline">{{ page.name }}</a>
                    <p class="mt-1 text-sm text-muted">By {{ page.created_by_user?.name ?? 'Unknown' }}</p>
                    <StatusChip status="pending" class="mt-2" />
                    <div class="mt-3 flex gap-2">
                        <Link :href="`${cityBaseUrl}/moderation/pages/${page.id}/approve`" method="post" as="button" class="rounded-token-sm bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700">Approve</Link>
                        <form :action="`${cityBaseUrl}/moderation/pages/${page.id}/remove`" method="post" class="inline">
                            <input type="hidden" name="_token" :value="$page.props.csrf_token" />
                            <input type="text" name="note" required placeholder="Reason (required)" class="mr-2 rounded-token-sm border border-border bg-input px-2 py-1 text-sm text-fg focus:border-focus focus:ring-focus" />
                            <button type="submit" class="rounded-token-sm bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700">Remove</button>
                        </form>
                    </div>
                </li>
            </ul>
            <p v-if="!pages.data?.length" class="mt-6 text-muted">No pending pages.</p>
        </main>
    </div>
</template>
