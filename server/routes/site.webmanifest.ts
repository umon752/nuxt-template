import zhTW from '~/i18n/locales/zh-TW.json'
// import en from '~/i18n/locales/en.json'

const messages = {
  'zh-TW': zhTW,
  // en,
} as const

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const siteUrl = String(config.public.siteUrl).replace(/\/$/, '')

  const query = getQuery(event)
  const cookieLang = getCookie(event, 'i18n_redirected')
  const locale = String(query.lang || cookieLang || 'zh-TW') as keyof typeof messages

  const message = messages[locale] ?? messages['zh-TW']

  setResponseHeader(event, 'Content-Type', 'application/manifest+json')

  return {
    name: message.site.name,
    short_name: message.site.shortName,
    description: message.site.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#00c58e',
    icons: [
      {
        src: `${siteUrl}/images/favicon/android-chrome-192x192.png`,
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: `${siteUrl}/images/favicon/android-chrome-512x512.png`,
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
})
