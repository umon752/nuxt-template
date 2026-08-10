import { afterEach, beforeEach, expect, vi } from 'vitest'

let warnSpy: ReturnType<typeof vi.spyOn>
let errorSpy: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  warnSpy = vi.spyOn(console, 'warn')
  errorSpy = vi.spyOn(console, 'error')
})

afterEach(() => {
  const unexpectedWarnings = warnSpy.mock.calls.filter(([message]) => {
    return !(
      typeof message === 'string' &&
      message.includes('[VUE_ROUTER_R0004] No match found for location with path "/about"')
    )
  })

  expect(unexpectedWarnings).toHaveLength(0)
  expect(errorSpy).not.toHaveBeenCalled()
})
