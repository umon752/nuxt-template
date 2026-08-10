import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'

import StickyAnchor from '~/components/stickyAnchor/StickyAnchor.vue'

const items = [
  { id: 'intro', label: '介紹' },
  { id: 'features', label: '功能' },
]

describe('StickyAnchor', () => {
  it('changes the active anchor and scrolls to its section', async () => {
    const wrapper = mount(StickyAnchor, {
      props: {
        items,
        modelValue: 'features',
      },
    })

    const buttons = wrapper.findAll('button')
    await buttons[0].trigger('click')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toEqual([['intro']])
    expect(wrapper.emitted('change')).toEqual([[items[0], 0]])
    expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalled()
  })

  it('exposes a safe no-op for an invalid section index', () => {
    const wrapper = mount(StickyAnchor, {
      props: {
        items,
      },
    })

    const instance = wrapper.vm as unknown as { scrollToItem: (index: number) => void }
    expect(() => instance.scrollToItem(99)).not.toThrow()
  })
})
