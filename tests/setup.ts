import { enableAutoUnmount } from '@vue/test-utils'
import { afterEach, beforeEach, vi } from 'vitest'

import { TestIntersectionObserver } from './utils/dom'

enableAutoUnmount(afterEach)

const createMatchMedia = (query: string): MediaQueryList => {
  const listeners = new Set<(event: MediaQueryListEvent) => void>()

  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: (listener) => listeners.add(listener),
    removeListener: (listener) => listeners.delete(listener),
    addEventListener: (_type, listener) => {
      if (typeof listener === 'function') {
        listeners.add(listener)
      }
    },
    removeEventListener: (_type, listener) => {
      if (typeof listener === 'function') {
        listeners.delete(listener)
      }
    },
    dispatchEvent: (event) => {
      listeners.forEach((listener) => listener(event as MediaQueryListEvent))
      return true
    },
  } as MediaQueryList
}

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: createMatchMedia,
  })

  window.scrollTo = vi.fn()
  HTMLElement.prototype.scrollIntoView = vi.fn()
  HTMLElement.prototype.scrollTo = vi.fn()

  if (typeof HTMLDialogElement !== 'undefined') {
    HTMLDialogElement.prototype.showModal = function showModal(): void {
      this.setAttribute('open', '')
    }

    HTMLDialogElement.prototype.close = function close(): void {
      this.removeAttribute('open')
      this.dispatchEvent(new Event('close'))
    }
  }

  if (typeof HTMLMediaElement !== 'undefined') {
    HTMLMediaElement.prototype.load = vi.fn()
  }
}

class TestResizeObserver implements ResizeObserver {
  observe(): void {}

  unobserve(): void {}

  disconnect(): void {}
}

vi.stubGlobal('IntersectionObserver', TestIntersectionObserver)
vi.stubGlobal('ResizeObserver', TestResizeObserver)

beforeEach(() => {
  Object.defineProperty(globalThis, 'IntersectionObserver', {
    configurable: true,
    writable: true,
    value: TestIntersectionObserver,
  })

  Object.defineProperty(globalThis, 'ResizeObserver', {
    configurable: true,
    writable: true,
    value: TestResizeObserver,
  })

  Object.defineProperty(window, 'IntersectionObserver', {
    configurable: true,
    writable: true,
    value: TestIntersectionObserver,
  })

  Object.defineProperty(window, 'ResizeObserver', {
    configurable: true,
    writable: true,
    value: TestResizeObserver,
  })
})

if (typeof window !== 'undefined') {
  Object.defineProperty(globalThis, 'IntersectionObserver', {
    configurable: true,
    writable: true,
    value: TestIntersectionObserver,
  })

  Object.defineProperty(globalThis, 'ResizeObserver', {
    configurable: true,
    writable: true,
    value: TestResizeObserver,
  })

  Object.defineProperty(window, 'IntersectionObserver', {
    configurable: true,
    writable: true,
    value: TestIntersectionObserver,
  })

  Object.defineProperty(window, 'ResizeObserver', {
    configurable: true,
    writable: true,
    value: TestResizeObserver,
  })
}

afterEach(() => {
  TestIntersectionObserver.reset()
})
