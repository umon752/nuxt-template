<script setup lang="ts">
type TProps = {
  banner?: string
  alt?: string
}

const props = withDefaults(defineProps<TProps>(), {
  banner: '',
  alt: '預設橫幅',
})
</script>
<template>
  <img :src="props.banner" :alt="props.alt" />
</template>
