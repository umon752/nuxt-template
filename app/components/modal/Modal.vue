<script setup lang="ts">
import type { ClassValue } from 'clsx'

import { cn } from '~/utils/cn'

export type TModalRole = 'dialog' | 'alertdialog'
export type TModalInitialFocus = 'first' | 'panel'
export type TModalCloseReason = 'close-button' | 'backdrop' | 'escape' | 'programmatic' | 'native'

export type TModalInstance = {
  open: () => void
  close: () => void
}

type TProps = {
  modelValue?: boolean
  title?: string
  role?: TModalRole
  ariaLabel?: string
  ariaDescribedby?: string
  closeOnEscape?: boolean
  closeOnBackdrop?: boolean
  showCloseButton?: boolean
  closeLabel?: string
  initialFocus?: TModalInitialFocus
  overlayClass?: ClassValue
  modalClass?: ClassValue
  headerClass?: ClassValue
  bodyClass?: ClassValue
  footerClass?: ClassValue
  closeButtonClass?: ClassValue
}

const {
  modelValue = false,
  title = '',
  role = 'dialog',
  ariaLabel = undefined,
  ariaDescribedby = undefined,
  closeOnEscape = true,
  closeOnBackdrop = true,
  showCloseButton = true,
  closeLabel = undefined,
  initialFocus = 'first',
  overlayClass = '',
  modalClass = '',
  headerClass = '',
  bodyClass = '',
  footerClass = '',
  closeButtonClass = '',
} = defineProps<TProps>()

const emit = defineEmits<{
  'update:modelValue': [visible: boolean]
  open: []
  close: [reason: TModalCloseReason]
}>()

const slots = defineSlots<{
  title?: () => unknown
  default?: (props: { close: () => void }) => unknown
  footer?: (props: { close: () => void }) => unknown
  closeIcon?: () => unknown
}>()

//----------------------------
// state and native dialog
//----------------------------
const { t } = useI18n()
const { lock, unlock } = useModalScrollLock()

const dialogElement = ref<HTMLDialogElement>()
const panelElement = ref<HTMLElement>()
const previousFocus = ref<HTMLElement>()
const isDialogMounted = ref(false)
const isRendered = ref(false)
const instanceId = useId()

let isMounted = false
let isInternalNativeClose = false
let isCloseFinalized = true
let pendingCloseReason: TModalCloseReason = 'programmatic'
let syncSequence = 0

//----------------------------
// accessibility and classes
//----------------------------
const focusableSelector = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

const titleId = `modal-title-${instanceId}`
const hasTitle = computed(() => Boolean(title || slots.title))
const resolvedCloseLabel = computed(() => closeLabel || t('components.modal.close'))
const ariaLabelledby = computed(() => {
  return ariaLabel || !hasTitle.value ? undefined : titleId
})

const overlayClassName = computed(() =>
  cn(
    'fixed inset-0 flex min-h-full items-center justify-center overflow-y-auto bg-slate-950/65 p-4 backdrop-blur-sm',
    overlayClass
  )
)
const modalClassName = computed(() =>
  cn(
    'my-auto flex w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white text-left text-slate-950 shadow-2xl',
    modalClass
  )
)
const headerClassName = computed(() =>
  cn('flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-4', headerClass)
)
const bodyClassName = computed(() => cn('px-6 py-5', bodyClass))
const footerClassName = computed(() =>
  cn('flex flex-wrap justify-end gap-3 border-t border-slate-200 px-6 py-4', footerClass)
)
const closeButtonClassName = computed(() =>
  cn(
    'inline-flex size-10 shrink-0 items-center justify-center rounded-md text-2xl leading-none text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600',
    closeButtonClass
  )
)

//----------------------------
// focus management
//----------------------------
const getFocusableElements = (): HTMLElement[] => {
  const panel = panelElement.value

  if (!panel) {
    return []
  }

  return Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector)).filter((element) => {
    return (
      element.tabIndex >= 0 &&
      !element.matches(':disabled') &&
      element.getAttribute('aria-hidden') !== 'true' &&
      !element.hidden &&
      element.getClientRects().length > 0
    )
  })
}

const focusInitialElement = (): void => {
  const panel = panelElement.value

  if (!panel) {
    return
  }

  if (initialFocus === 'panel') {
    panel.focus()
    return
  }

  const focusTarget = panel.querySelector<HTMLElement>('[autofocus]') ?? getFocusableElements()[0]

  if (focusTarget) {
    focusTarget.focus()
    return
  }

  panel.focus()
}

const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key !== 'Tab') {
    return
  }

  const panel = panelElement.value

  if (!panel) {
    return
  }

  const focusableElements = getFocusableElements()

  if (focusableElements.length === 0) {
    event.preventDefault()
    panel.focus()
    return
  }

  const activeElement = document.activeElement
  const activeIndex = focusableElements.findIndex((element) => element === activeElement)
  const isMovingBeforeFirst = event.shiftKey && activeIndex <= 0
  const isMovingAfterLast = !event.shiftKey && activeIndex === focusableElements.length - 1
  const isFocusOutsidePanel = !panel.contains(activeElement)

  if (!isMovingBeforeFirst && !isMovingAfterLast && !isFocusOutsidePanel) {
    return
  }

  event.preventDefault()

  const focusTarget = event.shiftKey ? focusableElements.at(-1) : focusableElements[0]
  focusTarget?.focus()
}

const restoreFocus = (): void => {
  if (!import.meta.client || !previousFocus.value) {
    return
  }

  const focusTarget = previousFocus.value
  previousFocus.value = undefined

  requestAnimationFrame(() => {
    if (!dialogElement.value?.open && focusTarget.isConnected) {
      focusTarget.focus()
    }
  })
}

//----------------------------
// close flow
//----------------------------
const completeClose = (reason: TModalCloseReason): void => {
  if (isCloseFinalized) {
    return
  }

  isCloseFinalized = true
  unlock()
  restoreFocus()
  emit('close', reason)
  pendingCloseReason = 'programmatic'
}

const finalizeClose = (): void => {
  if (isCloseFinalized) {
    return
  }

  const dialog = dialogElement.value

  if (dialog?.open) {
    isInternalNativeClose = true
    dialog.close()
  }

  completeClose(pendingCloseReason)
  isDialogMounted.value = false
}

const beginClose = (reason: TModalCloseReason): void => {
  syncSequence += 1
  pendingCloseReason = reason

  if (!dialogElement.value?.open) {
    isRendered.value = false
    isDialogMounted.value = false
    return
  }

  isRendered.value = false
}

const requestClose = (reason: TModalCloseReason): void => {
  beginClose(reason)

  if (modelValue) {
    emit('update:modelValue', false)
  }
}

//----------------------------
// open and event handlers
//----------------------------
const showNativeModal = async (): Promise<void> => {
  if (!import.meta.client || !isMounted) {
    return
  }

  const sequence = ++syncSequence
  isDialogMounted.value = true
  await nextTick()

  if (sequence !== syncSequence || !modelValue) {
    return
  }

  const dialog = dialogElement.value

  if (!dialog) {
    return
  }

  if (!dialog.open) {
    if (document.activeElement instanceof HTMLElement && document.activeElement !== document.body) {
      previousFocus.value = document.activeElement
    }

    dialog.showModal()
    lock()
  }

  isCloseFinalized = false
  isRendered.value = true
  await nextTick()
  focusInitialElement()
  emit('open')
}

const open = (): void => {
  if (modelValue) {
    void showNativeModal()
    return
  }

  emit('update:modelValue', true)
}

const close = (): void => {
  requestClose('programmatic')
}

const handleCancel = (event: Event): void => {
  event.preventDefault()

  if (closeOnEscape) {
    requestClose('escape')
  }
}

const handleBackdropClick = (event: MouseEvent): void => {
  if (closeOnBackdrop && event.target === event.currentTarget) {
    requestClose('backdrop')
  }
}

const handleNativeClose = (): void => {
  if (isInternalNativeClose) {
    isInternalNativeClose = false
    return
  }

  syncSequence += 1
  isRendered.value = false

  if (modelValue) {
    emit('update:modelValue', false)
  }

  completeClose('native')
}

//----------------------------
// watchers and lifecycle
//----------------------------
watch(
  () => modelValue,
  (visible) => {
    if (!isMounted) {
      return
    }

    if (visible) {
      void showNativeModal()
      return
    }

    beginClose(pendingCloseReason)
  }
)

onMounted(() => {
  isMounted = true

  if (modelValue) {
    void showNativeModal()
  }
})

onBeforeUnmount(() => {
  isMounted = false
  syncSequence += 1
  isRendered.value = false

  if (dialogElement.value?.open) {
    isInternalNativeClose = true
    dialogElement.value.close()
  }

  unlock()
  restoreFocus()
  isDialogMounted.value = false
})

defineExpose<TModalInstance>({
  open,
  close,
})
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <dialog
        v-if="isDialogMounted"
        ref="dialogElement"
        class="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-transparent p-0 text-inherit outline-none backdrop:bg-transparent"
        :role="role"
        aria-modal="true"
        :aria-label="ariaLabel"
        :aria-labelledby="ariaLabelledby"
        :aria-describedby="ariaDescribedby"
        @cancel="handleCancel"
        @close="handleNativeClose"
        @keydown="handleKeydown"
      >
        <Transition
          enter-active-class="transition-opacity duration-200 ease-out motion-reduce:transition-none"
          enter-from-class="opacity-0"
          leave-active-class="transition-opacity duration-150 ease-in motion-reduce:transition-none"
          leave-to-class="opacity-0"
          @after-leave="finalizeClose"
        >
          <div v-if="isRendered" :class="overlayClassName" @click.self="handleBackdropClick">
            <section ref="panelElement" :class="modalClassName" tabindex="-1">
              <header v-if="hasTitle || showCloseButton" :class="headerClassName">
                <h2 v-if="hasTitle" :id="titleId" class="text-xl font-bold">
                  <slot name="title">{{ title }}</slot>
                </h2>

                <button
                  v-if="showCloseButton"
                  type="button"
                  :class="closeButtonClassName"
                  :aria-label="resolvedCloseLabel"
                  @click="requestClose('close-button')"
                >
                  <slot name="closeIcon">
                    <span aria-hidden="true">&times;</span>
                  </slot>
                </button>
              </header>

              <div :class="bodyClassName">
                <slot :close="close" />
              </div>

              <footer v-if="slots.footer" :class="footerClassName">
                <slot name="footer" :close="close" />
              </footer>
            </section>
          </div>
        </Transition>
      </dialog>
    </Teleport>
  </ClientOnly>
</template>
