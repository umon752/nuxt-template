export const LOCALES = {
  'zh-TW': {
    lang: 'zh-Hant',
    ogLocale: 'zh_TW',
  },
  en: {
    lang: 'en',
    ogLocale: 'en_US',
  },
} as const

export type TLocaleCode = keyof typeof LOCALES

export const DEFAULT_LOCALE: TLocaleCode = 'zh-TW'

export const LOCALE_OPTIONS = [
  { code: 'zh-TW', labelKey: 'header.language.names.zhTW' },
  { code: 'en', labelKey: 'header.language.names.en' },
] as const satisfies ReadonlyArray<{ code: TLocaleCode; labelKey: string }>

export type TLocaleOption = (typeof LOCALE_OPTIONS)[number]

export function isLocaleCode(value: string): value is TLocaleCode {
  return Object.prototype.hasOwnProperty.call(LOCALES, value)
}
