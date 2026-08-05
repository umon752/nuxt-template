<script setup lang="ts">
import type { ClassValue } from 'clsx'

import { cn } from '~/utils/cn'

type TInputType = 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number'

type TProps = {
  type?: TInputType
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  invalid?: boolean
  size?: 'sm' | 'md' | 'lg'
  leadingIcon?: string
  trailingIcon?: string
  inputClass?: ClassValue
}

defineOptions({ inheritAttrs: false })

const {
  type = 'text',
  placeholder = undefined,
  disabled = false,
  readonly = false,
  required = false,
  invalid = false,
  size = 'md',
  leadingIcon = undefined,
  trailingIcon = undefined,
  inputClass: inputClassProp = '',
} = defineProps<TProps>()

const attrs = useAttrs()
const model = defineModel<string | number | undefined>()

const inputClass = computed(() => cn('w-full', attrs.class as ClassValue, inputClassProp))
const inputColor = computed(() => (invalid ? 'error' : 'neutral'))
</script>

<template>
  <UInput
    v-bind="attrs"
    v-model="model"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :color="inputColor"
    :size="size"
    :leading-icon="leadingIcon"
    :trailing-icon="trailingIcon"
    :aria-invalid="invalid || undefined"
    :class="inputClass"
  />
</template>
