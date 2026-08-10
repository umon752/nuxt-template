import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import SlideTab from '~/components/slideTab/SlideTab.vue'

const items = [
  { id: 'overview', label: '總覽' },
  { id: 'details', label: '詳細資料' },
  { id: 'disabled', label: '停用項目', disabled: true },
]

describe('SlideTab', () => {
  it('emits selection changes and prevents disabled items from being selected', async () => {
    const wrapper = mount(SlideTab, {
      props: {
        items,
        modelValue: 'overview',
        showControls: false,
      },
    })

    const buttons = wrapper.findAll('button')
    await buttons[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['details']])
    expect(wrapper.emitted('change')).toEqual([[items[1], 1]])

    await buttons[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
  })
})
