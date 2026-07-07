import { usePageMeta } from './usePageMeta'

interface PageSeoOptions {
  title?: string
  description?: string
  image?: string
  type?: 'website' | 'article'
}

export function usePageSeo(options: PageSeoOptions = {}) {
  const { siteName, siteDescription, buildUrl, buildImage, buildTitle } = usePageMeta()

  const title = options.title
  const description = options.description ?? siteDescription
  const image = options.image ?? buildImage()
  const type = options.type ?? 'website'

  const socialTitle = buildTitle(title)

  useSeoMeta({
    title,
    titleTemplate: (pageTitle) => buildTitle(pageTitle),
    description,
    ogTitle: socialTitle,
    ogSiteName: siteName,
    ogUrl: buildUrl(),
    ogDescription: description,
    ogImage: image,
    ogType: type,

    twitterCard: 'summary_large_image',
    twitterTitle: socialTitle,
    twitterDescription: description,
    twitterImage: image,
  })
}
