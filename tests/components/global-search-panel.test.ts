import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'

import GlobalSearchPanel from '~/components/search/GlobalSearchPanel.vue'

const flushPanel = async (): Promise<void> => {
  await nextTick()
  await nextTick()
}

describe('GlobalSearchPanel', () => {
  it('focuses the input and emits a normalized query on submit', async () => {
    const wrapper = mount(GlobalSearchPanel, {
      props: {
        open: false,
        suggestions: ['Accordion'],
      },
      attachTo: document.body,
    })

    await wrapper.setProps({ open: true })
    await flushPanel()

    const input = wrapper.get('input')
    expect(wrapper.get('button[aria-label="關閉搜尋"] svg').exists()).toBe(true)
    expect(document.activeElement).toBe(input.element)

    await input.setValue('  Nuxt   4  ')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('submit')).toEqual([['Nuxt 4']])
  })

  it('emits submit for a suggestion and close for Escape or outside pointerdown', async () => {
    const wrapper = mount(GlobalSearchPanel, {
      props: {
        open: true,
        suggestions: ['Accordion'],
      },
      attachTo: document.body,
    })

    await flushPanel()
    const suggestion = wrapper.findAll('button').find((button) => button.text() === 'Accordion')

    expect(suggestion).toBeDefined()
    await suggestion?.trigger('click')

    expect(wrapper.emitted('submit')).toEqual([['Accordion']])

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    document.dispatchEvent(new Event('pointerdown'))

    expect(wrapper.emitted('close')).toHaveLength(2)
  })
})
