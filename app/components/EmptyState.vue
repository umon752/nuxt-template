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

const props = withDefaults(defineProps<TProps>(), {
  description: '',
  emptyClass: '',
  titleClass: '',
  descriptionClass: '',
})

const emptyClassName = computed(() =>
  cn(
    'flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 px-6 py-12 text-center',
    props.emptyClass
  )
)

const titleClassName = computed(() => cn('text-lg font-semibold text-slate-900', props.titleClass))

const descriptionClassName = computed(() =>
  cn('max-w-prose text-sm text-slate-600', props.descriptionClass)
)
</script>

<template>
  <div :class="emptyClassName" role="status">
    <p :class="titleClassName">{{ props.title }}</p>
    <p v-if="props.description" :class="descriptionClassName">{{ props.description }}</p>
  </div>
</template>
