interface PageSeoOptions {
  title?: string
  description?: string
  image?: string
  type?: 'website' | 'article'
}

export function usePageSeo(options: PageSeoOptions = {}) {
  const config = useRuntimeConfig()
  const route = useRoute()
  const { t } = useI18n()

  const siteUrl = config.public.siteUrl.replace(/\/$/, '')
  const siteName = t('site.name')

  const title = options.title
  const description = options.description ?? t('site.description')
  const image = options.image ?? `${siteUrl}/images/og-image.jpg`
  const type = options.type ?? 'website'

  const socialTitle = title ? `${title}｜${siteName}` : siteName

  useSeoMeta({
    title,
    titleTemplate: (pageTitle) => (pageTitle ? `${pageTitle}｜${siteName}` : siteName),
    description,
    ogTitle: socialTitle,
    ogSiteName: siteName,
    ogUrl: `${siteUrl}${route.path}`,
    ogDescription: description,
    ogImage: image,
    ogType: type,

    twitterCard: 'summary_large_image',
    twitterTitle: socialTitle,
    twitterDescription: description,
    twitterImage: image,
  })
}
