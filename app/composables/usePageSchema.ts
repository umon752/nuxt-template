import { usePageMeta } from './usePageMeta'

type PageSchemaType = 'WebPage' | 'Article' | 'Product' | 'FAQPage'

interface BaseSchemaOptions {
  type?: PageSchemaType
  name?: string
  description?: string
  url?: string
}

interface ArticleSchemaOptions extends BaseSchemaOptions {
  type: 'Article'
  datePublished?: string
  dateModified?: string
  image?: string
}

export function usePageSchema(options: BaseSchemaOptions | ArticleSchemaOptions = {}) {
  const { buildUrl, siteName, siteDescription } = usePageMeta()

  const url = options.url ?? buildUrl()

  const name = options.name ?? siteName
  const description = options.description ?? siteDescription

  if (options.type === 'Article') {
    const article = options as ArticleSchemaOptions

    useSchemaOrg([
      defineArticle({
        headline: name,
        description,
        url,
        image: article.image,
        datePublished: article.datePublished,
        dateModified: article.dateModified,
      }),
    ])

    return
  }

  useSchemaOrg([
    defineWebPage({
      name,
      description,
      url,
    }),
  ])
}
