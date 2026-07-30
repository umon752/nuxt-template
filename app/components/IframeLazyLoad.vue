<script setup lang="ts">
import type { ClassValue } from 'clsx'
import type { CSSProperties } from 'vue'
import { cn } from '~/utils/cn'

defineOptions({
  inheritAttrs: false,
})

type TProps = {
  src: string
  srcMobile?: string
  srcDesktop?: string
  title: string
  breakpoint?: string
  aspectRatio?: string
  aspectRatioMobile?: string
  aspectRatioDesktop?: string
  loading?: 'eager' | 'lazy'
  rootMargin?: string
  threshold?: number
  iframeClass?: ClassValue
  skeletonClass?: ClassValue
}

const props = withDefaults(defineProps<TProps>(), {
  srcMobile: undefined,
  srcDesktop: undefined,
  breakpoint: '768px',
  aspectRatio: '16 / 9',
  aspectRatioMobile: undefined,
  aspectRatioDesktop: undefined,
  loading: 'lazy',
  rootMargin: '200px',
  threshold: 0,
  iframeClass: '',
  skeletonClass: '',
})

const emit = defineEmits<{
  load: [event: Event]
  error: [event: Event]
}>()

const { t } = useI18n()
const attrs = useAttrs()
const containerRef = useTemplateRef<HTMLDivElement>('containerRef')
const isLoading = ref(true)
const hasError = ref(false)

const hasResponsiveValues = computed(() =>
  Boolean(
    props.srcMobile || props.srcDesktop || props.aspectRatioMobile || props.aspectRatioDesktop
  )
)
const { isDesktop } = useResponsiveBreakpoint({
  breakpoint: () => props.breakpoint,
  enabled: hasResponsiveValues,
})
const { isActivated } = useLazyLoadObserver({
  target: containerRef,
  rootMargin: () => props.rootMargin,
  threshold: () => props.threshold,
})

const resolvedSrc = computed(() => {
  if (isDesktop.value) {
    return props.srcDesktop || props.src
  }

  return props.srcMobile || props.src
})
const resolvedAspectRatio = computed(() => {
  if (isDesktop.value) {
    return props.aspectRatioDesktop || props.aspectRatio
  }

  return props.aspectRatioMobile || props.aspectRatio
})
const containerClassName = computed(() =>
  cn('relative block overflow-hidden bg-slate-100', attrs.class as ClassValue)
)
const iframeClassName = computed(() =>
  cn(
    'absolute inset-0 h-full w-full border-0 transition-opacity duration-300 motion-reduce:transition-none',
    isLoading.value || hasError.value ? 'opacity-0' : 'opacity-100',
    props.iframeClass
  )
)
const skeletonClassName = computed(() =>
  cn('c-skeleton absolute inset-0 overflow-hidden bg-slate-200', props.skeletonClass)
)
const aspectRatioStyle = computed<CSSProperties>(() => ({
  aspectRatio: resolvedAspectRatio.value,
}))
const iframeAttrs = computed(() => {
  const { class: _class, style: _style, ...restAttrs } = attrs

  return restAttrs
})
const resolvedErrorLabel = computed(() => t('components.iframe.error'))

const resetLoadingState = (): void => {
  isLoading.value = true
  hasError.value = false
}

const handleLoad = (event: Event): void => {
  isLoading.value = false
  hasError.value = false
  emit('load', event)
}

const handleError = (event: Event): void => {
  isLoading.value = false
  hasError.value = true
  emit('error', event)
}

watch(isActivated, (active) => {
  if (active) {
    resetLoadingState()
  }
})
watch(resolvedSrc, () => {
  if (isActivated.value) {
    resetLoadingState()
  }
})
</script>

<template>
  <div
    ref="containerRef"
    :class="containerClassName"
    :style="[aspectRatioStyle, attrs.style]"
    :aria-busy="isLoading || undefined"
  >
    <span v-if="isLoading" :class="skeletonClassName" aria-hidden="true">
      <slot name="skeleton" />
    </span>

    <iframe
      v-if="isActivated"
      v-bind="iframeAttrs"
      :src="resolvedSrc"
      :title="props.title"
      :loading="props.loading"
      :class="iframeClassName"
      :aria-hidden="hasError || undefined"
      @load="handleLoad"
      @error="handleError"
    />

    <span
      v-if="hasError"
      class="absolute inset-0 flex items-center justify-center bg-slate-100 p-4 text-center text-sm text-slate-500"
      role="status"
    >
      <slot name="error">{{ resolvedErrorLabel }}</slot>
    </span>
  </div>
</template>

<style scoped>
.c-skeleton::after {
  position: absolute;
  inset: 0;
  content: '';
  background: linear-gradient(105deg, transparent 25%, rgb(255 255 255 / 55%) 50%, transparent 75%);
  transform: translateX(-100%);
  animation: iframe-lazy-load-shimmer 1.5s ease-in-out infinite;
}

@keyframes iframe-lazy-load-shimmer {
  100% {
    transform: translateX(100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .c-skeleton::after {
    animation: none;
  }
}
</style>
