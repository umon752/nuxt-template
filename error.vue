<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const is404 = computed(() => props.error.statusCode === 404)

const title = computed(() => {
  return is404.value ? t('error.404.title') : t('error.500.title')
})

const description = computed(() => {
  return is404.value ? t('error.404.description') : t('error.500.description')
})

const handleClearError = () => {
  clearError({
    redirect: '/',
  })
}
</script>

<template>
  <main>
    <p>{{ statusCode }}</p>
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
    <button type="button" @click="handleClearError">
      {{ t('error.backToHome') }}
    </button>
  </main>
</template>
