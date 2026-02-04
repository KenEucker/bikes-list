<script setup>
import { Head } from '@inertiajs/vue3';
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
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <nav class="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-16 items-center gap-6">
                    <a :href="`${cityBaseUrl}/community/${communityPage.id}`" class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Back</a>
                </div>
            </div>
        </nav>

        <main class="mx-auto max-w-xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Claim this page</h1>
            <p class="mt-2 text-gray-600 dark:text-gray-400">Request to manage "{{ communityPage.name }}". Your message will be sent to city moderators.</p>
            <form :action="`${cityBaseUrl}/community/${communityPage.id}/claim`" method="post" class="mt-6 space-y-4">
                <input type="hidden" name="_token" :value="$page.props.csrf_token" />
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Message *</label>
                    <textarea v-model="form.message" name="message" rows="4" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" placeholder="Explain your connection to this organization..."></textarea>
                </div>
                <button type="submit" class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Submit claim</button>
            </form>
        </main>
    </div>
</template>
