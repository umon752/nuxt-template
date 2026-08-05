<script setup lang="ts">
type TProps = {
  title?: string
}

const { title = undefined } = defineProps<TProps>()

const { t } = useI18n()
const resolvedTitle = computed(() => title || t('components.pageHeader.defaultTitle'))
</script>
<template>
  <h1>{{ resolvedTitle }}</h1>
</template>
