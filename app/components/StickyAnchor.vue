<script setup lang="ts">
import type { ClassValue } from 'clsx'

import { cn } from '~/utils/cn'

export type TStickyAnchorItem = {
  id: string | number
  label: string
  [key: string]: unknown
}

export type TStickyAnchorInstance = {
  scrollToItem: (index: number, behavior?: ScrollBehavior) => void
  refresh: () => void
}

type TProps = {
  items: TStickyAnchorItem[]
  modelValue?: string | number
  ariaLabel?: string
  scrollOffset?: number
  rootClass?: ClassValue
  asideClass?: ClassValue
  viewportClass?: ClassValue
  listClass?: ClassValue
  itemClass?: ClassValue
  buttonClass?: ClassValue
  activeButtonClass?: ClassValue
  contentClass?: ClassValue
  sectionClass?: ClassValue
  headingClass?: ClassValue
}

const {
  items,
  modelValue = undefined,
  ariaLabel = undefined,
  scrollOffset = 0,
  rootClass: rootClassProp = '',
  asideClass: asideClassProp = '',
  viewportClass: viewportClassProp = '',
  listClass: listClassProp = '',
  itemClass: itemClassProp = '',
  buttonClass: buttonClassProp = '',
  activeButtonClass: activeButtonClassProp = '',
  contentClass: contentClassProp = '',
  sectionClass: sectionClassProp = '',
  headingClass: headingClassProp = '',
} = defineProps<TProps>()

const emit = defineEmits<{
  'update:modelValue': [id: string | number]
  change: [item: TStickyAnchorItem, index: number]
}>()

defineSlots<{
  item?: (props: {
    item: TStickyAnchorItem
    index: number
    isActive: boolean
    select: () => void
  }) => unknown
  content?: (props: { item: TStickyAnchorItem; index: number; isActive: boolean }) => unknown
}>()

const { t } = useI18n()
const instanceId = useId()
const rootElement = useTemplateRef<HTMLElement>('rootElement')
const viewportElement = useTemplateRef<HTMLElement>('viewportElement')
const listElement = useTemplateRef<HTMLOListElement>('listElement')
const itemElements = useTemplateRef<HTMLButtonElement[]>('itemElements')
const sectionElements = useTemplateRef<HTMLElement[]>('sectionElements')

const internalActiveId = ref<string | number | undefined>(modelValue ?? items[0]?.id)
const activeId = computed(() => modelValue ?? internalActiveId.value)
const interactiveElements = computed<HTMLElement[]>(() => itemElements.value ?? [])

const { isDragging } = useDrag({
  target: viewportElement,
  interactiveElements,
})

const resolvedAriaLabel = computed(() => ariaLabel || t('components.stickyAnchor.ariaLabel'))
const resolvedScrollOffset = computed(() =>
  Number.isFinite(scrollOffset) ? Math.max(0, scrollOffset) : 0
)
const sectionStyle = computed(() => {
  if (resolvedScrollOffset.value <= 0) {
    return undefined
  }

  return {
    scrollMarginTop: `${resolvedScrollOffset.value}px`,
  }
})
const rootClassName = computed(() =>
  cn(
    'grid w-full gap-8 lg:grid-cols-[minmax(12rem,16rem)_minmax(0,1fr)] lg:items-start',
    rootClassProp
  )
)
const asideClassName = computed(() =>
  cn('sticky top-[var(--nav-h,0px)] z-10 min-w-0 bg-white', asideClassProp)
)
const viewportClassName = computed(() =>
  cn(
    'sticky-anchor__viewport touch-pan-y overflow-x-auto overscroll-x-contain select-none lg:max-h-[calc(100vh-var(--nav-h,0px))] lg:overflow-x-hidden lg:overflow-y-auto',
    isDragging.value ? 'cursor-grabbing' : 'cursor-grab',
    viewportClassProp
  )
)
const listClassName = computed(() =>
  cn(
    'flex w-max min-w-full items-center gap-1 lg:w-full lg:flex-col lg:items-stretch',
    listClassProp
  )
)
const contentClassName = computed(() => cn('min-w-0', contentClassProp))
const sectionClassName = computed(() =>
  cn('scroll-mt-[var(--nav-h,0px)] space-y-3', sectionClassProp)
)
const headingClassName = computed(() =>
  cn('border-b border-slate-200 py-2.5 text-xl font-bold text-slate-900', headingClassProp)
)
const baseButtonClassName = computed(() =>
  cn(
    'relative w-full whitespace-nowrap px-5 py-2.5 text-left text-sm font-semibold text-slate-800 transition-[padding,color,background-color] hover:bg-slate-50 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-slate-500 motion-reduce:transition-none lg:text-base before:absolute before:top-1/2 before:left-0 before:h-1 before:w-2.5 before:-translate-y-1/2 before:bg-slate-300 before:transition-colors before:content-["_"] hover:before:bg-main-500 motion-reduce:before:transition-none',
    buttonClassProp
  )
)

const getItemClassName = (): string => cn('shrink-0 lg:w-full', itemClassProp)

const getButtonClassName = (item: TStickyAnchorItem): string =>
  cn(
    baseButtonClassName.value,
    Object.is(item.id, activeId.value) &&
      cn('pl-7 text-slate-950 before:bg-main-500', activeButtonClassProp)
  )

const getButtonId = (index: number): string => `${instanceId}-button-${index}`
const getSectionId = (index: number): string => `${instanceId}-section-${index}`
const getHeadingId = (index: number): string => `${instanceId}-heading-${index}`

const getItemElementList = (): HTMLButtonElement[] => itemElements.value ?? []
const getSectionElementList = (): HTMLElement[] => sectionElements.value ?? []

const getScrollBehavior = (): ScrollBehavior => {
  if (
    !import.meta.client ||
    typeof window.matchMedia !== 'function' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return 'auto'
  }

  return 'smooth'
}

const getSectionTop = (section: HTMLElement): number =>
  section.getBoundingClientRect().top + window.scrollY

const scrollActiveButtonIntoView = (index: number, behavior: ScrollBehavior): void => {
  const button = getItemElementList()[index]
  const viewport = viewportElement.value

  if (!button || !viewport) {
    return
  }

  const buttonRect = button.getBoundingClientRect()
  const viewportRect = viewport.getBoundingClientRect()
  let left = viewport.scrollLeft
  let top = viewport.scrollTop

  if (buttonRect.left < viewportRect.left) {
    left -= viewportRect.left - buttonRect.left
  } else if (buttonRect.right > viewportRect.right) {
    left += buttonRect.right - viewportRect.right
  }

  if (buttonRect.top < viewportRect.top) {
    top -= viewportRect.top - buttonRect.top
  } else if (buttonRect.bottom > viewportRect.bottom) {
    top += buttonRect.bottom - viewportRect.bottom
  }

  if (left === viewport.scrollLeft && top === viewport.scrollTop) {
    return
  }

  viewport.scrollTo({ left, top, behavior })
}

const scrollToSection = (index: number, behavior: ScrollBehavior): void => {
  if (!import.meta.client) {
    return
  }

  const section = getSectionElementList()[index]

  if (!section) {
    return
  }

  section.scrollIntoView({
    behavior,
    block: 'start',
    inline: 'nearest',
  })
}

const scrollToItem = (index: number, behavior = getScrollBehavior()): void => {
  scrollToSection(index, behavior)
}

const setActiveItem = (
  item: TStickyAnchorItem,
  index: number,
  ensureVisible: boolean,
  behavior: ScrollBehavior = 'auto'
): void => {
  const isChanged = !Object.is(activeId.value, item.id)

  if (isChanged) {
    if (modelValue === undefined) {
      internalActiveId.value = item.id
    }

    emit('update:modelValue', item.id)
    emit('change', item, index)
  }

  if (ensureVisible) {
    nextTick(() => {
      scrollActiveButtonIntoView(index, behavior)
    })
  }
}

const selectItem = (index: number): void => {
  const item = items[index]

  if (!item) {
    return
  }

  const behavior = getScrollBehavior()

  setActiveItem(item, index, false)

  nextTick(() => {
    scrollToSection(index, behavior)
    scrollActiveButtonIntoView(index, behavior)
  })
}

const syncInternalActiveId = (): void => {
  if (modelValue !== undefined) {
    internalActiveId.value = modelValue
    return
  }

  const hasActiveItem = items.some((item) => Object.is(item.id, internalActiveId.value))

  if (!hasActiveItem) {
    internalActiveId.value = items[0]?.id
  }
}

const updateActiveFromScroll = (): void => {
  if (!import.meta.client || !items.length) {
    return
  }

  const sections = getSectionElementList()

  if (!sections.length) {
    return
  }

  const activationPoint = window.scrollY + window.innerHeight / 2
  let currentIndex = 0

  sections.forEach((section, index) => {
    if (getSectionTop(section) <= activationPoint) {
      currentIndex = index
    }
  })

  const currentItem = items[currentIndex]

  if (currentItem) {
    setActiveItem(currentItem, currentIndex, !Object.is(activeId.value, currentItem.id), 'auto')
  }
}

const refresh = (): void => {
  syncInternalActiveId()
  updateActiveFromScroll()
}

let scrollFrame: number | undefined
let resizeObserver: ResizeObserver | undefined

const cancelScrollFrame = (): void => {
  if (scrollFrame === undefined || !import.meta.client) {
    return
  }

  window.cancelAnimationFrame(scrollFrame)
  scrollFrame = undefined
}

const scheduleScrollSpy = (): void => {
  if (!import.meta.client || scrollFrame !== undefined) {
    return
  }

  scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = undefined
    updateActiveFromScroll()
  })
}

const handleResize = (): void => {
  refresh()
}

const setupResizeObserver = (): void => {
  resizeObserver?.disconnect()
  resizeObserver = undefined

  if (!import.meta.client || typeof ResizeObserver === 'undefined') {
    return
  }

  resizeObserver = new ResizeObserver(handleResize)

  const targets = [rootElement.value, listElement.value, ...getSectionElementList()].filter(
    (element): element is HTMLElement => element instanceof HTMLElement
  )

  targets.forEach((target) => resizeObserver?.observe(target))
}

watch(
  () => items.map((item) => item.id),
  async () => {
    syncInternalActiveId()
    await nextTick()
    setupResizeObserver()
    refresh()
  },
  { flush: 'post' }
)

watch(
  () => modelValue,
  async () => {
    syncInternalActiveId()
    await nextTick()

    const activeIndex = items.findIndex((item) => Object.is(item.id, activeId.value))

    if (activeIndex >= 0) {
      scrollActiveButtonIntoView(activeIndex, 'auto')
    }
  }
)

onMounted(async () => {
  await nextTick()

  window.addEventListener('scroll', scheduleScrollSpy, { passive: true })
  window.addEventListener('resize', handleResize, { passive: true })
  setupResizeObserver()
  refresh()

  const activeIndex = items.findIndex((item) => Object.is(item.id, activeId.value))

  if (activeIndex >= 0) {
    scrollActiveButtonIntoView(activeIndex, 'auto')
  }
})

onBeforeUnmount(() => {
  if (!import.meta.client) {
    return
  }

  window.removeEventListener('scroll', scheduleScrollSpy)
  window.removeEventListener('resize', handleResize)
  resizeObserver?.disconnect()
  cancelScrollFrame()
})

defineExpose<TStickyAnchorInstance>({
  scrollToItem,
  refresh,
})
</script>

<template>
  <div v-if="items.length" ref="rootElement" :class="rootClassName">
    <aside :class="asideClassName">
      <nav :aria-label="resolvedAriaLabel">
        <div
          ref="viewportElement"
          :class="viewportClassName"
          :data-dragging="isDragging || undefined"
        >
          <ol ref="listElement" :class="listClassName">
            <li v-for="(item, index) in items" :key="item.id" :class="getItemClassName()">
              <button
                :id="getButtonId(index)"
                ref="itemElements"
                type="button"
                :class="getButtonClassName(item)"
                :aria-controls="getSectionId(index)"
                :aria-current="Object.is(item.id, activeId) ? 'location' : undefined"
                @click="selectItem(index)"
              >
                <slot
                  name="item"
                  :item="item"
                  :index="index"
                  :is-active="Object.is(item.id, activeId)"
                  :select="() => selectItem(index)"
                >
                  {{ item.label }}
                </slot>
              </button>
            </li>
          </ol>
        </div>
      </nav>
    </aside>

    <div :class="contentClassName">
      <section
        v-for="(item, index) in items"
        :id="getSectionId(index)"
        ref="sectionElements"
        :key="item.id"
        :class="sectionClassName"
        :style="sectionStyle"
        :aria-labelledby="getHeadingId(index)"
      >
        <h3 :id="getHeadingId(index)" :class="headingClassName">{{ item.label }}</h3>
        <slot
          name="content"
          :item="item"
          :index="index"
          :is-active="Object.is(item.id, activeId)"
        />
      </section>
    </div>
  </div>
</template>

<style scoped>
.sticky-anchor__viewport {
  scrollbar-width: none;
}

.sticky-anchor__viewport::-webkit-scrollbar {
  display: none;
}
</style>
