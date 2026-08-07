<script setup lang="ts">
import type { ClassValue } from 'clsx'
import type { CSSProperties } from 'vue'

import { cn } from '~/utils/cn'

export type TOdometerInstance = {
  run: () => void
}

type TDigitColumn = {
  place: number
  digit: number
}

type TProps = {
  value: number
  startValue?: number
  maxCount?: number
  duration?: number
  easing?: string
  autoplay?: boolean
  overflowText?: string
  odometerClass?: ClassValue
}

const {
  value,
  startValue = 0,
  maxCount = 99999,
  duration = 1000,
  easing = 'ease-in-out',
  autoplay = false,
  overflowText = '+',
  odometerClass = '',
} = defineProps<TProps>()

const emit = defineEmits<{
  run: [value: number]
  update: [value: number]
  done: [value: number]
}>()

//----------------------------
// state and derived values
//----------------------------
const digitOptions = Array.from({ length: 10 }, (_, index) => index)
const isMounted = ref(false)
const prefersReducedMotion = ref(false)
const transitionsEnabled = ref(false)
const hasPendingAnimation = ref(false)

const normalizedMaxCount = computed(() => normalizeMaxCount(maxCount))
const normalizedValue = computed(() => normalizeNonNegativeInteger(value))
const normalizedStartValue = computed(() =>
  Math.min(normalizeNonNegativeInteger(startValue), normalizedMaxCount.value)
)
const targetValue = computed(() => Math.min(normalizedValue.value, normalizedMaxCount.value))
const isOverMax = computed(() => normalizedValue.value > normalizedMaxCount.value)
const normalizedDuration = computed(() => normalizeDuration(duration))
const normalizedEasing = computed(() => easing.trim() || 'ease-in-out')
const accessibleValue = computed(() => `${targetValue.value}${isOverMax.value ? overflowText : ''}`)
const odometerClassName = computed(() =>
  cn('inline-flex items-baseline overflow-hidden leading-none tabular-nums', odometerClass)
)
const columns = ref<TDigitColumn[]>(createColumns(normalizedStartValue.value))

let prepareFrame: number | undefined
let animateFrame: number | undefined
let completionTimer: ReturnType<typeof setTimeout> | undefined
let reducedMotionQuery: MediaQueryList | undefined
let animationToken = 0

//----------------------------
// digit and column helpers
//----------------------------
function normalizeNonNegativeInteger(value: number): number {
  return Number.isFinite(value) && Number.isInteger(value) && value >= 0 ? value : 0
}

function normalizeMaxCount(value: number): number {
  return Number.isFinite(value) && Number.isInteger(value) && value > 0 ? value : 99999
}

function normalizeDuration(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 1000
}

function createColumns(value: number): TDigitColumn[] {
  return String(value)
    .split('')
    .reverse()
    .map((digit, place) => ({
      place,
      digit: Number(digit),
    }))
    .reverse()
}

function getDigitAtPlace(value: number, place: number): number {
  const digits = String(value)
  const index = digits.length - place - 1

  return index >= 0 ? Number(digits[index]) : 0
}

function resizeColumnsToTarget(currentColumns: TDigitColumn[], target: number): TDigitColumn[] {
  const targetLength = String(target).length
  const currentDigits = new Map(currentColumns.map((column) => [column.place, column.digit]))

  return Array.from({ length: targetLength }, (_, index) => {
    const place = targetLength - index - 1

    return {
      place,
      digit: currentDigits.get(place) ?? 0,
    }
  })
}

function getTrackStyle(column: TDigitColumn): CSSProperties {
  return {
    transform: `translate3d(0, ${column.digit * -10}%, 0)`,
    transitionDuration: transitionsEnabled.value ? `${normalizedDuration.value}ms` : '0ms',
    transitionTimingFunction: normalizedEasing.value,
  }
}

//----------------------------
// animation lifecycle
//----------------------------
function clearScheduledWork(): void {
  if (prepareFrame !== undefined) {
    cancelAnimationFrame(prepareFrame)
    prepareFrame = undefined
  }

  if (animateFrame !== undefined) {
    cancelAnimationFrame(animateFrame)
    animateFrame = undefined
  }

  if (completionTimer !== undefined) {
    clearTimeout(completionTimer)
    completionTimer = undefined
  }
}

function cancelAnimation(): void {
  animationToken += 1
  clearScheduledWork()
  hasPendingAnimation.value = false
}

function setFinalState(): void {
  transitionsEnabled.value = false
  columns.value = createColumns(targetValue.value)
}

function completeAnimation(token: number): void {
  if (token !== animationToken) {
    return
  }

  clearScheduledWork()
  hasPendingAnimation.value = false
  setFinalState()
  emit('done', targetValue.value)
}

async function animateToTarget(resetToStart: boolean): Promise<void> {
  cancelAnimation()
  const token = animationToken

  if (resetToStart) {
    transitionsEnabled.value = false
    columns.value = resizeColumnsToTarget(
      createColumns(normalizedStartValue.value),
      targetValue.value
    )
  } else {
    transitionsEnabled.value = false
    columns.value = resizeColumnsToTarget(columns.value, targetValue.value)
  }

  hasPendingAnimation.value = true
  await nextTick()

  if (token !== animationToken) {
    return
  }

  if (prefersReducedMotion.value || normalizedDuration.value === 0) {
    completeAnimation(token)
    return
  }

  prepareFrame = requestAnimationFrame(() => {
    prepareFrame = undefined
    animateFrame = requestAnimationFrame(() => {
      animateFrame = undefined

      if (token !== animationToken) {
        return
      }

      transitionsEnabled.value = true
      columns.value = columns.value.map((column) => ({
        place: column.place,
        digit: getDigitAtPlace(targetValue.value, column.place),
      }))
      completionTimer = setTimeout(() => completeAnimation(token), normalizedDuration.value)
    })
  })
}

function run(): void {
  emit('run', targetValue.value)
  void animateToTarget(true)
}

function handleReducedMotionChange(event: MediaQueryListEvent): void {
  prefersReducedMotion.value = event.matches

  if (event.matches && hasPendingAnimation.value) {
    cancelAnimation()
    setFinalState()
    emit('done', targetValue.value)
  }
}

//----------------------------
// watchers and lifecycle
//----------------------------
watch([() => value, () => maxCount], () => {
  if (!isMounted.value) {
    return
  }

  emit('update', targetValue.value)
  void animateToTarget(false)
})

watch(
  () => autoplay,
  (autoplay) => {
    if (isMounted.value && autoplay) {
      run()
    }
  }
)

onMounted(() => {
  isMounted.value = true
  reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = reducedMotionQuery.matches
  reducedMotionQuery.addEventListener('change', handleReducedMotionChange)

  if (autoplay) {
    run()
  }
})

onBeforeUnmount(() => {
  isMounted.value = false
  cancelAnimation()
  reducedMotionQuery?.removeEventListener('change', handleReducedMotionChange)
})

defineExpose<TOdometerInstance>({
  run,
})
</script>

<template>
  <span :class="odometerClassName">
    <span class="inline-flex items-baseline" aria-hidden="true">
      <span
        v-for="column in columns"
        :key="column.place"
        class="inline-block h-[1em] w-[1ch] overflow-hidden leading-none"
      >
        <span
          class="flex flex-col transition-transform [will-change:transform]"
          :style="getTrackStyle(column)"
        >
          <span v-for="digit in digitOptions" :key="digit" class="h-[1em] flex-none leading-none">
            {{ digit }}
          </span>
        </span>
      </span>
      <span v-if="isOverMax">{{ overflowText }}</span>
    </span>
    <span class="sr-only">{{ accessibleValue }}</span>
  </span>
</template>
