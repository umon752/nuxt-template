<script setup lang="ts">
import type { ClassValue } from 'clsx'
import type { CSSProperties } from 'vue'

import { cn } from '~/utils/cn'

export type TTooltipPlacement = 'top' | 'right' | 'bottom' | 'left'

type TProps = {
  text?: string
  placement?: TTooltipPlacement
  disabled?: boolean
  showDelay?: number
  hideDelay?: number
  tooltipClass?: ClassValue
}

const props = withDefaults(defineProps<TProps>(), {
  text: '',
  placement: 'top',
  disabled: false,
  showDelay: 150,
  hideDelay: 100,
  tooltipClass: '',
})

const emit = defineEmits<{
  show: []
  hide: []
}>()

const slots = defineSlots<{
  default: () => unknown
  content?: () => unknown
}>()

const triggerWrapper = ref<HTMLElement>()
const tooltipElement = ref<HTMLElement>()
const isVisible = ref(false)
const isPositioned = ref(false)
const resolvedPlacement = ref<TTooltipPlacement>(props.placement)
const tooltipPosition = ref({ left: 0, top: 0 })
const instanceId = useId()
const tooltipId = `tooltip-${instanceId}`

const viewportPadding = 8
const tooltipGap = 10
const placementCandidates: Record<TTooltipPlacement, TTooltipPlacement[]> = {
  right: ['right', 'top', 'bottom'],
  left: ['left', 'top', 'bottom'],
  top: ['top', 'bottom'],
  bottom: ['bottom', 'top'],
}
let showTimer: ReturnType<typeof setTimeout> | undefined
let hideTimer: ReturnType<typeof setTimeout> | undefined
let positionFrame: number | undefined

const normalizeDelay = (delay: number): number => {
  return Number.isFinite(delay) ? Math.max(0, delay) : 0
}

const hasContent = computed(() => Boolean(props.text || slots.content))
const tooltipClassName = computed(() =>
  cn(
    'pointer-events-none fixed z-[1090] max-w-72 rounded-md bg-slate-950 px-3 py-2 text-sm leading-5 text-white shadow-lg transition-opacity duration-150 motion-reduce:transition-none',
    isPositioned.value ? 'visible' : 'invisible',
    props.tooltipClass
  )
)
const tooltipStyle = computed<CSSProperties>(() => ({
  left: `${tooltipPosition.value.left}px`,
  top: `${tooltipPosition.value.top}px`,
}))
const arrowClassName = computed(() =>
  cn('absolute size-2 rotate-45 bg-inherit', {
    'bottom-[-0.25rem]': resolvedPlacement.value === 'top',
    'top-[-0.25rem]': resolvedPlacement.value === 'bottom',
    'right-[-0.25rem]': resolvedPlacement.value === 'left',
    'left-[-0.25rem]': resolvedPlacement.value === 'right',
  })
)
const arrowStyle = computed<CSSProperties>(() => {
  const trigger = triggerWrapper.value?.getBoundingClientRect()
  const tooltip = tooltipElement.value?.getBoundingClientRect()
  const position = tooltipPosition.value

  if (!trigger || !tooltip) {
    return {}
  }

  if (resolvedPlacement.value === 'top' || resolvedPlacement.value === 'bottom') {
    const triggerCenter = trigger.left + trigger.width / 2
    const left = Math.min(Math.max(triggerCenter - position.left, 8), tooltip.width - 8)

    return { left: `${left}px`, marginLeft: '-0.25rem' }
  }

  const triggerCenter = trigger.top + trigger.height / 2
  const top = Math.min(Math.max(triggerCenter - position.top, 8), tooltip.height - 8)

  return { top: `${top}px`, marginTop: '-0.25rem' }
})

const getTriggerElement = (): HTMLElement | undefined => {
  const element = triggerWrapper.value?.firstElementChild

  return element instanceof HTMLElement ? element : triggerWrapper.value
}

const addDescribedBy = (): void => {
  const trigger = getTriggerElement()

  if (!trigger) {
    return
  }

  const ids = new Set((trigger.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean))
  ids.add(tooltipId)
  trigger.setAttribute('aria-describedby', [...ids].join(' '))
}

const removeDescribedBy = (): void => {
  const trigger = getTriggerElement()

  if (!trigger) {
    return
  }

  const ids = (trigger.getAttribute('aria-describedby') ?? '')
    .split(/\s+/)
    .filter((id) => id && id !== tooltipId)

  if (ids.length) {
    trigger.setAttribute('aria-describedby', ids.join(' '))
  } else {
    trigger.removeAttribute('aria-describedby')
  }
}

const getCoordinates = (
  placement: TTooltipPlacement,
  trigger: DOMRect,
  tooltip: DOMRect
): { left: number; top: number } => {
  switch (placement) {
    case 'right':
      return {
        left: trigger.right + tooltipGap,
        top: trigger.top + (trigger.height - tooltip.height) / 2,
      }
    case 'bottom':
      return {
        left: trigger.left + (trigger.width - tooltip.width) / 2,
        top: trigger.bottom + tooltipGap,
      }
    case 'left':
      return {
        left: trigger.left - tooltip.width - tooltipGap,
        top: trigger.top + (trigger.height - tooltip.height) / 2,
      }
    case 'top':
    default:
      return {
        left: trigger.left + (trigger.width - tooltip.width) / 2,
        top: trigger.top - tooltip.height - tooltipGap,
      }
  }
}

const fitsPlacement = (
  placement: TTooltipPlacement,
  coordinates: { left: number; top: number },
  tooltip: DOMRect
): boolean => {
  if (placement === 'top') return coordinates.top >= viewportPadding
  if (placement === 'bottom') {
    return coordinates.top + tooltip.height <= window.innerHeight - viewportPadding
  }
  if (placement === 'left') return coordinates.left >= viewportPadding

  return coordinates.left + tooltip.width <= window.innerWidth - viewportPadding
}

const resolvePlacement = (
  preferredPlacement: TTooltipPlacement,
  trigger: DOMRect,
  tooltip: DOMRect
): TTooltipPlacement => {
  return (
    placementCandidates[preferredPlacement].find((placement) => {
      return fitsPlacement(placement, getCoordinates(placement, trigger, tooltip), tooltip)
    }) ?? preferredPlacement
  )
}

const updatePosition = async (): Promise<void> => {
  if (!isVisible.value || !import.meta.client) {
    return
  }

  await nextTick()

  const trigger = triggerWrapper.value?.getBoundingClientRect()
  const tooltip = tooltipElement.value?.getBoundingClientRect()

  if (!trigger || !tooltip) {
    return
  }

  const placement = resolvePlacement(props.placement, trigger, tooltip)
  const coordinates = getCoordinates(placement, trigger, tooltip)

  tooltipPosition.value = {
    left: Math.min(
      Math.max(coordinates.left, viewportPadding),
      window.innerWidth - tooltip.width - viewportPadding
    ),
    top: Math.min(
      Math.max(coordinates.top, viewportPadding),
      window.innerHeight - tooltip.height - viewportPadding
    ),
  }
  resolvedPlacement.value = placement
  isPositioned.value = true
}

const schedulePositionUpdate = (): void => {
  if (positionFrame !== undefined) {
    return
  }

  positionFrame = requestAnimationFrame(() => {
    positionFrame = undefined
    void updatePosition()
  })
}

const addPositionListeners = (): void => {
  window.addEventListener('resize', schedulePositionUpdate)
  window.addEventListener('scroll', schedulePositionUpdate, true)
}

const removePositionListeners = (): void => {
  window.removeEventListener('resize', schedulePositionUpdate)
  window.removeEventListener('scroll', schedulePositionUpdate, true)
}

const clearShowTimer = (): void => {
  if (showTimer !== undefined) {
    clearTimeout(showTimer)
    showTimer = undefined
  }
}

const clearHideTimer = (): void => {
  if (hideTimer !== undefined) {
    clearTimeout(hideTimer)
    hideTimer = undefined
  }
}

const show = async (): Promise<void> => {
  if (isVisible.value || props.disabled || !hasContent.value) {
    return
  }

  isVisible.value = true
  isPositioned.value = false
  addDescribedBy()
  addPositionListeners()
  await updatePosition()
  emit('show')
}

const hide = (): void => {
  if (!isVisible.value) {
    return
  }

  isVisible.value = false
  isPositioned.value = false
  removeDescribedBy()
  removePositionListeners()
  emit('hide')
}

const scheduleShow = (): void => {
  clearHideTimer()
  clearShowTimer()
  showTimer = setTimeout(() => {
    showTimer = undefined
    void show()
  }, normalizeDelay(props.showDelay))
}

const scheduleHide = (): void => {
  clearShowTimer()
  clearHideTimer()
  hideTimer = setTimeout(() => {
    hideTimer = undefined
    hide()
  }, normalizeDelay(props.hideDelay))
}

const handleFocusout = (event: FocusEvent): void => {
  const relatedTarget = event.relatedTarget

  if (relatedTarget instanceof Node && triggerWrapper.value?.contains(relatedTarget)) {
    return
  }

  scheduleHide()
}

const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') {
    clearShowTimer()
    clearHideTimer()
    hide()
  }
}

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) {
      clearShowTimer()
      clearHideTimer()
      hide()
    }
  }
)

watch([() => props.placement, () => props.text], () => {
  if (isVisible.value) {
    isPositioned.value = false
    void updatePosition()
  }
})

onBeforeUnmount(() => {
  clearShowTimer()
  clearHideTimer()
  removeDescribedBy()
  removePositionListeners()

  if (positionFrame !== undefined) {
    cancelAnimationFrame(positionFrame)
  }
})
</script>

<template>
  <span
    ref="triggerWrapper"
    class="inline-flex"
    @mouseenter="scheduleShow"
    @mouseleave="scheduleHide"
    @focusin="scheduleShow"
    @focusout="handleFocusout"
    @keydown="handleKeydown"
  >
    <slot />
  </span>

  <ClientOnly>
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-150 motion-reduce:transition-none"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-100 motion-reduce:transition-none"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isVisible"
          :id="tooltipId"
          ref="tooltipElement"
          role="tooltip"
          :class="tooltipClassName"
          :style="tooltipStyle"
        >
          <slot name="content">{{ text }}</slot>
          <span aria-hidden="true" :class="arrowClassName" :style="arrowStyle" />
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>
