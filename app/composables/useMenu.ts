import { DEFAULT_LOCALE, isLocaleCode, type TLocaleCode } from '~/constants/locales'
import { systemMenuConfig } from '~/config/menu'
import type { TMenuApiItem } from '~/types/menu'

export type TMenuItem = {
  id: string
  title: string
  href: string
  icon: string
  targetId?: string
  slug?: string
  children?: TMenuItem[]
}

function joinMenuPath(parentHref: string | undefined, slug: string): string {
  const normalizedParent = parentHref && parentHref !== '/' ? parentHref.replace(/\/+$/, '') : ''

  return `${normalizedParent}/${encodeURIComponent(slug)}`
}

function transformMenuItem(item: TMenuApiItem, parentHref?: string): TMenuItem | undefined {
  if (!item.enabled) return undefined

  const slug = typeof item.slug === 'string' ? item.slug.trim() : ''
  const config = item.type === 'system' ? systemMenuConfig[item.code] : undefined
  const href = slug
    ? joinMenuPath(parentHref, slug)
    : item.type === 'system' && item.code === 'home'
      ? '/'
      : ''
  const icon = config?.icon || ''

  const children = item.children
    ?.slice()
    .sort((a, b) => a.order - b.order)
    .map((child) => transformMenuItem(child, href))
    .filter((child): child is TMenuItem => child !== undefined)

  return {
    id: item.id,
    title: item.title,
    href,
    icon,
    targetId: item.targetId,
    slug: slug || undefined,
    children: children?.length ? children : undefined,
  }
}

function createMenuState() {
  const { locale } = useI18n()
  const menuLocale = computed<TLocaleCode>(() =>
    isLocaleCode(locale.value) ? locale.value : DEFAULT_LOCALE
  )
  const requestQuery = computed(() => ({ locale: menuLocale.value }))
  const { data, status, error, refresh } = useFetch<TMenuApiItem[]>('/api/menu', {
    query: requestQuery,
    default: () => [],
  })

  const menuItems = computed(() =>
    data.value
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((item) => transformMenuItem(item))
      .filter((item): item is TMenuItem => item !== undefined)
  )

  return {
    menuItems,
    status,
    error,
    refresh,
  }
}

export function useMenu(): ReturnType<typeof createMenuState> {
  return createMenuState()
}
