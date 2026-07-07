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

  const buildUrl = (url?: string) => String(url ?? `${siteUrl}${route.path}`)
  const buildImage = (image?: string) => String(image ?? `${siteUrl}/images/og-image.jpg`)
  const buildTitle = (pageTitle?: string) => (pageTitle ? `${pageTitle}｜${siteName}` : siteName)

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
