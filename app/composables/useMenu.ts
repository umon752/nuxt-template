import { systemMenuConfig } from '~/config/menu'
import type { TMenuApiItem } from '~/types/menu'

export type TMenuItem = {
  id: string
  title: string
  href: string
  icon: string
  children?: TMenuItem[]
}

function joinMenuPath(parentHref: string | undefined, slug: string): string {
  const normalizedParent = parentHref && parentHref !== '/' ? parentHref.replace(/\/+$/, '') : ''

  return `${normalizedParent}/${encodeURIComponent(slug)}`
}

function transformMenuItem(item: TMenuApiItem, parentHref?: string): TMenuItem | undefined {
  if (!item.enabled) return undefined

  let href = ''
  let icon = ''

  if (item.type === 'custom') {
    // 若 slug 不存在或為空字串，就不要產生 href
    const slug = (item.slug ?? '').toString().trim()
    if (slug) {
      href = joinMenuPath(parentHref, slug)
    } else {
      href = ''
    }
  } else {
    const config = systemMenuConfig[item.code]

    href = config.route
    icon = config.icon
  }

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
    children: children?.length ? children : undefined,
  }
}

function createMenuState() {
  const { data, status, error, refresh } = useFetch<TMenuApiItem[]>('/api/menu', {
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
