<script setup lang="ts">
import type { TBreadcrumbItem } from '../../types/breadcrumb'

type TProps = {
  items?: TBreadcrumbItem[]
}

const { items = [] } = defineProps<TProps>()

const isHomeItem = (item: TBreadcrumbItem, index: number): boolean => {
  return index === 0 && item.href === '/'
}
</script>

<template>
  <nav v-if="items.length" :aria-label="$t('components.breadcrumb.ariaLabel')">
    <ol class="flex flex-wrap items-center gap-2">
      <li
        v-for="(item, index) in items"
        :key="`${item.href ?? item.title}-${index}`"
        class="flex items-center gap-2"
      >
        <template v-if="index === items.length - 1">
          <span v-if="isHomeItem(item, index)" class="inline-flex items-center" aria-current="page">
            <IconHome class="size-4 shrink-0" />
            <span class="sr-only">{{ item.title }}</span>
          </span>
          <span v-else aria-current="page">{{ item.title }}</span>
        </template>
        <template v-else>
          <NuxtLink v-if="item.href" :to="item.href">
            <template v-if="isHomeItem(item, index)">
              <IconHome class="size-4 shrink-0 hover:text-slate-500" />
              <span class="sr-only">{{ item.title }}</span>
            </template>
            <template v-else>{{ item.title }}</template>
          </NuxtLink>
          <span v-else>{{ item.title }}</span>
          <span aria-hidden="true">/</span>
        </template>
      </li>
    </ol>
  </nav>
</template>
