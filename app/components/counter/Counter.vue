<script setup lang="ts">
import type { ClassValue } from 'clsx'

import { cn } from '~/utils/cn'

export type TCounterChangeSource = 'decrement' | 'increment' | 'input'

type TProps = {
  modelValue: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  editable?: boolean
  ariaLabel?: string
  valueLabel?: string
  decrementLabel?: string
  incrementLabel?: string
  counterClass?: ClassValue
  buttonClass?: ClassValue
  valueClass?: ClassValue
  inputClass?: ClassValue
  disabledClass?: ClassValue
}

const {
  modelValue,
  min = 0,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  disabled = false,
  editable = false,
  ariaLabel = undefined,
  valueLabel = undefined,
  decrementLabel = undefined,
  incrementLabel = undefined,
  counterClass = '',
  buttonClass = '',
  valueClass = '',
  inputClass = '',
  disabledClass = '',
} = defineProps<TProps>()

//----------------------------
// state and events
//----------------------------
const { t } = useI18n()

const emit = defineEmits<{
  'update:modelValue': [value: number]
  decrement: [value: number]
  increment: [value: number]
  change: [value: number, source: TCounterChangeSource]
}>()

defineSlots<{
  decrement?: (props: { disabled: boolean; decrement: () => void }) => unknown
  value?: (props: { value: number }) => unknown
  increment?: (props: { disabled: boolean; increment: () => void }) => unknown
}>()

//----------------------------
// normalized values
//----------------------------
const normalizedMin = computed(() => {
  return Number.isFinite(min) ? min : 0
})

const normalizedMax = computed(() => {
  if (!Number.isFinite(max)) {
    return Number.POSITIVE_INFINITY
  }

  return Math.max(max, normalizedMin.value)
})

const normalizedStep = computed(() => {
  return Number.isFinite(step) && step > 0 ? step : 1
})

const clampValue = (value: number): number => {
  const finiteValue = Number.isFinite(value) ? value : normalizedMin.value

  return Math.min(normalizedMax.value, Math.max(normalizedMin.value, finiteValue))
}

const currentValue = computed(() => clampValue(modelValue))
const canDecrement = computed(() => !disabled && currentValue.value > normalizedMin.value)
const canIncrement = computed(() => !disabled && currentValue.value < normalizedMax.value)
const resolvedAriaLabel = computed(() => ariaLabel || t('components.counter.ariaLabel'))
const resolvedValueLabel = computed(() => valueLabel || t('components.counter.valueLabel'))
const resolvedDecrementLabel = computed(
  () => decrementLabel || t('components.counter.decrementLabel')
)
const resolvedIncrementLabel = computed(
  () => incrementLabel || t('components.counter.incrementLabel')
)

//----------------------------
// labels and classes
//----------------------------
const counterClassName = computed(() => cn('inline-flex items-center gap-2', counterClass))
const buttonClassName = computed(() =>
  cn(
    'inline-flex size-10 items-center justify-center rounded-md border border-slate-300 bg-white text-lg font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400',
    buttonClass
  )
)
const valueClassName = computed(() =>
  cn(
    'inline-flex min-h-10 min-w-14 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-center font-medium text-slate-900',
    valueClass
  )
)
const inputClassName = computed(() =>
  cn(
    'min-h-10 w-20 rounded-md border border-slate-300 bg-white px-3 text-center font-medium text-slate-900 focus:border-slate-500 focus:outline-2 focus:outline-offset-2 focus:outline-slate-500 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400',
    inputClass
  )
)

//----------------------------
// value updates and actions
//----------------------------
const normalizeStepResult = (value: number): number => {
  return Number(value.toFixed(10))
}

const getButtonClass = (isDisabled: boolean): string => {
  return cn(buttonClassName.value, isDisabled && disabledClass)
}

const updateValue = (value: number, source: TCounterChangeSource): void => {
  const nextValue = clampValue(normalizeStepResult(value))

  if (nextValue === currentValue.value) {
    return
  }

  emit('update:modelValue', nextValue)

  if (source === 'decrement') {
    emit('decrement', nextValue)
  } else if (source === 'increment') {
    emit('increment', nextValue)
  }

  emit('change', nextValue, source)
}

const decrement = (): void => {
  if (!canDecrement.value) {
    return
  }

  updateValue(currentValue.value - normalizedStep.value, 'decrement')
}

const increment = (): void => {
  if (!canIncrement.value) {
    return
  }

  updateValue(currentValue.value + normalizedStep.value, 'increment')
}

const handleInput = (event: Event): void => {
  const input = event.currentTarget

  if (!(input instanceof HTMLInputElement) || input.value === '') {
    return
  }

  const inputValue = input.valueAsNumber

  if (!Number.isFinite(inputValue)) {
    return
  }

  const nextValue = clampValue(inputValue)
  input.value = nextValue.toString()
  updateValue(nextValue, 'input')
}

const restoreInputValue = (event: Event): void => {
  const input = event.currentTarget

  if (!(input instanceof HTMLInputElement)) {
    return
  }

  input.value = currentValue.value.toString()
}
</script>

<template>
  <div role="group" :aria-label="resolvedAriaLabel" :class="counterClassName">
    <button
      type="button"
      :class="getButtonClass(!canDecrement)"
      :disabled="!canDecrement"
      :aria-label="resolvedDecrementLabel"
      @click="decrement"
    >
      <slot name="decrement" :disabled="!canDecrement" :decrement="decrement">
        <span aria-hidden="true">−</span>
      </slot>
    </button>

    <input
      v-if="editable"
      type="number"
      inputmode="decimal"
      :class="inputClassName"
      :value="currentValue"
      :min="normalizedMin"
      :max="Number.isFinite(normalizedMax) ? normalizedMax : undefined"
      :step="normalizedStep"
      :disabled="disabled"
      :aria-label="resolvedValueLabel"
      @input="handleInput"
      @change="restoreInputValue"
      @blur="restoreInputValue"
    />

    <output v-else :class="valueClassName" aria-live="polite">
      <slot name="value" :value="currentValue">
        {{ currentValue }}
      </slot>
    </output>

    <button
      type="button"
      :class="getButtonClass(!canIncrement)"
      :disabled="!canIncrement"
      :aria-label="resolvedIncrementLabel"
      @click="increment"
    >
      <slot name="increment" :disabled="!canIncrement" :increment="increment">
        <span aria-hidden="true">+</span>
      </slot>
    </button>
  </div>
</template>
