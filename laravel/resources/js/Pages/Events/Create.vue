<script setup>
import { Head, usePage } from '@inertiajs/vue3';
import { ref } from 'vue';

const page = usePage();
const props = defineProps({
    city: { type: Object, required: true },
    guidelines: { type: Array, required: true },
    eventTags: { type: Object, default: () => ({}) },
    homeUrl: { type: String, default: '/' },
    cityBaseUrl: { type: String, required: true },
});

const form = ref({
    title: '',
    description: '',
    organizer_name: page.props.auth?.user?.name ?? '',
    organizer_email_hidden: false,
    location_address: '',
    route_description: '',
    starts_at: '',
    ends_at: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? '',
    is_recurring: false,
    recurrence_ends_at: '',
    tags: [],
    guidelines_accepted: false,
    guideline_ids: props.guidelines.map(g => g.id),
});
</script>

<template>
    <Head :title="`New event – ${city.name}`" />
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <nav class="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-16 justify-between items-center">
                    <div class="flex items-center gap-6">
                        <a :href="homeUrl" class="text-xl font-semibold text-gray-800 dark:text-white">Bikes</a>
                        <span class="text-gray-500 dark:text-gray-400">/ {{ city.name }} / New event</span>
                    </div>
                </div>
            </div>
        </nav>

        <main class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">New event</h1>

            <div v-if="guidelines.length" class="mt-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <h2 class="font-medium text-gray-900 dark:text-white">Event community guidelines</h2>
                <div class="mt-2 space-y-2 text-sm text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none">
                    <div v-for="g in guidelines" :key="g.id" class="whitespace-pre-wrap">{{ g.body }}</div>
                </div>
            </div>

            <form :action="`${cityBaseUrl}/events`" method="post" class="mt-6 space-y-4">
                <input type="hidden" name="_token" :value="$page.props.csrf_token" />
                <input v-for="id in form.guideline_ids" :key="id" type="hidden" :name="`guideline_ids[]`" :value="id" />
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Title *</label>
                    <input v-model="form.title" type="text" name="title" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Description *</label>
                    <textarea v-model="form.description" name="description" rows="4" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"></textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Organizer name *</label>
                    <input v-model="form.organizer_name" type="text" name="organizer_name" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                    <label class="flex items-center gap-2">
                        <input v-model="form.organizer_email_hidden" type="checkbox" name="organizer_email_hidden" value="1" />
                        <span class="text-sm text-gray-700 dark:text-gray-300">Hide my email from public</span>
                    </label>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Location (optional)</label>
                    <input v-model="form.location_address" type="text" name="location_address" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Route description (optional)</label>
                    <textarea v-model="form.route_description" name="route_description" rows="2" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"></textarea>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Starts at *</label>
                        <input v-model="form.starts_at" type="datetime-local" name="starts_at" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Ends at *</label>
                        <input v-model="form.ends_at" type="datetime-local" name="ends_at" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                    </div>
                </div>
                <div>
                    <label class="flex items-center gap-2">
                        <input v-model="form.guidelines_accepted" type="checkbox" name="guidelines_accepted" value="1" required />
                        <span class="text-sm text-gray-700 dark:text-gray-300">I agree to the event community guidelines above *</span>
                    </label>
                </div>
                <div class="flex gap-3">
                    <button type="submit" class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Submit event</button>
                    <a :href="`${cityBaseUrl}/events`" class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">Cancel</a>
                </div>
            </form>
        </main>
    </div>
</template>
