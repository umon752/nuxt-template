<script setup lang="ts">
import type { ClassValue } from 'clsx'

import { cn } from '~/utils/cn'

type TProps = {
  banner?: string
  alt?: string
  class?: ClassValue
}

const { banner = '', alt = undefined, class: classProp = '' } = defineProps<TProps>()

const { t } = useI18n()
const resolvedAlt = computed(() => alt || t('components.pageHeader.bannerAlt'))
const imageClass = computed(() => cn('block h-auto w-full aspect-[3/2] object-cover', classProp))
</script>
<template>
  <img :src="banner" :alt="resolvedAlt" :class="imageClass" />
</template>
