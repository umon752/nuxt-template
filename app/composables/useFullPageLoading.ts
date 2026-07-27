type TFullPageLoadingState = {
  count: number
  label?: string
}

export type TFullPageLoadingControls = {
  isLoading: ComputedRef<boolean>
  label: ComputedRef<string | undefined>
  start: (label?: string) => void
  finish: () => void
  clear: () => void
  withLoading: <T>(task: () => Promise<T>, label?: string) => Promise<T>
}

export const useFullPageLoading = (): TFullPageLoadingControls => {
  const state = useState<TFullPageLoadingState>('full-page-loading', () => ({ count: 0 }))

  const isLoading = computed(() => state.value.count > 0)
  const label = computed(() => state.value.label)

  const start = (nextLabel?: string): void => {
    state.value.count += 1

    if (nextLabel) {
      state.value.label = nextLabel
    }
  }

  const finish = (): void => {
    state.value.count = Math.max(0, state.value.count - 1)

    if (state.value.count === 0) {
      state.value.label = undefined
    }
  }

  const clear = (): void => {
    state.value = { count: 0 }
  }

  const withLoading = async <T>(task: () => Promise<T>, nextLabel?: string): Promise<T> => {
    start(nextLabel)

    try {
      return await task()
    } finally {
      finish()
    }
  }

  return {
    isLoading,
    label,
    start,
    finish,
    clear,
    withLoading,
  }
}
