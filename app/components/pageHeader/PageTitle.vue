<script setup lang="ts">
type TProps = {
  title?: string
}

const props = withDefaults(defineProps<TProps>(), {
  title: undefined,
})

const { t } = useI18n()
const resolvedTitle = computed(() => props.title || t('components.pageHeader.defaultTitle'))
</script>
<template>
  <h1>{{ resolvedTitle }}</h1>
</template>
