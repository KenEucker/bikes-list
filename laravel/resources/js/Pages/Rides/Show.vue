<script setup>
import { Head, Link, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import CityLayout from '@/Layouts/CityLayout.vue';
import EmailRelayCard from '@/Components/EmailRelayCard.vue';
import PendingReviewBanner from '@/Components/PendingReviewBanner.vue';

defineProps({
    city: { type: Object, required: true },
    ride: { type: Object, required: true },
    rideTags: { type: Object, default: () => ({}) },
    organizerRelayEmail: { type: String, default: null },
    moderatorRelayEmail: { type: String, default: '' },
    homeUrl: { type: String, default: '/' },
    cityBaseUrl: { type: String, required: true },
});

const page = usePage();
const status = computed(() => page.props.status ?? page.props.flash?.status);
</script>

<template>
    <Head :title="`BikesList – ${ride.name}`" />
    <CityLayout :city="city" :city-base-url="cityBaseUrl" :breadcrumb="['Rides', ride.name]">
        <template #nav-right>
            <a :href="`${cityBaseUrl}/rides`" class="govuk-link">Back to rides</a>
            <Link v-if="$page.props.auth.user && (ride.user_id === $page.props.auth.user.id || ride.community_page_id)" :href="`${cityBaseUrl}/rides/${ride.id}/edit`" class="govuk-link">Edit</Link>
        </template>

        <gv-notification-banner v-if="status" type="success" title="Success" class="rounded-none border-x-0 border-t-0">
            <p class="govuk-body">{{ status }}</p>
        </gv-notification-banner>
        <PendingReviewBanner :show="ride.state === 'pending_review'" resource-label="ride" />
        <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-fg">{{ ride.name }}</h1>
            <p class="mt-2 text-muted">
                {{ ride.ends_at ? `${new Date(ride.starts_at).toLocaleString()} – ${new Date(ride.ends_at).toLocaleString()}` : new Date(ride.starts_at).toLocaleString() }}
            </p>
            <p v-if="ride.organizer_name" class="mt-1 text-sm text-muted">Organizer: {{ ride.organizer_name }}{{ ride.organizer_email_hidden ? ' (contact via relay below)' : '' }}</p>
            <p v-if="ride.audience?.name" class="mt-1 text-sm text-muted">Audience: {{ ride.audience.name }}</p>
            <div v-if="ride.tags && ride.tags.length && Object.keys(rideTags).length" class="mt-1 flex flex-wrap gap-1">
                <span v-for="slug in ride.tags" :key="slug" class="rounded bg-muted px-2 py-0.5 text-xs text-fg">{{ rideTags[slug] || slug }}</span>
            </div>
            <img v-if="ride.uploads && ride.uploads.length && ride.uploads[0].lg_url" :src="ride.uploads[0].lg_url" alt="" class="mt-4 max-h-64 w-full object-cover rounded">
            <div class="mt-6 prose dark:prose-invert max-w-none">
                <p class="whitespace-pre-wrap text-fg">{{ ride.description }}</p>
            </div>
            <p v-if="ride.time_details" class="mt-4 text-sm text-muted">{{ ride.time_details }}</p>
            <p v-if="ride.location_name" class="mt-4 text-sm text-muted">Location: {{ ride.location_name }}{{ ride.location_address ? ` – ${ride.location_address}` : '' }}</p>
            <p v-else-if="ride.location_address" class="mt-4 text-sm text-muted">Address: {{ ride.location_address }}</p>
            <p v-if="ride.location_details" class="mt-1 text-sm text-muted">{{ ride.location_details }}</p>
            <p v-if="ride.route_length" class="mt-2 text-sm text-muted">Length of ride: {{ ride.route_length }}</p>
            <p v-if="ride.is_loop" class="mt-1 text-sm text-muted">Loop ride (ends at start).</p>
            <p v-if="ride.route_description" class="mt-2 text-sm text-muted">Route: {{ ride.route_description }}</p>
            <a v-if="ride.route_link" :href="ride.route_link" target="_blank" rel="noopener noreferrer" class="mt-2 block text-sm text-primary underline">View route link</a>

            <div v-if="organizerRelayEmail" class="mt-8">
                <EmailRelayCard
                    :email="organizerRelayEmail"
                    label="Contact organizer"
                    note="Copy the address below and use your own email client. Your address is never shown to the recipient."
                    :mailto-subject="`Re: Ride – ${ride.name} – ${ride.id}`"
                />
            </div>

            <div v-if="moderatorRelayEmail" class="mt-8">
                <EmailRelayCard
                    :email="moderatorRelayEmail"
                    label="Report this ride"
                    note="Email the city moderators. Include the subject so they can identify the item."
                    :mailto-subject="`Report: Ride – ${ride.name} – ${ride.id}`"
                />
            </div>
        </div>
    </CityLayout>
</template>
