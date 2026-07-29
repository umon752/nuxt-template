<script setup lang="ts">
/**
 * Accordion 元件
 *
 * @props {Array} items - 手風琴項目陣列，每個項目包含 title 和 content
 * @props {Boolean} collapseOthers - 是否在展開一個項目時自動收合其他項目（預設 true）
 * @props {Array} activeItems - 目前展開的項目索引陣列
 *
 * @slots title - 自訂標題區塊（接收 item, index, isActive）
 * @slots content - 自訂內容區塊（接收 item, index）
 *
 * @emits update:activeItems - 請求父層更新展開的項目索引
 * @emits toggle - 當項目展開/收合時觸發（index, isActive）
 */

// 定義 Accordion 項目的型別
import type { ClassValue } from 'clsx'

import { cn } from '~/utils/cn'

export type TAccordionItem = {
  title?: string
  content?: string
  [key: string]: unknown
}

type TProps = {
  items: TAccordionItem[]
  activeItems: number[]
  collapseOthers?: boolean
  accordionClass?: ClassValue
  titleClass?: ClassValue
  contentClass?: ClassValue
}

const props = withDefaults(defineProps<TProps>(), {
  collapseOthers: true,
  accordionClass: '',
  titleClass: '',
  contentClass: '',
})

const accordionClass = computed(() => cn('w-full', props.accordionClass))

const titleClass = computed(() => cn('w-full px-4 py-3 text-left', props.titleClass))

// useId 可在 SSR 與 hydration 間產生穩定且不重複的 id
const instanceId = useId()

const contentClass = computed(() => cn('px-4 py-3', props.contentClass))

const emit = defineEmits<{
  'update:activeItems': [items: number[]]
  toggle: [index: number, isActive: boolean]
}>()

const activeItemSet = computed(() => new Set(props.activeItems))

/**
 * 切換手風琴項目的展開/收合狀態
 * @param {number} index - 項目索引
 */
const toggle = (index: number): void => {
  const nextActiveItems = new Set(props.activeItems)
  const isCurrentlyActive = nextActiveItems.has(index)

  if (props.collapseOthers) {
    nextActiveItems.clear()

    if (!isCurrentlyActive) {
      nextActiveItems.add(index)
    }
  } else {
    if (isCurrentlyActive) {
      nextActiveItems.delete(index)
    } else {
      nextActiveItems.add(index)
    }
  }

  const items = [...nextActiveItems].sort((first, second) => first - second)
  const isActive = nextActiveItems.has(index)

  emit('update:activeItems', items)
  emit('toggle', index, isActive)
}
</script>

<template>
  <div v-for="(item, index) in items" :key="index" :class="accordionClass">
    <!-- Accordion 按鈕 -->
    <button
      :id="`accordion-button-${instanceId}-${index}`"
      type="button"
      :class="titleClass"
      :aria-expanded="activeItemSet.has(index)"
      :aria-controls="`accordion-content-${instanceId}-${index}`"
      @click="toggle(index)"
    >
      <slot name="title" :item="item" :index="index" :is-active="activeItemSet.has(index)">
        {{ item.title }}
      </slot>
    </button>

    <!-- Accordion 內容 -->
    <div
      :id="`accordion-content-${instanceId}-${index}`"
      class="grid transition-[grid-template-rows] duration-500 ease-in-out"
      :class="activeItemSet.has(index) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
      role="region"
      :aria-labelledby="`accordion-button-${instanceId}-${index}`"
      :aria-hidden="!activeItemSet.has(index)"
      :inert="!activeItemSet.has(index)"
    >
      <div class="overflow-hidden" :class="{ 'animate-overflow': activeItemSet.has(index) }">
        <div :class="contentClass">
          <slot name="content" :item="item" :index="index">
            {{ item.content }}
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@layer components {
  @keyframes overflow-reveal {
    0%,
    99.9% {
      overflow: hidden;
    }
    100% {
      overflow: visible;
    }
  }

  .animate-overflow {
    animation: overflow-reveal 500ms ease forwards;
  }
}
</style>
