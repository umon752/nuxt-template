<script setup lang="ts">
import type { TMenuItem } from '~/composables/useMenu'
import { nextTick, watch } from 'vue'

defineOptions({
  name: 'SingleSubmenu',
})

const props = withDefaults(
  defineProps<{
    item: TMenuItem
    nested?: boolean
    panelId?: string
    open?: boolean
  }>(),
  {
    nested: false,
    panelId: '',
    open: false,
  }
)

console.log('props', props.item)

const hasChildren = computed(() => Boolean(props.item.children?.length))
const panelRef = ref<HTMLElement | null>(null)
const isNested = computed(() => props.nested)

const { panelStyle, refreshPosition } = useDropdownMenuPosition({
  panelRef,
  nested: isNested,
})

const panelClass = computed(() => {
  if (props.nested) {
    return 'invisible absolute z-50 px-1 min-w-48 opacity-0 transition peer-focus-within/submenu-trigger:visible peer-focus-within/submenu-trigger:opacity-100 peer-hover/submenu-trigger:visible peer-hover/submenu-trigger:opacity-100 hover:visible hover:opacity-100 focus-within:visible focus-within:opacity-100'
  }

  return 'invisible absolute z-50 min-w-48 pt-5 opacity-0 transition group-focus-within/menu:visible group-focus-within/menu:opacity-100 group-hover/menu:visible group-hover/menu:opacity-100 hover:visible hover:opacity-100 focus-within:visible focus-within:opacity-100'
})

const resolvedPanelId = computed(() => props.panelId || `submenu-${props.item.id}`)

// 當面板開啟時，將 focus 移到第一個可聚焦項目；關閉時回到 trigger
watch(
  () => props.open,
  async (open) => {
    await nextTick()
    const panel = panelRef.value as HTMLElement | null
    const trigger = document.getElementById(`menu-trigger-${props.item.id}`) as HTMLElement | null

    if (open) {
      if (panel) {
        // 讓面板可見（補強 CSS 覆蓋）
        panel.style.visibility = 'visible'
        panel.style.pointerEvents = 'auto'
        panel.style.opacity = '1'

        // focus 第一個可聚焦元素
        const first = panel.querySelector(
          'a, button, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement | null
        if (first) {
          first.focus()
        }

        // Esc 關閉（點擊 trigger）
        const onKey = (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            e.stopPropagation()
            if (trigger) {
              trigger.click()
              trigger.focus()
            }
          }
        }

        panel.addEventListener('keydown', onKey)

        // 清理監聽器（當 panel 被卸載或關閉時）
        const cleanup = () => panel.removeEventListener('keydown', onKey)
        ;(panel as any).__nuxt_cleanup && (panel as any).__nuxt_cleanup()
        ;(panel as any).__nuxt_cleanup = cleanup
      }
    } else {
      if (panel) {
        // 恢復由 CSS 控制的狀態（移除內聯樣式）
        panel.style.visibility = ''
        panel.style.pointerEvents = ''
        panel.style.opacity = ''

        // 移回 trigger
        if (trigger) trigger.focus()

        // 清理 keydown
        const cleanup = (panel as any).__nuxt_cleanup as (() => void) | undefined
        if (cleanup) cleanup()
        ;(panel as any).__nuxt_cleanup = undefined
      }
    }
  },
  { immediate: false }
)
</script>

<template>
  <div
    v-if="hasChildren"
    :id="resolvedPanelId"
    ref="panelRef"
    :class="[panelClass, props.open ? 'visible opacity-100' : '']"
    :style="panelStyle"
    :aria-labelledby="`menu-trigger-${props.item.id}`"
    role="region"
    @mouseenter="refreshPosition"
    @focusin="refreshPosition"
  >
    <ul class="bg-white shadow-lg">
      <li v-for="child in props.item.children" :key="child.id" class="group/submenu relative">
        <NuxtLink
          v-if="child.href"
          :to="child.href"
          class="peer/submenu-trigger hover:text-main-500 relative block px-4 py-2 pr-9 whitespace-nowrap"
        >
          {{ child.title }}
        </NuxtLink>
        <button
          v-else
          type="button"
          class="peer/submenu-trigger hover:text-main-500 relative block cursor-auto px-4 py-2 pr-9 whitespace-nowrap"
        >
          {{ child.title }}
        </button>

        <SingleSubmenu v-if="child.children?.length" :item="child" nested />
      </li>
    </ul>
  </div>
</template>
