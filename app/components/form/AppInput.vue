<script setup lang="ts">
import type { ClassValue } from 'clsx'

import IconClose from '~/components/icon/IconClose.vue'
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
  clearable?: boolean
  clearLabel?: string
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
  clearable = false,
  clearLabel: clearLabelProp = undefined,
  inputClass: inputClassProp = '',
} = defineProps<TProps>()

const attrs = useAttrs()
const model = defineModel<string | number | undefined>()
const { t } = useI18n()

const inputClass = computed(() => cn('w-full', attrs.class as ClassValue, inputClassProp))
const inputColor = computed(() => (invalid ? 'error' : 'neutral'))
const hasValue = computed(
  () => model.value !== undefined && model.value !== null && model.value !== ''
)
const shouldShowClearButton = computed(() => clearable && hasValue.value && !disabled && !readonly)
const resolvedClearLabel = computed(() => clearLabelProp || t('components.input.clear'))

const clearInput = (): void => {
  model.value = type === 'number' ? undefined : ''
}
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
    :trailing-icon="clearable ? undefined : trailingIcon"
    :aria-invalid="invalid || undefined"
    :class="inputClass"
  >
    <template v-if="clearable && (trailingIcon || shouldShowClearButton)" #trailing="{ ui }">
      <UIcon
        v-if="trailingIcon"
        :name="trailingIcon"
        data-slot="trailingIcon"
        :class="ui.trailingIcon()"
      />

      <button
        v-if="shouldShowClearButton"
        type="button"
        :aria-label="resolvedClearLabel"
        class="ms-1 inline-flex size-5 items-center justify-center rounded-sm text-slate-500 transition-colors hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-slate-500"
        @mousedown.prevent
        @click="clearInput"
      >
        <IconClose class="size-4" aria-hidden="true" />
      </button>
    </template>
  </UInput>
</template>
