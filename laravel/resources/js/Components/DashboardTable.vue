<script setup>
import StatusTag from '@/Components/StatusTag.vue';

const props = defineProps({
    items: { type: Array, required: true },
    columns: { type: Array, required: true },
    showUrlFn: { type: Function, required: true },
    editUrlFn: { type: Function, required: true },
    statusKey: { type: String, default: 'state' },
});

const cellValue = (item, col) => {
    if (col.key === props.statusKey) return null;
    return col.format ? col.format(item) : (item[col.key] ?? '');
};
</script>

<template>
    <gv-table class="govuk-!-margin-top-6">
        <gv-table-head>
            <gv-table-row>
                <gv-table-header
                    v-for="col in columns"
                    :key="col.key"
                    :class="col.key === '_actions' ? 'govuk-table__header--numeric' : ''"
                >
                    {{ col.label }}
                </gv-table-header>
            </gv-table-row>
        </gv-table-head>
        <gv-table-body>
            <gv-table-row v-for="item in items" :key="item.id">
                <gv-table-cell
                    v-for="(col, idx) in columns"
                    :key="col.key"
                    :class="col.key === '_actions' ? 'govuk-table__cell--numeric' : ''"
                >
                    <template v-if="col.key === '_actions'">
                        <a :href="editUrlFn(item)" class="govuk-link">Edit</a>
                    </template>
                    <template v-else-if="idx === 0">
                        <a :href="showUrlFn(item)" class="govuk-link">{{ item[col.key] }}</a>
                    </template>
                    <template v-else-if="col.key === statusKey">
                        <StatusTag :status="item[statusKey]" />
                    </template>
                    <template v-else>
                        {{ cellValue(item, col) }}
                    </template>
                </gv-table-cell>
            </gv-table-row>
        </gv-table-body>
    </gv-table>
</template>
