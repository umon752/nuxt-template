import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'

import SearchPage from '~/pages/search.vue'

describe('search page integration', () => {
  it('renders results returned by the server search endpoint', async () => {
    const unregisterEndpoint = registerEndpoint('/api/search', () => ({
      query: 'Accordion',
      results: [
        {
          id: 'sample',
          title: '範例頁',
          description: '展示網站元件、表單、互動元件、分頁與內容版型的範例頁。',
          href: '/sample',
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    }))

    try {
      const wrapper = await mountSuspended(SearchPage, {
        route: '/search?q=Accordion',
      })

      await vi.waitFor(
        () => {
          expect(wrapper.text()).toContain('範例頁')
          expect(wrapper.text()).toContain('展示網站元件、表單、互動元件、分頁與內容版型的範例頁。')
        },
        { timeout: 5000 }
      )
    } finally {
      unregisterEndpoint()
    }
  })
})
