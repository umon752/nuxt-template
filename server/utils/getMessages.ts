import zhTW from '~/i18n/locales/zh-TW.json'

export const messages = {
  'zh-TW': zhTW,
} as const

export type TLocale = keyof typeof messages

export function getMessages(locale: TLocale): (typeof messages)[TLocale] {
  return messages[locale] ?? messages['zh-TW']
}
