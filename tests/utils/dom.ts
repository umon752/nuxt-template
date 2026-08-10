export class TestIntersectionObserver implements IntersectionObserver {
  static instances: TestIntersectionObserver[] = []

  readonly root = null
  readonly rootMargin = '0px'
  readonly thresholds = [0]
  disconnectCalls = 0

  private readonly callback: IntersectionObserverCallback

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    TestIntersectionObserver.instances.push(this)
  }

  observe(): void {}

  unobserve(): void {}

  disconnect(): void {
    this.disconnectCalls += 1
  }

  takeRecords(): IntersectionObserverEntry[] {
    return []
  }

  trigger(target: Element, isIntersecting = true): void {
    this.callback(
      [
        {
          target,
          isIntersecting,
          intersectionRatio: isIntersecting ? 1 : 0,
        } as IntersectionObserverEntry,
      ],
      this
    )
  }

  static reset(): void {
    TestIntersectionObserver.instances = []
  }
}

export const triggerIntersection = (target: Element, isIntersecting = true): void => {
  TestIntersectionObserver.instances.at(-1)?.trigger(target, isIntersecting)
}
