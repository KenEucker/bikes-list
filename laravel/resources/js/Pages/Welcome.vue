<script setup>
import { Head, Link, usePage } from '@inertiajs/vue3';

defineProps({
    canLogin: {
        type: Boolean,
    },
    canRegister: {
        type: Boolean,
    },
});

const logo = usePage().props.logo || '/bikeslist.png';

</script>

<template>
    <Head title="Welcome" />
    <div class="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
        <div
            class="relative flex min-h-screen flex-col items-center justify-center selection:bg-indigo-600 selection:text-white"
        >
            <div class="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                <header
                    class="grid grid-cols-2 items-center gap-2 py-10 lg:grid-cols-3"
                >
                    <div class="flex items-center gap-3 lg:col-start-2 lg:justify-center">
                        <Link href="/" class="flex items-center gap-3">
                            <img
                                :src="logo"
                                alt="BikesList logo"
                                class="h-12 w-auto object-contain lg:h-16"
                            />
                            <span class="text-xl font-semibold text-gray-800 dark:text-white lg:text-2xl">BikesList</span>
                        </Link>
                    </div>
                    <nav v-if="canLogin" class="-mx-3 flex flex-1 justify-end">
                        <Link
                            v-if="$page.props.auth.user"
                            :href="$page.props.dashboardUrl || (typeof window !== 'undefined' ? window.location.origin + '/dashboard' : '/dashboard')"
                            class="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                        >
                            Dashboard
                        </Link>

                        <template v-else>
                            <Link
                                :href="route('login')"
                                class="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                            >
                                Log in
                            </Link>

                            <Link
                                v-if="canRegister"
                                :href="route('register')"
                                class="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                            >
                                Register
                            </Link>
                        </template>
                    </nav>
                </header>

                <main class="mt-6">
                    <div class="rounded-lg bg-white p-8 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] dark:bg-zinc-900">
                        <h1 class="text-2xl font-semibold text-gray-800 dark:text-white">
                            Welcome to BikesList
                        </h1>
                        <p class="mt-4 text-gray-600 dark:text-gray-400">
                            Find and share bike-friendly listings and events in your area.
                        </p>
                    </div>
                </main>

                <footer
                    class="py-16 text-center text-sm text-black dark:text-white/70"
                >
                    BikesList
                </footer>
            </div>
        </div>
    </div>
</template>
