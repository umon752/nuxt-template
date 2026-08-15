import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { defineComponent, h, type PropType } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import Header from '~/components/header/Header.vue'

const NuxtLinkStub = defineComponent({
  props: {
    to: {
      type: [String, Object] as PropType<string | Record<string, unknown>>,
      default: undefined,
    },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'a',
        { ...attrs, href: typeof props.to === 'string' ? props.to : undefined },
        slots.default?.()
      )
  },
})

describe('header menu integration', () => {
  it('renders a linked parent with an inline submenu indicator', async () => {
    const unregisterEndpoint = registerEndpoint('/api/menu', () => [
      {
        id: 'examples',
        type: 'system',
        code: 'examples',
        title: '多層選單',
        slug: 'examples',
        enabled: true,
        order: 1,
        children: [
          {
            id: 'examples-basic',
            type: 'system',
            code: 'examples',
            title: '基礎元件',
            slug: 'basic',
            enabled: true,
            order: 1,
            children: [
              {
                id: 'examples-button',
                type: 'system',
                code: 'sample',
                slug: 'button',
                title: '按鈕元件',
                enabled: true,
                order: 1,
              },
            ],
          },
        ],
      },
    ])

    try {
      const wrapper = await mountSuspended(Header, {
        route: '/',
        global: {
          stubs: {
            NuxtLink: NuxtLinkStub,
          },
        },
      })

      await vi.waitFor(() => expect(wrapper.text()).toContain('按鈕元件'), { timeout: 5000 })
      const parentLink = wrapper.findAll('a').find((link) => link.text() === '多層選單')
      const buttonLink = wrapper.findAll('a').find((link) => link.text() === '按鈕元件')

      expect(parentLink?.attributes('href')).toBe('/examples')
      expect(parentLink?.find('[aria-hidden="true"]').exists()).toBe(true)
      expect(buttonLink?.attributes('href')).toBe('/examples/basic/button')
    } finally {
      unregisterEndpoint()
    }
  })

  it('renders a parent without a route as a submenu toggle only', async () => {
    const unregisterEndpoint = registerEndpoint('/api/menu', () => [
      {
        id: 'group',
        type: 'system',
        code: 'sample',
        title: '純分組節點',
        slug: null,
        enabled: true,
        order: 1,
        children: [
          {
            id: 'group-child',
            type: 'custom',
            slug: 'child',
            title: '子項目',
            enabled: true,
            order: 1,
          },
        ],
      },
    ])

    try {
      const wrapper = await mountSuspended(Header, {
        route: '/',
        global: {
          stubs: {
            NuxtLink: NuxtLinkStub,
          },
        },
      })

      await vi.waitFor(() => expect(wrapper.text()).toContain('純分組節點'), { timeout: 5000 })

      expect(wrapper.findAll('a').some((link) => link.text() === '純分組節點')).toBe(false)
      expect(wrapper.get('#menu-trigger-group').text()).toContain('純分組節點')
    } finally {
      unregisterEndpoint()
    }
  })
})
