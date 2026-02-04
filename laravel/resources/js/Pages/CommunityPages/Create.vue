<script setup>
import { Head } from '@inertiajs/vue3';
import { ref } from 'vue';
import CityNav from '@/Components/CityNav.vue';

defineProps({
    city: { type: Object, required: true },
    homeUrl: { type: String, default: '/' },
    cityBaseUrl: { type: String, required: true },
});

const form = ref({
    type: 'bike_shop',
    name: '',
    about: '',
    event_info: '',
    sales_info: '',
    contact_address: '',
    contact_email: '',
    contact_phone: '',
});
</script>

<template>
    <Head :title="`New community page – ${city.name}`" />
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <CityNav :city="city" :city-base-url="cityBaseUrl" breadcrumb="New page">
            <template #nav-right>
                <a :href="`${cityBaseUrl}/community`" class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Back to community</a>
            </template>
        </CityNav>

        <main class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">New community page</h1>
            <form :action="`${cityBaseUrl}/community`" method="post" class="mt-6 space-y-4">
                <input type="hidden" name="_token" :value="$page.props.csrf_token" />
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Type *</label>
                    <select v-model="form.type" name="type" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                        <option value="bike_shop">Bike shop</option>
                        <option value="club">Club</option>
                        <option value="recurring_event">Recurring event</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name *</label>
                    <input v-model="form.name" type="text" name="name" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">About</label>
                    <textarea v-model="form.about" name="about" rows="4" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"></textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Event info</label>
                    <textarea v-model="form.event_info" name="event_info" rows="2" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"></textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Sales info</label>
                    <textarea v-model="form.sales_info" name="sales_info" rows="2" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"></textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact address</label>
                    <input v-model="form.contact_address" type="text" name="contact_address" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact email</label>
                    <input v-model="form.contact_email" type="email" name="contact_email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact phone</label>
                    <input v-model="form.contact_phone" type="text" name="contact_phone" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                </div>
                <button type="submit" class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Submit</button>
                <a :href="`${cityBaseUrl}/community`" class="ml-3 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">Cancel</a>
            </form>
        </main>
    </div>
</template>
