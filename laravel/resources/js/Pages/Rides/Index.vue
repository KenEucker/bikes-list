<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityLayout from '@/Layouts/CityLayout.vue';

defineProps({
    city: { type: Object, required: true },
    rides: { type: Object, required: true },
    homeUrl: { type: String, default: '/' },
    cityBaseUrl: { type: String, required: true },
});
</script>

<template>
    <Head :title="`BikesList – ${city.name} – Rides`" />
    <CityLayout :city="city" :city-base-url="cityBaseUrl" breadcrumb="Rides">
        <template #nav-right>
            <gv-header-navigation-item v-if="$page.props.auth?.user" :href="$page.props.urls?.accountSettings || '/account/settings'" text="Profile" />
            <gv-header-navigation-item v-else :href="$page.props.urls?.signIn || '/account/sign-in'" text="Log in" />
        </template>

        <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
                <h1 class="govuk-heading-l">Rides</h1>
                <Link v-if="$page.props.auth?.user" :href="`${cityBaseUrl}/rides/new`" class="govuk-button" role="button">Add ride</Link>
            </div>
            <ul class="govuk-list govuk-!-margin-top-4 divide-y divide-border border-t border-border">
                <li v-for="ride in rides.data" :key="ride.id" class="py-3">
                    <Link :href="`${cityBaseUrl}/rides/${ride.id}`" class="no-underline hover:underline block">
                        <p class="font-medium text-fg">{{ ride.name }}</p>
                        <p class="text-sm text-muted">
                            {{ ride.ends_at ? `${new Date(ride.starts_at).toLocaleString()} – ${new Date(ride.ends_at).toLocaleString()}` : new Date(ride.starts_at).toLocaleString() }}
                        </p>
                        <p v-if="ride.location" class="text-sm text-muted">{{ ride.location }}</p>
                    </Link>
                </li>
            </ul>
            <p v-if="rides.data.length === 0" class="govuk-body py-8 text-center text-muted">No upcoming rides.</p>
        </div>
    </CityLayout>
</template>
