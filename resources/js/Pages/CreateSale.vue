<template>
    <div class="min-h-screen bg-gray-50">
        <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-6">Create For Sale</h1>

            <form @submit.prevent="submit" class="bg-white rounded-lg shadow p-6">
                <div class="mb-4">
                    <label class="block text-gray-700 font-medium mb-2">Title</label>
                    <input
                        v-model="form.title"
                        type="text"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                </div>

                <div class="mb-4">
                    <label class="block text-gray-700 font-medium mb-2">Description</label>
                    <textarea
                        v-model="form.description"
                        required
                        rows="6"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                </div>

                <div class="mb-4 grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-gray-700 font-medium mb-2">Price ($)</label>
                        <input
                            v-model.number="form.price_cents"
                            type="number"
                            step="0.01"
                            required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            @input="form.price_cents = Math.round($event.target.value * 100)"
                        >
                    </div>
                    <div>
                        <label class="block text-gray-700 font-medium mb-2">Currency</label>
                        <select
                            v-model="form.currency"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                        </select>
                    </div>
                </div>

                <div class="mb-4">
                    <button
                        type="submit"
                        :disabled="processing"
                        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {{ processing ? 'Creating...' : 'Create For Sale' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useForm } from '@inertiajs/vue3';

const props = defineProps({
    region: Object,
});

const form = useForm({
    title: '',
    description: '',
    price_cents: 0,
    currency: 'USD',
    category: null,
    condition: null,
    brand: null,
    model: null,
    frame_size: null,
});

const processing = computed(() => form.processing);

const submit = () => {
    form.post('/for-sale', {
        preserveScroll: true,
    });
};
</script>
