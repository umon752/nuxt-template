<script setup lang="ts">
import type { ClassValue } from 'clsx'

import { cn } from '~/utils/cn'

export type TAppComboboxOption = {
  label: string
  value: string | number
  description?: string
  disabled?: boolean
}

type TProps = {
  options: readonly TAppComboboxOption[]
  placeholder?: string
  searchPlaceholder?: string
  searchInput?: boolean
  clearable?: boolean
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  size?: 'sm' | 'md' | 'lg'
  comboboxClass?: ClassValue
}

defineOptions({ inheritAttrs: false })

const {
  options,
  placeholder = '請選擇',
  searchPlaceholder = undefined,
  searchInput = true,
  clearable = false,
  disabled = false,
  required = false,
  invalid = false,
  size = 'md',
  comboboxClass: comboboxClassProp = '',
} = defineProps<TProps>()

const attrs = useAttrs()
const model = defineModel<string | number | undefined>()
const { t } = useI18n()

const comboboxItems = computed(() => [...options])
const searchInputConfig = computed(() => {
  if (!searchInput) {
    return false
  }

  return {
    placeholder: searchPlaceholder ?? t('components.combobox.search'),
    variant: 'none' as const,
  }
})
const comboboxClass = computed(() => cn('w-full', attrs.class as ClassValue, comboboxClassProp))
const comboboxColor = computed(() => (invalid ? 'error' : 'neutral'))
</script>

<template>
  <USelectMenu
    v-bind="attrs"
    v-model="model"
    :items="comboboxItems"
    value-key="value"
    label-key="label"
    description-key="description"
    :placeholder="placeholder"
    :search-input="searchInputConfig"
    :clear="clearable"
    :disabled="disabled"
    :required="required"
    :color="comboboxColor"
    :size="size"
    :aria-invalid="invalid || undefined"
    :class="comboboxClass"
  />
</template>
