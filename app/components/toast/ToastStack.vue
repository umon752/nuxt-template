<script setup lang="ts">
import type { ClassValue } from 'clsx'
import type { CSSProperties } from 'vue'

import type { TToastPosition } from '~/types/toast'
import { useToast } from '~/composables/useToast'
import { cn } from '~/utils/cn'
import Toast from './Toast.vue'

type TProps = {
  position?: TToastPosition
  x?: string
  y?: string
  stackClass?: ClassValue
  toastClass?: ClassValue
}

const props = withDefaults(defineProps<TProps>(), {
  position: 'fixed',
  x: undefined,
  y: undefined,
  stackClass: '',
  toastClass: '',
})

const { toasts, hide, remove } = useToast()

const stackClassName = computed(() =>
  cn(
    'pointer-events-none right-4 top-4 z-[1080] flex w-fit max-w-[calc(100vw-2rem)] flex-col items-end gap-2',
    props.stackClass
  )
)

const stackStyle = computed<CSSProperties>(() => ({
  position: props.position,
  left: props.x,
  right: props.x === undefined ? undefined : 'auto',
  top: props.y,
}))
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <div :class="stackClassName" :style="stackStyle">
        <Toast
          v-for="toast in toasts"
          :key="toast.id"
          :model-value="toast.visible"
          :text="toast.text"
          :auto-hide="toast.autoHide"
          :duration="toast.duration"
          :role="toast.role"
          :aria-live="toast.ariaLive"
          :aria-label="toast.ariaLabel"
          :position="toast.position"
          :x="toast.x"
          :y="toast.y"
          :toast-class="cn(props.toastClass, toast.toastClass)"
          :show-close-button="toast.showCloseButton"
          :close-label="toast.closeLabel"
          remove-on-hide
          @update:model-value="(visible) => !visible && hide(toast.id)"
          @kill="remove(toast.id)"
        />
      </div>
    </Teleport>
  </ClientOnly>
</template>
