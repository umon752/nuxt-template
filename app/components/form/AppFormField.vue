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

const props = withDefaults(defineProps<TProps>(), {
  label: undefined,
  description: undefined,
  help: undefined,
  hint: undefined,
  error: undefined,
  required: false,
  size: 'md',
  fieldClass: '',
})

const attrs = useAttrs()
const fieldClass = computed(() => cn(attrs.class as ClassValue, props.fieldClass))
</script>

<template>
  <UFormField
    v-bind="attrs"
    :label="props.label"
    :description="props.description"
    :help="props.help"
    :hint="props.hint"
    :error="props.error"
    :required="props.required"
    :size="props.size"
    :class="fieldClass"
  >
    <slot />
  </UFormField>
</template>
