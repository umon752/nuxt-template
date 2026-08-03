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

const props = withDefaults(defineProps<TProps>(), {
  placeholder: '請選擇',
  disabled: false,
  invalid: false,
  size: 'md',
  selectClass: '',
})

const attrs = useAttrs()
const model = defineModel<string | number | undefined>()

const selectItems = computed(() => [...props.options])
const selectClass = computed(() => cn('w-full', attrs.class as ClassValue, props.selectClass))
const selectColor = computed(() => (props.invalid ? 'error' : 'neutral'))
</script>

<template>
  <USelect
    v-bind="attrs"
    v-model="model"
    :items="selectItems"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :color="selectColor"
    :size="props.size"
    :aria-invalid="props.invalid || undefined"
    :class="selectClass"
  />
</template>
