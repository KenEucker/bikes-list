<script setup>
import { Link, usePage } from '@inertiajs/vue3';

const page = usePage();
const logo = page.props.logo || '/bikeslist.png';
const urls = page.props.urls || {};
const homeUrl = urls.home || '/';
</script>

<template>
    <div class="min-h-screen flex flex-col bg-page">
        <slot name="header">
            <gv-header service-name="Cities" :service-url="homeUrl">
                <template #logo>
                    <div class="govuk-header__logo">
                        <Link :href="homeUrl" class="govuk-header__link govuk-header__link--homepage flex items-center gap-2 no-underline">
                            <img :src="logo" alt="BikesList" class="h-9 w-auto object-contain" />
                            <span class="govuk-header__product-name">BikesList</span>
                        </Link>
                    </div>
                </template>
                <template #navigation>
                    <slot name="nav" />
                </template>
            </gv-header>
        </slot>

        <main class="govuk-width-container govuk-!-margin-top-6 flex-1">
            <slot />
        </main>

        <gv-footer class="mt-auto">
            <template #meta>
                <gv-footer-meta>
                    <gv-footer-meta-item :href="urls.mainSite || homeUrl">Choose city</gv-footer-meta-item>
                    <gv-footer-meta-item :href="urls.terms || '/terms'">Terms</gv-footer-meta-item>
                    <gv-footer-meta-item :href="urls.privacy || '/privacy'">Privacy</gv-footer-meta-item>
                </gv-footer-meta>
            </template>
            <template #content-licence>
                Built with ❤️ from KenEucker.
            </template>
            <template #copyright>
                <div class="flex items-center">
                    <img :src="logo" alt="BikesList" class="h-6 justify-center" />
                    <span class="govuk-footer__copyright-text ml-2 justify-center">
                        BikesList &copy; {{ new Date().getFullYear() }}
                    </span>
                </div>
            </template>
        </gv-footer>
    </div>
</template>
