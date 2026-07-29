let activeModalScrollLocks = 0
let previousBodyOverflow: string | undefined

export type TModalScrollLockControls = {
  lock: () => void
  unlock: () => void
}

export const useModalScrollLock = (): TModalScrollLockControls => {
  let isLocked = false

  const lock = (): void => {
    if (!import.meta.client || isLocked) {
      return
    }

    if (activeModalScrollLocks === 0) {
      previousBodyOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }

    activeModalScrollLocks += 1
    isLocked = true
  }

  const unlock = (): void => {
    if (!import.meta.client || !isLocked) {
      return
    }

    activeModalScrollLocks = Math.max(0, activeModalScrollLocks - 1)
    isLocked = false

    if (activeModalScrollLocks === 0) {
      document.body.style.overflow = previousBodyOverflow ?? ''
      previousBodyOverflow = undefined
    }
  }

  onBeforeUnmount(unlock)

  return {
    lock,
    unlock,
  }
}
