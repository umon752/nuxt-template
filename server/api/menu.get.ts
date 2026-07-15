import type { TMenuApiItem } from '~/types/menu'

const mockMenuItems: TMenuApiItem[] = [
  {
    id: 'home',
    type: 'system',
    code: 'home',
    title: '首頁',
    enabled: true,
    order: 1,
  },
  {
    id: 'about',
    type: 'system',
    code: 'about',
    title: '關於我們',
    enabled: true,
    order: 2,
  },
  {
    id: 'news',
    type: 'system',
    code: 'news',
    title: '最新消息',
    enabled: true,
    order: 3,
  },
  {
    id: 'sample',
    type: 'system',
    code: 'sample',
    title: '範例頁',
    enabled: true,
    order: 4,
  },
  {
    id: 'content',
    type: 'system',
    code: 'content',
    title: '頁面',
    enabled: true,
    order: 5,
    children: [
      {
        id: 'page-1',
        type: 'custom',
        slug: 'page-1',
        title: '頁面 1',
        enabled: true,
        order: 1,
      },
      {
        id: 'page-2',
        type: 'custom',
        slug: 'page-2',
        title: '頁面 2',
        enabled: true,
        order: 2,
      },
      {
        id: 'page-3',
        type: 'custom',
        slug: 'page-3',
        title: '頁面 3',
        enabled: true,
        order: 3,
      },
    ],
  },
]

export default defineEventHandler((): TMenuApiItem[] => mockMenuItems)
