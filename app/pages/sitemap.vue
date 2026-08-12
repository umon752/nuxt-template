<script setup lang="ts">
import { featureConfig } from '~/config/features'
import type { TMenuItem } from '~/composables/useMenu'
import type { TBreadcrumbItem } from '~/types/breadcrumb'

if (!featureConfig.sitemap) {
  throw createError({ statusCode: 404, statusMessage: 'Sitemap page is disabled' })
}

const { t } = useI18n()
const { menuItems, status: menuStatus } = useMenu()
const pageTitle = t('pages.sitemap.meta.title')
const pageDescription = t('pages.sitemap.meta.description')
const breadcrumbItems: TBreadcrumbItem[] = [
  { title: t('pages.home.meta.title'), href: '/' },
  { title: pageTitle },
]

usePageSeo({
  title: pageTitle,
  description: pageDescription,
})

usePageSchema({
  type: 'WebPage',
  name: pageTitle,
  description: pageDescription,
  breadcrumbItems,
})

type TSitemapLink = Pick<TMenuItem, 'id' | 'title' | 'href'>

function collectMenuLinks(items: TMenuItem[], visitedHrefs: Set<string>): TSitemapLink[] {
  const links: TSitemapLink[] = []

  for (const item of items) {
    if (item.href && !visitedHrefs.has(item.href)) {
      visitedHrefs.add(item.href)
      links.push({
        id: item.id,
        title: item.title,
        href: item.href,
      })
    }

    if (item.children) {
      links.push(...collectMenuLinks(item.children, visitedHrefs))
    }
  }

  return links
}

const sitemapLinks = computed<TSitemapLink[]>(() => collectMenuLinks(menuItems.value, new Set()))
</script>

<template>
  <div>
    <PageHeader :title="pageTitle" :breadcrumb-items="breadcrumbItems" />

    <section class="container space-y-6 py-10" aria-labelledby="sitemap-links-title">
      <div class="space-y-2">
        <h2 id="sitemap-links-title" class="text-2xl font-bold">
          {{ $t('pages.sitemap.linksTitle') }}
        </h2>
        <p>{{ pageDescription }}</p>
      </div>

      <ul v-if="sitemapLinks.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="item in sitemapLinks" :key="item.id">
          <NuxtLink
            :to="item.href"
            class="block rounded-md border border-gray-200 p-4 hover:bg-slate-100"
          >
            {{ item.title }}
          </NuxtLink>
        </li>
      </ul>

      <p v-else-if="menuStatus === 'error'" role="alert">
        {{ $t('pages.sitemap.loadError') }}
      </p>
      <p v-else-if="menuStatus === 'success'" role="status">
        {{ $t('pages.sitemap.empty') }}
      </p>
      <p v-else role="status" aria-live="polite">
        {{ $t('pages.sitemap.loading') }}
      </p>
    </section>
  </div>
</template>
