<script setup>
import { Head, Link, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import CityLayout from '@/Layouts/CityLayout.vue';
import EmailRelayCard from '@/Components/EmailRelayCard.vue';

defineProps({
    city: { type: Object, required: true },
    event: { type: Object, required: true },
    eventTags: { type: Object, default: () => ({}) },
    organizerRelayEmail: { type: String, default: null },
    moderatorRelayEmail: { type: String, default: '' },
    homeUrl: { type: String, default: '/' },
    cityBaseUrl: { type: String, required: true },
});

const page = usePage();
const status = computed(() => page.props.status ?? page.props.flash?.status);
</script>

<template>
    <Head :title="`BikesList – ${event.name}`" />
    <CityLayout :city="city" :city-base-url="cityBaseUrl" :breadcrumb="['Events', event.name]">
        <template #nav-right>
            <a :href="`${cityBaseUrl}/events`" class="govuk-link">Back to events</a>
            <Link v-if="$page.props.auth.user && (event.user_id === $page.props.auth.user.id || event.community_page_id)" :href="`${cityBaseUrl}/events/${event.id}/edit`" class="govuk-link">Edit</Link>
        </template>

        <gv-notification-banner v-if="status" type="success" title="Success" class="rounded-none border-x-0 border-t-0">
            <p class="govuk-body">{{ status }}</p>
        </gv-notification-banner>
        <gv-notification-banner v-if="event.state === 'pending_review'" type="warning" title="Pending review" class="rounded-none border-x-0 border-t-0 border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800">
            <p class="govuk-body">This event is pending review. It is not visible to the public yet. A moderator will review it; when approved, it will be published.</p>
        </gv-notification-banner>
        <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-fg">{{ event.name }}</h1>
            <p class="mt-2 text-muted">
                {{ event.ends_at ? `${new Date(event.starts_at).toLocaleString()} – ${new Date(event.ends_at).toLocaleString()}` : new Date(event.starts_at).toLocaleString() }}
            </p>
            <p v-if="event.organizer_name" class="mt-1 text-sm text-muted">Organizer: {{ event.organizer_name }}{{ event.organizer_email_hidden ? ' (contact via relay below)' : '' }}</p>
            <p v-if="event.audience?.name" class="mt-1 text-sm text-muted">Audience: {{ event.audience.name }}</p>
            <div v-if="event.tags && event.tags.length && Object.keys(eventTags).length" class="mt-1 flex flex-wrap gap-1">
                <span v-for="slug in event.tags" :key="slug" class="rounded bg-muted px-2 py-0.5 text-xs text-fg">{{ eventTags[slug] || slug }}</span>
            </div>
            <img v-if="event.uploads && event.uploads.length && event.uploads[0].lg_url" :src="event.uploads[0].lg_url" alt="" class="mt-4 max-h-64 w-full object-cover rounded">
            <div class="mt-6 prose dark:prose-invert max-w-none">
                <p class="whitespace-pre-wrap text-fg">{{ event.description }}</p>
            </div>
            <p v-if="event.time_details" class="mt-4 text-sm text-muted">{{ event.time_details }}</p>
            <p v-if="event.location_name" class="mt-4 text-sm text-muted">Location: {{ event.location_name }}{{ event.location_address ? ` – ${event.location_address}` : '' }}</p>
            <p v-else-if="event.location_address" class="mt-4 text-sm text-muted">Address: {{ event.location_address }}</p>
            <p v-if="event.location_details" class="mt-1 text-sm text-muted">{{ event.location_details }}</p>
            <p v-if="event.route_length" class="mt-2 text-sm text-muted">Length of ride: {{ event.route_length }}</p>
            <p v-if="event.is_loop" class="mt-1 text-sm text-muted">Loop ride (ends at start).</p>
            <p v-if="event.route_description" class="mt-2 text-sm text-muted">Route: {{ event.route_description }}</p>
            <a v-if="event.route_link" :href="event.route_link" target="_blank" rel="noopener noreferrer" class="mt-2 block text-sm text-primary underline">View route link</a>

            <div v-if="organizerRelayEmail" class="mt-8">
                <EmailRelayCard
                    :email="organizerRelayEmail"
                    label="Contact organizer"
                    note="Copy the address below and use your own email client. Your address is never shown to the recipient."
                    :mailto-subject="`Re: Event – ${event.name} – ${event.id}`"
                />
            </div>

            <div v-if="moderatorRelayEmail" class="mt-8">
                <EmailRelayCard
                    :email="moderatorRelayEmail"
                    label="Report this event"
                    note="Email the city moderators. Include the subject so they can identify the item."
                    :mailto-subject="`Report: Event – ${event.name} – ${event.id}`"
                />
            </div>
        </div>
    </CityLayout>
</template>
