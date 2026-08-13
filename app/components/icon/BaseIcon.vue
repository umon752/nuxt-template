<script setup lang="ts">
defineProps<{
  viewBox: string
}>()
</script>

<template>
  <svg
    class="inline-block h-6 w-6 fill-current stroke-current stroke-0 transition-colors duration-300"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="viewBox"
    aria-hidden="true"
  >
    <slot />
  </svg>
</template>
