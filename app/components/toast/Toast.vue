<script setup lang="ts">
import type { ClassValue } from 'clsx'
import type { CSSProperties } from 'vue'

import type { TToastAriaLive, TToastPosition, TToastRole } from '~/types/toast'
import { cn } from '~/utils/cn'

export type TToastInstance = {
  show: () => void
  hide: () => void
  kill: () => void
}

type TProps = {
  modelValue?: boolean
  text?: string
  autoHide?: boolean
  duration?: number
  role?: TToastRole
  ariaLive?: TToastAriaLive
  ariaLabel?: string
  position?: TToastPosition
  x?: string
  y?: string
  toastClass?: ClassValue
  showCloseButton?: boolean
  closeLabel?: string
  removeOnHide?: boolean
}

const props = withDefaults(defineProps<TProps>(), {
  modelValue: false,
  text: '',
  autoHide: true,
  duration: 3000,
  role: 'status',
  ariaLive: 'polite',
  ariaLabel: undefined,
  position: 'fixed',
  x: undefined,
  y: undefined,
  toastClass: '',
  showCloseButton: true,
  closeLabel: undefined,
  removeOnHide: false,
})

const emit = defineEmits<{
  'update:modelValue': [visible: boolean]
  show: []
  hide: []
  kill: []
}>()

defineSlots<{
  text?: (props: { text: string }) => unknown
  actions?: (props: { hide: () => void }) => unknown
}>()

const toastElement = ref<HTMLElement>()
const previousFocus = ref<HTMLElement>()
let timer: ReturnType<typeof setTimeout> | undefined
let isFocusTrapActive = false

const { t } = useI18n()

const normalizedDuration = computed(() => {
  return Number.isFinite(props.duration) ? Math.max(0, props.duration) : 3000
})

const displayText = computed(() => props.text.replace(/<br\s*\/?>/gi, '\n'))
const resolvedCloseLabel = computed(() => props.closeLabel || t('components.toast.close'))

const toastClassName = computed(() =>
  cn(
    'rounded-md pointer-events-auto flex min-w-53.5 max-w-[min(24rem,calc(100vw-2rem))] flex-col items-center gap-3 rounded-2 bg-white px-10.5 py-7 text-center text-slate-950 shadow-[0_0_10px_rgba(0,0,0,0.1)]',
    props.toastClass
  )
)

const toastStyle = computed<CSSProperties>(() => ({
  position: props.position,
  left: props.x,
  top: props.y,
  zIndex: 1080,
}))

const clearTimer = (): void => {
  if (timer !== undefined) {
    clearTimeout(timer)
    timer = undefined
  }
}

const startTimer = (): void => {
  clearTimer()

  if (!props.autoHide || !props.modelValue) {
    return
  }

  timer = setTimeout(() => {
    hide()
  }, normalizedDuration.value)
}

const restoreFocus = (): void => {
  if (!import.meta.client || !previousFocus.value) {
    return
  }

  requestAnimationFrame(() => {
    previousFocus.value?.focus()
    previousFocus.value = undefined
  })
}

const handleDocumentFocusIn = (event: FocusEvent): void => {
  if (
    !props.modelValue ||
    props.role !== 'alertdialog' ||
    !toastElement.value ||
    !(event.target instanceof Node) ||
    toastElement.value.contains(event.target)
  ) {
    return
  }

  toastElement.value.focus()
}

const activateFocusTrap = (): void => {
  if (!import.meta.client || isFocusTrapActive) {
    return
  }

  document.addEventListener('focusin', handleDocumentFocusIn)
  isFocusTrapActive = true
}

const deactivateFocusTrap = (): void => {
  if (!import.meta.client || !isFocusTrapActive) {
    return
  }

  document.removeEventListener('focusin', handleDocumentFocusIn)
  isFocusTrapActive = false
}

const focusAlertDialog = async (): Promise<void> => {
  if (!import.meta.client || props.role !== 'alertdialog') {
    return
  }

  if (document.activeElement instanceof HTMLElement && document.activeElement !== document.body) {
    previousFocus.value = document.activeElement
  }

  await nextTick()
  activateFocusTrap()
  toastElement.value?.focus()
}

const show = (): void => {
  if (props.modelValue) {
    startTimer()
    return
  }

  emit('update:modelValue', true)
}

const hide = (): void => {
  if (!props.modelValue) {
    return
  }

  clearTimer()
  emit('update:modelValue', false)
}

const kill = (): void => {
  clearTimer()
  emit('kill')
}

const handleKeydown = (event: KeyboardEvent): void => {
  if (props.role !== 'alertdialog' || event.key !== 'Tab' || !toastElement.value) {
    return
  }

  const focusableElements = Array.from(
    toastElement.value.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  )

  if (focusableElements.length === 0) {
    event.preventDefault()
    toastElement.value.focus()
    return
  }

  const firstElement = focusableElements[0]
  const lastElement = focusableElements.at(-1)

  if (document.activeElement === toastElement.value) {
    event.preventDefault()

    if (event.shiftKey) {
      lastElement?.focus()
    } else {
      firstElement?.focus()
    }

    return
  }

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault()
    lastElement?.focus()
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault()
    firstElement?.focus()
  }
}

const handleAfterLeave = (): void => {
  if (props.removeOnHide) {
    emit('kill')
  }
}

watch(
  () => props.modelValue,
  async (visible, wasVisible) => {
    if (visible) {
      await focusAlertDialog()
      startTimer()

      if (!wasVisible) {
        emit('show')
      }

      return
    }

    clearTimer()
    deactivateFocusTrap()

    if (wasVisible) {
      restoreFocus()
      emit('hide')
    }
  },
  { immediate: true }
)

watch([() => props.autoHide, normalizedDuration, () => props.text], startTimer)

watch(
  () => props.role,
  async (role, previousRole) => {
    if (!props.modelValue) {
      return
    }

    if (role === 'alertdialog') {
      await focusAlertDialog()
      return
    }

    if (previousRole === 'alertdialog') {
      deactivateFocusTrap()
      restoreFocus()
    }
  }
)

onBeforeUnmount(() => {
  clearTimer()
  deactivateFocusTrap()
  restoreFocus()
})

defineExpose<TToastInstance>({
  show,
  hide,
  kill,
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out motion-reduce:transition-none"
    enter-from-class="translate-y-2 opacity-0 motion-reduce:translate-y-0"
    leave-active-class="transition duration-300 ease-in motion-reduce:transition-none"
    leave-to-class="translate-y-2 opacity-0 motion-reduce:translate-y-0"
    @after-leave="handleAfterLeave"
  >
    <div
      v-if="modelValue"
      ref="toastElement"
      :class="toastClassName"
      :style="toastStyle"
      :role="role"
      :aria-live="ariaLive"
      :aria-label="ariaLabel"
      aria-atomic="true"
      :aria-modal="role === 'alertdialog' ? true : undefined"
      :tabindex="role === 'alertdialog' ? -1 : undefined"
      @keydown="handleKeydown"
    >
      <div class="whitespace-pre-line">
        <slot name="text" :text="displayText">
          {{ displayText }}
        </slot>
      </div>

      <slot name="actions" :hide="hide">
        <BtnDefault v-if="showCloseButton" :text="resolvedCloseLabel" @click="hide" />
      </slot>
    </div>
  </Transition>
</template>
