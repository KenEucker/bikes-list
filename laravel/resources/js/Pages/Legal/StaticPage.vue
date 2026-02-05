<script setup>
import { Head, Link, usePage } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import ThemeToggle from '@/Components/ThemeToggle.vue';

defineProps({
    title: { type: String, required: true },
    content: { type: String, default: '' },
});

const page = usePage();
const urls = page.props.urls || {};
</script>

<template>
    <Head :title="title" />
    <PublicLayout>
        <template #nav>
            <li class="govuk-header__navigation-item">
                <ThemeToggle />
            </li>
            <gv-header-navigation-item :href="urls.home || '/'" text="Home" />
            <gv-header-navigation-item :href="urls.terms || '/terms'" text="Terms" />
            <gv-header-navigation-item :href="urls.privacy || '/privacy'" text="Privacy" />
            <gv-header-navigation-item v-if="$page.props.auth?.user" :href="urls.accountSettings || '/account/settings'" text="Account" />
            <template v-else>
                <gv-header-navigation-item :href="urls.signIn || '/account/sign-in'" text="Sign in" />
                <gv-header-navigation-item :href="urls.signUp || '/account/sign-up'" text="Sign up" />
            </template>
        </template>

        <div class="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
            <h1 class="govuk-heading-xl">{{ title }}</h1>
            <p class="mt-4 text-muted">{{ content || 'Placeholder. Replace with your content.' }}</p>
            <Link :href="urls.home || '/'" class="mt-8 inline-block text-primary underline">Back to home</Link>
        </div>
    </PublicLayout>
</template>
