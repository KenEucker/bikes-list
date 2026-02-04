<script setup>
import { Link, usePage } from '@inertiajs/vue3';
import ThemeToggle from '@/Components/ThemeToggle.vue';

defineProps({
    city: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
    /** Optional breadcrumb segment(s) after city name, e.g. "Listings" or "Community" */
    breadcrumb: { type: [String, Array], default: null },
});

const page = usePage();
const logo = page.props.logo || '/bikeslist.png';
const appName = page.props.appName || 'BikesList';
</script>

<template>
    <nav class="border-b border-border bg-card" aria-label="Main">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="flex h-16 justify-between items-center">
                <div class="flex items-center gap-6">
                    <a :href="cityBaseUrl" class="flex items-center gap-2 text-xl font-semibold text-fg">
                        <img :src="logo" :alt="appName" class="h-8 w-auto object-contain" />
                        <span>{{ appName }}</span>
                    </a>
                    <span class="text-muted">
                        / {{ city.name }}
                        <template v-if="breadcrumb">
                            <template v-if="Array.isArray(breadcrumb)">
                                <template v-for="(segment, i) in breadcrumb" :key="i"> / {{ segment }}</template>
                            </template>
                            <template v-else> / {{ breadcrumb }}</template>
                        </template>
                    </span>
                </div>
                <div class="flex items-center gap-4">
                    <Link :href="`${cityBaseUrl}/listings`" class="text-sm text-muted hover:text-fg underline">Listings</Link>
                    <Link :href="`${cityBaseUrl}/events`" class="text-sm text-muted hover:text-fg underline">Events</Link>
                    <Link :href="`${cityBaseUrl}/community`" class="text-sm text-muted hover:text-fg underline">Community</Link>
                    <Link :href="`${cityBaseUrl}/search`" class="text-sm text-muted hover:text-fg underline">Search</Link>
                    <Link v-if="$page.props.auth.user" :href="`${cityBaseUrl}/listings/new`" class="text-sm font-medium text-fg underline">New listing</Link>
                    <ThemeToggle />
                    <slot name="nav-right">
                        <Link v-if="$page.props.auth.user" :href="`${cityBaseUrl}/dashboard`" class="text-sm text-muted hover:text-fg underline">Dashboard</Link>
                        <Link v-else :href="$page.props.urls?.signIn || '/account/sign-in'" class="text-sm text-muted hover:text-fg underline">Sign in</Link>
                    </slot>
                </div>
            </div>
        </div>
    </nav>
</template>
