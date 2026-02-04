<script setup>
import { Head, usePage } from '@inertiajs/vue3';
import { ref } from 'vue';
import CityNav from '@/Components/CityNav.vue';

const page = usePage();
const props = defineProps({
    city: { type: Object, required: true },
    guidelines: { type: Array, required: true },
    managedCommunityPages: { type: Array, default: () => [] },
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
    route_link: '',
    external_link: '',
    event_type: '',
    community_page_id: null,
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
    <div class="min-h-screen bg-page">
        <CityNav :city="city" :city-base-url="cityBaseUrl" breadcrumb="New event">
            <template #nav-right>
                <a :href="`${cityBaseUrl}/events`" class="text-sm text-muted hover:text-fg underline">Back to events</a>
            </template>
        </CityNav>

        <main class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-fg">New event</h1>

            <div v-if="guidelines.length" class="mt-4 rounded-token-md border border-border bg-card p-4">
                <h2 class="font-medium text-fg">Event community guidelines</h2>
                <div class="mt-2 space-y-2 text-sm text-fg prose dark:prose-invert max-w-none">
                    <div v-for="g in guidelines" :key="g.id" class="whitespace-pre-wrap">{{ g.body }}</div>
                </div>
            </div>

            <form :action="`${cityBaseUrl}/events`" method="post" class="mt-6 space-y-4">
                <input type="hidden" name="_token" :value="$page.props.csrf_token" />
                <input v-for="id in form.guideline_ids" :key="id" type="hidden" :name="`guideline_ids[]`" :value="id" />
                <div>
                    <label class="block text-sm font-medium text-fg">Title *</label>
                    <input v-model="form.title" type="text" name="title" required class="mt-1 block w-full rounded-token-md border border-border bg-input text-fg shadow-sm focus:border-focus focus:ring-focus" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-fg">Description *</label>
                    <textarea v-model="form.description" name="description" rows="4" required class="mt-1 block w-full rounded-token-md border border-border bg-input text-fg shadow-sm focus:border-focus focus:ring-focus"></textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-fg">Organizer name *</label>
                    <input v-model="form.organizer_name" type="text" name="organizer_name" required class="mt-1 block w-full rounded-token-md border border-border bg-input text-fg shadow-sm focus:border-focus focus:ring-focus" />
                </div>
                <div>
                    <label class="flex items-center gap-2">
                        <input v-model="form.organizer_email_hidden" type="checkbox" name="organizer_email_hidden" value="1" />
                        <span class="text-sm text-fg">Hide my email from public</span>
                    </label>
                </div>
                <div>
                    <label class="block text-sm font-medium text-fg">Location (optional)</label>
                    <input v-model="form.location_address" type="text" name="location_address" class="mt-1 block w-full rounded-token-md border border-border bg-input text-fg shadow-sm focus:border-focus focus:ring-focus" />
                </div>
                <div v-if="managedCommunityPages.length">
                    <label class="block text-sm font-medium text-fg">Host as</label>
                    <select v-model="form.community_page_id" name="community_page_id" class="mt-1 block w-full rounded-token-md border border-border bg-input text-fg shadow-sm focus:border-focus focus:ring-focus">
                        <option :value="null">Me (personal)</option>
                        <option v-for="p in managedCommunityPages" :key="p.id" :value="p.id">{{ p.name }}</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-fg">Meeting location</label>
                    <input v-model="form.location_address" type="text" name="location_address" class="mt-1 block w-full rounded-token-md border border-border bg-input text-fg shadow-sm focus:border-focus focus:ring-focus" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-fg">Route description (optional)</label>
                    <textarea v-model="form.route_description" name="route_description" rows="2" class="mt-1 block w-full rounded-token-md border border-border bg-input text-fg shadow-sm focus:border-focus focus:ring-focus"></textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-fg">Route link URL (optional)</label>
                    <input v-model="form.route_link" type="url" name="route_link" class="mt-1 block w-full rounded-token-md border border-border bg-input text-fg shadow-sm focus:border-focus focus:ring-focus" placeholder="https://..." />
                </div>
                <div>
                    <label class="block text-sm font-medium text-fg">External link (optional)</label>
                    <input v-model="form.external_link" type="url" name="external_link" class="mt-1 block w-full rounded-token-md border border-border bg-input text-fg shadow-sm focus:border-focus focus:ring-focus" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-fg">Event type (optional)</label>
                    <input v-model="form.event_type" type="text" name="event_type" class="mt-1 block w-full rounded-token-md border border-border bg-input text-fg shadow-sm focus:border-focus focus:ring-focus" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-fg">Starts at *</label>
                        <input v-model="form.starts_at" type="datetime-local" name="starts_at" required class="mt-1 block w-full rounded-token-md border border-border bg-input text-fg shadow-sm focus:border-focus focus:ring-focus" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-fg">Ends at *</label>
                        <input v-model="form.ends_at" type="datetime-local" name="ends_at" required class="mt-1 block w-full rounded-token-md border border-border bg-input text-fg shadow-sm focus:border-focus focus:ring-focus" />
                    </div>
                </div>
                <div>
                    <label class="flex items-center gap-2">
                        <input v-model="form.guidelines_accepted" type="checkbox" name="guidelines_accepted" value="1" required />
                        <span class="text-sm text-fg">I agree to the event community guidelines above *</span>
                    </label>
                </div>
                <div class="flex gap-3">
                    <button type="submit" class="rounded-token-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:opacity-90">Submit event</button>
                    <a :href="`${cityBaseUrl}/events`" class="rounded-token-md border border-border bg-card px-4 py-2 text-sm font-medium text-fg hover:opacity-90">Cancel</a>
                </div>
            </form>
        </main>
    </div>
</template>
