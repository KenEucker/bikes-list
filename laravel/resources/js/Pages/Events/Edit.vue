<script setup>
import { Head } from '@inertiajs/vue3';
import { ref } from 'vue';
import CityNav from '@/Components/CityNav.vue';

const props = defineProps({
    city: { type: Object, required: true },
    event: { type: Object, required: true },
    guidelines: { type: Array, default: () => [] },
    eventTags: { type: Object, default: () => ({}) },
    homeUrl: { type: String, default: '/' },
    cityBaseUrl: { type: String, required: true },
});

const form = ref({
    title: props.event.title,
    description: props.event.description,
    organizer_name: props.event.organizer_name,
    organizer_email_hidden: props.event.organizer_email_hidden ?? false,
    location_address: props.event.location_address ?? '',
    route_description: props.event.route_description ?? '',
    starts_at: (props.event.starts_at || '').slice(0, 16),
    ends_at: (props.event.ends_at || '').slice(0, 16),
    timezone: props.event.timezone ?? '',
    is_recurring: props.event.is_recurring ?? false,
    recurrence_ends_at: props.event.recurrence_ends_at ? props.event.recurrence_ends_at.slice(0, 10) : '',
    tags: props.event.tags ?? [],
});
</script>

<template>
    <Head :title="`Edit – ${event.title}`" />
    <div class="min-h-screen bg-page">
        <CityNav :city="city" :city-base-url="cityBaseUrl" breadcrumb="Edit event">
            <template #nav-right>
                <a :href="`${cityBaseUrl}/events/${event.id}`" class="text-sm text-muted hover:text-fg underline">Back to event</a>
            </template>
        </CityNav>

        <main class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-fg">Edit event</h1>
            <form :action="`${cityBaseUrl}/events/${event.id}`" method="post" class="mt-6 space-y-4">
                <input type="hidden" name="_token" :value="$page.props.csrf_token" />
                <input type="hidden" name="_method" value="PUT" />
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
                        <span class="text-sm text-fg">Hide email from public</span>
                    </label>
                </div>
                <div>
                    <label class="block text-sm font-medium text-fg">Location (optional)</label>
                    <input v-model="form.location_address" type="text" name="location_address" class="mt-1 block w-full rounded-token-md border border-border bg-input text-fg shadow-sm focus:border-focus focus:ring-focus" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-fg">Route description (optional)</label>
                    <textarea v-model="form.route_description" name="route_description" rows="2" class="mt-1 block w-full rounded-token-md border border-border bg-input text-fg shadow-sm focus:border-focus focus:ring-focus"></textarea>
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
                <div class="flex gap-3">
                    <button type="submit" class="rounded-token-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:opacity-90">Save</button>
                    <a :href="`${cityBaseUrl}/events/${event.id}`" class="rounded-token-md border border-border bg-card px-4 py-2 text-sm font-medium text-fg hover:opacity-90">Cancel</a>
                </div>
            </form>
        </main>
    </div>
</template>
