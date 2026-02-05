<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityLayout from '@/Layouts/CityLayout.vue';
import EmailRelayCard from '@/Components/EmailRelayCard.vue';

defineProps({
    city: { type: Object, required: true },
    event: { type: Object, required: true },
    organizerRelayEmail: { type: String, default: null },
    moderatorRelayEmail: { type: String, default: '' },
    homeUrl: { type: String, default: '/' },
    cityBaseUrl: { type: String, required: true },
});
</script>

<template>
    <Head :title="event.title" />
    <CityLayout :city="city" :city-base-url="cityBaseUrl" :breadcrumb="['Events', event.title]">
        <template #nav-right>
            <a :href="`${cityBaseUrl}/events`" class="govuk-link">Back to events</a>
            <Link v-if="$page.props.auth.user && (event.user_id === $page.props.auth.user.id || event.community_page_id)" :href="`${cityBaseUrl}/events/${event.id}/edit`" class="govuk-link">Edit</Link>
        </template>

        <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-fg">{{ event.title }}</h1>
            <p class="mt-2 text-muted">{{ new Date(event.starts_at).toLocaleString() }} – {{ new Date(event.ends_at).toLocaleString() }}</p>
            <p v-if="event.organizer_name" class="mt-1 text-sm text-muted">Organizer: {{ event.organizer_name }}{{ event.organizer_email_hidden ? ' (contact via relay below)' : '' }}</p>
            <div class="mt-6 prose dark:prose-invert max-w-none">
                <p class="whitespace-pre-wrap text-fg">{{ event.description }}</p>
            </div>
            <p v-if="event.location_address" class="mt-4 text-sm text-muted">Location: {{ event.location_address }}</p>
            <p v-if="event.route_description" class="mt-2 text-sm text-muted">Route: {{ event.route_description }}</p>
            <a v-if="event.route_link" :href="event.route_link" target="_blank" rel="noopener noreferrer" class="mt-2 block text-sm text-primary underline">View route link</a>

            <div v-if="organizerRelayEmail" class="mt-8">
                <EmailRelayCard
                    :email="organizerRelayEmail"
                    label="Contact organizer"
                    note="Copy the address below and use your own email client. Your address is never shown to the recipient."
                    :mailto-subject="`Re: Event – ${event.title} – ${event.id}`"
                />
            </div>

            <div v-if="moderatorRelayEmail" class="mt-8">
                <EmailRelayCard
                    :email="moderatorRelayEmail"
                    label="Report this event"
                    note="Email the city moderators. Include the subject so they can identify the item."
                    :mailto-subject="`Report: Event – ${event.title} – ${event.id}`"
                />
            </div>
        </div>
    </CityLayout>
</template>
