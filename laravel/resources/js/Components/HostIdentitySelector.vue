<script setup>
defineProps({
    modelValue: { type: [String, Number], default: '' },
    managedPages: { type: Array, default: () => [] },
    disabled: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue']);

function change(e) {
    const val = e.target.value;
    emit('update:modelValue', val === '' ? null : val);
}
</script>

<template>
    <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Host as</label>
        <select
            :value="modelValue"
            :disabled="disabled"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            @change="change"
        >
            <option value="">Me (personal)</option>
            <option
                v-for="page in managedPages"
                :key="page.id"
                :value="page.id"
            >
                {{ page.name }}
            </option>
        </select>
    </div>
</template>
