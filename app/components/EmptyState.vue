<script setup lang="ts">
import type { ClassValue } from 'clsx'

import { cn } from '~/utils/cn'

type TProps = {
  title: string
  description?: string
  emptyClass?: ClassValue
  titleClass?: ClassValue
  descriptionClass?: ClassValue
}

const {
  title,
  description = '',
  emptyClass = '',
  titleClass = '',
  descriptionClass = '',
} = defineProps<TProps>()

const emptyClassName = computed(() =>
  cn(
    'flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 px-6 py-12 text-center',
    emptyClass
  )
)

const titleClassName = computed(() => cn('text-lg font-semibold text-slate-900', titleClass))

const descriptionClassName = computed(() =>
  cn('max-w-prose text-sm text-slate-600', descriptionClass)
)
</script>

<template>
  <div :class="emptyClassName" role="status">
    <p :class="titleClassName">{{ title }}</p>
    <p v-if="description" :class="descriptionClassName">{{ description }}</p>
  </div>
</template>
