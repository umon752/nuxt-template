import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import Toast, { type TToastInstance } from '~/components/toast/Toast.vue'

const getInstance = (wrapper: ReturnType<typeof mount>): TToastInstance =>
  wrapper.vm as unknown as TToastInstance

describe('Toast', () => {
  it('renders text, exposes hide, and emits the visibility events', async () => {
    const wrapper = mount(Toast, {
      props: {
        modelValue: true,
        text: '第一行<br>第二行',
        autoHide: false,
      },
    })

    await nextTick()

    expect(wrapper.get('[role="status"]').text()).toContain('第一行\n第二行')
    expect(wrapper.get('button').text()).toBe('關閉通知')
    expect(wrapper.emitted('show')).toHaveLength(1)

    getInstance(wrapper).hide()

    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])

    await wrapper.setProps({ modelValue: false })
    await nextTick()
    expect(wrapper.emitted('hide')).toHaveLength(1)
  })

  it('automatically hides after the configured duration', async () => {
    vi.useFakeTimers()

    try {
      const wrapper = mount(Toast, {
        props: {
          modelValue: true,
          text: '短暫通知',
          duration: 200,
        },
      })

      await nextTick()
      vi.advanceTimersByTime(199)
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()

      vi.advanceTimersByTime(1)
      expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    } finally {
      vi.useRealTimers()
    }
  })
})
