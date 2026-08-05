<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import type { ClassValue } from 'clsx'

import { cn } from '~/utils/cn'

type TProps = {
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  invalid?: boolean
  size?: 'sm' | 'md' | 'lg'
  locale?: string
  minValue?: DateValue
  maxValue?: DateValue
  trailingIcon?: string
  inputClass?: ClassValue
  calendarClass?: ClassValue
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
  trailingIcon = 'i-lucide-calendar-days',
  inputClass: inputClassProp = '',
  calendarClass: calendarClassProp = '',
} = defineProps<TProps>()

const attrs = useAttrs()
const model = defineModel<DateValue | undefined>()
const { locale: appLocale } = useI18n()

const inputClass = computed(() => cn('w-full', attrs.class as ClassValue, inputClassProp))
const calendarClass = computed(() => cn('p-3', calendarClassProp))
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
        :trailing-icon="trailingIcon"
        :aria-invalid="invalid || undefined"
        :class="inputClass"
      />
    </template>

    <template #content="{ close }">
      <UCalendar
        v-model="model"
        :disabled="disabled"
        :locale="inputLocale"
        :min-value="minValue"
        :max-value="maxValue"
        :class="calendarClass"
        @update:model-value="close"
      />
    </template>
  </UPopover>
</template>
