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

const props = withDefaults(defineProps<TProps>(), {
  disabled: false,
  readonly: false,
  required: false,
  invalid: false,
  size: 'md',
  locale: undefined,
  minValue: undefined,
  maxValue: undefined,
  trailingIcon: 'i-lucide-calendar-days',
  inputClass: '',
  calendarClass: '',
})

const attrs = useAttrs()
const model = defineModel<DateValue | undefined>()
const { locale: appLocale } = useI18n()

const inputClass = computed(() => cn('w-full', attrs.class as ClassValue, props.inputClass))
const calendarClass = computed(() => cn('p-3', props.calendarClass))
const inputColor = computed(() => (props.invalid ? 'error' : 'neutral'))
const inputLocale = computed(() => props.locale ?? appLocale.value)
</script>

<template>
  <UPopover :content="{ align: 'start' }">
    <template #default>
      <UInputDate
        v-bind="attrs"
        v-model="model"
        :disabled="props.disabled"
        :readonly="props.readonly"
        :required="props.required"
        :color="inputColor"
        :size="props.size"
        :locale="inputLocale"
        :min-value="props.minValue"
        :max-value="props.maxValue"
        :trailing-icon="props.trailingIcon"
        :aria-invalid="props.invalid || undefined"
        :class="inputClass"
      />
    </template>

    <template #content="{ close }">
      <UCalendar
        v-model="model"
        :disabled="props.disabled"
        :locale="inputLocale"
        :min-value="props.minValue"
        :max-value="props.maxValue"
        :class="calendarClass"
        @update:model-value="close"
      />
    </template>
  </UPopover>
</template>
