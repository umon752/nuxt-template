import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'

import Odometer, { type TOdometerInstance } from '~/components/odometer/Odometer.vue'

const getInstance = (wrapper: ReturnType<typeof mount>): TOdometerInstance =>
  wrapper.vm as unknown as TOdometerInstance

describe('Odometer', () => {
  it('runs to a capped target and emits run and done', async () => {
    const wrapper = mount(Odometer, {
      props: {
        value: 1234,
        startValue: 10,
        maxCount: 999,
        duration: 0,
      },
    })

    getInstance(wrapper).run()
    await nextTick()

    expect(wrapper.find('.sr-only').text()).toBe('999+')
    expect(wrapper.emitted('run')).toEqual([[999]])
    expect(wrapper.emitted('done')).toEqual([[999]])
  })

  it('normalizes an invalid negative value to zero', () => {
    const wrapper = mount(Odometer, {
      props: {
        value: -10,
        duration: 0,
      },
    })

    expect(wrapper.find('.sr-only').text()).toBe('0')
  })

  it('emits update when the target value changes', async () => {
    const wrapper = mount(Odometer, {
      props: {
        value: 10,
        duration: 0,
      },
    })

    await wrapper.setProps({ value: 25 })
    await nextTick()

    expect(wrapper.emitted('update')).toEqual([[25]])
    expect(wrapper.find('.sr-only').text()).toBe('25')
  })
})
