import type { ClassValue } from 'clsx'

export type TToastRole = 'status' | 'alert' | 'alertdialog'

export type TToastAriaLive = 'off' | 'polite' | 'assertive'

export type TToastPosition = 'fixed' | 'absolute' | 'relative'

export type TToastOptions = {
  text: string
  autoHide?: boolean
  duration?: number
  role?: TToastRole
  ariaLive?: TToastAriaLive
  ariaLabel?: string
  position?: TToastPosition
  x?: string
  y?: string
  toastClass?: ClassValue
  showCloseButton?: boolean
  closeLabel?: string
}

export type TToastItem = Required<
  Pick<
    TToastOptions,
    'text' | 'autoHide' | 'duration' | 'role' | 'ariaLive' | 'position' | 'showCloseButton'
  >
> &
  Pick<TToastOptions, 'ariaLabel' | 'x' | 'y' | 'toastClass' | 'closeLabel'> & {
    id: string
    visible: boolean
  }

export type TToastUpdate = Partial<TToastOptions> & {
  visible?: boolean
}
