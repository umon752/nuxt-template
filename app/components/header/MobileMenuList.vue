<script setup lang="ts">
import Accordion from '~/components/Accordion.vue'
import type { TMenuItem } from '~/composables/useMenu'
import { computed } from 'vue'

defineOptions({ name: 'MobileMenuList' })

const props = defineProps<{
  items: TMenuItem[]
  level?: number
}>()

const level = computed<number>(() => props.level ?? 0)

function childrenOf(it: unknown): TMenuItem[] {
  return ((it as TMenuItem)?.children ?? []) as TMenuItem[]
}
</script>

<template>
  <ul>
    <li v-for="item in props.items" :key="item.id">
      <div v-if="item.children?.length">
        <Accordion :items="[item]" :collapse-others="false" title-class="p-0" content-class="p-0">
          <template #title="{ item: aItem }">
            <div
              class="flex items-center justify-between border-b border-solid border-gray-200 py-3"
              :style="{ paddingLeft: `${level * 16}px` }"
            >
              <span>{{ aItem.title }}</span>
              <IconArrowDown />
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
