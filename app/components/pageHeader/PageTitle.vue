<script setup lang="ts">
type TProps = {
  title?: string
}

const props = withDefaults(defineProps<TProps>(), {
  title: '預設標題',
})
</script>
<template>
  <h1>{{ props.title }}</h1>
</template>
