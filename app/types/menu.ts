import type { SystemMenuCode } from '~/config/menu'

type TMenuApiItemBase = {
  id: string
  title: string
  enabled: boolean
  order: number
  targetId?: string
  slug?: string | null
  children?: TMenuApiItem[]
}

export type TSystemMenuApiItem = TMenuApiItemBase & {
  type: 'system'
  code: SystemMenuCode
}

export type TCustomMenuApiItem = TMenuApiItemBase & { type: 'custom' }

export type TMenuApiItem = TSystemMenuApiItem | TCustomMenuApiItem
