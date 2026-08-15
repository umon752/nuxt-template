import zhTW from '~/i18n/locales/zh-TW.json'
import en from '~/i18n/locales/en.json'

export const messages = {
  'zh-TW': zhTW,
  en,
} as const

export type TLocale = keyof typeof messages

export function getMessages(locale: TLocale): (typeof messages)[TLocale] {
  return messages[locale] ?? messages['zh-TW']
}
