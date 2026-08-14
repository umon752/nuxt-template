<script setup lang="ts">
import type { ClassValue } from 'clsx'
import { cn } from '~/utils/cn'

type TProps = {
  text?: string
  btnClass?: ClassValue
}

const { text = undefined, btnClass: btnClassProp = '' } = defineProps<TProps>()

const { t } = useI18n()
const resolvedText = computed(() => text || t('components.button.defaultText'))
const btnClass = computed(() =>
  cn(
    'inline-flex items-center justify-center rounded-md border border-slate-900 bg-slate-900 px-3 py-2 font-medium text-white transition-colors hover:border-slate-700 hover:bg-slate-700 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400',
    btnClassProp
  )
)
</script>

<template>
  <button type="button" :class="btnClass">
    {{ resolvedText }}
  </button>
</template>
