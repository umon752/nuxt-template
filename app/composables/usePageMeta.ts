export type TPageMeta = {
  siteUrl: string
  siteName: string
  siteDescription: string
  route: ReturnType<typeof useRoute>
  buildUrl: (url?: string) => string
  buildImage: (image?: string) => string
  buildTitle: (pageTitle?: string) => string
}

export function usePageMeta(): TPageMeta {
  const route = useRoute()
  const config = useRuntimeConfig()
  const { t } = useI18n()

  const siteUrl = String(config.public.siteUrl).replace(/\/$/, '')
  const siteName = t('site.name')
  const siteDescription = t('site.description')

  const buildUrl = (url?: string): string => {
    const targetUrl = url ?? route.path

    if (/^https?:\/\//.test(targetUrl)) {
      return String(targetUrl)
    }

    if (!targetUrl) {
      return String(siteUrl)
    }

    const normalizedPath = targetUrl.startsWith('/') ? targetUrl : `/${targetUrl}`

    return `${siteUrl}${normalizedPath}`
  }
  const buildImage = (image?: string): string => String(image ?? `${siteUrl}/images/og.png`)
  const buildTitle = (pageTitle?: string): string =>
    pageTitle ? `${pageTitle}｜${siteName}` : siteName

  return {
    siteUrl,
    siteName,
    siteDescription,
    route,
    buildUrl,
    buildImage,
    buildTitle,
  }
}
