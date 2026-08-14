<script setup lang="ts">
import type { ClassValue } from 'clsx'
import type { CSSProperties, StyleValue } from 'vue'

import { cn } from '~/utils/cn'

defineOptions({
  inheritAttrs: false,
})

export type TCursorContentSlotProps = {
  isLink: boolean
  imageSrc: string | undefined
}

type TProps = {
  disabled?: boolean
  text?: string
  linkHover?: boolean
  hideCursor?: boolean
  touchDevice?: boolean
  triggerClass?: ClassValue
  cursorClass?: ClassValue
  hoverClass?: ClassValue
}

const {
  disabled = false,
  text = '',
  linkHover = false,
  hideCursor = false,
  touchDevice = false,
  triggerClass: triggerClassProp = '',
  cursorClass: cursorClassProp = '',
  hoverClass: hoverClassProp = 'size-12',
} = defineProps<TProps>()

const emit = defineEmits<{
  enter: [event: PointerEvent]
  move: [event: PointerEvent]
  leave: [event: PointerEvent]
}>()

defineSlots<{
  default: () => unknown
  content?: (props: TCursorContentSlotProps) => unknown
}>()

const attrs = useAttrs()
const triggerWrapper = useTemplateRef<HTMLElement>('triggerWrapper')
const cursorElement = useTemplateRef<HTMLDivElement>('cursorElement')
const isVisible = ref(false)
const isPointerInside = ref(false)
const isLink = ref(false)
const activeImageSrc = ref<string>()
const cursorPosition = reactive({
  left: 0,
  top: 0,
})

const instanceId = useId()
const cursorId = `cursor-${instanceId}`

const triggerAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs

  return rest
})

const triggerStyle = computed<StyleValue | undefined>(() => attrs.style as StyleValue | undefined)

const triggerClassName = computed(() =>
  cn(
    'inline-flex',
    attrs.class as ClassValue,
    triggerClassProp,
    hideCursor && isPointerInside.value && !disabled ? 'cursor-none [&_*]:!cursor-none' : ''
  )
)

const isLinkActive = computed(() => linkHover && isLink.value)

const cursorClassName = computed(() =>
  cn(
    'pointer-events-none fixed top-0 left-0 z-[9999] flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white opacity-0 scale-0 transition-[opacity,transform,width,height] duration-200 motion-reduce:transition-none',
    cursorClassProp,
    isLinkActive.value ? hoverClassProp : '',
    isVisible.value ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
  )
)

const cursorStyle = computed<CSSProperties>(() => ({
  left: `${cursorPosition.left}px`,
  top: `${cursorPosition.top}px`,
}))

const getElementFromEvent = (event: PointerEvent): Element | undefined => {
  return event.target instanceof Element ? event.target : undefined
}

const getLinkElement = (event: PointerEvent): Element | undefined => {
  const target = getElementFromEvent(event)
  const link = target?.closest('a, button')

  if (!link || !triggerWrapper.value?.contains(link)) {
    return undefined
  }

  return link
}

const getImageSource = (event: PointerEvent): string | undefined => {
  const target = getElementFromEvent(event)
  const targetImage = target?.closest<HTMLElement>('[data-cursor-img]')

  if (!targetImage || !triggerWrapper.value?.contains(targetImage)) {
    return undefined
  }

  return targetImage.dataset.cursorImg || undefined
}

const syncTargetState = (event: PointerEvent): void => {
  isLink.value = Boolean(linkHover && getLinkElement(event))
  activeImageSrc.value = getImageSource(event)
}

const updateCursorPosition = (event: PointerEvent): void => {
  const left = event.clientX
  const top = event.clientY

  cursorPosition.left = left
  cursorPosition.top = top

  if (cursorElement.value) {
    cursorElement.value.style.left = `${left}px`
    cursorElement.value.style.top = `${top}px`
    return
  }
}

const canHandlePointer = (event: PointerEvent): boolean => {
  if (disabled) {
    return false
  }

  return touchDevice || event.pointerType !== 'touch'
}

const resetCursorState = (): void => {
  isVisible.value = false
  isPointerInside.value = false
  isLink.value = false
  activeImageSrc.value = undefined
}

const handlePointerEnter = (event: PointerEvent): void => {
  if (!canHandlePointer(event)) {
    return
  }

  isPointerInside.value = true
  syncTargetState(event)
  updateCursorPosition(event)
  isVisible.value = true
  emit('enter', event)
}

const handlePointerMove = (event: PointerEvent): void => {
  if (!canHandlePointer(event) || !isPointerInside.value) {
    return
  }

  syncTargetState(event)
  updateCursorPosition(event)
  emit('move', event)
}

const handlePointerLeave = (event: PointerEvent): void => {
  if (!isPointerInside.value) {
    return
  }

  resetCursorState()
  emit('leave', event)
}

watch(
  () => disabled,
  (isDisabled) => {
    if (isDisabled) {
      resetCursorState()
    }
  }
)

watch(
  () => linkHover,
  (isEnabled) => {
    if (!isEnabled) {
      isLink.value = false
    }
  }
)

onBeforeUnmount(resetCursorState)
</script>

<template>
  <div
    ref="triggerWrapper"
    v-bind="triggerAttrs"
    :class="triggerClassName"
    :style="triggerStyle"
    @pointerenter="handlePointerEnter"
    @pointermove="handlePointerMove"
    @pointerleave="handlePointerLeave"
  >
    <slot />
  </div>

  <ClientOnly>
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-150 motion-reduce:transition-none"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-100 motion-reduce:transition-none"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isVisible"
          :id="cursorId"
          ref="cursorElement"
          aria-hidden="true"
          :class="cursorClassName"
          :style="cursorStyle"
        >
          <slot name="content" :is-link="isLinkActive" :image-src="activeImageSrc">
            {{ text }}
          </slot>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>
