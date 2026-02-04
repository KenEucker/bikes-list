<script setup>
import ApplicationLogo from '@/Components/ApplicationLogo.vue';
import { Link } from '@inertiajs/vue3';
</script>

<template>
    <div
        class="flex min-h-screen flex-col items-center bg-page pt-6 sm:justify-center sm:pt-0"
    >
        <div>
            <Link href="/">
                <ApplicationLogo />
            </Link>
        </div>

        <div
            class="mt-6 w-full overflow-hidden bg-card border border-border px-6 py-4 shadow-sm sm:max-w-md rounded-token-md"
        >
            <slot />
        </div>
    </div>
</template>
