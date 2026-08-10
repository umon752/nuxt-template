import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'

import CountUp, { type TCountUpInstance } from '~/components/countup/CountUp.vue'

const getInstance = (wrapper: ReturnType<typeof mount>): TCountUpInstance =>
  wrapper.vm as unknown as TCountUpInstance

describe('CountUp', () => {
  it('exposes control methods and completes a zero-duration animation', async () => {
    const wrapper = mount(CountUp, {
      props: {
        value: 12500,
        startValue: 500,
        duration: 0,
        mode: 'sequential',
        thousandComma: true,
      },
    })

    const instance = getInstance(wrapper)

    instance.run()
    await nextTick()

    expect(wrapper.find('.sr-only').text()).toBe('12,500')
    expect(wrapper.emitted('run')).toHaveLength(1)
    expect(wrapper.emitted('done')).toEqual([['12,500']])
  })

  it('emits stop, start, reset, and restart events through the exposed API', async () => {
    const wrapper = mount(CountUp, {
      props: {
        value: 100,
        duration: 1000,
      },
    })

    const instance = getInstance(wrapper)

    instance.run()
    instance.stop()
    instance.start()
    instance.reset()
    instance.restart()
    await nextTick()

    expect(wrapper.emitted('stop')).toHaveLength(1)
    expect(wrapper.emitted('start')).toHaveLength(1)
    expect(wrapper.emitted('reset')).toHaveLength(1)
    expect(wrapper.emitted('restart')).toHaveLength(1)
    expect(wrapper.emitted('run')).toHaveLength(2)
  })
})
