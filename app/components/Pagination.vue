<script setup lang="ts">
import type { ClassValue } from 'clsx'

import { cn } from '~/utils/cn'

type TPaginationItem =
  | {
      type: 'page'
      page: number
      key: string
    }
  | {
      type: 'ellipsis'
      key: string
    }

type TProps = {
  currentPage: number
  totalPages: number
  displayRange?: number
  firstLastDisplayRange?: number
  showArrow?: boolean
  showFirstLastArrow?: boolean
  ariaLabel?: string
  firstLabel?: string
  lastLabel?: string
  prevLabel?: string
  nextLabel?: string
  navClass?: ClassValue
  listClass?: ClassValue
  itemClass?: ClassValue
  activeClass?: ClassValue
  disabledClass?: ClassValue
}

const props = withDefaults(defineProps<TProps>(), {
  displayRange: 2,
  firstLastDisplayRange: 4,
  showArrow: true,
  showFirstLastArrow: true,
  ariaLabel: '',
  firstLabel: '',
  lastLabel: '',
  prevLabel: '',
  nextLabel: '',
  navClass: '',
  listClass: '',
  itemClass: '',
  activeClass: '',
  disabledClass: '',
})

const emit = defineEmits<{
  'update:currentPage': [page: number]
  change: [page: number]
}>()

defineSlots<{
  prev?: (props: { disabled: boolean; page: number }) => unknown
  next?: (props: { disabled: boolean; page: number }) => unknown
  page?: (props: { page: number; isActive: boolean }) => unknown
  ellipsis?: () => unknown
  first?: (props: { disabled: boolean; page: number }) => unknown
  last?: (props: { disabled: boolean; page: number }) => unknown
}>()

const { t } = useI18n()

const normalizePositiveInteger = (value: number, fallback: number) => {
  const normalizedValue = Math.floor(value)

  return Number.isSafeInteger(normalizedValue) && normalizedValue >= 1 ? normalizedValue : fallback
}

const normalizeRange = (value: number) => {
  const normalizedValue = Math.floor(value)

  return Number.isSafeInteger(normalizedValue) && normalizedValue >= 0 ? normalizedValue : 0
}

const normalizedTotalPages = computed(() => normalizePositiveInteger(props.totalPages, 1))
const normalizedDisplayRange = computed(() => normalizeRange(props.displayRange))
const normalizedFirstLastDisplayRange = computed(() => normalizeRange(props.firstLastDisplayRange))

const clampPage = (page: number) => {
  return Math.min(normalizePositiveInteger(page, 1), normalizedTotalPages.value)
}

const normalizedCurrentPage = computed(() => clampPage(props.currentPage))

const resolvedAriaLabel = computed(() => props.ariaLabel || t('components.pagination.ariaLabel'))
const resolvedFirstLabel = computed(() => props.firstLabel || t('components.pagination.first'))
const resolvedLastLabel = computed(() => props.lastLabel || t('components.pagination.last'))
const resolvedPrevLabel = computed(() => props.prevLabel || t('components.pagination.prev'))
const resolvedNextLabel = computed(() => props.nextLabel || t('components.pagination.next'))

const visiblePages = computed<TPaginationItem[]>(() => {
  const includedPages = new Set<number>([1, normalizedTotalPages.value])
  const startPage = Math.max(1, normalizedCurrentPage.value - normalizedDisplayRange.value)
  const endPage = Math.min(
    normalizedTotalPages.value,
    normalizedCurrentPage.value + normalizedDisplayRange.value
  )

  for (let page = startPage; page <= endPage; page += 1) {
    includedPages.add(page)
  }

  if (normalizedCurrentPage.value <= normalizedFirstLastDisplayRange.value + 1) {
    const leadingEndPage = Math.min(
      normalizedTotalPages.value,
      normalizedFirstLastDisplayRange.value + 1
    )

    for (let page = 1; page <= leadingEndPage; page += 1) {
      includedPages.add(page)
    }
  }

  if (
    normalizedCurrentPage.value >=
    normalizedTotalPages.value - normalizedFirstLastDisplayRange.value
  ) {
    const trailingStartPage = Math.max(
      1,
      normalizedTotalPages.value - normalizedFirstLastDisplayRange.value
    )

    for (let page = trailingStartPage; page <= normalizedTotalPages.value; page += 1) {
      includedPages.add(page)
    }
  }

  const sortedPages = [...includedPages].sort((firstPage, secondPage) => firstPage - secondPage)
  const items: TPaginationItem[] = []

  sortedPages.forEach((page, index) => {
    const previousPage = sortedPages[index - 1]

    if (previousPage !== undefined && page - previousPage > 1) {
      items.push({
        type: 'ellipsis',
        key: `ellipsis-${previousPage}-${page}`,
      })
    }

    items.push({
      type: 'page',
      page,
      key: `page-${page}`,
    })
  })

  return items
})

const canGoPrev = computed(() => normalizedCurrentPage.value > 1)
const canGoNext = computed(() => normalizedCurrentPage.value < normalizedTotalPages.value)

const goToPage = (page: number) => {
  const nextPage = clampPage(page)

  if (nextPage === normalizedCurrentPage.value) {
    return
  }

  emit('update:currentPage', nextPage)
  emit('change', nextPage)
}

const navClassName = computed(() => cn('c-pagination', props.navClass))
const listClassName = computed(() =>
  cn('flex flex-wrap items-center justify-center gap-2', props.listClass)
)
const itemButtonClass = computed(() =>
  cn(
    'inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400',
    props.itemClass
  )
)
const activeButtonClass = computed(() =>
  cn(
    'border-slate-900 bg-slate-900 text-white hover:border-slate-900 hover:bg-slate-900',
    props.activeClass
  )
)
const disabledButtonClass = computed(() => cn('pointer-events-none', props.disabledClass))

const getButtonClass = (isActive: boolean, isDisabled: boolean) => {
  return cn(
    itemButtonClass.value,
    isActive && activeButtonClass.value,
    isDisabled && disabledButtonClass.value
  )
}
</script>

<template>
  <nav :aria-label="resolvedAriaLabel" :class="navClassName">
    <ul :class="listClassName">
      <li v-if="showFirstLastArrow">
        <button
          type="button"
          :class="getButtonClass(false, !canGoPrev)"
          :disabled="!canGoPrev"
          :aria-label="resolvedFirstLabel"
          @click="goToPage(1)"
        >
          <slot name="first" :disabled="!canGoPrev" :page="1">
            <span aria-hidden="true">&laquo;</span>
          </slot>
        </button>
      </li>

      <li v-if="showArrow">
        <button
          type="button"
          :class="getButtonClass(false, !canGoPrev)"
          :disabled="!canGoPrev"
          :aria-label="resolvedPrevLabel"
          @click="goToPage(normalizedCurrentPage - 1)"
        >
          <slot name="prev" :disabled="!canGoPrev" :page="normalizedCurrentPage - 1">
            <span aria-hidden="true">&lsaquo;</span>
          </slot>
        </button>
      </li>

      <li v-for="item in visiblePages" :key="item.key">
        <span
          v-if="item.type === 'ellipsis'"
          class="inline-flex min-h-10 min-w-10 items-center justify-center px-2 text-slate-500"
          aria-hidden="true"
        >
          <slot name="ellipsis">...</slot>
        </span>

        <button
          v-else
          type="button"
          :class="getButtonClass(item.page === normalizedCurrentPage, false)"
          :aria-current="item.page === normalizedCurrentPage ? 'page' : undefined"
          :aria-label="
            item.page === normalizedCurrentPage
              ? t('components.pagination.currentPage', { page: item.page })
              : t('components.pagination.goToPage', { page: item.page })
          "
          @click="goToPage(item.page)"
        >
          <slot name="page" :page="item.page" :is-active="item.page === normalizedCurrentPage">
            {{ item.page }}
          </slot>
        </button>
      </li>

      <li v-if="showArrow">
        <button
          type="button"
          :class="getButtonClass(false, !canGoNext)"
          :disabled="!canGoNext"
          :aria-label="resolvedNextLabel"
          @click="goToPage(normalizedCurrentPage + 1)"
        >
          <slot name="next" :disabled="!canGoNext" :page="normalizedCurrentPage + 1">
            <span aria-hidden="true">&rsaquo;</span>
          </slot>
        </button>
      </li>

      <li v-if="showFirstLastArrow">
        <button
          type="button"
          :class="getButtonClass(false, !canGoNext)"
          :disabled="!canGoNext"
          :aria-label="resolvedLastLabel"
          @click="goToPage(normalizedTotalPages)"
        >
          <slot name="last" :disabled="!canGoNext" :page="normalizedTotalPages">
            <span aria-hidden="true">&raquo;</span>
          </slot>
        </button>
      </li>
    </ul>
  </nav>
</template>
