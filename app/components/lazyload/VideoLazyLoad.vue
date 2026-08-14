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
  poster?: string
  posterMobile?: string
  posterDesktop?: string
  breakpoint?: string
  aspectRatio?: string
  aspectRatioMobile?: string
  aspectRatioDesktop?: string
  controls?: boolean
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  playsinline?: boolean
  preload?: 'auto' | 'metadata' | 'none'
  objectFit?: TObjectFit
  rootMargin?: string
  threshold?: number
  videoClass?: ClassValue
  skeletonClass?: ClassValue
}

const {
  src,
  srcMobile = undefined,
  srcDesktop = undefined,
  poster = '',
  posterMobile = undefined,
  posterDesktop = undefined,
  breakpoint = '768px',
  aspectRatio = '16 / 9',
  aspectRatioMobile = undefined,
  aspectRatioDesktop = undefined,
  controls = false,
  autoplay = false,
  muted = false,
  loop = false,
  playsinline = true,
  preload = 'metadata',
  objectFit = 'cover',
  rootMargin = '200px',
  threshold = 0,
  videoClass = '',
  skeletonClass = '',
} = defineProps<TProps>()

const emit = defineEmits<{
  load: [event: Event]
  error: [event: Event]
}>()

//----------------------------
// state and lazy loading
//----------------------------
const { t } = useI18n()
const attrs = useAttrs()
const containerRef = useTemplateRef<HTMLDivElement>('containerRef')
const videoRef = useTemplateRef<HTMLVideoElement>('videoRef')
const isLoading = ref(true)
const hasError = ref(false)

const hasResponsiveValues = computed(() =>
  Boolean(
    srcMobile ||
    srcDesktop ||
    posterMobile ||
    posterDesktop ||
    aspectRatioMobile ||
    aspectRatioDesktop
  )
)
const { isDesktop } = useResponsiveBreakpoint({
  breakpoint: () => breakpoint,
  enabled: hasResponsiveValues,
})
const { isActivated } = useLazyLoadObserver({
  target: containerRef,
  rootMargin: () => rootMargin,
  threshold: () => threshold,
})

//----------------------------
// responsive media and classes
//----------------------------
const resolvedSrc = computed(() => {
  if (isDesktop.value) {
    return srcDesktop || src
  }

  return srcMobile || src
})
const resolvedPoster = computed(() => {
  if (isDesktop.value) {
    return posterDesktop || poster
  }

  return posterMobile || poster
})
const resolvedAspectRatio = computed(() => {
  if (isDesktop.value) {
    return aspectRatioDesktop || aspectRatio
  }

  return aspectRatioMobile || aspectRatio
})
const activeSrc = computed(() => (isActivated.value ? resolvedSrc.value : undefined))
const activePoster = computed(() =>
  isActivated.value && resolvedPoster.value ? resolvedPoster.value : undefined
)
const containerClassName = computed(() =>
  cn('relative block overflow-hidden bg-slate-100', attrs.class as ClassValue)
)
const objectFitClasses: Record<TObjectFit, string> = {
  contain: 'object-contain',
  cover: 'object-cover',
  fill: 'object-fill',
  none: 'object-none',
  'scale-down': 'object-scale-down',
}
const videoClassName = computed(() =>
  cn(
    'absolute inset-0 size-full transition-opacity duration-300 motion-reduce:transition-none',
    objectFitClasses[objectFit],
    isLoading.value || hasError.value ? 'opacity-0' : 'opacity-100',
    videoClass
  )
)
const skeletonClassName = computed(() =>
  cn('c-skeleton absolute inset-0 overflow-hidden bg-slate-200', skeletonClass)
)
const aspectRatioStyle = computed<CSSProperties>(() => ({
  aspectRatio: resolvedAspectRatio.value,
}))
const mediaAttrs = computed(() => {
  const { class: _class, style: _style, ...restAttrs } = attrs

  return restAttrs
})
const resolvedErrorLabel = computed(() => t('components.video.error'))

//----------------------------
// media events and loading state
//----------------------------
const resetLoadingState = (): void => {
  isLoading.value = true
  hasError.value = false
}

const loadVideo = (): void => {
  resetLoadingState()

  void nextTick(() => {
    videoRef.value?.load()

    if (preload === 'none') {
      isLoading.value = false
    }
  })
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

//----------------------------
// watchers
//----------------------------
watch(isActivated, (active) => {
  if (active) {
    loadVideo()
  }
})
watch([resolvedSrc, () => preload], () => {
  if (isActivated.value) {
    loadVideo()
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

    <video
      ref="videoRef"
      v-bind="mediaAttrs"
      :src="activeSrc"
      :poster="activePoster"
      :controls="controls"
      :autoplay="autoplay"
      :muted="muted"
      :loop="loop"
      :playsinline="playsinline"
      :preload="preload"
      :class="videoClassName"
      :aria-hidden="hasError || undefined"
      @loadedmetadata="handleLoad"
      @error="handleError"
    >
      <slot />
    </video>

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
  animation: video-lazy-load-shimmer 1.5s ease-in-out infinite;
}

@keyframes video-lazy-load-shimmer {
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
