<script setup lang="ts">
import type { TBreadcrumbItem } from '../../types/breadcrumb'

const props = withDefaults(
  defineProps<{
    banner?: string
    bannerAlt?: string
    title?: string
    breadcrumbItems?: TBreadcrumbItem[]
  }>(),
  {
    banner: '/images/nopic.png',
    bannerAlt: '',
    title: '',
    breadcrumbItems: () => [],
  }
)

const { items: autoBreadcrumbItems, currentTitle } = useBreadcrumb()

const breadcrumbItems = computed(() =>
  props.breadcrumbItems.length ? props.breadcrumbItems : autoBreadcrumbItems.value
)

const pageTitle = computed(
  () => props.title || breadcrumbItems.value.at(-1)?.title || currentTitle.value
)

const bannerAlt = computed(() => props.bannerAlt || pageTitle.value || '頁面橫幅')
</script>

<template>
  <header>
    <div class="container">
      <PageBanner :banner="props.banner" :alt="bannerAlt" />
      <PageTitle :title="pageTitle" />
      <Breadcrumb :items="breadcrumbItems" />
    </div>
  </header>
</template>
