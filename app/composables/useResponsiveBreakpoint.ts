import type { MaybeRefOrGetter, Ref } from 'vue'

type TUseResponsiveBreakpointOptions = {
  breakpoint: MaybeRefOrGetter<string>
  enabled?: MaybeRefOrGetter<boolean>
}

export type TUseResponsiveBreakpointControls = {
  isDesktop: Readonly<Ref<boolean>>
}

export const useResponsiveBreakpoint = (
  options: TUseResponsiveBreakpointOptions
): TUseResponsiveBreakpointControls => {
  const isDesktop = ref(false)
  const media = computed(() => `(min-width: ${toValue(options.breakpoint)})`)
  let mediaQuery: MediaQueryList | undefined

  const handleChange = (event: MediaQueryListEvent): void => {
    isDesktop.value = event.matches
  }

  const removeListener = (): void => {
    mediaQuery?.removeEventListener('change', handleChange)
    mediaQuery = undefined
  }

  const setup = (): void => {
    removeListener()

    const isEnabled = options.enabled === undefined || toValue(options.enabled)

    if (!import.meta.client || !isEnabled) {
      isDesktop.value = false
      return
    }

    mediaQuery = window.matchMedia(media.value)
    isDesktop.value = mediaQuery.matches
    mediaQuery.addEventListener('change', handleChange)
  }

  watch([media, () => (options.enabled === undefined ? true : toValue(options.enabled))], setup)

  onMounted(setup)
  onBeforeUnmount(removeListener)

  return {
    isDesktop: readonly(isDesktop),
  }
}
