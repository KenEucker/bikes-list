<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityNav from '@/Components/CityNav.vue';

defineProps({
    city: { type: Object, required: true },
    events: { type: Object, required: true },
    homeUrl: { type: String, default: '/' },
    cityBaseUrl: { type: String, required: true },
});
</script>

<template>
    <Head :title="`Events – ${city.name}`" />
    <div class="min-h-screen bg-page">
        <CityNav :city="city" :city-base-url="cityBaseUrl" breadcrumb="Events">
            <template #nav-right>
                <Link v-if="$page.props.auth.user" :href="`${cityBaseUrl}/events/new`" class="rounded-token-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-fg hover:opacity-90 underline">Add event</Link>
                <Link v-if="$page.props.auth.user" :href="$page.props.urls?.accountSettings || '/account/settings'" class="text-sm text-muted hover:text-fg underline">Profile</Link>
                <Link v-else :href="$page.props.urls?.signIn || '/account/sign-in'" class="text-sm text-muted hover:text-fg underline">Log in</Link>
            </template>
        </CityNav>

        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="govuk-heading-l">Events</h1>
            <ul class="govuk-list govuk-!-margin-top-4 divide-y divide-border border-t border-border">
                <li v-for="event in events.data" :key="event.id" class="py-3">
                    <Link :href="`${cityBaseUrl}/events/${event.id}`" class="no-underline hover:underline block">
                        <p class="font-medium text-fg">{{ event.title }}</p>
                        <p class="text-sm text-muted">{{ new Date(event.starts_at).toLocaleString() }} – {{ new Date(event.ends_at).toLocaleString() }}</p>
                        <p v-if="event.location" class="text-sm text-muted">{{ event.location }}</p>
                    </Link>
                </li>
            </ul>
            <p v-if="events.data.length === 0" class="govuk-body py-8 text-center text-muted">No upcoming events.</p>
        </main>
    </div>
</template>
