<script setup lang="ts">
const { title } = defineProps({
  title: {
    type: String,
    default: '預設標題',
  },
})
</script>
<template>
  <h1>{{ title }}</h1>
</template>

<style></style>
