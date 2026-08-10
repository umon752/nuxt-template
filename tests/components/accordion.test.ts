import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Accordion from '~/components/accordion/Accordion.vue'

const items = [
  { title: '第一項', content: '第一項內容' },
  { title: '第二項', content: '第二項內容' },
]

describe('Accordion', () => {
  it('opens one item at a time by default and emits the requested state', async () => {
    const wrapper = mount(Accordion, {
      props: {
        items,
        activeItems: [],
      },
    })

    const buttons = wrapper.findAll('button')

    await buttons[0].trigger('click')
    expect(buttons[0].attributes('aria-expanded')).toBe('false')
    expect(wrapper.emitted('update:activeItems')).toEqual([[[0]]])
    expect(wrapper.emitted('toggle')).toEqual([[0, true]])

    await wrapper.setProps({ activeItems: [0] })
    await buttons[1].trigger('click')

    expect(wrapper.emitted('update:activeItems')).toEqual([[[0]], [[1]]])
    expect(wrapper.emitted('toggle')).toEqual([
      [0, true],
      [1, true],
    ])
  })

  it('supports multiple expanded items when collapseOthers is disabled', async () => {
    const wrapper = mount(Accordion, {
      props: {
        items,
        activeItems: [],
        collapseOthers: false,
      },
    })

    const buttons = wrapper.findAll('button')
    await buttons[0].trigger('click')
    await wrapper.setProps({ activeItems: [0] })
    await buttons[1].trigger('click')

    expect(wrapper.emitted('update:activeItems')).toEqual([[[0]], [[0, 1]]])
  })
})
