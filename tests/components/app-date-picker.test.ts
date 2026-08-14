import { defineComponent, h, type PropType } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AppDatePicker from '~/components/form/AppDatePicker.vue'

const PopoverStub = defineComponent({
  setup(_, { slots }) {
    return () => h('div', [slots.default?.(), slots.content?.({ close: () => undefined })])
  },
})

const InputDateStub = defineComponent({
  props: {
    class: {
      type: String,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    const ui = {
      trailingIcon: ({ class: className }: { class?: string }) => className,
    }

    return () =>
      h('div', { 'data-testid': 'input-date', class: props.class }, [
        h('div', { 'data-testid': 'trailing-slot' }, slots.trailing?.({ ui })),
      ])
  },
})

const CalendarStub = defineComponent({
  props: {
    ui: {
      type: Object as PropType<{ cellTrigger?: string }>,
      default: undefined,
    },
  },
  setup(props) {
    return () =>
      h('div', {
        'data-testid': 'calendar',
        'data-cell-trigger-class': props.ui?.cellTrigger,
      })
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

    expect(wrapper.get('[data-testid="trailing-slot"] svg').exists()).toBe(true)
  })

  it('merges iconClass into the default trailing icon classes', () => {
    const wrapper = mount(AppDatePicker, {
      props: {
        iconClass: 'size-4',
      },
      global: {
        stubs: {
          UPopover: PopoverStub,
          UInputDate: InputDateStub,
          UCalendar: CalendarStub,
        },
      },
    })

    const icon = wrapper.get('[data-testid="trailing-slot"] svg')

    expect(icon.classes()).toContain('size-4')
    expect(icon.classes()).not.toContain('size-6')
  })

  it('renders a custom trailing icon component with merged classes', () => {
    const CustomIcon = defineComponent({
      props: {
        class: {
          type: String,
          default: undefined,
        },
      },
      setup(props) {
        return () => h('svg', { 'data-testid': 'custom-icon', class: props.class })
      },
    })

    const wrapper = mount(AppDatePicker, {
      props: {
        trailingIcon: CustomIcon,
        iconClass: 'text-red-500 size-5',
      },
      global: {
        stubs: {
          UPopover: PopoverStub,
          UInputDate: InputDateStub,
          UCalendar: CalendarStub,
        },
      },
    })

    expect(wrapper.get('[data-testid="custom-icon"]').classes()).toEqual(['text-red-500', 'size-5'])
  })

  it('forwards calendarCellClass to the calendar cell trigger ui slot', () => {
    const wrapper = mount(AppDatePicker, {
      props: {
        calendarCellClass:
          'hover:not-data-selected:bg-primary-100 data-selected:bg-primary-500 data-selected:text-white',
      },
      global: {
        stubs: {
          UPopover: PopoverStub,
          UInputDate: InputDateStub,
          UCalendar: CalendarStub,
        },
      },
    })

    expect(wrapper.get('[data-testid="calendar"]').attributes('data-cell-trigger-class')).toBe(
      'hover:not-data-selected:bg-primary-100 data-selected:bg-primary-500 data-selected:text-white'
    )
  })
})
