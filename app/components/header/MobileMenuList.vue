<script setup lang="ts">
import type { TAccordionItem } from '~/components/accordion/Accordion.vue'
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

function isMenuItem(value: unknown): value is TMenuItem {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'string' &&
    'title' in value &&
    typeof value.title === 'string' &&
    'href' in value &&
    typeof value.href === 'string' &&
    'icon' in value &&
    typeof value.icon === 'string'
  )
}

function childrenOf(item: TAccordionItem): TMenuItem[] {
  return Array.isArray(item.children) ? item.children.filter(isMenuItem) : []
}
</script>

<template>
  <ul>
    <li v-for="item in props.items" :key="item.id">
      <div v-if="item.children?.length">
        <Accordion
          :active-items="activeItemsById[item.id] ?? []"
          :items="[item]"
          :collapse-others="false"
          title-class="p-0"
          content-class="p-0"
          @update:active-items="activeItemsById[item.id] = $event"
        >
          <template #title="{ item: aItem, isActive }">
            <div
              class="flex items-center justify-between border-b border-solid border-gray-200 py-3"
              :style="{ paddingLeft: `${level * 16}px` }"
            >
              <span>{{ aItem.title }}</span>
              <span
                aria-hidden="true"
                class="transition-transform duration-200"
                :class="{ 'rotate-180': isActive }"
              >
                <IconChevronDown />
              </span>
            </div>
          </template>

          <template #content="{ item: aItem }">
            <MobileMenuList :items="childrenOf(aItem)" :level="level + 1" />
          </template>
        </Accordion>
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
