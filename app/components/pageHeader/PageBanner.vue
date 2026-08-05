<script setup lang="ts">
type TProps = {
  banner?: string
  alt?: string
}

const { banner = '', alt = undefined } = defineProps<TProps>()

const { t } = useI18n()
const resolvedAlt = computed(() => alt || t('components.pageHeader.bannerAlt'))
</script>
<template>
  <img :src="banner" :alt="resolvedAlt" />
</template>
