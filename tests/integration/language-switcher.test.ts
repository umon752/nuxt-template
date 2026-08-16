import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { getQuery } from 'h3'
import { defineComponent, h, ref, type PropType } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { RouteLocationNormalized } from 'vue-router'

import Header from '~/components/header/Header.vue'
import LanguageSwitcher from '~/components/header/LanguageSwitcher.vue'
import { featureConfig } from '~/config/features'
import { useLocaleSwitcher } from '~/composables/useLocaleSwitcher'
import localeFeatureMiddleware from '~/middleware/locale-feature.global'

const mutableFeatureConfig = featureConfig as unknown as { languageSwitcher: boolean }
const initialLanguageSwitcher = mutableFeatureConfig.languageSwitcher

beforeEach(() => {
  mutableFeatureConfig.languageSwitcher = true
})

afterEach(() => {
  mutableFeatureConfig.languageSwitcher = initialLanguageSwitcher
})

const createRoute = (path: string): RouteLocationNormalized => {
  return { path } as RouteLocationNormalized
}

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
  template:
    '<div id="results"><button type="button" @click="handleSwitch">{{ result }}</button></div>',
})

describe('language switcher integration', () => {
  it('provides an imperative locale switch action', async () => {
    const wrapper = await mountSuspended(LocaleSwitchButton, {
      route: '/search?q=nuxt',
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

  it('hides the Header language switcher when its feature is disabled', async () => {
    const previousValue = mutableFeatureConfig.languageSwitcher
    const unregisterEndpoint = registerEndpoint('/api/menu', () => [])
    mutableFeatureConfig.languageSwitcher = false

    try {
      const wrapper = await mountSuspended(Header, {
        route: '/',
        global: {
          stubs: {
            NuxtLink: NuxtLinkStub,
          },
        },
      })

      expect(wrapper.find('button[aria-label="Change language"]').exists()).toBe(false)
    } finally {
      mutableFeatureConfig.languageSwitcher = previousValue
      unregisterEndpoint()
    }
  })

  it('blocks non-default locale routes when the language feature is disabled', () => {
    const previousValue = mutableFeatureConfig.languageSwitcher
    mutableFeatureConfig.languageSwitcher = false

    try {
      expect(() => localeFeatureMiddleware(createRoute('/en'), createRoute('/'))).toThrowError(
        'Locale route is disabled'
      )
      expect(() =>
        localeFeatureMiddleware(createRoute('/en/sample'), createRoute('/'))
      ).toThrowError('Locale route is disabled')
      expect(localeFeatureMiddleware(createRoute('/'), createRoute('/'))).toBeUndefined()
    } finally {
      mutableFeatureConfig.languageSwitcher = previousValue
    }
  })
})
