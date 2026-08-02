import type { Ref } from 'vue'

export type TObserverFadeType = 'in' | 'up'

export type TObserverFadeTiming = {
  duration?: number
  easing?: string
  fill?: FillMode
  delay?: number
  iterations?: number
  direction?: PlaybackDirection
}

type TUseObserverFadeOptions = {
  container?: Readonly<Ref<HTMLElement | null | undefined>>
  selector?: string
  defaultDuration?: number
  defaultEasing?: string
  defaultFill?: FillMode
  rootMargin?: string
  threshold?: number | readonly number[]
  observeMutations?: boolean
}

export type TUseObserverFadeControls = {
  isActive: Readonly<Ref<boolean>>
  observedCount: Readonly<Ref<number>>
  start: () => void
  refresh: () => void
  stop: () => void
}

type TObserverFadeState = {
  animation?: Animation
  observer?: IntersectionObserver
}

const OBSERVER_FADE_INITIALIZED_ATTRIBUTE = 'data-fade-initialized'
const DEFAULT_SELECTOR = '[data-fade]'
const FILL_MODES: readonly FillMode[] = ['none', 'forwards', 'backwards', 'both', 'auto']
const PLAYBACK_DIRECTIONS: readonly PlaybackDirection[] = [
  'normal',
  'reverse',
  'alternate',
  'alternate-reverse',
]

export function useObserverFade(options: TUseObserverFadeOptions = {}): TUseObserverFadeControls {
  const isActive = ref(false)
  const observedCount = ref(0)
  const elementStates = new Map<HTMLElement, TObserverFadeState>()

  const selector = options.selector?.trim() || DEFAULT_SELECTOR
  const defaultDuration = normalizeNonNegativeNumber(options.defaultDuration, 500)
  const defaultEasing = options.defaultEasing?.trim() || 'ease'
  const defaultFill = isFillMode(options.defaultFill) ? options.defaultFill : 'both'
  const rootMargin = options.rootMargin?.trim() || '0px'
  const threshold = normalizeThreshold(options.threshold)
  const observeMutations = options.observeMutations ?? true

  let currentContainer: HTMLElement | undefined
  let mutationObserver: MutationObserver | undefined
  let reducedMotionQuery: MediaQueryList | undefined

  const warn = (message: string, element?: HTMLElement): void => {
    if (import.meta.dev) {
      console.warn(`[useObserverFade] ${message}`, element)
    }
  }

  const updateObservedCount = (): void => {
    observedCount.value = elementStates.size
  }

  const revealElement = (element: HTMLElement, animation?: Animation): void => {
    animation?.cancel()
    element.setAttribute(OBSERVER_FADE_INITIALIZED_ATTRIBUTE, '')
  }

  const disposeElement = (element: HTMLElement, reveal: boolean): void => {
    const state = elementStates.get(element)

    if (!state) {
      return
    }

    state.observer?.disconnect()

    if (reveal) {
      revealElement(element, state.animation)
    } else {
      state.animation?.cancel()
    }

    elementStates.delete(element)
    updateObservedCount()
  }

  const getFadeType = (element: HTMLElement): TObserverFadeType => {
    const value = element.dataset.fade?.trim() || 'in'

    if (value === 'in' || value === 'up') {
      return value
    }

    warn(`不支援 data-fade="${value}"，已改用 "in"。`, element)
    return 'in'
  }

  const getFadeOnce = (element: HTMLElement): boolean => {
    const value = element.dataset.fadeOnce?.trim()

    if (value === undefined || value === '' || value === 'true') {
      return true
    }

    if (value === 'false') {
      return false
    }

    warn(`data-fade-once="${value}" 無效，已改用 true。`, element)
    return true
  }

  const getFadeTiming = (element: HTMLElement): KeyframeAnimationOptions => {
    const timing: KeyframeAnimationOptions = {
      duration: defaultDuration,
      easing: defaultEasing,
      fill: defaultFill,
    }
    const value = element.dataset.fadeTiming?.trim()

    if (!value) {
      return timing
    }

    let parsedValue: unknown

    try {
      parsedValue = JSON.parse(value)
    } catch {
      warn('data-fade-timing 必須是有效的 JSON，已改用預設 timing。', element)
      return timing
    }

    if (!isRecord(parsedValue)) {
      warn('data-fade-timing 必須是 JSON object，已改用預設 timing。', element)
      return timing
    }

    if (parsedValue.duration !== undefined) {
      timing.duration = normalizeTimingNumber(
        parsedValue.duration,
        'duration',
        defaultDuration,
        element
      )
    }

    if (parsedValue.delay !== undefined) {
      timing.delay = normalizeTimingNumber(parsedValue.delay, 'delay', 0, element)
    }

    if (parsedValue.iterations !== undefined) {
      timing.iterations = normalizeTimingNumber(parsedValue.iterations, 'iterations', 1, element)
    }

    if (typeof parsedValue.easing === 'string' && parsedValue.easing.trim()) {
      timing.easing = parsedValue.easing.trim()
    } else if (parsedValue.easing !== undefined) {
      warn('data-fade-timing.easing 必須是非空字串，已改用預設值。', element)
    }

    if (isFillMode(parsedValue.fill)) {
      timing.fill = parsedValue.fill
    } else if (parsedValue.fill !== undefined) {
      warn('data-fade-timing.fill 無效，已改用預設值。', element)
    }

    if (isPlaybackDirection(parsedValue.direction)) {
      timing.direction = parsedValue.direction
    } else if (parsedValue.direction !== undefined) {
      warn('data-fade-timing.direction 無效，已改用預設值。', element)
    }

    return timing
  }

  const createAnimation = (element: HTMLElement, type: TObserverFadeType): Animation => {
    const keyframes: Keyframe[] =
      type === 'up'
        ? [
            { opacity: 0, transform: 'translateY(20%)' },
            { opacity: 1, transform: 'translateY(0)' },
          ]
        : [{ opacity: 0 }, { opacity: 1 }]
    const animation = element.animate(keyframes, getFadeTiming(element))

    animation.pause()
    animation.currentTime = 0

    return animation
  }

  const observeElement = (element: HTMLElement): void => {
    if (elementStates.has(element)) {
      return
    }

    if (
      reducedMotionQuery?.matches ||
      !('IntersectionObserver' in window) ||
      typeof element.animate !== 'function'
    ) {
      revealElement(element)
      elementStates.set(element, {})
      updateObservedCount()
      return
    }

    const type = getFadeType(element)
    const once = getFadeOnce(element)
    let animation: Animation

    try {
      animation = createAnimation(element, type)
    } catch {
      warn('瀏覽器無法建立動畫，元素已直接顯示。', element)
      revealElement(element)
      elementStates.set(element, {})
      updateObservedCount()
      return
    }

    const state: TObserverFadeState = { animation }

    try {
      state.observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animation.play()

              if (once) {
                observer.unobserve(element)
              }

              return
            }

            if (!once) {
              animation.pause()
              animation.currentTime = 0
            }
          })
        },
        { rootMargin, threshold }
      )
      state.observer.observe(element)
      elementStates.set(element, state)
      element.setAttribute(OBSERVER_FADE_INITIALIZED_ATTRIBUTE, '')
      updateObservedCount()
    } catch {
      animation.cancel()
      warn('IntersectionObserver 設定無效，元素已直接顯示。', element)
      revealElement(element)
      elementStates.set(element, {})
      updateObservedCount()
    }
  }

  const visitMatchingElements = (root: Element, callback: (element: HTMLElement) => void): void => {
    try {
      if (root instanceof HTMLElement && root.matches(selector)) {
        callback(root)
      }

      root.querySelectorAll(selector).forEach((element) => {
        if (element instanceof HTMLElement) {
          callback(element)
        }
      })
    } catch {
      warn(`selector「${selector}」無效，無法尋找 fade 元素。`)
    }
  }

  const refresh = (): void => {
    if (!import.meta.client || !isActive.value || !currentContainer) {
      return
    }

    visitMatchingElements(currentContainer, observeElement)
  }

  const handleMutations = (records: MutationRecord[]): void => {
    records.forEach((record) => {
      record.removedNodes.forEach((node) => {
        if (node instanceof Element) {
          visitMatchingElements(node, (element) => disposeElement(element, false))
        }
      })

      record.addedNodes.forEach((node) => {
        if (node instanceof Element) {
          visitMatchingElements(node, observeElement)
        }
      })
    })
  }

  const resetForMotionPreference = (): void => {
    const elements = [...elementStates.keys()]

    elements.forEach((element) => disposeElement(element, true))
    refresh()
  }

  const stop = (): void => {
    mutationObserver?.disconnect()
    mutationObserver = undefined
    reducedMotionQuery?.removeEventListener('change', resetForMotionPreference)
    reducedMotionQuery = undefined
    ;[...elementStates.keys()].forEach((element) => disposeElement(element, true))

    currentContainer = undefined
    isActive.value = false
  }

  const start = (): void => {
    if (!import.meta.client) {
      return
    }

    const nextContainer = options.container ? options.container.value : document.body

    if (!nextContainer) {
      stop()
      return
    }

    if (isActive.value && currentContainer === nextContainer) {
      refresh()
      return
    }

    stop()
    currentContainer = nextContainer
    isActive.value = true

    if ('matchMedia' in window) {
      reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      reducedMotionQuery.addEventListener('change', resetForMotionPreference)
    }

    refresh()

    if (observeMutations && 'MutationObserver' in window) {
      mutationObserver = new MutationObserver(handleMutations)
      mutationObserver.observe(nextContainer, { childList: true, subtree: true })
    }
  }

  watch(
    () => options.container?.value,
    (container, previousContainer) => {
      if (!import.meta.client || container === previousContainer) {
        return
      }

      start()
    },
    { flush: 'post' }
  )

  onMounted(start)
  onBeforeUnmount(stop)

  return {
    isActive: readonly(isActive),
    observedCount: readonly(observedCount),
    start,
    refresh,
    stop,
  }

  function normalizeTimingNumber(
    value: unknown,
    key: 'duration' | 'delay' | 'iterations',
    fallback: number,
    element: HTMLElement
  ): number {
    if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
      return value
    }

    warn(`data-fade-timing.${key} 必須是大於或等於 0 的有限數值，已改用預設值。`, element)
    return fallback
  }
}

function normalizeNonNegativeNumber(value: number | undefined, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, value) : fallback
}

function normalizeThreshold(value: number | readonly number[] | undefined): number | number[] {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeThresholdValue(item))
  }

  return normalizeThresholdValue(typeof value === 'number' ? value : 0)
}

function normalizeThresholdValue(value: number): number {
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isFillMode(value: unknown): value is FillMode {
  return typeof value === 'string' && FILL_MODES.includes(value as FillMode)
}

function isPlaybackDirection(value: unknown): value is PlaybackDirection {
  return typeof value === 'string' && PLAYBACK_DIRECTIONS.includes(value as PlaybackDirection)
}
