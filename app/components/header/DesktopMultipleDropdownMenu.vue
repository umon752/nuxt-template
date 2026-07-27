<script setup lang="ts">
import type { TMenuItem } from '~/composables/useMenu'

defineOptions({
  name: 'MultipleSubmenu',
})

const props = withDefaults(
  defineProps<{
    item: TMenuItem
    nested?: boolean
  }>(),
  {
    nested: false,
  }
)

// 一排 8 個選單項目，超過 8 個就換下一排
const itemsPerColumn = 8

const hasChildren = computed(() => Boolean(props.item.children?.length))
const panelRef = ref<HTMLElement | null>(null)
const isNested = computed(() => props.nested)

const columns = computed(() => {
  if (!props.item.children?.length) return []

  const items = props.item.children
  const result: TMenuItem[][] = []

  for (let index = 0; index < items.length; index += itemsPerColumn) {
    result.push(items.slice(index, index + itemsPerColumn))
  }

  return result
})

const panelStyle = computed(() => {
  const columnCount = Math.max(columns.value.length, 1)

  return {
    minWidth: `${columnCount * 14}rem`,
  }
})

const { panelStyle: positionStyle, refreshPosition } = useDropdownMenuPosition({
  panelRef,
  nested: isNested,
})

const panelClass = computed((): string => {
  if (props.nested) {
    return 'invisible absolute z-50 px-7 min-w-48 opacity-0 transition peer-focus-within/submenu-trigger:visible peer-focus-within/submenu-trigger:opacity-100 peer-hover/submenu-trigger:visible peer-hover/submenu-trigger:opacity-100 hover:visible hover:opacity-100 focus-within:visible focus-within:opacity-100'
  }

  return 'invisible absolute z-50 min-w-48 pt-5 opacity-0 transition group-focus-within/menu:visible group-focus-within/menu:opacity-100 group-hover/menu:visible group-hover/menu:opacity-100 hover:visible hover:opacity-100 focus-within:visible focus-within:opacity-100'
})
</script>

<template>
  <div
    v-if="hasChildren"
    ref="panelRef"
    :class="panelClass"
    :style="[panelStyle, positionStyle]"
    @mouseenter="refreshPosition"
    @focusin="refreshPosition"
  >
    <div class="rounded-md bg-white px-6 shadow-lg">
      <div class="grid auto-cols-fr grid-flow-col gap-x-8">
        <ul v-for="(column, columnIndex) in columns" :key="columnIndex">
          <li
            v-for="child in column"
            :key="child.id"
            class="group/submenu relative border-b border-gray-200 last:border-b-0"
          >
            <NuxtLink
              v-if="child.href"
              :to="child.href"
              class="peer/submenu-trigger hover:text-main-500 relative block py-4 pr-9 text-lg leading-snug transition"
            >
              {{ child.title }}
            </NuxtLink>
            <button
              v-else
              type="button"
              class="peer/submenu-trigger relative cursor-auto py-4 pr-9 text-lg leading-snug"
            >
              {{ child.title }}
            </button>

            <MultipleSubmenu v-if="child.children?.length" :item="child" nested />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
