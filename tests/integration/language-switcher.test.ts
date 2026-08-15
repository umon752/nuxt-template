import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { getQuery } from 'h3'
import { defineComponent, h, ref, type PropType } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import Header from '~/components/header/Header.vue'
import LanguageSwitcher from '~/components/header/LanguageSwitcher.vue'
import { useLocaleSwitcher } from '~/composables/useLocaleSwitcher'

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

const LocaleSwitchButton = defineComponent({
  setup() {
    const { switchLocale } = useLocaleSwitcher()
    const result = ref('idle')

    const handleSwitch = async (): Promise<void> => {
      result.value = (await switchLocale('en')) ? 'switched' : 'unchanged'
    }

    return { handleSwitch, result }
  },
  template: '<button type="button" @click="handleSwitch">{{ result }}</button>',
})

describe('language switcher integration', () => {
  it('provides an imperative locale switch action', async () => {
    const wrapper = await mountSuspended(LocaleSwitchButton, {
      route: '/search?q=nuxt#results',
    })

    await wrapper.get('button').trigger('click')

    await vi.waitFor(() => expect(wrapper.text()).toBe('switched'))
  })

  it('renders locale options, current state, and preserved query links', async () => {
    const wrapper = await mountSuspended(LanguageSwitcher, {
      route: '/search?q=nuxt#results',
      global: {
        stubs: {
          NuxtLink: NuxtLinkStub,
        },
      },
    })

    const trigger = wrapper.get('button')

    expect(trigger.text()).toContain('中文')
    expect(trigger.attributes('aria-expanded')).toBe('false')

    await trigger.trigger('click')

    const links = wrapper.findAll('a')
    const englishLink = links.find((link) => link.text() === 'English')

    expect(links.map((link) => link.text())).toEqual(['中文', 'English'])
    expect(links[0]?.attributes('aria-current')).toBe('true')
    expect(englishLink?.attributes('href')).toContain('/en/search')
    expect(englishLink?.attributes('href')).toContain('q=nuxt')
    expect(englishLink?.attributes('href')).toContain('#results')

    await trigger.trigger('keydown', { key: 'Escape' })
    expect(trigger.attributes('aria-expanded')).toBe('false')
  })

  it('renders English menu titles on an English route', async () => {
    let requestedLocale: unknown
    const unregisterEndpoint = registerEndpoint('/api/menu', (event) => {
      requestedLocale = getQuery(event).locale

      return [
        {
          id: 'home',
          type: 'system',
          code: 'home',
          title: 'Home',
          enabled: true,
          order: 1,
        },
        {
          id: 'sample',
          type: 'system',
          code: 'sample',
          title: 'Sample Page',
          slug: 'sample',
          enabled: true,
          order: 2,
        },
        {
          id: 'examples',
          type: 'system',
          code: 'examples',
          title: 'Examples',
          slug: 'examples',
          enabled: true,
          order: 3,
        },
      ]
    })

    try {
      const wrapper = await mountSuspended(Header, {
        route: '/en',
        global: {
          stubs: {
            NuxtLink: NuxtLinkStub,
          },
        },
      })

      await vi.waitFor(() => expect(wrapper.text()).toContain('Sample Page'), { timeout: 5000 })

      expect(requestedLocale).toBe('en')
      expect(wrapper.text()).toContain('Examples')
      expect(wrapper.get('button[aria-label="Change language"]').text()).toContain('English')
    } finally {
      unregisterEndpoint()
    }
  })
})
