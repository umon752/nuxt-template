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
    id: 'sample',
    type: 'system',
    code: 'sample',
    title: '範例頁',
    enabled: true,
    order: 2,
  },
  {
    id: 'examples',
    type: 'system',
    code: 'examples',
    title: '多層選單',
    enabled: true,
    order: 3,
    children: [
      {
        id: 'examples-basic',
        type: 'system',
        code: 'examples',
        title: '基礎元件',
        enabled: true,
        order: 1,
        children: [
          {
            id: 'examples-button',
            type: 'system',
            code: 'sample',
            title: '按鈕元件',
            enabled: true,
            order: 1,
          },
          {
            id: 'examples-card',
            type: 'system',
            code: 'sample',
            title: '卡片元件',
            enabled: true,
            order: 2,
          },
        ],
      },
      {
        id: 'examples-interactive',
        type: 'system',
        code: 'examples',
        title: '互動元件',
        enabled: true,
        order: 2,
        children: [
          {
            id: 'examples-accordion',
            type: 'system',
            code: 'sample',
            title: 'Accordion',
            enabled: true,
            order: 1,
          },
          {
            id: 'examples-navigation',
            type: 'system',
            code: 'examples',
            title: '分頁與導覽',
            enabled: true,
            order: 2,
            children: [
              {
                id: 'examples-pagination',
                type: 'system',
                code: 'sample',
                title: 'Pagination',
                enabled: true,
                order: 1,
              },
              {
                id: 'examples-breadcrumb',
                type: 'system',
                code: 'sample',
                title: 'Breadcrumb',
                enabled: true,
                order: 2,
              },
            ],
          },
        ],
      },
      {
        id: 'examples-layout',
        type: 'system',
        code: 'examples',
        title: '版型元件',
        enabled: true,
        order: 3,
        children: [
          {
            id: 'examples-header',
            type: 'system',
            code: 'sample',
            title: 'Page Header',
            enabled: true,
            order: 1,
          },
        ],
      },
    ],
  },
]

export default defineEventHandler((): TMenuApiItem[] => mockMenuItems)
