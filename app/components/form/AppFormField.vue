<script setup lang="ts">
import type { ClassValue } from 'clsx'

import { cn } from '~/utils/cn'

type TProps = {
  label?: string
  description?: string
  help?: string
  hint?: string
  error?: string | boolean
  required?: boolean
  size?: 'sm' | 'md' | 'lg'
  fieldClass?: ClassValue
}

defineOptions({ inheritAttrs: false })

const {
  label = undefined,
  description = undefined,
  help = undefined,
  hint = undefined,
  error = undefined,
  required = false,
  size = 'md',
  fieldClass: fieldClassProp = '',
} = defineProps<TProps>()

const attrs = useAttrs()
const fieldClass = computed(() => cn(attrs.class as ClassValue, fieldClassProp))
</script>

<template>
  <UFormField
    v-bind="attrs"
    :label="label"
    :description="description"
    :help="help"
    :hint="hint"
    :error="error"
    :required="required"
    :size="size"
    :class="fieldClass"
  >
    <slot />
  </UFormField>
</template>
