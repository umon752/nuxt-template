<script setup lang="ts">
import type { ClassValue } from 'clsx'

import { cn } from '~/utils/cn'

defineOptions({ inheritAttrs: false })

defineProps<{
  viewBox: string
}>()

const attrs = useAttrs()
const forwardedAttrs = computed(() => {
  const { class: _class, ...restAttrs } = attrs

  return restAttrs
})

const iconClass = computed(() =>
  cn(
    'inline-block size-6 fill-current stroke-current stroke-0 transition-colors duration-300',
    attrs.class as ClassValue
  )
)
</script>

<template>
  <svg
    v-bind="forwardedAttrs"
    :class="iconClass"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="viewBox"
    aria-hidden="true"
  >
    <slot />
  </svg>
</template>
