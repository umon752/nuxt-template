import type { Ref } from 'vue'

type TUseGoTopOptions = {
  visibleOffset?: number
}

export type TUseGoTopControls = {
  isVisible: Readonly<Ref<boolean>>
  scrollToTop: () => void
}

export const useGoTop = (options: TUseGoTopOptions = {}): TUseGoTopControls => {
  const { visibleOffset = 100 } = options
  const isVisible = ref(false)

  const updateVisibility = (): void => {
    isVisible.value = window.scrollY > visibleOffset
  }

  const scrollToTop = (): void => {
    if (!import.meta.client) {
      return
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }

  onMounted(() => {
    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', updateVisibility)
  })

  return {
    isVisible: readonly(isVisible),
    scrollToTop,
  }
}
