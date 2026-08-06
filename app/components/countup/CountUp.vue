<script setup lang="ts">
import type { ClassValue } from 'clsx'

import { useNumberFormat } from '~/composables/useNumberFormat'
import { cn } from '~/utils/cn'

export type TCountUpMode = 'random' | 'sequential'

export type TCountUpInstance = {
  run: () => void
  stop: () => void
  start: () => void
  reset: () => void
  restart: () => void
}

type TCountUpStatus = 'idle' | 'scheduled' | 'running' | 'paused' | 'done'

type TProps = {
  value: number | string
  startValue?: number
  duration?: number
  startTime?: number
  delay?: number
  mode?: TCountUpMode
  thousandComma?: boolean
  autoplay?: boolean
  countUpClass?: ClassValue
}

const {
  value,
  startValue = 0,
  duration = 1000,
  startTime = 0,
  delay = 0,
  mode = 'random',
  thousandComma = false,
  autoplay = false,
  countUpClass = '',
} = defineProps<TProps>()

const emit = defineEmits<{
  run: [value: string]
  stop: [value: string]
  start: [value: string]
  reset: [value: string]
  restart: [value: string]
  done: [value: string]
}>()

const { formatNumber } = useNumberFormat({ locale: 'en-US' })
const status = ref<TCountUpStatus>('idle')
const prefersReducedMotion = ref(false)
const isMounted = ref(false)

const normalizedStartValue = computed(() => (Number.isFinite(startValue) ? startValue : 0))
const normalizedDuration = computed(() => normalizeNonNegative(duration, 1000))
const normalizedStartTime = computed(() => normalizeNonNegative(startTime, 0))
const normalizedDelay = computed(() => normalizeNonNegative(delay, 0))
const sequentialTarget = computed(() => {
  const target = typeof value === 'number' ? value : Number(value)

  return Number.isFinite(target) ? target : undefined
})
const effectiveMode = computed<TCountUpMode>(() =>
  mode === 'sequential' && sequentialTarget.value !== undefined ? 'sequential' : 'random'
)
const targetPrecision = computed(() => getDecimalPlaces(value))
const formatSequentialValue = (value: number): string => {
  const precision = targetPrecision.value
  const zeroThreshold = precision > 0 ? 0.5 * 10 ** -precision : 0.5
  const normalizedValue = Math.abs(value) < zeroThreshold ? 0 : value

  return formatNumber(normalizedValue, {
    useGrouping: thousandComma,
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })
}
const targetText = computed(() => {
  if (effectiveMode.value === 'sequential' && sequentialTarget.value !== undefined) {
    return formatSequentialValue(sequentialTarget.value)
  }

  return String(value)
})
const initialText = computed(() => String(normalizedStartValue.value))
const displayValue = ref(initialText.value)
const countUpClassName = computed(() => cn('inline-block tabular-nums', countUpClass))

let animationFrame: number | undefined
let startDelayTimer: ReturnType<typeof setTimeout> | undefined
let frameStartedAt: number | undefined
let elapsedBeforePause = 0
let lastRenderAt = Number.NEGATIVE_INFINITY
let reducedMotionQuery: MediaQueryList | undefined

function normalizeNonNegative(value: number, fallback: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : fallback
}

function getDecimalPlaces(value: number | string): number {
  const match = String(value)
    .trim()
    .match(/^[+-]?(?:\d+(?:\.(\d*))?|\.(\d+))(?:e([+-]?\d+))?$/i)

  if (!match) {
    return 0
  }

  const fractionLength = (match[1] ?? match[2])?.length ?? 0
  const exponent = Number(match[3] ?? 0)

  return Math.min(20, Math.max(0, fractionLength - exponent))
}

function renderProgress(progress: number): void {
  if (effectiveMode.value === 'sequential' && sequentialTarget.value !== undefined) {
    const nextValue =
      normalizedStartValue.value + (sequentialTarget.value - normalizedStartValue.value) * progress

    displayValue.value = formatSequentialValue(nextValue)
    return
  }

  displayValue.value = Array.from(String(value), (character) =>
    /\d/.test(character) ? Math.floor(Math.random() * 10).toString() : character
  ).join('')
}

function clearAnimationFrame(): void {
  if (animationFrame !== undefined) {
    cancelAnimationFrame(animationFrame)
    animationFrame = undefined
  }
}

function clearStartDelay(): void {
  if (startDelayTimer !== undefined) {
    clearTimeout(startDelayTimer)
    startDelayTimer = undefined
  }
}

function clearScheduledWork(): void {
  clearAnimationFrame()
  clearStartDelay()
  frameStartedAt = undefined
}

function finish(): void {
  clearScheduledWork()
  elapsedBeforePause = normalizedDuration.value
  displayValue.value = targetText.value
  status.value = 'done'
  emit('done', displayValue.value)
}

function renderFrame(timestamp: number): void {
  if (status.value !== 'running' || frameStartedAt === undefined) {
    return
  }

  const elapsed = elapsedBeforePause + Math.max(0, timestamp - frameStartedAt)
  const progress = Math.min(1, elapsed / normalizedDuration.value)

  if (progress >= 1) {
    finish()
    return
  }

  if (timestamp - lastRenderAt >= normalizedDelay.value) {
    renderProgress(progress)
    lastRenderAt = timestamp
  }

  animationFrame = requestAnimationFrame(renderFrame)
}

function startAnimation(): void {
  clearStartDelay()

  if (prefersReducedMotion.value || normalizedDuration.value === 0) {
    finish()
    return
  }

  status.value = 'running'
  frameStartedAt = performance.now()
  lastRenderAt = Number.NEGATIVE_INFINITY
  animationFrame = requestAnimationFrame(renderFrame)
}

function resetState(): void {
  clearScheduledWork()
  elapsedBeforePause = 0
  lastRenderAt = Number.NEGATIVE_INFINITY
  displayValue.value = initialText.value
  status.value = 'idle'
}

function run(): void {
  if (status.value === 'running' || status.value === 'scheduled') {
    return
  }

  if (status.value === 'done') {
    resetState()
  }

  emit('run', displayValue.value)

  if (normalizedStartTime.value > 0 && !prefersReducedMotion.value) {
    status.value = 'scheduled'
    startDelayTimer = setTimeout(startAnimation, normalizedStartTime.value)
    return
  }

  startAnimation()
}

function stop(): void {
  if (status.value !== 'running' && status.value !== 'scheduled') {
    return
  }

  if (status.value === 'running' && frameStartedAt !== undefined) {
    elapsedBeforePause = Math.min(
      normalizedDuration.value,
      elapsedBeforePause + Math.max(0, performance.now() - frameStartedAt)
    )
  }

  clearScheduledWork()
  status.value = 'paused'
  emit('stop', displayValue.value)
}

function start(): void {
  if (status.value === 'running' || status.value === 'scheduled') {
    return
  }

  if (status.value === 'done') {
    resetState()
  }

  emit('start', displayValue.value)
  startAnimation()
}

function reset(): void {
  resetState()
  emit('reset', displayValue.value)
}

function restart(): void {
  resetState()
  emit('restart', displayValue.value)
  run()
}

function handleReducedMotionChange(event: MediaQueryListEvent): void {
  prefersReducedMotion.value = event.matches

  if (
    event.matches &&
    (status.value === 'scheduled' || status.value === 'running' || status.value === 'paused')
  ) {
    finish()
  }
}

watch(
  [
    () => value,
    () => startValue,
    () => duration,
    () => startTime,
    () => delay,
    () => mode,
    () => thousandComma,
  ],
  () => {
    resetState()

    if (isMounted.value && autoplay) {
      run()
    }
  }
)

watch(
  () => autoplay,
  (autoplay) => {
    if (!isMounted.value) {
      return
    }

    if (autoplay) {
      run()
    } else if (status.value === 'running' || status.value === 'scheduled') {
      stop()
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
  clearScheduledWork()
  reducedMotionQuery?.removeEventListener('change', handleReducedMotionChange)
})

defineExpose<TCountUpInstance>({
  run,
  stop,
  start,
  reset,
  restart,
})
</script>

<template>
  <span :class="countUpClassName">
    <span aria-hidden="true">{{ displayValue }}</span>
    <span class="sr-only">{{ targetText }}</span>
  </span>
</template>
