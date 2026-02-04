<script setup>
import { computed } from 'vue';

const props = defineProps({
    events: { type: Array, default: () => [] },
});

const groupedByDay = computed(() => {
    const map = new Map();
    const events = props.events ?? [];
    for (const event of events) {
        const start = event.starts_at ? new Date(event.starts_at) : null;
        const dayKey = start ? start.toDateString() : 'date-unknown';
        if (!map.has(dayKey)) map.set(dayKey, { label: start ? start.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }) : 'Date TBA', events: [] });
        map.get(dayKey).events.push(event);
    }
    return Array.from(map.entries()).map(([key, val]) => ({ key, ...val }));
});
</script>

<template>
    <div class="space-y-6">
        <section v-for="group in groupedByDay" :key="group.key" class="space-y-2">
            <h3 class="text-sm font-semibold uppercase tracking text-gray-500 dark:text-gray-400">
                {{ group.label }}
            </h3>
            <ul class="space-y-2">
                <li
                    v-for="event in (group.events ?? [])"
                    :key="event.id"
                    class="flex items-baseline gap-2"
                >
                    <slot name="event" :event="event">
                        <a
                            :href="event.url"
                            class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                        >
                            {{ event.title }}
                        </a>
                        <span class="text-sm text-gray-500 dark:text-gray-400">
                            {{ event.starts_at ? new Date(event.starts_at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '' }}
                        </span>
                    </slot>
                </li>
            </ul>
        </section>
    </div>
</template>
