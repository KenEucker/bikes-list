<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CityNav from '@/Components/CityNav.vue';

defineProps({
    city: { type: Object, required: true },
    pages: { type: Object, required: true },
    homeUrl: { type: String, default: '/' },
    cityBaseUrl: { type: String, required: true },
});
</script>

<template>
    <Head :title="`Community – ${city.name}`" />
    <div class="min-h-screen bg-page">
        <CityNav :city="city" :city-base-url="cityBaseUrl" breadcrumb="Community pages">
            <template #nav-right>
                <Link v-if="$page.props.auth.user" :href="`${cityBaseUrl}/community/new`" class="rounded-token-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-fg hover:opacity-90 underline">Add page</Link>
                <Link v-if="$page.props.auth.user" :href="`${cityBaseUrl}/dashboard`" class="text-sm text-muted hover:text-fg underline">Dashboard</Link>
                <Link v-else :href="$page.props.urls?.signIn || '/account/sign-in'" class="text-sm text-muted hover:text-fg underline">Sign in</Link>
            </template>
        </CityNav>

        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="govuk-heading-l">Shops &amp; clubs</h1>
            <ul class="govuk-list govuk-!-margin-top-4 divide-y divide-border border-t border-border">
                <li v-for="page in pages.data" :key="page.id" class="py-3">
                    <a :href="`${cityBaseUrl}/community/${page.slug}`" class="font-medium text-fg underline hover:no-underline">{{ page.name }}</a>
                    <p v-if="page.about" class="mt-1 line-clamp-2 text-sm text-muted">{{ page.about }}</p>
                </li>
            </ul>
            <p v-if="pages.data.length === 0" class="govuk-body py-8 text-center text-muted">No community pages yet.</p>
        </main>
    </div>
</template>
