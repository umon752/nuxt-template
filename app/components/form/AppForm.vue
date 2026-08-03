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

const props = withDefaults(defineProps<TProps>(), {
  state: undefined,
  schema: undefined,
  disabled: false,
  loadingAuto: true,
  formClass: '',
})

const attrs = useAttrs()
const formClass = computed(() => cn(attrs.class as ClassValue, props.formClass))
</script>

<template>
  <UForm
    v-bind="attrs"
    :state="props.state"
    :schema="props.schema"
    :disabled="props.disabled"
    :loading-auto="props.loadingAuto"
    :class="formClass"
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </UForm>
</template>
