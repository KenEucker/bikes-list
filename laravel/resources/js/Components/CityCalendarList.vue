<script setup>
import { computed } from 'vue';

const props = defineProps({
    rides: { type: Array, default: () => [] },
});

const groupedByDay = computed(() => {
    const map = new Map();
    const rides = props.rides ?? [];
    for (const ride of rides) {
        const start = ride.starts_at ? new Date(ride.starts_at) : null;
        const dayKey = start ? start.toDateString() : 'date-unknown';
        if (!map.has(dayKey)) map.set(dayKey, { label: start ? start.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }) : 'Date TBA', rides: [] });
        map.get(dayKey).rides.push(ride);
    }
    return Array.from(map.entries()).map(([key, val]) => ({ key, ...val }));
});
</script>

<template>
    <div class="space-y-6">
        <section v-for="group in groupedByDay" :key="group.key" class="space-y-2">
            <h3 class="text-sm font-semibold uppercase tracking text-muted">
                {{ group.label }}
            </h3>
            <ul class="space-y-2">
                <li
                    v-for="ride in (group.rides ?? [])"
                    :key="ride.id"
                    class="flex items-baseline gap-2"
                >
                    <slot name="ride" :ride="ride">
                        <a
                            :href="ride.url"
                            class="font-medium text-primary underline"
                        >
                            {{ ride.name }}
                        </a>
                        <span class="text-sm text-muted">
                            {{ ride.starts_at ? new Date(ride.starts_at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '' }}
                        </span>
                    </slot>
                </li>
            </ul>
        </section>
    </div>
</template>
