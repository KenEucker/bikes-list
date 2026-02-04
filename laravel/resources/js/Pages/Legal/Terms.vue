<script setup>
import { Head, Link } from '@inertiajs/vue3';
</script>

<template>
    <Head title="Terms of Service" />
    <div class="min-h-screen bg-page">
        <nav class="border-b border-border bg-card">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-16 justify-between items-center">
                    <Link :href="route('home')" class="text-xl font-semibold text-fg no-underline">BikesList</Link>
                    <Link :href="route('home')" class="text-sm text-muted hover:text-fg underline">Back to home</Link>
                </div>
            </div>
        </nav>
        <main class="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold text-fg">Terms of Service</h1>
            <p class="mt-4 text-muted">Placeholder. Replace with your terms of service content.</p>
            <Link :href="route('home')" class="mt-8 inline-block text-primary underline">Back to home</Link>
        </main>
    </div>
</template>
