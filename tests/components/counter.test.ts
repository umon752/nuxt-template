import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Counter from '~/components/counter/Counter.vue'

describe('Counter', () => {
  it('increments, decrements, and respects the configured boundaries', async () => {
    const wrapper = mount(Counter, {
      props: {
        modelValue: 1,
        min: 0,
        max: 2,
      },
    })

    const [decrementButton, incrementButton] = wrapper.findAll('button')

    await incrementButton.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[2]])
    expect(wrapper.emitted('increment')).toEqual([[2]])
    expect(wrapper.emitted('change')).toEqual([[2, 'increment']])

    await wrapper.setProps({ modelValue: 2 })
    expect(incrementButton.attributes('disabled')).toBeDefined()

    await incrementButton.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)

    await wrapper.setProps({ modelValue: 1 })
    await decrementButton.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[2], [0]])
    expect(wrapper.emitted('decrement')).toEqual([[0]])
  })

  it('clamps editable input values and reports input as the change source', async () => {
    const wrapper = mount(Counter, {
      props: {
        modelValue: 2,
        min: 0,
        max: 5,
        editable: true,
      },
    })

    const input = wrapper.get('input')

    await input.setValue('99')

    expect(wrapper.emitted('update:modelValue')).toEqual([[5]])
    expect(wrapper.emitted('change')).toEqual([[5, 'input']])

    await wrapper.setProps({ modelValue: 5 })
    expect(input.element.value).toBe('5')
  })
})
