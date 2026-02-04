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
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <CityNav :city="city" :city-base-url="cityBaseUrl" breadcrumb="Community pages">
            <template #nav-right>
                <Link v-if="$page.props.auth.user" :href="`${cityBaseUrl}/community/new`" class="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700">Add page</Link>
                <Link v-if="$page.props.auth.user" :href="`${cityBaseUrl}/dashboard`" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Dashboard</Link>
                <Link v-else :href="$page.props.urls?.signIn || '/account/sign-in'" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Sign in</Link>
            </template>
        </CityNav>

        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Shops &amp; clubs</h1>
            <ul class="mt-4 space-y-3">
                <li v-for="page in pages.data" :key="page.id" class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <a :href="`${cityBaseUrl}/community/${page.slug}`" class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">{{ page.name }}</a>
                    <p v-if="page.about" class="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{{ page.about }}</p>
                </li>
            </ul>
            <p v-if="pages.data.length === 0" class="py-8 text-center text-gray-500 dark:text-gray-400">No community pages yet.</p>
        </main>
    </div>
</template>
