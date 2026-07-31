<script setup lang="ts">
import type { ClassValue } from 'clsx'
import type { TExternalSharePlatform, TSharePlatform } from '~/composables/useSocialShare'
import { cn } from '~/utils/cn'

defineOptions({
  inheritAttrs: false,
})

type TProps = {
  url?: string
  title?: string
  platforms?: TSharePlatform[]
  copiedDuration?: number
  buttonClass?: ClassValue
}

const props = withDefaults(defineProps<TProps>(), {
  url: undefined,
  title: undefined,
  platforms: () => ['facebook', 'line', 'twitter', 'copy'],
  copiedDuration: 2000,
  buttonClass: '',
})

const emit = defineEmits<{
  share: [platform: TExternalSharePlatform, url: string]
  copied: [url: string]
  error: [error: unknown]
}>()

const { t } = useI18n()
const attrs = useAttrs()
const { isCopied, feedbackMessage, share } = useSocialShare({
  url: () => props.url,
  title: () => props.title,
  copiedDuration: () => props.copiedDuration,
})

const visiblePlatforms = computed(() => [...new Set(props.platforms)])
const platformLabels = computed<Record<TSharePlatform, string>>(() => ({
  facebook: t('components.socialShare.facebook'),
  line: t('components.socialShare.line'),
  twitter: t('components.socialShare.twitter'),
  copy: isCopied.value ? t('components.socialShare.copied') : t('components.socialShare.copy'),
}))
const resolvedAriaLabel = computed(() => {
  const ariaLabel = attrs['aria-label']

  return typeof ariaLabel === 'string' ? ariaLabel : t('components.socialShare.ariaLabel')
})
const containerAttrs = computed(() => {
  const { class: _class, 'aria-label': _ariaLabel, ...restAttrs } = attrs

  return restAttrs
})
const containerClassName = computed(() =>
  cn('flex flex-wrap items-center gap-2', attrs.class as ClassValue)
)

const platformClassNames: Record<TSharePlatform, string> = {
  facebook: 'border-[#1877f2] bg-[#1877f2] text-white hover:bg-[#166fe5]',
  line: 'border-[#06c755] bg-[#06c755] text-white hover:bg-[#05b84e]',
  twitter: 'border-black bg-black text-white hover:bg-slate-800',
  copy: 'border-slate-700 bg-white text-slate-800 hover:bg-slate-100',
}

const getButtonClassName = (platform: TSharePlatform): string =>
  cn(
    'inline-flex min-h-10 items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600',
    platformClassNames[platform],
    props.buttonClass
  )

const handleClick = (platform: TSharePlatform): void => {
  void share(platform)
    .then(({ url }) => {
      if (platform === 'copy') {
        emit('copied', url)
      } else {
        emit('share', platform, url)
      }
    })
    .catch((error: unknown) => emit('error', error))
}
</script>

<template>
  <div
    v-bind="containerAttrs"
    :class="containerClassName"
    role="group"
    :aria-label="resolvedAriaLabel"
  >
    <button
      v-for="platform in visiblePlatforms"
      :key="platform"
      type="button"
      :class="getButtonClassName(platform)"
      :data-share-platform="platform"
      :aria-label="platformLabels[platform]"
      @click="handleClick(platform)"
    >
      <slot
        :name="platform"
        :platform="platform"
        :label="platformLabels[platform]"
        :copied="isCopied"
      >
        {{ platformLabels[platform] }}
      </slot>
    </button>

    <span class="sr-only" aria-live="polite">{{ feedbackMessage }}</span>
  </div>
</template>
