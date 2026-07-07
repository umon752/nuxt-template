import type { H3Event } from 'h3'

import { messages, type TLocale } from './getMessages'

export function getLocale(event: H3Event): TLocale {
  const query = getQuery(event)
  const cookieLang = getCookie(event, 'i18n_redirected')
  const locale = String(query.lang || cookieLang || 'zh-TW') as TLocale

  return locale in messages ? locale : 'zh-TW'
}
