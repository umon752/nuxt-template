<script setup lang="ts">
defineProps<{
  viewBox: string
}>()
</script>

<template>
  <svg class="c-icon" xmlns="http://www.w3.org/2000/svg" :viewBox="viewBox" aria-hidden="true">
    <slot />
  </svg>
</template>
