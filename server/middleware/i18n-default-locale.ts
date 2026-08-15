import { getCookie, getRequestURL } from 'h3'

const defaultLocale = 'zh-TW'

export default defineEventHandler((event) => {
  const requestURL = getRequestURL(event)

  if (requestURL.pathname !== '/' || getCookie(event, 'i18n_redirected')) {
    return
  }

  // @nuxtjs/i18n 會在 app plugin 前讀取 Accept-Language，首次根路徑固定使用預設語系。
  event.node.req.headers['accept-language'] = defaultLocale
})
