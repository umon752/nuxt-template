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

const props = withDefaults(defineProps<TProps>(), {
  type: 'text',
  placeholder: undefined,
  disabled: false,
  readonly: false,
  required: false,
  invalid: false,
  size: 'md',
  leadingIcon: undefined,
  trailingIcon: undefined,
  inputClass: '',
})

const attrs = useAttrs()
const model = defineModel<string | number | undefined>()

const inputClass = computed(() => cn('w-full', attrs.class as ClassValue, props.inputClass))
const inputColor = computed(() => (props.invalid ? 'error' : 'neutral'))
</script>

<template>
  <UInput
    v-bind="attrs"
    v-model="model"
    :type="props.type"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :readonly="props.readonly"
    :required="props.required"
    :color="inputColor"
    :size="props.size"
    :leading-icon="props.leadingIcon"
    :trailing-icon="props.trailingIcon"
    :aria-invalid="props.invalid || undefined"
    :class="inputClass"
  />
</template>
