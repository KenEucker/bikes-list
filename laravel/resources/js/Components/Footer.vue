<script setup>
import { Link, usePage } from '@inertiajs/vue3';

const page = usePage();
const urls = page.props.urls || {};
</script>

<template>
    <footer class="border-t border-border bg-card mt-auto py-6" role="contentinfo">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2" aria-label="Footer">
                <Link :href="urls.home || '/'" class="text-sm text-muted hover:text-fg underline">Choose city</Link>
                <Link :href="urls.terms || '/terms'" class="text-sm text-muted hover:text-fg underline">Terms</Link>
                <Link :href="urls.privacy || '/privacy'" class="text-sm text-muted hover:text-fg underline">Privacy</Link>
            </nav>
        </div>
    </footer>
</template>
