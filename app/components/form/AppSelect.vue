<script setup lang="ts">
import type { ClassValue } from 'clsx'

import { cn } from '~/utils/cn'

export type TAppSelectOption = {
  label: string
  value: string | number
  description?: string
  disabled?: boolean
}

type TProps = {
  options: readonly TAppSelectOption[]
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
  size?: 'sm' | 'md' | 'lg'
  selectClass?: ClassValue
}

defineOptions({ inheritAttrs: false })

const {
  options,
  placeholder = '請選擇',
  disabled = false,
  invalid = false,
  size = 'md',
  selectClass: selectClassProp = '',
} = defineProps<TProps>()

const attrs = useAttrs()
const model = defineModel<string | number | undefined>()

const selectItems = computed(() => [...options])
const selectClass = computed(() => cn('w-full', attrs.class as ClassValue, selectClassProp))
const selectColor = computed(() => (invalid ? 'error' : 'neutral'))
</script>

<template>
  <USelect
    v-bind="attrs"
    v-model="model"
    :items="selectItems"
    :placeholder="placeholder"
    :disabled="disabled"
    :color="selectColor"
    :size="size"
    :aria-invalid="invalid || undefined"
    :class="selectClass"
  />
</template>
