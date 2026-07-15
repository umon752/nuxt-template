<script setup lang="ts">
// import { ref } from 'vue'

/**
 * Accordion 元件
 *
 * @props {Array} items - 手風琴項目陣列，每個項目包含 title 和 content
 * @props {Boolean} collapseOthers - 是否在展開一個項目時自動收合其他項目（預設 false）
 * @props {Array} defaultActive - 預設展開的項目索引陣列（預設 []）
 *
 * @slots title - 自訂標題區塊（接收 item, index, isActive）
 * @slots content - 自訂內容區塊（接收 item, index）
 *
 * @emits toggle - 當項目展開/收合時觸發（index, isActive）
 */

// 定義 Accordion 項目的型別
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'
import { getCurrentInstance } from 'vue'

export type TAccordionItem = {
  title?: string
  content?: string
  [key: string]: unknown
}

// 定義 Accordion 實例的型別
export type TAccordionInstance = {
  expand: (index: number) => void
  collapse: (index: number) => void
  collapseAll: () => void
  expandAll: () => void
  activeItems: Ref<Set<number>>
}

const props = defineProps({
  items: {
    type: Array as () => TAccordionItem[],
    required: true,
    validator: (value: TAccordionItem[]) => {
      return value.every(
        (item) =>
          typeof item === 'object' && (item.title !== undefined || item.content !== undefined)
      )
    },
  },
  collapseOthers: {
    type: Boolean,
    default: true,
  },
  defaultActive: {
    type: Array as () => number[],
    default: () => [],
  },
  titleClass: {
    // 支援字串 / 物件 / 陣列，讓使用者可以傳入自訂 class 覆蓋預設樣式
    type: [String, Object, Array],
    default: '',
  },
  contentClass: {
    // 支援字串 / 物件 / 陣列，讓使用者可以傳入自訂 class 覆蓋預設樣式
    type: [String, Object, Array],
    default: '',
  },
})

const mergedTitleClass = computed(() =>
  twMerge(clsx('w-full px-4 py-3 text-left', props.titleClass))
)

// instance uid 用於產生在多個 Accordion 元件間不會衝突的 id
const _instanceUid = getCurrentInstance()?.uid ?? Math.floor(Math.random() * 1e9)

const mergedContentClass = computed(() => twMerge(clsx('px-4 py-3', props.contentClass)))

const emit = defineEmits<{
  toggle: [index: number, isActive: boolean]
}>()

// 使用 Set 來追蹤展開的項目
const activeItems = ref<Set<number>>(new Set(props.defaultActive))

/**
 * 切換手風琴項目的展開/收合狀態
 * @param {number} index - 項目索引
 */
const toggle = (index: number) => {
  const isCurrentlyActive = activeItems.value.has(index)

  if (props.collapseOthers) {
    // 如果啟用「折疊其他項目」，先清空所有展開的項目
    activeItems.value.clear()

    // 如果當前項目原本不是展開的，則展開它
    if (!isCurrentlyActive) {
      activeItems.value.add(index)
    }
  } else {
    // 切換當前項目的狀態
    if (isCurrentlyActive) {
      activeItems.value.delete(index)
    } else {
      activeItems.value.add(index)
    }
  }

  // 觸發事件
  emit('toggle', index, !isCurrentlyActive)
}

/**
 * 展開指定項目
 * @param {number} index - 項目索引
 */
const expand = (index: number) => {
  if (props.collapseOthers) {
    activeItems.value.clear()
  }
  activeItems.value.add(index)
}

/**
 * 收合指定項目
 * @param {number} index - 項目索引
 */
const collapse = (index: number) => {
  activeItems.value.delete(index)
}

/**
 * 收合所有項目
 */
const collapseAll = () => {
  activeItems.value.clear()
}

/**
 * 展開所有項目
 */
const expandAll = () => {
  props.items.forEach((_, index) => {
    activeItems.value.add(index)
  })
}

// 暴露方法給父元件使用（透過 ref）
defineExpose<TAccordionInstance>({
  expand,
  collapse,
  collapseAll,
  expandAll,
  activeItems,
})
</script>

<template>
  <div v-for="(item, index) in items" :key="index" :class="{ 'is-active': activeItems.has(index) }">
    <!-- Accordion 按鈕 -->
    <button
      type="button"
      :class="mergedTitleClass"
      @click="toggle(index)"
      :aria-expanded="activeItems.has(index)"
      :aria-controls="`accordion-content-${_instanceUid}-${index}`"
      :id="`accordion-button-${_instanceUid}-${index}`"
    >
      <slot name="title" :item="item" :index="index" :is-active="activeItems.has(index)">
        {{ item.title }}
      </slot>
    </button>

    <!-- Accordion 內容 -->
    <div
      class="grid transition-[grid-template-rows] duration-500 ease-in-out"
      :class="activeItems.has(index) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
      :id="`accordion-content-${_instanceUid}-${index}`"
      role="region"
      :aria-labelledby="`accordion-button-${_instanceUid}-${index}`"
    >
      <div class="overflow-hidden" :class="{ 'animate-overflow': activeItems.has(index) }">
        <div :class="mergedContentClass">
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
