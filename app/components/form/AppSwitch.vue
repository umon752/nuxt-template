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
  loading?: boolean
  switchClass?: ClassValue
}

defineOptions({ inheritAttrs: false })

const {
  label = undefined,
  description = undefined,
  disabled = false,
  required = false,
  invalid = false,
  size = 'md',
  loading = false,
  switchClass: switchClassProp = '',
} = defineProps<TProps>()

const attrs = useAttrs()
const model = defineModel<boolean>()

const switchClass = computed(() => cn('w-full', attrs.class as ClassValue, switchClassProp))
const switchColor = computed(() => (invalid ? 'error' : 'neutral'))
</script>

<template>
  <USwitch
    v-bind="attrs"
    v-model="model"
    :label="label"
    :description="description"
    :disabled="disabled"
    :required="required"
    :loading="loading"
    :color="switchColor"
    :size="size"
    :aria-invalid="invalid || undefined"
    :class="switchClass"
  />
</template>
