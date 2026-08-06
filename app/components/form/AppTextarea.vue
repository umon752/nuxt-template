<script setup lang="ts">
import type { ClassValue } from 'clsx'

import { cn } from '~/utils/cn'

type TProps = {
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  invalid?: boolean
  size?: 'sm' | 'md' | 'lg'
  rows?: number
  autoresize?: boolean
  maxrows?: number
  fixed?: boolean
  textareaClass?: ClassValue
}

defineOptions({ inheritAttrs: false })

const {
  placeholder = undefined,
  disabled = false,
  readonly = false,
  required = false,
  invalid = false,
  size = 'md',
  rows = 3,
  autoresize = false,
  maxrows = 0,
  fixed = false,
  textareaClass: textareaClassProp = '',
} = defineProps<TProps>()

const attrs = useAttrs()
const model = defineModel<string | undefined>()

const textareaClass = computed(() => cn('w-full', attrs.class as ClassValue, textareaClassProp))
const textareaColor = computed(() => (invalid ? 'error' : 'neutral'))
</script>

<template>
  <UTextarea
    v-bind="attrs"
    v-model="model"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :color="textareaColor"
    :size="size"
    :rows="rows"
    :autoresize="autoresize"
    :maxrows="maxrows"
    :fixed="fixed"
    :aria-invalid="invalid || undefined"
    :class="textareaClass"
  />
</template>
