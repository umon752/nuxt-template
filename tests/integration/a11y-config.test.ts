import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { afterEach, describe, expect, it } from 'vitest'

import Footer from '~/components/footer/Footer.vue'
import Header from '~/components/header/Header.vue'
import { a11yConfig } from '~/config/features'
import DefaultLayout from '~/layouts/default.vue'

const mutableA11yConfig = a11yConfig as unknown as {
  skipLink: boolean
  accessKeyLinks: boolean
}
const initialA11yConfig = { ...mutableA11yConfig }

afterEach(() => {
  Object.assign(mutableA11yConfig, initialA11yConfig)
})

const mountLayout = () =>
  mountSuspended(DefaultLayout, {
    route: '/',
    global: {
      stubs: {
        BtnGoTop: true,
        Footer: true,
        Header: true,
      },
    },
  })

describe('a11y config integration', () => {
  it('controls SkipLink and the main content access key in the default layout', async () => {
    mutableA11yConfig.skipLink = false
    mutableA11yConfig.accessKeyLinks = false

    const wrapper = await mountLayout()

    expect(wrapper.find('a[href="#main-content"]').exists()).toBe(false)
    expect(wrapper.find('#AC').exists()).toBe(false)
  })

  it('controls the Header access key link', async () => {
    const unregisterEndpoint = registerEndpoint('/api/menu', () => [])
    mutableA11yConfig.accessKeyLinks = false

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

      expect(wrapper.find('#AU').exists()).toBe(false)
    } finally {
      unregisterEndpoint()
    }
  })

  it('controls the Footer access key link', async () => {
    mutableA11yConfig.accessKeyLinks = false

    const wrapper = await mountSuspended(Footer, {
      route: '/',
      global: {
        stubs: {
          NuxtLink: {
            template: '<a><slot /></a>',
          },
        },
      },
    })

    expect(wrapper.find('#AZ').exists()).toBe(false)
  })
})
