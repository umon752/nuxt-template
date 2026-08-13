import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import Header from '~/components/header/Header.vue'

describe('header search integration', () => {
  it('closes the search panel when the search trigger is clicked again', async () => {
    const unregisterEndpoint = registerEndpoint('/api/menu', () => [
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
    ])

    try {
      const wrapper = await mountSuspended(Header, {
        route: '/',
        global: {
          stubs: {
            NuxtLink: {
              template: '<a><slot /></a>',
            },
          },
        },
      })
      const searchTrigger = wrapper.get('button[aria-controls="global-search-panel"]')

      await searchTrigger.trigger('click')
      expect(wrapper.find('#global-search-panel').exists()).toBe(true)

      await searchTrigger.trigger('pointerdown')
      await searchTrigger.trigger('click')

      expect(wrapper.find('#global-search-panel').exists()).toBe(false)
    } finally {
      unregisterEndpoint()
    }
  })
})
