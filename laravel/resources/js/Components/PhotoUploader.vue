<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    modelValue: { type: Array, default: () => [] },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 4 },
    disabled: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue']);

const previews = ref([...props.modelValue]);
const inputRef = ref(null);

watch(() => props.modelValue, (val) => {
    previews.value = [...(val || [])];
}, { deep: true });

function addFiles(e) {
    const files = Array.from(e.target.files || []);
    const remaining = props.max - previews.value.length;
    const toAdd = files.slice(0, remaining);
    if (toAdd.length === 0) return;
    const next = previews.value.concat(toAdd.map(f => ({ file: f, url: URL.createObjectURL(f), id: Math.random().toString(36).slice(2) })));
    previews.value = next;
    emitFiles();
    e.target.value = '';
}

function remove(index) {
    const item = previews.value[index];
    if (item?.url && item.url.startsWith('blob:')) URL.revokeObjectURL(item.url);
    previews.value = previews.value.filter((_, i) => i !== index);
    emitFiles();
}

function emitFiles() {
    const files = previews.value.filter(p => p.file).map(p => p.file);
    const urls = previews.value.map(p => p.url || (p.url && typeof p === 'object' ? p.url : null)).filter(Boolean);
    emit('update:modelValue', files.length ? files : previews.value.map(p => p.id ? p : ({ id: p })));
}

function triggerInput() {
    if (props.disabled || previews.value.length >= props.max) return;
    inputRef.value?.click();
}
</script>

<template>
    <div class="space-y-2">
        <label class="block text-sm font-medium text-fg">
            Photos ({{ min }}-{{ max }})
        </label>
        <div class="flex flex-wrap gap-3">
            <template v-for="(item, index) in previews" :key="item.id ?? index">
                <div class="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-token-md border border-border bg-muted/30">
                    <img
                        v-if="item.url"
                        :src="item.url"
                        alt="Preview"
                        class="h-full w-full object-cover"
                    />
                    <div v-else class="flex h-full items-center justify-center text-muted">?</div>
                    <button
                        v-if="!disabled"
                        type="button"
                        class="absolute right-1 top-1 rounded bg-red-600 p-1 text-white hover:bg-red-700"
                        aria-label="Remove"
                        @click="remove(index)"
                    >
                        <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                    </button>
                </div>
            </template>
            <button
                v-if="previews.length < max && !disabled"
                type="button"
                class="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-token-md border-2 border-dashed border-border text-muted hover:border-primary hover:text-fg"
                @click="triggerInput"
            >
                <span class="text-2xl">+</span>
            </button>
        </div>
        <input
            ref="inputRef"
            type="file"
            accept="image/*"
            class="hidden"
            multiple
            @change="addFiles"
        />
        <p v-if="min > 0 && previews.length < min" class="text-sm text-amber-600 dark:text-amber-400">
            At least {{ min }} photo(s) required.
        </p>
    </div>
</template>
