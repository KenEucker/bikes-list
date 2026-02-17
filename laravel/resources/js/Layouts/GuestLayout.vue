<script setup>
import ApplicationLogo from '@/Components/ApplicationLogo.vue';
import { Link, usePage } from '@inertiajs/vue3';

const page = usePage();
const appName = page.props.appName || 'BikesList';
</script>

<template>
    <div
        class="flex min-h-screen flex-col items-center bg-page pt-6 sm:justify-center sm:pt-0"
    >
        <div class="flex flex-col items-center">
            <Link href="/" class="guest-logo block">
                <ApplicationLogo />
            </Link>
            <p class="mt-2 text-center text-lg font-semibold text-fg">
                {{ appName }}
            </p>
        </div>

        <div
            class="mt-6 w-full overflow-hidden bg-card border border-border px-6 py-4 shadow-sm sm:max-w-md rounded-token-md"
        >
            <slot />
        </div>
    </div>
</template>
