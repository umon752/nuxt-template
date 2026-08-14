<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import type { ClassValue } from 'clsx'
import type { Component } from 'vue'

import IconDate from '~/components/icon/IconDate.vue'
import { cn } from '~/utils/cn'

type TCalendarUi = {
  cellTrigger?: string
}

type TProps = {
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  invalid?: boolean
  size?: 'sm' | 'md' | 'lg'
  locale?: string
  minValue?: DateValue
  maxValue?: DateValue
  trailingIcon?: string | Component
  iconClass?: ClassValue
  inputClass?: ClassValue
  calendarClass?: ClassValue
  calendarCellClass?: ClassValue
}

defineOptions({ inheritAttrs: false })

const {
  disabled = false,
  readonly = false,
  required = false,
  invalid = false,
  size = 'md',
  locale = undefined,
  minValue = undefined,
  maxValue = undefined,
  trailingIcon = IconDate,
  iconClass: iconClassProp = '',
  inputClass: inputClassProp = '',
  calendarClass: calendarClassProp = '',
  calendarCellClass: calendarCellClassProp = '',
} = defineProps<TProps>()

const attrs = useAttrs()
const model = defineModel<DateValue | undefined>()
const { locale: appLocale } = useI18n()

const inputClass = computed(() =>
  cn('w-full cursor-pointer', attrs.class as ClassValue, inputClassProp)
)
const trailingIconClass = computed(() => cn(iconClassProp))
const calendarClass = computed(() => cn('p-3', calendarClassProp))
const calendarUi = computed<TCalendarUi>(() => ({
  cellTrigger: cn(calendarCellClassProp),
}))
const inputColor = computed(() => (invalid ? 'error' : 'neutral'))
const inputLocale = computed(() => locale ?? appLocale.value)
</script>

<template>
  <UPopover :content="{ align: 'start' }">
    <template #default>
      <UInputDate
        v-bind="attrs"
        v-model="model"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :color="inputColor"
        :size="size"
        :locale="inputLocale"
        :min-value="minValue"
        :max-value="maxValue"
        :aria-invalid="invalid || undefined"
        :class="inputClass"
      >
        <template #trailing="{ ui }">
          <UIcon
            v-if="typeof trailingIcon === 'string'"
            :name="trailingIcon"
            :class="ui.trailingIcon({ class: trailingIconClass })"
          />

          <component
            :is="trailingIcon"
            v-else
            :class="ui.trailingIcon({ class: trailingIconClass })"
          />
        </template>
      </UInputDate>
    </template>

    <template #content="{ close }">
      <UCalendar
        v-model="model"
        :disabled="disabled"
        :locale="inputLocale"
        :min-value="minValue"
        :max-value="maxValue"
        :ui="calendarUi"
        :class="calendarClass"
        @update:model-value="close"
      />
    </template>
  </UPopover>
</template>
