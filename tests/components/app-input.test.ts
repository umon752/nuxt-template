import { defineComponent, h, type PropType } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AppInput from '~/components/form/AppInput.vue'

const InputStub = defineComponent({
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    const ui = {
      trailingIcon: () => 'stub-trailing-icon',
    }

    return () =>
      h('div', { 'data-testid': 'input-root' }, [
        h('input', { value: props.modelValue }),
        h('div', { 'data-testid': 'trailing' }, slots.trailing?.({ ui })),
      ])
  },
})

const IconBaseIconStub = defineComponent({
  setup(_, { attrs, slots }) {
    return () => h('svg', { ...attrs, 'data-testid': 'close-icon' }, slots.default?.())
  },
})

const mountAppInput = (props: Record<string, unknown>) =>
  mount(AppInput, {
    props,
    global: {
      stubs: {
        UInput: InputStub,
        IconBaseIcon: IconBaseIconStub,
      },
    },
  })

describe('AppInput', () => {
  it('clears a string model value through the clear button', async () => {
    const wrapper = mountAppInput({ modelValue: 'Alice', clearable: true })

    const button = wrapper.get('button[aria-label="清除輸入內容"]')

    expect(button.get('[data-testid="close-icon"]').exists()).toBe(true)

    await button.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['']])
  })

  it('clears a number model value with undefined', async () => {
    const wrapper = mountAppInput({ modelValue: 42, type: 'number', clearable: true })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[undefined]])
  })

  it.each([
    ['an empty value', { modelValue: '' }],
    ['a disabled input', { modelValue: 'Alice', disabled: true }],
    ['a readonly input', { modelValue: 'Alice', readonly: true }],
  ])('does not render a clear button for %s', (_description, props) => {
    const wrapper = mountAppInput({ ...props, clearable: true })

    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('uses a custom clear label', () => {
    const wrapper = mountAppInput({
      modelValue: 'Alice',
      clearable: true,
      clearLabel: '清除姓名',
    })

    expect(wrapper.get('button').attributes('aria-label')).toBe('清除姓名')
  })
})
