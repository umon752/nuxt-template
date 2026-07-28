<script setup lang="ts">
import type { TMenuItem } from '~/composables/useMenu'
import { nextTick, watch } from 'vue'

type TProps = {
  item: TMenuItem
  nested?: boolean
  panelId?: string
  open?: boolean
}

defineOptions({
  name: 'SingleSubmenu',
})

const props = withDefaults(defineProps<TProps>(), {
  nested: false,
  panelId: '',
  open: false,
})

const emit = defineEmits<{
  close: []
}>()

const hasChildren = computed(() => Boolean(props.item.children?.length))
const panelRef = ref<HTMLElement | null>(null)
const isNested = computed(() => props.nested)
const openChildId = ref<string>()

const { panelStyle, refreshPosition } = useDropdownMenuPosition({
  panelRef,
  nested: isNested,
})

const panelClass = computed(() => {
  return props.nested
    ? 'absolute z-50 min-w-48 px-1 transition'
    : 'absolute z-50 min-w-48 pt-5 transition'
})

const resolvedPanelId = computed(() => props.panelId || `submenu-${props.item.id}`)

// 面板開啟後更新位置；Escape 關閉時將 focus 移回 trigger
watch(
  () => props.open,
  async (open, _previousOpen, onCleanup) => {
    await nextTick()
    const panel = panelRef.value
    const trigger = document.getElementById(`menu-trigger-${props.item.id}`)

    if (open) {
      if (panel) {
        await refreshPosition()

        // Esc 關閉並回到 trigger
        const onKey = (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            e.stopPropagation()
            emit('close')
            trigger?.focus()
          }
        }

        panel.addEventListener('keydown', onKey)

        onCleanup(() => panel.removeEventListener('keydown', onKey))
      }
    } else {
      openChildId.value = undefined
    }
  },
  { immediate: false }
)

const openChild = (itemId?: string): void => {
  openChildId.value = itemId
}

const closeChild = (): void => {
  openChildId.value = undefined
}

const handleChildFocusout = (event: FocusEvent): void => {
  const currentTarget = event.currentTarget
  const relatedTarget = event.relatedTarget

  if (
    currentTarget instanceof HTMLElement &&
    relatedTarget instanceof Node &&
    currentTarget.contains(relatedTarget)
  ) {
    return
  }

  closeChild()
}
</script>

<template>
  <div
    v-if="hasChildren"
    :id="resolvedPanelId"
    ref="panelRef"
    :class="[
      panelClass,
      props.open
        ? 'pointer-events-auto visible opacity-100'
        : 'pointer-events-none invisible opacity-0',
    ]"
    :style="panelStyle"
    :aria-labelledby="`menu-trigger-${props.item.id}`"
    role="region"
    @mouseenter="refreshPosition"
    @focusin="refreshPosition"
  >
    <ul class="bg-white shadow-lg">
      <li
        v-for="child in props.item.children"
        :key="child.id"
        class="group/submenu relative"
        @mouseenter="openChild(child.children?.length ? child.id : undefined)"
        @mouseleave="closeChild"
        @focusin="openChild(child.children?.length ? child.id : undefined)"
        @focusout="handleChildFocusout"
      >
        <button
          v-if="child.children?.length"
          :id="`menu-trigger-${child.id}`"
          type="button"
          class="hover:text-main-500 relative block w-full px-4 py-2 pr-9 text-left whitespace-nowrap"
          aria-haspopup="true"
          :aria-expanded="openChildId === child.id"
          :aria-controls="`submenu-${child.id}`"
        >
          {{ child.title }}
        </button>
        <NuxtLink
          v-else-if="child.href"
          :to="child.href"
          class="hover:text-main-500 relative block px-4 py-2 pr-9 whitespace-nowrap"
        >
          {{ child.title }}
        </NuxtLink>
        <span v-else class="relative block px-4 py-2 pr-9 whitespace-nowrap text-gray-600">
          {{ child.title }}
        </span>

        <SingleSubmenu
          v-if="child.children?.length"
          :item="child"
          nested
          :panel-id="`submenu-${child.id}`"
          :open="openChildId === child.id"
          @close="closeChild"
        />
      </li>
    </ul>
  </div>
</template>
