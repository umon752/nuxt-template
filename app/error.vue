<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const { t } = useI18n()

const statusCode = computed(() => props.error.status)
const is404 = computed(() => statusCode.value === 404)

const title = computed(() => {
  return is404.value ? t('error.404.title') : t('error.500.title')
})

const description = computed(() => {
  return is404.value ? t('error.404.description') : t('error.500.description')
})

const handleClearError = (): void => {
  clearError({
    redirect: '/',
  })
}
</script>

<template>
  <main
    class="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 text-center"
  >
    <p class="text-4xl font-bold">{{ statusCode }}</p>
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
    <Btn :text="t('error.backToHome')" @click="handleClearError" />
  </main>
</template>
