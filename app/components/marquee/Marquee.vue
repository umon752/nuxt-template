<script setup lang="ts">
import type { ClassValue } from 'clsx'
import type { CSSProperties } from 'vue'

import { cn } from '~/utils/cn'

export type TMarqueeDirection = 'left' | 'right'

export type TMarqueeItem = {
  id: string | number
  title?: string
  [key: string]: unknown
}

type TProps = {
  items: TMarqueeItem[]
  activeIndex: number
  paused: boolean
  speed?: number
  direction?: TMarqueeDirection
  pauseOnHover?: boolean
  draggable?: boolean
  gap?: number
  ariaLabel?: string
  marqueeClass?: ClassValue
  trackClass?: ClassValue
  itemClass?: ClassValue
  activeClass?: ClassValue
}

const props = withDefaults(defineProps<TProps>(), {
  speed: 60,
  direction: 'left',
  pauseOnHover: false,
  draggable: false,
  gap: 0,
  ariaLabel: undefined,
  marqueeClass: '',
  trackClass: '',
  itemClass: '',
  activeClass: '',
})

const { t } = useI18n()

const emit = defineEmits<{
  'update:activeIndex': [index: number]
  'update:paused': [paused: boolean]
  start: []
  stop: []
  prev: [index: number]
  next: [index: number]
  dragStart: []
  dragEnd: []
}>()

defineSlots<{
  item?: (props: {
    item: TMarqueeItem
    index: number
    isActive: boolean
    isClone: boolean
  }) => unknown
  controls?: (props: {
    paused: boolean
    start: () => void
    stop: () => void
    prev: () => void
    next: () => void
  }) => unknown
}>()

const viewportElement = ref<HTMLElement>()
const originalGroupElement = ref<HTMLElement>()
const viewportWidth = ref(0)
const groupWidth = ref(0)
const itemStartPositions = ref<number[]>([])
const itemEndPositions = ref<number[]>([])
const offset = ref(0)
const isHovered = ref(false)
const isFocusWithin = ref(false)
const isDragging = ref(false)
const isNavigating = ref(false)
const prefersReducedMotion = ref(false)
const isPageVisible = ref(true)
const isMounted = ref(false)

const minimumGroupCount = 3
const groupCount = computed(() => {
  if (!groupWidth.value) {
    return minimumGroupCount
  }

  return Math.max(
    minimumGroupCount,
    Math.ceil(viewportWidth.value / groupWidth.value) + minimumGroupCount
  )
})
const normalizedSpeed = computed(() => {
  return Number.isFinite(props.speed) ? Math.max(0, props.speed) : 60
})
const normalizedGap = computed(() => {
  return Number.isFinite(props.gap) ? Math.max(0, props.gap) : 0
})
const normalizedActiveIndex = computed(() => normalizeIndex(props.activeIndex))
const resolvedAriaLabel = computed(() => props.ariaLabel || t('components.marquee.ariaLabel'))
const activeGroupIndex = computed(() => {
  if (!groupWidth.value) {
    return 1
  }

  const boundary = props.direction === 'right' ? viewportWidth.value : 0
  const index = Math.floor((boundary - offset.value) / groupWidth.value) + 1

  return Math.min(groupCount.value, Math.max(1, index))
})
const isTemporarilyPaused = computed(() => {
  return (
    isDragging.value ||
    isNavigating.value ||
    !isPageVisible.value ||
    (props.pauseOnHover && (isHovered.value || isFocusWithin.value))
  )
})
const isEffectivelyPaused = computed(() => {
  return (
    props.paused ||
    prefersReducedMotion.value ||
    isTemporarilyPaused.value ||
    !props.items.length ||
    !groupWidth.value ||
    normalizedSpeed.value === 0
  )
})
const marqueeClassName = computed(() =>
  cn(
    'w-full overflow-hidden',
    props.draggable && 'touch-pan-y select-none',
    props.draggable && (isDragging.value ? 'cursor-grabbing' : 'cursor-grab'),
    props.marqueeClass
  )
)
const trackClassName = computed(() =>
  cn(
    'flex w-max will-change-transform',
    isNavigating.value &&
      !prefersReducedMotion.value &&
      'transition-transform duration-300 ease-out',
    props.trackClass
  )
)
const trackStyle = computed<CSSProperties>(() => ({
  transform: `translate3d(${offset.value}px, 0, 0)`,
}))
const groupStyle = computed<CSSProperties>(() => ({
  columnGap: `${normalizedGap.value}px`,
  paddingRight: `${normalizedGap.value}px`,
}))

let animationFrame: number | undefined
let lastFrameTime: number | undefined
let resizeObserver: ResizeObserver | undefined
let reducedMotionQuery: MediaQueryList | undefined
let navigationFrame: number | undefined
let navigationTimer: ReturnType<typeof setTimeout> | undefined
let dragPointerId: number | undefined
let dragStartX = 0
let dragStartOffset = 0
let hasDragged = false
let lastDetectedActiveIndex = 0
let pendingActiveIndex: number | undefined

function normalizeIndex(index: number): number {
  if (!props.items.length || !Number.isFinite(index)) {
    return 0
  }

  const integerIndex = Math.trunc(index)

  return ((integerIndex % props.items.length) + props.items.length) % props.items.length
}

function isActiveItem(groupIndex: number, itemIndex: number): boolean {
  return groupIndex === activeGroupIndex.value && itemIndex === normalizedActiveIndex.value
}

function normalizeOffset(value: number): number {
  const width = groupWidth.value

  if (!width) {
    return value
  }

  let normalizedValue = value

  while (normalizedValue < -2 * width) {
    normalizedValue += width
  }

  while (normalizedValue >= -width) {
    normalizedValue -= width
  }

  return normalizedValue
}

function getItemOffset(index: number): number {
  const normalizedIndex = normalizeIndex(index)

  if (props.direction === 'right') {
    return viewportWidth.value - (itemEndPositions.value[normalizedIndex] ?? 0)
  }

  return -(itemStartPositions.value[normalizedIndex] ?? 0)
}

function getActiveIndexFromOffset(): number {
  if (!groupWidth.value || !itemStartPositions.value.length) {
    return 0
  }

  const boundary = props.direction === 'right' ? viewportWidth.value : 0
  const progress =
    (((boundary - offset.value - groupWidth.value) % groupWidth.value) + groupWidth.value) %
    groupWidth.value
  let activeIndex = 0

  itemStartPositions.value.forEach((itemStart, index) => {
    if (progress >= itemStart) {
      activeIndex = index
    }
  })

  return activeIndex
}

function updateActiveIndex(): void {
  const nextActiveIndex = getActiveIndexFromOffset()

  if (nextActiveIndex === lastDetectedActiveIndex) {
    return
  }

  lastDetectedActiveIndex = nextActiveIndex
  pendingActiveIndex = nextActiveIndex
  emit('update:activeIndex', nextActiveIndex)
}

function stopAnimation(): void {
  if (animationFrame !== undefined) {
    cancelAnimationFrame(animationFrame)
    animationFrame = undefined
  }

  lastFrameTime = undefined
}

function animate(timestamp: number): void {
  if (isEffectivelyPaused.value) {
    stopAnimation()
    return
  }

  if (lastFrameTime === undefined) {
    lastFrameTime = timestamp
  }

  const elapsedSeconds = Math.min((timestamp - lastFrameTime) / 1000, 0.1)
  const distance = normalizedSpeed.value * elapsedSeconds
  lastFrameTime = timestamp
  offset.value = normalizeOffset(offset.value + (props.direction === 'left' ? -distance : distance))
  updateActiveIndex()
  animationFrame = requestAnimationFrame(animate)
}

function startAnimation(): void {
  if (animationFrame !== undefined || isEffectivelyPaused.value) {
    return
  }

  lastFrameTime = undefined
  animationFrame = requestAnimationFrame(animate)
}

function measure(resetPosition = false): void {
  const viewport = viewportElement.value
  const group = originalGroupElement.value

  if (!viewport || !group) {
    return
  }

  const nextViewportWidth = viewport.getBoundingClientRect().width
  const groupRect = group.getBoundingClientRect()
  const nextGroupWidth = groupRect.width
  const widthChanged = Math.abs(nextGroupWidth - groupWidth.value) > 0.5

  viewportWidth.value = nextViewportWidth
  groupWidth.value = nextGroupWidth
  itemStartPositions.value = Array.from(group.children).map((child) => {
    return child.getBoundingClientRect().left - groupRect.left
  })
  itemEndPositions.value = Array.from(group.children).map((child) => {
    return child.getBoundingClientRect().right - groupRect.left
  })

  if (nextGroupWidth && (resetPosition || widthChanged)) {
    const activeIndex = normalizedActiveIndex.value
    offset.value = normalizeOffset(-nextGroupWidth + getItemOffset(activeIndex))
    lastDetectedActiveIndex = activeIndex
  }

  if (!isEffectivelyPaused.value) {
    startAnimation()
  }
}

function clearNavigation(): void {
  if (navigationFrame !== undefined) {
    cancelAnimationFrame(navigationFrame)
    navigationFrame = undefined
  }

  if (navigationTimer !== undefined) {
    clearTimeout(navigationTimer)
    navigationTimer = undefined
  }
}

function navigateToIndex(index: number): void {
  if (!groupWidth.value || !props.items.length) {
    return
  }

  clearNavigation()

  const normalizedIndex = normalizeIndex(index)
  const baseTarget = -groupWidth.value + getItemOffset(normalizedIndex)
  const candidates = [baseTarget - groupWidth.value, baseTarget, baseTarget + groupWidth.value]
  const target = candidates.reduce((nearest, candidate) => {
    return Math.abs(candidate - offset.value) < Math.abs(nearest - offset.value)
      ? candidate
      : nearest
  })

  isNavigating.value = true
  stopAnimation()
  lastDetectedActiveIndex = normalizedIndex

  if (prefersReducedMotion.value) {
    offset.value = normalizeOffset(target)
    isNavigating.value = false
    return
  }

  navigationFrame = requestAnimationFrame(() => {
    navigationFrame = undefined
    offset.value = target
  })
  navigationTimer = setTimeout(() => {
    navigationTimer = undefined
    offset.value = normalizeOffset(target)
    isNavigating.value = false
  }, 320)
}

function requestStart(): void {
  emit('update:paused', false)
}

function requestStop(): void {
  emit('update:paused', true)
}

function requestPrev(): void {
  const nextIndex = normalizeIndex(normalizedActiveIndex.value - 1)

  emit('update:activeIndex', nextIndex)
  emit('prev', nextIndex)
}

function requestNext(): void {
  const nextIndex = normalizeIndex(normalizedActiveIndex.value + 1)

  emit('update:activeIndex', nextIndex)
  emit('next', nextIndex)
}

function handlePointerdown(event: PointerEvent): void {
  if (!props.draggable || (event.pointerType === 'mouse' && event.button !== 0)) {
    return
  }

  dragPointerId = event.pointerId
  dragStartX = event.clientX
  dragStartOffset = offset.value
  hasDragged = false
  isDragging.value = true
  viewportElement.value?.setPointerCapture(event.pointerId)
  emit('dragStart')
}

function handlePointermove(event: PointerEvent): void {
  if (!isDragging.value || event.pointerId !== dragPointerId) {
    return
  }

  const distance = event.clientX - dragStartX

  if (Math.abs(distance) > 3) {
    hasDragged = true
  }

  offset.value = normalizeOffset(dragStartOffset + distance)
  updateActiveIndex()

  if (hasDragged) {
    event.preventDefault()
  }
}

function finishDrag(event: PointerEvent): void {
  if (!isDragging.value || event.pointerId !== dragPointerId) {
    return
  }

  if (viewportElement.value?.hasPointerCapture(event.pointerId)) {
    viewportElement.value.releasePointerCapture(event.pointerId)
  }

  dragPointerId = undefined
  isDragging.value = false
  emit('dragEnd')
}

function handleClickCapture(event: MouseEvent): void {
  if (!hasDragged) {
    return
  }

  event.preventDefault()
  event.stopPropagation()
  hasDragged = false
}

function handleFocusout(event: FocusEvent): void {
  const relatedTarget = event.relatedTarget

  if (relatedTarget instanceof Node && viewportElement.value?.contains(relatedTarget)) {
    return
  }

  isFocusWithin.value = false
}

function handleReducedMotionChange(event: MediaQueryListEvent): void {
  prefersReducedMotion.value = event.matches
}

function handleVisibilityChange(): void {
  isPageVisible.value = document.visibilityState === 'visible'
}

watch(isEffectivelyPaused, (paused, wasPaused) => {
  if (!isMounted.value || paused === wasPaused) {
    return
  }

  if (paused) {
    stopAnimation()
    emit('stop')
  } else {
    startAnimation()
    emit('start')
  }
})

watch(
  () => props.activeIndex,
  (activeIndex) => {
    const normalizedIndex = normalizeIndex(activeIndex)

    if (pendingActiveIndex === normalizedIndex) {
      pendingActiveIndex = undefined
      return
    }

    if (normalizedIndex !== lastDetectedActiveIndex) {
      navigateToIndex(normalizedIndex)
    }
  }
)

watch(
  () => props.items.map((item) => item.id),
  async () => {
    await nextTick()
    measure(true)
  }
)

watch([() => props.gap, () => props.direction], async () => {
  await nextTick()
  measure()
})

onMounted(async () => {
  isMounted.value = true
  isPageVisible.value = document.visibilityState === 'visible'
  reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = reducedMotionQuery.matches
  reducedMotionQuery.addEventListener('change', handleReducedMotionChange)
  document.addEventListener('visibilitychange', handleVisibilityChange)

  resizeObserver = new ResizeObserver(() => measure())

  if (viewportElement.value) {
    resizeObserver.observe(viewportElement.value)
  }

  if (originalGroupElement.value) {
    resizeObserver.observe(originalGroupElement.value)
  }

  await nextTick()
  measure(true)

  if (!isEffectivelyPaused.value) {
    startAnimation()
    emit('start')
  }
})

onBeforeUnmount(() => {
  isMounted.value = false
  stopAnimation()
  clearNavigation()
  resizeObserver?.disconnect()
  reducedMotionQuery?.removeEventListener('change', handleReducedMotionChange)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <div
    ref="viewportElement"
    role="region"
    :aria-label="resolvedAriaLabel"
    :class="marqueeClassName"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @focusin="isFocusWithin = true"
    @focusout="handleFocusout"
    @pointerdown="handlePointerdown"
    @pointermove="handlePointermove"
    @pointerup="finishDrag"
    @pointercancel="finishDrag"
    @click.capture="handleClickCapture"
  >
    <div :class="trackClassName" :style="trackStyle">
      <div
        v-for="groupIndex in groupCount"
        :key="groupIndex"
        :ref="
          groupIndex === 1
            ? (element) => (originalGroupElement = element as HTMLElement)
            : undefined
        "
        class="flex shrink-0"
        :style="groupStyle"
        :aria-hidden="groupIndex > 1 ? true : undefined"
        :inert="groupIndex > 1"
      >
        <div
          v-for="(item, index) in items"
          :key="`${groupIndex}-${item.id}`"
          :class="cn('shrink-0', itemClass, isActiveItem(groupIndex, index) && activeClass)"
        >
          <slot
            name="item"
            :item="item"
            :index="index"
            :is-active="isActiveItem(groupIndex, index)"
            :is-clone="groupIndex > 1"
          >
            {{ item.title }}
          </slot>
        </div>
      </div>
    </div>
  </div>

  <slot
    name="controls"
    :paused="paused"
    :start="requestStart"
    :stop="requestStop"
    :prev="requestPrev"
    :next="requestNext"
  />
</template>
