import type { ComputedRef, MaybeRefOrGetter, WritableComputedRef } from 'vue'
import type { LocationQueryRaw } from 'vue-router'

type TUsePaginationQueryOptions = {
  totalPages: MaybeRefOrGetter<number>
  pageQueryKey?: string
  omitFirstPage?: boolean
}

type TUsePaginationQueryReturn = {
  page: WritableComputedRef<number>
  totalPages: ComputedRef<number>
  replacePage: (page: number, query?: LocationQueryRaw) => Promise<void>
}

type TRouteQueryValue = string | null | Array<string | null> | undefined

//----------------------------
// query normalization
//----------------------------
export function getRouteQueryValue(value: TRouteQueryValue): string {
  if (Array.isArray(value)) {
    return value[0] ?? ''
  }

  return value ?? ''
}

function normalizePositiveInteger(value: number, fallback: number): number {
  const normalizedValue = Math.floor(value)

  return Number.isSafeInteger(normalizedValue) && normalizedValue >= 1 ? normalizedValue : fallback
}

function parsePageQuery(value: TRouteQueryValue): number {
  const queryValue = getRouteQueryValue(value)

  if (!/^\d+$/.test(queryValue)) {
    return 1
  }

  return normalizePositiveInteger(Number(queryValue), 1)
}

//----------------------------
// pagination state and route sync
//----------------------------
export function usePaginationQuery(options: TUsePaginationQueryOptions): TUsePaginationQueryReturn {
  const route = useRoute()
  const router = useRouter()
  const pageQueryKey = options.pageQueryKey ?? 'page'
  const omitFirstPage = options.omitFirstPage ?? true

  const totalPages = computed(() => normalizePositiveInteger(toValue(options.totalPages), 1))
  const routePage = computed(() => parsePageQuery(route.query[pageQueryKey]))

  //----------------------------
  // page navigation
  //----------------------------
  const normalizePage = (page: number): number => {
    const normalizedPage = normalizePositiveInteger(page, 1)

    return Math.min(normalizedPage, totalPages.value)
  }

  const replacePage = async (page: number, query: LocationQueryRaw = {}): Promise<void> => {
    const nextPage = normalizePage(page)

    await router.replace({
      query: {
        ...route.query,
        ...query,
        [pageQueryKey]: omitFirstPage && nextPage === 1 ? undefined : String(nextPage),
      },
    })
  }

  const handleNavigationError = (error: unknown): void => {
    console.error('Failed to synchronize pagination query.', error)
  }

  const page = computed({
    get: () => normalizePage(routePage.value),
    set: (value: number) => {
      void replacePage(value).catch(handleNavigationError)
    },
  })

  //----------------------------
  // route synchronization
  //----------------------------
  if (import.meta.client) {
    watch(
      [() => route.query[pageQueryKey], totalPages],
      ([queryValue]) => {
        const normalizedPage = normalizePage(parsePageQuery(queryValue))
        const expectedQueryValue =
          omitFirstPage && normalizedPage === 1 ? undefined : String(normalizedPage)
        const currentQueryValue = getRouteQueryValue(queryValue) || undefined

        if (currentQueryValue !== expectedQueryValue) {
          void replacePage(normalizedPage).catch(handleNavigationError)
        }
      },
      { immediate: true }
    )
  }

  return {
    page,
    totalPages,
    replacePage,
  }
}
