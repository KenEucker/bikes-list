<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityLayout from '@/Layouts/CityLayout.vue';

defineProps({
    city: { type: Object, required: true },
    events: { type: Object, required: true },
    homeUrl: { type: String, default: '/' },
    cityBaseUrl: { type: String, required: true },
});
</script>

<template>
    <Head :title="`BikesList – ${city.name} – Events`" />
    <CityLayout :city="city" :city-base-url="cityBaseUrl" breadcrumb="Events">
        <template #nav-right>
            <gv-header-navigation-item v-if="$page.props.auth?.user" :href="$page.props.urls?.accountSettings || '/account/settings'" text="Profile" />
            <gv-header-navigation-item v-else :href="$page.props.urls?.signIn || '/account/sign-in'" text="Log in" />
        </template>

        <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
                <h1 class="govuk-heading-l">Events</h1>
                <Link v-if="$page.props.auth?.user" :href="`${cityBaseUrl}/events/new`" class="govuk-button" role="button">Add event</Link>
            </div>
            <ul class="govuk-list govuk-!-margin-top-4 divide-y divide-border border-t border-border">
                <li v-for="event in events.data" :key="event.id" class="py-3">
                    <Link :href="`${cityBaseUrl}/events/${event.id}`" class="no-underline hover:underline block">
                        <p class="font-medium text-fg">{{ event.title }}</p>
                        <p class="text-sm text-muted">
                            {{ event.ends_at ? `${new Date(event.starts_at).toLocaleString()} – ${new Date(event.ends_at).toLocaleString()}` : new Date(event.starts_at).toLocaleString() }}
                        </p>
                        <p v-if="event.location" class="text-sm text-muted">{{ event.location }}</p>
                    </Link>
                </li>
            </ul>
            <p v-if="events.data.length === 0" class="govuk-body py-8 text-center text-muted">No upcoming events.</p>
        </div>
    </CityLayout>
</template>
