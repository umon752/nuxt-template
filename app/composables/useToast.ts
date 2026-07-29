import type { TToastItem, TToastOptions, TToastUpdate } from '~/types/toast'

export type TToastControls = {
  toasts: ComputedRef<readonly TToastItem[]>
  show: (options: TToastOptions) => string
  update: (id: string, options: TToastUpdate) => void
  hide: (id: string) => void
  remove: (id: string) => void
  clear: () => void
}

const normalizeDuration = (duration: number | undefined): number => {
  if (duration === undefined || !Number.isFinite(duration)) {
    return 3000
  }

  return Math.max(0, duration)
}

const resolveAriaLive = (
  role: TToastOptions['role'],
  ariaLive: TToastOptions['ariaLive']
): NonNullable<TToastOptions['ariaLive']> => {
  if (ariaLive) {
    return ariaLive
  }

  return role === 'status' || role === undefined ? 'polite' : 'assertive'
}

export const useToast = (): TToastControls => {
  const toastsState = useState<TToastItem[]>('toast-items', () => [])
  const toastSequence = useState<number>('toast-sequence', () => 0)
  const toasts = computed<readonly TToastItem[]>(() => toastsState.value)

  const show = (options: TToastOptions): string => {
    toastSequence.value += 1

    const role = options.role ?? 'status'
    const id = `toast-${toastSequence.value}`

    toastsState.value.push({
      id,
      text: options.text,
      autoHide: options.autoHide ?? true,
      duration: normalizeDuration(options.duration),
      role,
      ariaLive: resolveAriaLive(role, options.ariaLive),
      ariaLabel: options.ariaLabel,
      position: options.position ?? 'relative',
      x: options.x,
      y: options.y,
      toastClass: options.toastClass,
      showCloseButton: options.showCloseButton ?? true,
      closeLabel: options.closeLabel,
      visible: true,
    })

    return id
  }

  const update = (id: string, options: TToastUpdate): void => {
    const toast = toastsState.value.find((item) => item.id === id)

    if (!toast) {
      return
    }

    const nextRole = options.role ?? toast.role

    Object.assign(toast, options, {
      role: nextRole,
      ariaLive:
        options.ariaLive ??
        (options.role === undefined ? toast.ariaLive : resolveAriaLive(nextRole, undefined)),
      duration:
        options.duration === undefined ? toast.duration : normalizeDuration(options.duration),
    })
  }

  const hide = (id: string): void => {
    update(id, { visible: false })
  }

  const remove = (id: string): void => {
    toastsState.value = toastsState.value.filter((item) => item.id !== id)
  }

  const clear = (): void => {
    toastsState.value = []
  }

  return {
    toasts,
    show,
    update,
    hide,
    remove,
    clear,
  }
}
