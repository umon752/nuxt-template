import type { MaybeRefOrGetter, Ref } from 'vue'

export type TSharePlatform = 'facebook' | 'line' | 'x' | 'copy'
export type TExternalSharePlatform = Exclude<TSharePlatform, 'copy'>

export type TUseSocialShareOptions = {
  url?: MaybeRefOrGetter<string | undefined>
  title?: MaybeRefOrGetter<string | undefined>
  copiedDuration?: MaybeRefOrGetter<number | undefined>
}

export type TSocialShareResult = {
  platform: TSharePlatform
  url: string
}

export type TUseSocialShareReturn = {
  isCopied: Readonly<Ref<boolean>>
  feedbackMessage: Readonly<Ref<string>>
  share: (platform: TSharePlatform) => Promise<TSocialShareResult>
  clearFeedback: () => void
}

//----------------------------
// share endpoints
//----------------------------
const externalShareEndpoints: Record<TExternalSharePlatform, string> = {
  facebook: 'https://www.facebook.com/sharer/sharer.php',
  line: 'https://social-plugins.line.me/lineit/share',
  x: 'https://twitter.com/intent/tweet',
}

//----------------------------
// feedback state and timers
//----------------------------
export const useSocialShare = (options: TUseSocialShareOptions = {}): TUseSocialShareReturn => {
  const { t } = useI18n()
  const isCopied = ref(false)
  const feedbackMessage = ref('')
  let feedbackTimer: ReturnType<typeof setTimeout> | undefined

  const clearFeedbackTimer = (): void => {
    if (feedbackTimer !== undefined) {
      clearTimeout(feedbackTimer)
      feedbackTimer = undefined
    }
  }

  const clearFeedback = (): void => {
    clearFeedbackTimer()
    isCopied.value = false
    feedbackMessage.value = ''
  }

  const setFeedback = (message: string): void => {
    clearFeedbackTimer()
    feedbackMessage.value = message

    const copiedDuration = toValue(options.copiedDuration) ?? 2000

    if (copiedDuration > 0) {
      feedbackTimer = setTimeout(clearFeedback, copiedDuration)
    }
  }

  //----------------------------
  // URL and platform builders
  //----------------------------
  const resolveShareUrl = (): string => {
    const rawUrl = toValue(options.url)?.trim() || window.location.href
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

  const resolveShareTitle = (): string => toValue(options.title)?.trim() || document.title

  const buildShareUrl = (platform: TExternalSharePlatform, url: string): string => {
    const shareUrl = new URL(externalShareEndpoints[platform])

    shareUrl.searchParams.set(platform === 'facebook' ? 'u' : 'url', url)

    if (platform === 'x') {
      const title = resolveShareTitle()

      if (title) {
        shareUrl.searchParams.set('text', title)
      }
    }

    return shareUrl.href
  }

  //----------------------------
  // clipboard handling
  //----------------------------
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

  //----------------------------
  // share actions and cleanup
  //----------------------------
  const share = async (platform: TSharePlatform): Promise<TSocialShareResult> => {
    const url = resolveShareUrl()

    if (platform === 'copy') {
      try {
        await copyToClipboard(url)
        isCopied.value = true
        setFeedback(t('components.socialShare.copied'))
      } catch (error: unknown) {
        const localizedError = new Error(t('components.socialShare.copyError'), { cause: error })

        isCopied.value = false
        setFeedback(t('components.socialShare.copyError'))
        throw localizedError
      }
    } else {
      window.open(
        buildShareUrl(platform, url),
        '_blank',
        'noopener,noreferrer,width=640,height=640'
      )
    }

    return { platform, url }
  }

  onScopeDispose(clearFeedbackTimer)

  return {
    isCopied: readonly(isCopied),
    feedbackMessage: readonly(feedbackMessage),
    share,
    clearFeedback,
  }
}
