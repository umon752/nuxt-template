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
  alt?: string
  fallbackSrc?: string
  aspectRatio?: string
  objectFit?: TObjectFit
  loading?: 'eager' | 'lazy'
  decoding?: 'async' | 'auto' | 'sync'
  imgClass?: ClassValue
  skeletonClass?: ClassValue
}

const props = withDefaults(defineProps<TProps>(), {
  alt: '',
  fallbackSrc: '/images/nopic.png',
  aspectRatio: '16 / 9',
  objectFit: 'cover',
  loading: 'lazy',
  decoding: 'async',
  imgClass: '',
  skeletonClass: '',
})

const emit = defineEmits<{
  load: [event: Event]
  error: [event: Event]
}>()

const attrs = useAttrs()
const imageRef = useTemplateRef<HTMLImageElement>('imageRef')
const currentSrc = ref(props.src)
const isLoading = ref(true)
const hasError = ref(false)
const isUsingFallback = ref(false)

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
    'absolute inset-0 h-full w-full transition-opacity duration-300 motion-reduce:transition-none',
    objectFitClasses[props.objectFit],
    isLoading.value || hasError.value ? 'opacity-0' : 'opacity-100',
    props.imgClass
  )
)
const skeletonClassName = computed(() =>
  cn('c-skeleton absolute inset-0 overflow-hidden bg-slate-200', props.skeletonClass)
)
const aspectRatioStyle = computed<CSSProperties>(() => ({
  aspectRatio: props.aspectRatio,
}))
const imageAttrs = computed(() => {
  const { class: _class, style: _style, ...restAttrs } = attrs

  return restAttrs
})

const reset = (): void => {
  currentSrc.value = props.src
  isLoading.value = true
  hasError.value = false
  isUsingFallback.value = false
}

const handleLoad = (event: Event): void => {
  isLoading.value = false
  hasError.value = false
  emit('load', event)
}

const handleError = (event: Event): void => {
  emit('error', event)

  if (props.fallbackSrc && !isUsingFallback.value && currentSrc.value !== props.fallbackSrc) {
    isUsingFallback.value = true
    currentSrc.value = props.fallbackSrc
    return
  }

  isLoading.value = false
  hasError.value = true
}

watch(() => props.src, reset)

onMounted(() => {
  const image = imageRef.value

  if (image?.complete) {
    if (image.naturalWidth > 0) {
      isLoading.value = false
    } else {
      handleError(new Event('error'))
    }
  }
})
</script>

<template>
  <span :class="containerClassName" :style="[aspectRatioStyle, attrs.style]">
    <span v-if="isLoading" :class="skeletonClassName" aria-hidden="true">
      <slot name="skeleton" />
    </span>

    <img
      ref="imageRef"
      v-bind="imageAttrs"
      :src="currentSrc"
      :alt="props.alt"
      :loading="props.loading"
      :decoding="props.decoding"
      :class="imageClassName"
      :aria-hidden="hasError || undefined"
      @load="handleLoad"
      @error="handleError"
    />

    <span
      v-if="hasError"
      class="absolute inset-0 flex items-center justify-center bg-slate-100 p-4 text-center text-sm text-slate-500"
      role="img"
      :aria-label="props.alt || '圖片載入失敗'"
    >
      <slot name="error">圖片載入失敗</slot>
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
