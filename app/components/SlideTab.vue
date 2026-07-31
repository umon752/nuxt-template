<script setup lang="ts">
import type { ClassValue } from 'clsx'

import { cn } from '~/utils/cn'
import IconArrowLeft from './icon/IconArrowLeft.vue'

export type TSlideTabItem = {
  id: string | number
  label: string
  disabled?: boolean
  [key: string]: unknown
}

export type TSlideTabInstance = {
  scrollPrevious: () => void
  scrollNext: () => void
  scrollToItem: (index: number, behavior?: ScrollBehavior) => void
  refresh: () => void
}

type TProps = {
  items: TSlideTabItem[]
  modelValue?: string | number
  showControls?: boolean
  alignActiveToStart?: boolean
  ariaLabel?: string
  previousLabel?: string
  nextLabel?: string
  rootClass?: ClassValue
  viewportClass?: ClassValue
  listClass?: ClassValue
  itemClass?: ClassValue
  activeClass?: ClassValue
  disabledClass?: ClassValue
  controlClass?: ClassValue
}

const props = withDefaults(defineProps<TProps>(), {
  modelValue: undefined,
  showControls: true,
  alignActiveToStart: false,
  ariaLabel: undefined,
  previousLabel: undefined,
  nextLabel: undefined,
  rootClass: '',
  viewportClass: '',
  listClass: '',
  itemClass: '',
  activeClass: '',
  disabledClass: '',
  controlClass: '',
})

const emit = defineEmits<{
  'update:modelValue': [id: string | number]
  change: [item: TSlideTabItem, index: number]
}>()

defineSlots<{
  item?: (props: {
    item: TSlideTabItem
    index: number
    isActive: boolean
    select: () => void
  }) => unknown
  previous?: () => unknown
  next?: () => unknown
}>()

const { t } = useI18n()
const viewportElement = useTemplateRef<HTMLElement>('viewportElement')
const listElement = useTemplateRef<HTMLUListElement>('listElement')
const itemElements = computed<HTMLElement[]>(() => {
  if (!import.meta.client || !listElement.value) {
    return []
  }

  return Array.from(listElement.value.children).filter(
    (element): element is HTMLElement => element instanceof HTMLElement
  )
})
const canScrollPrevious = ref(false)
const canScrollNext = ref(false)

const { isDragging } = useDrag({
  target: viewportElement,
  interactiveElements: itemElements,
})

const resolvedAriaLabel = computed(() => props.ariaLabel || t('components.slideTab.ariaLabel'))
const resolvedPreviousLabel = computed(
  () => props.previousLabel || t('components.slideTab.previous')
)
const resolvedNextLabel = computed(() => props.nextLabel || t('components.slideTab.next'))
const rootClassName = computed(() => cn('relative w-full', props.rootClass))
const viewportClassName = computed(() =>
  cn(
    'slide-tab__viewport touch-pan-y overflow-x-auto select-none',
    isDragging.value ? 'cursor-grabbing' : 'cursor-grab',
    props.viewportClass
  )
)
const listClassName = computed(() => cn('flex w-max min-w-full items-stretch', props.listClass))
const controlClassName = computed(() =>
  cn(
    'pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-white shadow-lg transition-opacity hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500',
    props.controlClass
  )
)

const isActiveItem = (item: TSlideTabItem): boolean => Object.is(item.id, props.modelValue)

const getItemClassName = (item: TSlideTabItem): string =>
  cn(
    'h-full w-auto shrink-0',
    props.itemClass,
    isActiveItem(item) && props.activeClass,
    item.disabled && props.disabledClass
  )

const getDefaultButtonClassName = (item: TSlideTabItem): string =>
  cn(
    'block h-full whitespace-nowrap rounded-t-[20px] border border-b-0 border-slate-200 bg-slate-50 px-10 py-5 text-lg font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-white hover:text-slate-950 focus-visible:relative focus-visible:z-10 disabled:cursor-not-allowed disabled:opacity-50',
    isActiveItem(item) && 'border-slate-300 bg-white text-slate-950'
  )

const getScrollBehavior = (): ScrollBehavior => {
  if (!import.meta.client || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'auto'
  }

  return 'smooth'
}

const refresh = (): void => {
  const viewport = viewportElement.value

  if (!viewport) {
    canScrollPrevious.value = false
    canScrollNext.value = false
    return
  }

  const maximumScrollLeft = Math.max(0, viewport.scrollWidth - viewport.clientWidth)
  const boundaryTolerance = 1

  canScrollPrevious.value = viewport.scrollLeft > boundaryTolerance
  canScrollNext.value = viewport.scrollLeft < maximumScrollLeft - boundaryTolerance
}

const scrollToLeft = (left: number, behavior = getScrollBehavior()): void => {
  const viewport = viewportElement.value

  if (!viewport) {
    return
  }

  const maximumScrollLeft = Math.max(0, viewport.scrollWidth - viewport.clientWidth)

  viewport.scrollTo({
    left: Math.min(Math.max(0, left), maximumScrollLeft),
    behavior,
  })
}

const scrollToItem = (index: number, behavior = getScrollBehavior()): void => {
  const item = itemElements.value?.[index]

  if (!item) {
    return
  }

  scrollToLeft(item.offsetLeft, behavior)
}

const scrollPrevious = (): void => {
  const viewport = viewportElement.value
  const items = itemElements.value

  if (!viewport || !items?.length) {
    return
  }

  const previousItem = [...items]
    .reverse()
    .find((item) => item.offsetLeft < viewport.scrollLeft - 1)

  scrollToLeft(previousItem?.offsetLeft ?? 0)
}

const scrollNext = (): void => {
  const viewport = viewportElement.value
  const items = itemElements.value

  if (!viewport || !items?.length) {
    return
  }

  const visibleRight = viewport.scrollLeft + viewport.clientWidth
  const nextItem = items.find((item) => item.offsetLeft + item.offsetWidth > visibleRight + 1)

  scrollToLeft(nextItem?.offsetLeft ?? viewport.scrollWidth)
}

const ensureActiveItemVisible = (behavior: ScrollBehavior): void => {
  const viewport = viewportElement.value
  const activeIndex = props.items.findIndex((item) => isActiveItem(item))
  const activeItem = itemElements.value?.[activeIndex]

  if (!viewport || !activeItem) {
    return
  }

  if (props.alignActiveToStart) {
    scrollToLeft(activeItem.offsetLeft, behavior)
    return
  }

  const viewportRect = viewport.getBoundingClientRect()
  const itemRect = activeItem.getBoundingClientRect()

  if (itemRect.left < viewportRect.left) {
    scrollToLeft(viewport.scrollLeft + itemRect.left - viewportRect.left, behavior)
    return
  }

  if (itemRect.right > viewportRect.right) {
    scrollToLeft(viewport.scrollLeft + itemRect.right - viewportRect.right, behavior)
  }
}

const selectItem = (item: TSlideTabItem, index: number): void => {
  if (item.disabled || isActiveItem(item)) {
    return
  }

  emit('update:modelValue', item.id)
  emit('change', item, index)
}

let resizeObserver: ResizeObserver | undefined

const handleResize = (): void => {
  refresh()
  ensureActiveItemVisible('auto')
}

watch([() => props.modelValue, () => props.alignActiveToStart], async () => {
  await nextTick()
  ensureActiveItemVisible(getScrollBehavior())
})

watch(
  () => props.items.map((item) => item.id),
  async () => {
    await nextTick()
    refresh()
    ensureActiveItemVisible('auto')
  }
)

onMounted(async () => {
  await nextTick()
  refresh()
  ensureActiveItemVisible('auto')

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(handleResize)

    if (viewportElement.value) {
      resizeObserver.observe(viewportElement.value)
    }

    if (listElement.value) {
      resizeObserver.observe(listElement.value)
    }

    return
  }

  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', handleResize)
})

defineExpose<TSlideTabInstance>({
  scrollPrevious,
  scrollNext,
  scrollToItem,
  refresh,
})
</script>

<template>
  <nav :class="rootClassName" :aria-label="resolvedAriaLabel">
    <div
      ref="viewportElement"
      :class="viewportClassName"
      :data-can-scroll-previous="canScrollPrevious || undefined"
      :data-can-scroll-next="canScrollNext || undefined"
      @scroll.passive="refresh"
    >
      <ul ref="listElement" :class="listClassName">
        <li v-for="(item, index) in props.items" :key="item.id" :class="getItemClassName(item)">
          <slot
            name="item"
            :item="item"
            :index="index"
            :is-active="isActiveItem(item)"
            :select="() => selectItem(item, index)"
          >
            <button
              type="button"
              :class="getDefaultButtonClassName(item)"
              :disabled="item.disabled"
              :aria-pressed="isActiveItem(item)"
              @click="selectItem(item, index)"
            >
              {{ item.label }}
            </button>
          </slot>
        </li>
      </ul>
    </div>

    <div v-if="props.showControls" class="pointer-events-none absolute inset-0 z-20">
      <button
        v-if="canScrollPrevious"
        type="button"
        :class="cn(controlClassName, 'absolute top-1/2 left-2 -translate-y-1/2')"
        :aria-label="resolvedPreviousLabel"
        @click="scrollPrevious"
      >
        <slot name="previous">
          <IconArrowLeft />
        </slot>
      </button>

      <button
        v-if="canScrollNext"
        type="button"
        :class="cn(controlClassName, 'absolute top-1/2 right-2 -translate-y-1/2')"
        :aria-label="resolvedNextLabel"
        @click="scrollNext"
      >
        <slot name="next">
          <IconArrowRight />
        </slot>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.slide-tab__viewport {
  scrollbar-width: none;
  -webkit-mask-image: var(--slide-tab-mask-image);
  mask-image: var(--slide-tab-mask-image);
}

.slide-tab__viewport::-webkit-scrollbar {
  display: none;
}

.slide-tab__viewport[data-can-scroll-previous='true'][data-can-scroll-next='true'] {
  --slide-tab-mask-image: linear-gradient(
    90deg,
    transparent 0%,
    black 12%,
    black 88%,
    transparent 100%
  );
}

.slide-tab__viewport:not([data-can-scroll-previous])[data-can-scroll-next='true'] {
  --slide-tab-mask-image: linear-gradient(90deg, black 0%, black 88%, transparent 100%);
}

.slide-tab__viewport[data-can-scroll-previous='true']:not([data-can-scroll-next]) {
  --slide-tab-mask-image: linear-gradient(90deg, transparent 0%, black 12%, black 100%);
}
</style>
