import { getLocale } from '#server/utils/getLocale'
import { getMessages } from '#server/utils/getMessages'
import { getSiteUrl } from '#server/utils/getSiteUrl'

export default defineEventHandler((event) => {
  const siteUrl = getSiteUrl()
  const locale = getLocale(event)
  const message = getMessages(locale)

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
