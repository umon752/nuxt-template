<script setup lang="ts">
import type { ClassValue } from 'clsx'
import { cn } from '~/utils/cn'

defineOptions({
  inheritAttrs: false,
})

type TSharePlatform = 'facebook' | 'line' | 'twitter' | 'copy'
type TExternalSharePlatform = Exclude<TSharePlatform, 'copy'>

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
const isCopied = ref(false)
const feedbackMessage = ref('')
let feedbackTimer: ReturnType<typeof setTimeout> | undefined

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

const clearFeedbackTimer = (): void => {
  if (feedbackTimer !== undefined) {
    clearTimeout(feedbackTimer)
    feedbackTimer = undefined
  }
}

const setFeedback = (message: string): void => {
  clearFeedbackTimer()
  feedbackMessage.value = message

  if (props.copiedDuration > 0) {
    feedbackTimer = setTimeout(() => {
      isCopied.value = false
      feedbackMessage.value = ''
      feedbackTimer = undefined
    }, props.copiedDuration)
  }
}

const resolveShareUrl = (): string => {
  const rawUrl = props.url?.trim() || window.location.href
  let resolvedUrl: URL

  try {
    resolvedUrl = new URL(rawUrl, window.location.href)
  } catch (error: unknown) {
    throw new TypeError(t('components.socialShare.invalidUrl'), { cause: error })
  }

  if (resolvedUrl.protocol !== 'http:' && resolvedUrl.protocol !== 'https:') {
    throw new TypeError(t('components.socialShare.invalidUrl'))
  }

  return resolvedUrl.href
}

const resolveShareTitle = (): string => props.title?.trim() || document.title

const buildShareUrl = (platform: TExternalSharePlatform, url: string): string => {
  const endpoints: Record<TExternalSharePlatform, string> = {
    facebook: 'https://www.facebook.com/sharer/sharer.php',
    line: 'https://social-plugins.line.me/lineit/share',
    twitter: 'https://twitter.com/intent/tweet',
  }
  const shareUrl = new URL(endpoints[platform])

  shareUrl.searchParams.set(platform === 'facebook' ? 'u' : 'url', url)

  if (platform === 'twitter') {
    const title = resolveShareTitle()

    if (title) {
      shareUrl.searchParams.set('text', title)
    }
  }

  return shareUrl.href
}

const fallbackCopyToClipboard = (text: string): void => {
  const activeElement = document.activeElement
  const textArea = document.createElement('textarea')

  textArea.value = text
  textArea.setAttribute('readonly', '')
  textArea.style.position = 'fixed'
  textArea.style.inset = '0'
  textArea.style.opacity = '0'
  textArea.style.pointerEvents = 'none'
  document.body.appendChild(textArea)
  textArea.select()

  try {
    if (!document.execCommand('copy')) {
      throw new Error(t('components.socialShare.copyError'))
    }
  } finally {
    textArea.remove()

    if (activeElement instanceof HTMLElement) {
      activeElement.focus()
    }
  }
}

const copyToClipboard = async (text: string): Promise<void> => {
  if (window.isSecureContext && navigator.clipboard) {
    await navigator.clipboard.writeText(text)
    return
  }

  fallbackCopyToClipboard(text)
}

const handleCopy = (url: string): void => {
  void copyToClipboard(url)
    .then(() => {
      isCopied.value = true
      setFeedback(t('components.socialShare.copied'))
      emit('copied', url)
    })
    .catch((error: unknown) => {
      const localizedError = new Error(t('components.socialShare.copyError'), { cause: error })

      isCopied.value = false
      setFeedback(t('components.socialShare.copyError'))
      emit('error', localizedError)
    })
}

const handleClick = (platform: TSharePlatform): void => {
  try {
    const url = resolveShareUrl()

    if (platform === 'copy') {
      handleCopy(url)
      return
    }

    window.open(buildShareUrl(platform, url), '_blank', 'noopener,noreferrer,width=640,height=640')
    emit('share', platform, url)
  } catch (error: unknown) {
    emit('error', error)
  }
}

onBeforeUnmount(clearFeedbackTimer)
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
