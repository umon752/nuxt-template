<script setup lang="ts">
import type { TMenuItem } from '~/composables/useMenu'
import { computed } from 'vue'

defineOptions({ name: 'MobileMenuList' })

const props = defineProps<{
  items: TMenuItem[]
  level?: number
}>()

const level = computed<number>(() => props.level ?? 0)
const activeItemsById = reactive<Record<string, number[]>>(
  Object.fromEntries(props.items.map((item) => [item.id, []]))
)

const isItemExpanded = (itemId: string): boolean => {
  return activeItemsById[itemId]?.includes(0) ?? false
}

const toggleItem = (itemId: string): void => {
  activeItemsById[itemId] = isItemExpanded(itemId) ? [] : [0]
}

function childrenOf(item: TMenuItem): TMenuItem[] {
  return item.children ?? []
}
</script>

<template>
  <ul :class="{ '[&>li:last-child>div]:border-b-0': level > 0 }">
    <li v-for="item in props.items" :key="item.id">
      <div v-if="item.children?.length" class="border-b border-solid border-gray-200">
        <div class="flex items-center" :style="{ paddingLeft: `${level * 16}px` }">
          <NuxtLink v-if="item.href" :to="item.href" class="min-w-0 flex-1 py-3">
            {{ item.title }}
          </NuxtLink>
          <button
            :id="`mobile-menu-trigger-${item.id}`"
            type="button"
            :aria-expanded="isItemExpanded(item.id)"
            :aria-controls="`mobile-menu-content-${item.id}`"
            :aria-label="
              item.href ? $t('header.menu.toggleSubmenu', { title: item.title }) : undefined
            "
            :class="[
              'inline-flex items-center py-3',
              item.href ? 'shrink-0 px-3' : 'w-full justify-between px-0 text-left',
            ]"
            @click="toggleItem(item.id)"
          >
            <span v-if="!item.href">{{ item.title }}</span>
            <IconChevronDown
              aria-hidden="true"
              class="transition-transform duration-200"
              :class="{ 'rotate-180': isItemExpanded(item.id) }"
            />
          </button>
        </div>
        <div
          :id="`mobile-menu-content-${item.id}`"
          class="grid transition-[grid-template-rows] duration-500 ease-in-out"
          :class="isItemExpanded(item.id) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
          role="region"
          :aria-labelledby="`mobile-menu-trigger-${item.id}`"
          :aria-hidden="!isItemExpanded(item.id)"
          :inert="!isItemExpanded(item.id)"
        >
          <div class="overflow-hidden">
            <MobileMenuList :items="childrenOf(item)" :level="level + 1" />
          </div>
        </div>
      </div>

      <div
        v-else
        :style="{ paddingLeft: `${level * 16}px` }"
        class="border-b border-solid border-gray-200"
      >
        <NuxtLink v-if="item.href" :to="item.href" class="block py-3">
          {{ item.title }}
        </NuxtLink>
        <div v-else class="py-3 text-gray-600">
          {{ item.title }}
        </div>
      </div>
    </li>
  </ul>
</template>
