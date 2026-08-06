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

const radioItems = computed(() => [...options])
const radioClass = computed(() => cn('w-full', attrs.class as ClassValue, radioClassProp))
const radioColor = computed(() => (invalid ? 'error' : 'neutral'))
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
    :aria-invalid="invalid || undefined"
    :class="radioClass"
  />
</template>
