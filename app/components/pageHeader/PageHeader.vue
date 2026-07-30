<script setup lang="ts">
import type { TBreadcrumbItem } from '../../types/breadcrumb'

type TProps = {
  banner?: string
  bannerAlt?: string
  title?: string
  breadcrumbItems?: TBreadcrumbItem[]
}

const props = withDefaults(defineProps<TProps>(), {
  banner: '/images/nopic.png',
  bannerAlt: '',
  title: '',
  breadcrumbItems: () => [],
})

const { t } = useI18n()
const { items: autoBreadcrumbItems, currentTitle } = useBreadcrumb()

const breadcrumbItems = computed(() =>
  props.breadcrumbItems.length ? props.breadcrumbItems : autoBreadcrumbItems.value
)

const pageTitle = computed(
  () => props.title || breadcrumbItems.value.at(-1)?.title || currentTitle.value
)

const bannerAlt = computed(
  () => props.bannerAlt || pageTitle.value || t('components.pageHeader.bannerAlt')
)
</script>

<template>
  <header class="space-y-2">
    <PageHeaderPageBanner :banner="props.banner" :alt="bannerAlt" />
    <div class="container flex flex-col items-center gap-2">
      <PageHeaderPageTitle :title="pageTitle" class="text-4xl font-bold" />
      <Breadcrumb :items="breadcrumbItems" />
    </div>
  </header>
</template>
