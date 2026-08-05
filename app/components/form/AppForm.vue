<script setup lang="ts">
import type { FormSchema } from '@nuxt/ui'
import type { ClassValue } from 'clsx'

import { cn } from '~/utils/cn'

type TProps = {
  state?: Record<string, unknown>
  schema?: FormSchema
  disabled?: boolean
  loadingAuto?: boolean
  formClass?: ClassValue
}

defineOptions({ inheritAttrs: false })

const {
  state = undefined,
  schema = undefined,
  disabled = false,
  loadingAuto = true,
  formClass: formClassProp = '',
} = defineProps<TProps>()

const attrs = useAttrs()
const formClass = computed(() => cn(attrs.class as ClassValue, formClassProp))
</script>

<template>
  <UForm
    v-bind="attrs"
    :state="state"
    :schema="schema"
    :disabled="disabled"
    :loading-auto="loadingAuto"
    :class="formClass"
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </UForm>
</template>
