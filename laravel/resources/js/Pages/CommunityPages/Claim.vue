<script setup>
import { Head } from '@inertiajs/vue3';
import CityLayout from '@/Layouts/CityLayout.vue';
import { ref } from 'vue';

defineProps({
    city: { type: Object, required: true },
    communityPage: { type: Object, required: true },
    cityBaseUrl: { type: String, required: true },
});

const form = ref({ message: '' });
</script>

<template>
    <Head :title="`Claim ${communityPage.name}`" />
    <CityLayout :city="city" :city-base-url="cityBaseUrl" :breadcrumb="['Community pages', 'Claim']">
        <template #nav-right>
            <a :href="`${cityBaseUrl}/community/${communityPage.slug}`" class="govuk-link">Back to page</a>
        </template>

        <div class="mx-auto max-w-xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="govuk-heading-l">Claim this page</h1>
            <p class="govuk-body">Request to manage "{{ communityPage.name }}". Your message will be sent to city moderators.</p>
            <form :action="`${cityBaseUrl}/community/${communityPage.slug}/claim`" method="post" class="mt-6 space-y-4">
                <input type="hidden" name="_token" :value="$page.props.csrf_token" />
                <gv-textarea
                    id="message"
                    v-model="form.message"
                    name="message"
                    label="Message *"
                    :rows="4"
                    required
                    placeholder="Explain your connection to this organization..."
                    class="govuk-!-width-full"
                />
                <gv-button type="submit">Submit claim</gv-button>
            </form>
        </div>
    </CityLayout>
</template>
