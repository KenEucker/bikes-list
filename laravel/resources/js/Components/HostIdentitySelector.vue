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
        <label class="block text-sm font-medium text-fg">Host as</label>
        <select
            :value="modelValue"
            :disabled="disabled"
            class="mt-1 block w-full rounded-token-md border border-border bg-input text-fg shadow-sm focus:border-focus focus:ring-focus"
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
