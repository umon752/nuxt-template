import type { MaybeRefOrGetter, Ref } from 'vue'

type TUseLazyLoadObserverOptions = {
  target: Readonly<Ref<Element | null | undefined>>
  rootMargin: MaybeRefOrGetter<string>
  threshold: MaybeRefOrGetter<number>
}

export type TUseLazyLoadObserverControls = {
  isActivated: Readonly<Ref<boolean>>
  activate: () => void
}

export const useLazyLoadObserver = (
  options: TUseLazyLoadObserverOptions
): TUseLazyLoadObserverControls => {
  const isActivated = ref(false)
  let observer: IntersectionObserver | undefined

  const disconnect = (): void => {
    observer?.disconnect()
    observer = undefined
  }

  const activate = (): void => {
    if (isActivated.value) {
      return
    }

    isActivated.value = true
    disconnect()
  }

  const observe = (): void => {
    disconnect()

    if (!import.meta.client || isActivated.value) {
      return
    }

    const target = options.target.value

    if (!target) {
      return
    }

    if (!('IntersectionObserver' in window)) {
      activate()
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]

        if (entry?.isIntersecting) {
          activate()
        }
      },
      {
        rootMargin: toValue(options.rootMargin),
        threshold: toValue(options.threshold),
      }
    )
    observer.observe(target)
  }

  watch([() => toValue(options.rootMargin), () => toValue(options.threshold)], observe, {
    flush: 'post',
  })

  onMounted(observe)
  onBeforeUnmount(disconnect)

  return {
    isActivated: readonly(isActivated),
    activate,
  }
}
