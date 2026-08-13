import { getMessages, type TLocale } from '#server/utils/getMessages'
import type { TSearchDocument } from '~/types/search'

export function getSearchDocuments(locale: TLocale): TSearchDocument[] {
  const messages = getMessages(locale)

  return [
    {
      id: 'home',
      title: messages.pages.home.meta.title,
      description: messages.pages.home.meta.description,
      href: '/',
      keywords: ['首頁', '網站名稱', 'Nuxt 4', 'Vue 3', 'TypeScript', 'Tailwind CSS'],
    },
    {
      id: 'sample',
      title: '範例頁',
      description: '展示網站元件、表單、互動元件、分頁與內容版型的範例頁。',
      href: '/sample',
      keywords: [
        '範例',
        '元件',
        '按鈕元件',
        '卡片元件',
        '基礎元件',
        '互動元件',
        '多層選單',
        'Accordion',
        'Pagination',
        'Breadcrumb',
        'Page Header',
        '表單',
        'Swiper',
        'Modal',
        'Toast',
        'SocialShare',
        'Editor',
        'LazyLoad',
      ],
    },
    {
      id: 'privacy',
      title: messages.pages.privacy.meta.title,
      description: messages.pages.privacy.meta.description,
      href: '/privacy',
      keywords: ['隱私', '個人資料', 'Cookie', '資料安全', '資料保存', '使用者權利'],
    },
    {
      id: 'sitemap',
      title: messages.pages.sitemap.meta.title,
      description: messages.pages.sitemap.meta.description,
      href: '/sitemap',
      keywords: ['網站導覽', '頁面連結', '網站地圖', '導覽'],
    },
  ]
}
