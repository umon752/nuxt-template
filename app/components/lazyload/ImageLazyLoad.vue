<script setup lang="ts">
import type { ClassValue } from 'clsx'
import type { CSSProperties } from 'vue'
import { cn } from '~/utils/cn'

defineOptions({
  inheritAttrs: false,
})

type TObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'

type TProps = {
  src: string
  srcMobile?: string
  srcDesktop?: string
  alt?: string
  fallbackSrc?: string
  breakpoint?: string
  aspectRatio?: string
  aspectRatioMobile?: string
  aspectRatioDesktop?: string
  objectFit?: TObjectFit
  loading?: 'eager' | 'lazy'
  decoding?: 'async' | 'auto' | 'sync'
  rootMargin?: string
  threshold?: number
  imgClass?: ClassValue
  skeletonClass?: ClassValue
}

const {
  src,
  srcMobile = undefined,
  srcDesktop = undefined,
  alt = '',
  fallbackSrc = '/images/nopic.png',
  breakpoint = '768px',
  aspectRatio = '16 / 9',
  aspectRatioMobile = undefined,
  aspectRatioDesktop = undefined,
  objectFit = 'cover',
  loading = 'lazy',
  decoding = 'async',
  rootMargin = '200px',
  threshold = 0,
  imgClass = '',
  skeletonClass = '',
} = defineProps<TProps>()

const emit = defineEmits<{
  load: [event: Event]
  error: [event: Event]
}>()

//----------------------------
// state and responsive loading
//----------------------------
const { t } = useI18n()
const attrs = useAttrs()
const containerRef = useTemplateRef<HTMLSpanElement>('containerRef')
const imageRef = useTemplateRef<HTMLImageElement>('imageRef')
const resolvedMobileSrc = computed(() => srcMobile || src)
const resolvedDesktopSrc = computed(() => srcDesktop || src)
const currentSrc = ref(resolvedMobileSrc.value)
const isLoading = ref(true)
const hasError = ref(false)
const isUsingFallback = ref(false)

//----------------------------
// responsive media and classes
//----------------------------
const objectFitClasses: Record<TObjectFit, string> = {
  contain: 'object-contain',
  cover: 'object-cover',
  fill: 'object-fill',
  none: 'object-none',
  'scale-down': 'object-scale-down',
}

const containerClassName = computed(() =>
  cn('relative block overflow-hidden bg-slate-100', attrs.class as ClassValue)
)
const imageClassName = computed(() =>
  cn(
    'absolute inset-0 size-full transition-[opacity,scale] duration-300 motion-reduce:transition-none',
    objectFitClasses[objectFit],
    isLoading.value || hasError.value ? 'opacity-0' : 'opacity-100',
    imgClass
  )
)
const skeletonClassName = computed(() =>
  cn('c-skeleton absolute inset-0 overflow-hidden bg-slate-200', skeletonClass)
)
const desktopMedia = computed(() => `(min-width: ${breakpoint})`)
const hasResponsiveSource = computed(() => Boolean(srcMobile || srcDesktop))
const hasResponsiveAspectRatio = computed(() => Boolean(aspectRatioMobile || aspectRatioDesktop))
const { isDesktop } = useResponsiveBreakpoint({
  breakpoint: () => breakpoint,
  enabled: hasResponsiveAspectRatio,
})
const { isActivated } = useLazyLoadObserver({
  target: containerRef,
  rootMargin: () => rootMargin,
  threshold: () => threshold,
})
//----------------------------
// image attributes and fallback
//----------------------------
const resolvedAspectRatio = computed(() => {
  if (isDesktop.value) {
    return aspectRatioDesktop || aspectRatio
  }

  return aspectRatioMobile || aspectRatio
})
const aspectRatioStyle = computed<CSSProperties>(() => ({
  aspectRatio: resolvedAspectRatio.value,
}))
const activeSrc = computed(() => (isActivated.value ? currentSrc.value : undefined))
const resolvedErrorLabel = computed(() => alt || t('components.image.error'))
const imageAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    srcset: _srcset,
    sizes: _sizes,
    ...attrsWithoutResponsiveSources
  } = attrs

  if (!isActivated.value || isUsingFallback.value) {
    return attrsWithoutResponsiveSources
  }

  return {
    ...attrsWithoutResponsiveSources,
    ...(_srcset === undefined ? {} : { srcset: _srcset }),
    ...(_sizes === undefined ? {} : { sizes: _sizes }),
  }
})

//----------------------------
// image events and watchers
//----------------------------
const reset = (): void => {
  currentSrc.value = resolvedMobileSrc.value
  isLoading.value = true
  hasError.value = false
  isUsingFallback.value = false

  void nextTick(syncCompleteImage)
}

function syncCompleteImage(): void {
  const image = imageRef.value

  if (!isActivated.value || !image?.complete) {
    return
  }

  if (image.naturalWidth > 0) {
    isLoading.value = false
    hasError.value = false
  } else {
    handleError(new Event('error'))
  }
}

const handleLoad = (event: Event): void => {
  isLoading.value = false
  hasError.value = false
  emit('load', event)
}

const handleError = (event: Event): void => {
  emit('error', event)

  if (fallbackSrc && !isUsingFallback.value && currentSrc.value !== fallbackSrc) {
    isUsingFallback.value = true
    currentSrc.value = fallbackSrc
    return
  }

  isLoading.value = false
  hasError.value = true
}

watch([resolvedMobileSrc, resolvedDesktopSrc, () => breakpoint], reset)
watch(isActivated, (active) => {
  if (active) {
    isLoading.value = true
    void nextTick(syncCompleteImage)
  }
})
</script>

<template>
  <span
    ref="containerRef"
    :class="containerClassName"
    :style="[aspectRatioStyle, attrs.style]"
    :aria-busy="isLoading || undefined"
  >
    <span v-if="isLoading" :class="skeletonClassName" aria-hidden="true">
      <slot name="skeleton" />
    </span>

    <picture>
      <source
        v-if="isActivated && hasResponsiveSource && !isUsingFallback"
        :media="desktopMedia"
        :srcset="resolvedDesktopSrc"
      />
      <img
        ref="imageRef"
        v-bind="imageAttrs"
        :src="activeSrc"
        :alt="alt"
        :loading="loading"
        :decoding="decoding"
        :class="imageClassName"
        :aria-hidden="hasError || undefined"
        @load="handleLoad"
        @error="handleError"
      />
    </picture>

    <span
      v-if="hasError"
      class="absolute inset-0 flex items-center justify-center bg-slate-100 p-4 text-center text-sm text-slate-500"
      role="img"
      :aria-label="resolvedErrorLabel"
    >
      <slot name="error">{{ $t('components.image.error') }}</slot>
    </span>
  </span>
</template>

<style scoped>
.c-skeleton::after {
  position: absolute;
  inset: 0;
  content: '';
  background: linear-gradient(105deg, transparent 25%, rgb(255 255 255 / 55%) 50%, transparent 75%);
  transform: translateX(-100%);
  animation: image-lazy-load-shimmer 1.5s ease-in-out infinite;
}

@keyframes image-lazy-load-shimmer {
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
