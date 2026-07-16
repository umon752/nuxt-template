<script setup lang="ts">
type TProps = {
  id: string
  target: string
  accesskey: string
  labelKey: string
}

defineProps<TProps>()
</script>

<template>
  <a
    :id="id"
    :href="target"
    :accesskey="accesskey"
    class="sr-only"
    :aria-label="$t(labelKey)"
    :title="$t(labelKey)"
  >
    :::
  </a>
</template>
