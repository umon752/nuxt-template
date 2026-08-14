<script setup lang="ts">
import type { ClassValue } from 'clsx'

import { cn } from '~/utils/cn'

export type TAppRadioOption = {
  label: string
  value: string | number
  description?: string
  disabled?: boolean
}

type TProps = {
  options: readonly TAppRadioOption[]
  legend?: string
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  size?: 'sm' | 'md' | 'lg'
  orientation?: 'vertical' | 'horizontal'
  radioClass?: ClassValue
}

type TSlotClass = string | ((defaults: string) => string)

type TRadioUi = Record<string, TSlotClass | undefined>
type TRadioOptionWithUi = TAppRadioOption & { ui?: TRadioUi }

defineOptions({ inheritAttrs: false })

const {
  options,
  legend = undefined,
  disabled = false,
  required = false,
  invalid = false,
  size = 'md',
  orientation = 'vertical',
  radioClass: radioClassProp = '',
} = defineProps<TProps>()

const attrs = useAttrs()
const model = defineModel<string | number | undefined>()

const radioClass = computed(() => cn('w-full', attrs.class as ClassValue, radioClassProp))
const radioColor = computed(() => (invalid ? 'error' : 'neutral'))
const mergeLabelClass = (
  label: TSlotClass | undefined,
  shouldAddPointer: boolean
): TSlotClass | undefined => {
  if (!shouldAddPointer) {
    return label
  }

  if (typeof label === 'function') {
    return (defaults: string) => cn(label(defaults), 'cursor-pointer')
  }

  return cn(label, 'cursor-pointer')
}

const radioItems = computed<TRadioOptionWithUi[]>(() =>
  options.map((item) => {
    const itemWithUi = item as TRadioOptionWithUi

    return {
      ...itemWithUi,
      ui: {
        ...itemWithUi.ui,
        label: mergeLabelClass(itemWithUi.ui?.label, !disabled && !item.disabled),
      },
    }
  })
)

const radioUi = computed<TRadioUi>(() => {
  const ui = (attrs.ui ?? {}) as TRadioUi

  return ui
})
</script>

<template>
  <URadioGroup
    v-bind="attrs"
    v-model="model"
    :items="radioItems"
    :legend="legend"
    :disabled="disabled"
    :required="required"
    :color="radioColor"
    :size="size"
    :orientation="orientation"
    :ui="radioUi"
    :aria-invalid="invalid || undefined"
    :class="radioClass"
  />
</template>
