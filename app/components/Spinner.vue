<script setup lang="ts">
import type { ClassValue } from 'clsx'
import { cn } from '~/utils/cn'

type TProps = {
  label?: string
  spinnerClass?: ClassValue
}

const props = withDefaults(defineProps<TProps>(), {
  label: undefined,
  spinnerClass: '',
})

const spinnerClassName = computed(() =>
  cn(
    'border-50% text-main-500 inline-block h-6 w-6 shrink-0 animate-[spin_0.75s_linear_infinite] rounded-full border-3 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-none',
    props.spinnerClass
  )
)
</script>

<template>
  <span
    :class="spinnerClassName"
    :role="props.label ? 'status' : undefined"
    :aria-label="props.label"
    :aria-hidden="props.label ? undefined : true"
  />
</template>
