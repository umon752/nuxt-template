<script setup lang="ts">
type TProps = {
  banner?: string
  alt?: string
}

const props = withDefaults(defineProps<TProps>(), {
  banner: '',
  alt: undefined,
})

const { t } = useI18n()
const resolvedAlt = computed(() => props.alt || t('components.pageHeader.bannerAlt'))
</script>
<template>
  <img :src="props.banner" :alt="resolvedAlt" />
</template>
