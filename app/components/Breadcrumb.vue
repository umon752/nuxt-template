<script setup lang="ts">
import type { TBreadcrumbItem } from '../types/breadcrumb'

const props = withDefaults(
  defineProps<{
    items?: TBreadcrumbItem[]
  }>(),
  {
    items: () => [],
  }
)
</script>

<template>
  <nav v-if="props.items.length" :aria-label="$t('components.breadcrumb.ariaLabel')">
    <ol class="flex flex-wrap items-center gap-2">
      <li
        v-for="(item, index) in props.items"
        :key="`${item.href ?? item.title}-${index}`"
        class="flex items-center gap-2"
      >
        <template v-if="index === props.items.length - 1">
          <span aria-current="page">{{ item.title }}</span>
        </template>
        <template v-else>
          <NuxtLink v-if="item.href" :to="item.href">{{ item.title }}</NuxtLink>
          <span v-else>{{ item.title }}</span>
          <span aria-hidden="true">/</span>
        </template>
      </li>
    </ol>
  </nav>
</template>
