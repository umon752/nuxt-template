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

const checkboxClass = computed(() => cn('w-full', attrs.class as ClassValue, checkboxClassProp))
const checkboxColor = computed(() => (invalid ? 'error' : 'neutral'))
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
    :aria-invalid="invalid || undefined"
    :class="checkboxClass"
  />
</template>
