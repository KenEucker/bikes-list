<script setup>
import { Head, Link } from '@inertiajs/vue3';

defineProps({
    cities: {
        type: Array,
        required: true,
    },
});

function cityUrl(slug) {
    const host = window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : '';
    return `${window.location.protocol}//${slug}.${host}${port}`;
}
</script>

<template>
    <Head title="Cities" />
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <nav class="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-16 justify-between">
                    <div class="flex items-center">
                        <Link :href="route('home')" class="text-xl font-semibold text-gray-800 dark:text-white">
                            Bikes
                        </Link>
                    </div>
                    <div class="flex items-center gap-4">
                        <Link
                            v-if="$page.props.auth.user"
                            :href="route('profile.edit')"
                            class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            Profile
                        </Link>
                        <template v-else>
                            <Link
                                :href="route('login')"
                                class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            >
                                Log in
                            </Link>
                            <Link
                                :href="route('password.request')"
                                class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            >
                                Forgot password
                            </Link>
                        </template>
                    </div>
                </div>
            </div>
        </nav>

        <main class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Cities</h1>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
                Choose a city to view its page.
            </p>
            <ul class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <li
                    v-for="city in cities"
                    :key="city.id"
                    class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
                >
                    <a
                        :href="cityUrl(city.slug)"
                        class="block font-medium text-gray-900 dark:text-white"
                    >
                        {{ city.name }}
                    </a>
                    <p v-if="city.description" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {{ city.description }}
                    </p>
                </li>
            </ul>
        </main>
    </div>
</template>
