<script setup lang="ts">
import { featureConfig } from '~/config/features'
import { searchConfig } from '~/config/search'
import { getRouteQueryValue, usePaginationQuery } from '~/composables/usePaginationQuery'
import type { TBreadcrumbItem } from '~/types/breadcrumb'

if (!featureConfig.search) {
  throw createError({ statusCode: 404, statusMessage: 'Search page is disabled' })
}

const { t } = useI18n()
const route = useRoute()
const searchQuery = computed(() =>
  getRouteQueryValue(route.query.q).trim().slice(0, searchConfig.maxQueryLength)
)
const searchInput = ref(searchQuery.value)
const responseTotalPages = ref(1)
const { page, totalPages } = usePaginationQuery({
  totalPages: responseTotalPages,
})
const {
  results,
  total,
  status,
  totalPages: responseTotalPagesFromSearch,
} = useSiteSearch({
  query: searchQuery,
  page,
  limit: searchConfig.pageSize,
})

const pageTitle = t('pages.search.meta.title')
const pageDescription = t('pages.search.meta.description')
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

watch(searchQuery, (value) => {
  searchInput.value = value

  if (page.value !== 1) {
    page.value = 1
  }
})

watch(
  responseTotalPagesFromSearch,
  (value) => {
    responseTotalPages.value = value
  },
  { immediate: true }
)

const submitSearch = async (): Promise<void> => {
  const query = searchInput.value.trim().replace(/\s+/g, ' ')

  await navigateTo({
    path: '/search',
    query: query ? { q: query } : undefined,
  })
}
</script>

<template>
  <div>
    <PageHeader :title="pageTitle" :breadcrumb-items="breadcrumbItems" />

    <section
      class="container max-w-5xl space-y-8 py-10"
      :aria-busy="status === 'pending'"
      aria-labelledby="search-page-title"
    >
      <h1 id="search-page-title" class="sr-only">{{ pageTitle }}</h1>

      <form class="flex flex-col gap-3 sm:flex-row" role="search" @submit.prevent="submitSearch">
        <label for="search-page-input" class="sr-only">
          {{ $t('pages.search.inputLabel') }}
        </label>
        <input
          id="search-page-input"
          v-model="searchInput"
          type="search"
          :maxlength="searchConfig.maxQueryLength"
          :placeholder="$t('pages.search.placeholder')"
          class="min-h-12 min-w-0 flex-1 rounded-md border border-slate-300 px-4 text-base text-slate-900 transition outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-300"
        />
        <button
          type="submit"
          class="inline-flex min-h-12 items-center justify-center rounded-md bg-slate-900 px-6 font-semibold text-white transition-colors hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          {{ $t('pages.search.submit') }}
        </button>
      </form>

      <section aria-labelledby="search-results-title" class="space-y-5">
        <div class="space-y-2">
          <h2 id="search-results-title" class="text-2xl font-bold text-slate-900">
            {{ $t('pages.search.resultsTitle') }}
          </h2>
          <p v-if="!searchQuery" class="text-slate-600">
            {{ $t('pages.search.intro') }}
          </p>
          <p v-else-if="status === 'pending'" role="status" aria-live="polite">
            {{ $t('pages.search.loading') }}
          </p>
          <p v-else-if="status === 'error'" role="alert" class="text-error">
            {{ $t('pages.search.error') }}
          </p>
          <p v-else role="status" aria-live="polite" class="text-slate-600">
            {{ $t('pages.search.resultCount', { count: total }) }}
          </p>
        </div>

        <ul
          v-if="results.length"
          class="grid gap-4"
          :aria-label="$t('pages.search.resultsListAriaLabel')"
        >
          <li v-for="result in results" :key="result.id">
            <NuxtLink
              :to="result.href"
              class="block rounded-lg border border-slate-200 p-5 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
            >
              <h3 class="text-lg font-semibold text-slate-900">{{ result.title }}</h3>
              <p class="mt-2 text-slate-600">{{ result.description }}</p>
              <p class="mt-3 text-sm text-slate-500">{{ result.href }}</p>
            </NuxtLink>
          </li>
        </ul>

        <EmptyState
          v-else-if="searchQuery && status === 'success'"
          :title="$t('pages.search.empty', { query: searchQuery })"
          :description="$t('pages.search.emptyDescription')"
        />
      </section>

      <Pagination
        v-if="total > searchConfig.pageSize"
        v-model:current-page="page"
        :total-pages="totalPages"
        :aria-label="$t('pages.search.paginationAriaLabel')"
      />
    </section>
  </div>
</template>
