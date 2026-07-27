<script setup lang="ts">
const { banner } = defineProps({
  banner: {
    type: String,
    default: '',
  },
  alt: {
    type: String,
    default: '預設橫幅',
  },
})
</script>
<template>
  <img :src="banner" :alt="alt" />
</template>
