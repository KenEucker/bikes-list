<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityNav from '@/Components/CityNav.vue';
import StatusTag from '@/Components/StatusTag.vue';

defineProps({
    city: { type: Object, required: true },
    events: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
    homeUrl: { type: String, default: '/' },
});
</script>

<template>
    <Head title="Moderation – Events" />
    <div class="min-h-screen bg-page">
        <CityNav :city="city" :city-base-url="cityBaseUrl" :breadcrumb="['Moderation', 'Events']">
            <template #nav-right>
                <Link :href="`${cityBaseUrl}/moderation`" class="text-sm text-muted hover:text-fg underline">Back to moderation</Link>
            </template>
        </CityNav>
        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="govuk-heading-l">Pending events</h1>
            <ul class="mt-6 space-y-4">
                <li v-for="event in events.data" :key="event.id" class="rounded-token-md border border-border bg-card p-4">
                    <a :href="`${cityBaseUrl}/events/${event.id}`" class="font-medium text-primary underline">{{ event.title }}</a>
                    <p class="mt-1 text-sm text-muted">By {{ event.user?.name ?? 'Unknown' }} · {{ event.starts_at ? new Date(event.starts_at).toLocaleDateString() : '' }}</p>
                    <StatusTag status="pending_review" class="mt-2" />
                    <div class="mt-3 govuk-button-group">
                        <Link :href="`${cityBaseUrl}/moderation/events/${event.id}/approve`" method="post" as="button" class="govuk-button">Approve / Publish</Link>
                        <form :action="`${cityBaseUrl}/moderation/events/${event.id}/remove`" method="post" class="inline govuk-!-display-inline">
                            <input type="hidden" name="_token" :value="$page.props.csrf_token" />
                            <input type="text" name="note" required placeholder="Reason (required)" class="govuk-input govuk-!-width-one-third govuk-!-margin-right-2" />
                            <gv-button type="submit" variant="warning">Remove</gv-button>
                        </form>
                    </div>
                </li>
            </ul>
            <p v-if="!events.data?.length" class="mt-6 text-muted">No pending events.</p>
        </main>
    </div>
</template>
