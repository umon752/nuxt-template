import { h, defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Breadcrumb from '~/components/breadcrumb/Breadcrumb.vue'

const NuxtLinkStub = defineComponent({
  props: {
    to: {
      type: String,
      default: undefined,
    },
  },
  setup(props, { attrs, slots }) {
    return () => h('a', { ...attrs, href: props.to }, slots.default?.())
  },
})

const IconHomeStub = defineComponent({
  setup(_, { attrs }) {
    return () => h('svg', { ...attrs, 'data-testid': 'icon-home' })
  },
})

const mountBreadcrumb = (items: Array<{ title: string; href?: string }>) =>
  mount(Breadcrumb, {
    props: { items },
    global: {
      stubs: {
        NuxtLink: NuxtLinkStub,
        IconHome: IconHomeStub,
      },
    },
  })

describe('Breadcrumb', () => {
  it('renders the root item with IconHome and keeps its accessible label', () => {
    const wrapper = mountBreadcrumb([
      { title: '首頁', href: '/' },
      { title: '最新消息', href: '/news' },
      { title: '消息內容' },
    ])

    const links = wrapper.findAll('a')

    expect(links[0]?.find('[data-testid="icon-home"]').exists()).toBe(true)
    expect(links[0]?.find('.sr-only').text()).toBe('首頁')
    expect(links[1]?.text()).toBe('最新消息')
    expect(wrapper.get('[aria-current="page"]').text()).toBe('消息內容')
  })

  it('keeps the home icon accessible when the root item is the current page', () => {
    const wrapper = mountBreadcrumb([{ title: '首頁', href: '/' }])
    const currentItem = wrapper.get('[aria-current="page"]')

    expect(currentItem.find('[data-testid="icon-home"]').exists()).toBe(true)
    expect(currentItem.find('.sr-only').text()).toBe('首頁')
  })
})
