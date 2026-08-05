<script setup lang="ts">
import type { TBreadcrumbItem } from '../../types/breadcrumb'

type TProps = {
  banner?: string
  bannerAlt?: string
  title?: string
  breadcrumbItems?: TBreadcrumbItem[]
}

const {
  banner = '',
  bannerAlt: bannerAltProp = '',
  title = '',
  breadcrumbItems: breadcrumbItemsProp = [],
} = defineProps<TProps>()

const { t } = useI18n()
const { items: autoBreadcrumbItems, currentTitle } = useBreadcrumb()

const breadcrumbItems = computed(() =>
  breadcrumbItemsProp.length ? breadcrumbItemsProp : autoBreadcrumbItems.value
)

const pageTitle = computed(() => title || breadcrumbItems.value.at(-1)?.title || currentTitle.value)

const bannerAlt = computed(
  () => bannerAltProp || pageTitle.value || t('components.pageHeader.bannerAlt')
)
</script>

<template>
  <header class="space-y-2">
    <PageHeaderPageBanner v-if="banner" :banner="banner" :alt="bannerAlt" />
    <div class="container flex flex-col items-center gap-2 py-4">
      <PageHeaderPageTitle :title="pageTitle" class="text-4xl font-bold" />
      <Breadcrumb :items="breadcrumbItems" />
    </div>
  </header>
</template>
