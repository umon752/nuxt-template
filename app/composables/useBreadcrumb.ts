import type { TMenuItem } from '~/composables/useMenu'
import type { TBreadcrumbItem } from '~/types/breadcrumb'

function normalizePath(path: string): string {
  if (!path || path === '/') return '/'

  return path.replace(/\/+$/, '')
}

function isPathMatch(routePath: string, href: string): boolean {
  const normalizedRoutePath = normalizePath(routePath)
  const normalizedHref = normalizePath(href)

  if (normalizedHref === '/') {
    return normalizedRoutePath === '/'
  }

  return (
    normalizedRoutePath === normalizedHref || normalizedRoutePath.startsWith(`${normalizedHref}/`)
  )
}

function collectTrails(items: TMenuItem[], parentTrail: TMenuItem[] = []): TMenuItem[][] {
  return items.flatMap((item) => {
    const currentTrail = [...parentTrail, item]
    const childTrails = item.children ? collectTrails(item.children, currentTrail) : []

    return [currentTrail, ...childTrails]
  })
}

function getFallbackTitle(path: string): string {
  const lastSegment = path.split('/').filter(Boolean).at(-1)

  if (!lastSegment) return ''

  return decodeURIComponent(lastSegment).replace(/-/g, ' ')
}

type TUseBreadcrumbReturn = {
  items: ComputedRef<TBreadcrumbItem[]>
  currentTitle: ComputedRef<string>
}

export function useBreadcrumb(): TUseBreadcrumbReturn {
  const route = useRoute()
  const { menuItems } = useMenu()

  const homeItem = computed<TBreadcrumbItem | undefined>(() => {
    const item = menuItems.value.find((menuItem) => normalizePath(menuItem.href) === '/')

    if (!item) return undefined

    return {
      title: item.title,
      href: item.href,
    }
  })

  const matchedTrail = computed<TMenuItem[] | undefined>(() => {
    const trails = collectTrails(menuItems.value)
    const matches = trails.filter((trail) => {
      const currentItem = trail.at(-1)

      return currentItem?.href ? isPathMatch(route.path, currentItem.href) : false
    })

    return matches.sort((left, right) => {
      const leftHref = left.at(-1)?.href ?? ''
      const rightHref = right.at(-1)?.href ?? ''

      return rightHref.length - leftHref.length
    })[0]
  })

  const items = computed<TBreadcrumbItem[]>(() => {
    const trailItems = matchedTrail.value?.map((item) => ({
      title: item.title,
      href: item.href || undefined,
    }))

    if (trailItems?.length) {
      const shouldPrependHome = homeItem.value && trailItems[0]?.href !== homeItem.value.href

      return shouldPrependHome ? [homeItem.value, ...trailItems] : trailItems
    }

    const fallbackTitle = getFallbackTitle(route.path)

    if (!fallbackTitle) {
      return homeItem.value ? [homeItem.value] : []
    }

    return homeItem.value ? [homeItem.value, { title: fallbackTitle }] : [{ title: fallbackTitle }]
  })

  const currentTitle = computed(() => items.value.at(-1)?.title ?? '')

  return {
    items,
    currentTitle,
  }
}
