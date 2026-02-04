<script setup>
import logoUrl from '../../images/bikeslist.png';

defineProps({
    logoClass: {
        type: String,
        default: 'h-20 w-20 object-contain',
    },
});
</script>

<template>
    <img :src="logoUrl" alt="BikesList logo" :class="logoClass" />
</template>
