import type { Ref } from 'vue'

type TUseDragOptions = {
  target: Readonly<Ref<HTMLElement | null | undefined>>
  interactiveElements?: Readonly<Ref<readonly HTMLElement[] | null | undefined>>
  dragThreshold?: number
}

export type TUseDragControls = {
  isDragging: Readonly<Ref<boolean>>
  stop: () => void
}

export function useDrag(options: TUseDragOptions): TUseDragControls {
  const isDragging = ref(false)
  const originalPointerEvents = new Map<HTMLElement, string>()

  let activePointerId: number | undefined
  let currentTarget: HTMLElement | undefined
  let startX = 0
  let initialScrollLeft = 0
  let suppressClick = false
  let suppressClickTimer: ReturnType<typeof setTimeout> | undefined

  const dragThreshold = Math.max(0, options.dragThreshold ?? 3)

  const restoreInteractiveElements = (): void => {
    originalPointerEvents.forEach((pointerEvents, element) => {
      element.style.pointerEvents = pointerEvents
    })
    originalPointerEvents.clear()
  }

  const disableInteractiveElements = (): void => {
    options.interactiveElements?.value?.forEach((element) => {
      if (!originalPointerEvents.has(element)) {
        originalPointerEvents.set(element, element.style.pointerEvents)
      }
      element.style.pointerEvents = 'none'
    })
  }

  const scheduleClickReset = (): void => {
    if (suppressClickTimer) {
      clearTimeout(suppressClickTimer)
    }

    suppressClickTimer = setTimeout(() => {
      suppressClick = false
      suppressClickTimer = undefined
    })
  }

  const stop = (): void => {
    const wasDragging = isDragging.value

    if (
      currentTarget &&
      activePointerId !== undefined &&
      currentTarget.hasPointerCapture(activePointerId)
    ) {
      currentTarget.releasePointerCapture(activePointerId)
    }

    activePointerId = undefined
    isDragging.value = false
    restoreInteractiveElements()

    if (wasDragging) {
      suppressClick = true
      scheduleClickReset()
    }
  }

  const handlePointerDown = (event: PointerEvent): void => {
    if (!event.isPrimary || event.button !== 0) {
      return
    }

    const target = event.currentTarget

    if (!(target instanceof HTMLElement)) {
      return
    }

    activePointerId = event.pointerId
    startX = event.clientX
    initialScrollLeft = target.scrollLeft
    target.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: PointerEvent): void => {
    if (event.pointerId !== activePointerId || !currentTarget) {
      return
    }

    const distance = event.clientX - startX

    if (!isDragging.value && Math.abs(distance) < dragThreshold) {
      return
    }

    if (!isDragging.value) {
      isDragging.value = true
      disableInteractiveElements()
    }

    event.preventDefault()
    currentTarget.scrollLeft = initialScrollLeft - distance
  }

  const handlePointerEnd = (event: PointerEvent): void => {
    if (event.pointerId === activePointerId) {
      stop()
    }
  }

  const handleClick = (event: MouseEvent): void => {
    if (!suppressClick) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    suppressClick = false
  }

  const removeTargetListeners = (): void => {
    if (!currentTarget) {
      return
    }

    stop()
    currentTarget.removeEventListener('pointerdown', handlePointerDown)
    currentTarget.removeEventListener('pointermove', handlePointerMove)
    currentTarget.removeEventListener('pointerup', handlePointerEnd)
    currentTarget.removeEventListener('pointercancel', handlePointerEnd)
    currentTarget.removeEventListener('lostpointercapture', handlePointerEnd)
    currentTarget.removeEventListener('click', handleClick, true)
    currentTarget = undefined
  }

  const addTargetListeners = (target: HTMLElement): void => {
    currentTarget = target
    target.addEventListener('pointerdown', handlePointerDown)
    target.addEventListener('pointermove', handlePointerMove)
    target.addEventListener('pointerup', handlePointerEnd)
    target.addEventListener('pointercancel', handlePointerEnd)
    target.addEventListener('lostpointercapture', handlePointerEnd)
    target.addEventListener('click', handleClick, true)
  }

  watch(
    () => options.target.value,
    (target) => {
      if (!import.meta.client || target === currentTarget) {
        return
      }

      removeTargetListeners()

      if (target) {
        addTargetListeners(target)
      }
    },
    { immediate: true, flush: 'post' }
  )

  onBeforeUnmount(() => {
    removeTargetListeners()

    if (suppressClickTimer) {
      clearTimeout(suppressClickTimer)
    }
  })

  return {
    isDragging: readonly(isDragging),
    stop,
  }
}
