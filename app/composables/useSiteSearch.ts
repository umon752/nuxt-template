import type { MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

import { searchConfig } from '~/config/search'
import type { TSearchResponse } from '~/types/search'

export type TUseSiteSearchOptions = {
  query?: MaybeRefOrGetter<string | undefined>
  page?: MaybeRefOrGetter<number>
  limit?: number
}

function normalizePositiveInteger(value: number | undefined, fallback: number): number {
  const normalizedValue = Math.floor(value ?? fallback)

  return Number.isSafeInteger(normalizedValue) && normalizedValue >= 1 ? normalizedValue : fallback
}

function createEmptyResponse(limit: number): TSearchResponse {
  return {
    query: '',
    results: [],
    total: 0,
    page: 1,
    limit,
    totalPages: 1,
  }
}

function createSiteSearchState(options: TUseSiteSearchOptions) {
  const limit = Math.min(
    normalizePositiveInteger(options.limit, searchConfig.pageSize),
    searchConfig.pageSize
  )
  const query = computed(() => {
    const value = options.query === undefined ? '' : toValue(options.query)

    return String(value ?? '')
      .trim()
      .slice(0, searchConfig.maxQueryLength)
  })
  const page = computed(() => {
    const value = options.page === undefined ? 1 : toValue(options.page)

    return normalizePositiveInteger(value, 1)
  })
  const requestQuery = computed(() => ({
    q: query.value || undefined,
    page: String(page.value),
    limit: String(limit),
  }))
  const { data, status, error, refresh } = useFetch<TSearchResponse>('/api/search', {
    query: requestQuery,
    default: () => createEmptyResponse(limit),
  })

  const response = computed(() => data.value ?? createEmptyResponse(limit))

  return {
    query,
    page,
    limit,
    results: computed(() => response.value.results),
    total: computed(() => response.value.total),
    totalPages: computed(() => response.value.totalPages),
    status,
    error,
    refresh,
  }
}

export type TUseSiteSearchReturn = ReturnType<typeof createSiteSearchState>

export function useSiteSearch(options: TUseSiteSearchOptions = {}): TUseSiteSearchReturn {
  return createSiteSearchState(options)
}
