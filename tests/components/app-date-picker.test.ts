import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AppDatePicker from '~/components/form/AppDatePicker.vue'
import IconDate from '~/components/icon/IconDate.vue'

const PopoverStub = defineComponent({
  setup(_, { slots }) {
    return () => h('div', slots.default?.())
  },
})

const InputDateStub = defineComponent({
  props: {
    trailingIcon: {
      type: null,
      default: undefined,
    },
  },
  setup(props) {
    return () =>
      h('div', {
        'data-testid': 'input-date',
        'data-is-icon-date': props.trailingIcon === IconDate,
      })
  },
})

const CalendarStub = defineComponent({
  setup() {
    return () => h('div', { 'data-testid': 'calendar' })
  },
})

describe('AppDatePicker', () => {
  it('uses IconDate component as the default trailing icon', () => {
    const wrapper = mount(AppDatePicker, {
      global: {
        stubs: {
          UPopover: PopoverStub,
          UInputDate: InputDateStub,
          UCalendar: CalendarStub,
        },
      },
    })

    expect(wrapper.get('[data-testid="input-date"]').attributes('data-is-icon-date')).toBe('true')
  })
})
