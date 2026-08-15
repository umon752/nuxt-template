import type { ComputedRef } from 'vue'
import { computed } from 'vue'

import {
  DEFAULT_LOCALE,
  isLocaleCode,
  LOCALE_OPTIONS,
  type TLocaleCode,
  type TLocaleOption,
} from '~/constants/locales'

export type TLocalizedLocaleOption = TLocaleOption & {
  label: string
  to: string
  isCurrent: boolean
}

export type TUseLocaleSwitcherReturn = {
  currentLocale: ComputedRef<TLocaleCode>
  localeOptions: ComputedRef<ReadonlyArray<TLocalizedLocaleOption>>
  getLocalePath: (targetLocale: TLocaleCode) => string
  switchLocale: (targetLocale: string) => Promise<boolean>
}

export function useLocaleSwitcher(): TUseLocaleSwitcherReturn {
  const { locale, t } = useI18n()
  const switchLocalePath = useSwitchLocalePath()
  const localePath = useLocalePath()

  const currentLocale = computed<TLocaleCode>(() =>
    isLocaleCode(locale.value) ? locale.value : DEFAULT_LOCALE
  )

  const getLocalePath = (targetLocale: TLocaleCode): string => {
    return switchLocalePath(targetLocale) || localePath('/', targetLocale) || '/'
  }

  const localeOptions = computed<ReadonlyArray<TLocalizedLocaleOption>>(() =>
    LOCALE_OPTIONS.map((option) => ({
      ...option,
      label: t(option.labelKey),
      to: getLocalePath(option.code),
      isCurrent: option.code === currentLocale.value,
    }))
  )

  const switchLocale = async (targetLocale: string): Promise<boolean> => {
    if (!isLocaleCode(targetLocale) || targetLocale === currentLocale.value) {
      return false
    }

    await navigateTo(getLocalePath(targetLocale))
    return true
  }

  return {
    currentLocale,
    localeOptions,
    getLocalePath,
    switchLocale,
  }
}
