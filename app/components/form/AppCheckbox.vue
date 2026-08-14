<script setup lang="ts">
import type { ClassValue } from 'clsx'

import { cn } from '~/utils/cn'

type TProps = {
  label?: string
  description?: string
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  size?: 'sm' | 'md' | 'lg'
  checkboxClass?: ClassValue
}

type TSlotClass = string | ((defaults: string) => string)

type TCheckboxUi = Record<string, TSlotClass | undefined>

defineOptions({ inheritAttrs: false })

const {
  label = undefined,
  description = undefined,
  disabled = false,
  required = false,
  invalid = false,
  size = 'md',
  checkboxClass: checkboxClassProp = '',
} = defineProps<TProps>()

const attrs = useAttrs()
const model = defineModel<boolean | 'indeterminate'>()

const checkboxClass = computed(() => cn(attrs.class as ClassValue, checkboxClassProp))
const checkboxColor = computed(() => (invalid ? 'error' : 'neutral'))
const mergeLabelClass = (label: TSlotClass | undefined): TSlotClass | undefined => {
  if (disabled) {
    return label
  }

  if (typeof label === 'function') {
    return (defaults: string) => cn(label(defaults), 'cursor-pointer')
  }

  return cn(label, 'cursor-pointer')
}
const checkboxUi = computed<TCheckboxUi>(() => {
  const ui = (attrs.ui ?? {}) as TCheckboxUi

  return {
    ...ui,
    label: mergeLabelClass(ui.label),
  }
})
</script>

<template>
  <UCheckbox
    v-bind="attrs"
    v-model="model"
    :label="label"
    :description="description"
    :disabled="disabled"
    :required="required"
    :color="checkboxColor"
    :size="size"
    :ui="checkboxUi"
    :aria-invalid="invalid || undefined"
    :class="checkboxClass"
  />
</template>
