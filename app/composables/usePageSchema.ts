import { usePageMeta } from '~/composables/usePageMeta'
import { useBreadcrumb } from '~/composables/useBreadcrumb'
import type { TBreadcrumbItem } from '~/types/breadcrumb'

type PageSchemaType = 'WebPage' | 'Article' | 'Product' | 'FAQPage'

type BaseSchemaOptions = {
  type?: PageSchemaType
  name?: string
  description?: string
  url?: string
  includeBreadcrumb?: boolean
  breadcrumbItems?: TBreadcrumbItem[]
}

type ArticleSchemaOptions = BaseSchemaOptions & {
  type: 'Article'
  datePublished?: string
  dateModified?: string
  image?: string
}

type PageSchemaOptions = BaseSchemaOptions | ArticleSchemaOptions

export function usePageSchema(options: PageSchemaOptions = {}) {
  const { buildUrl, siteName, siteDescription } = usePageMeta()
  const { items: autoBreadcrumbItems } = useBreadcrumb()

  const url = options.url ?? buildUrl()

  const name = options.name ?? siteName
  const description = options.description ?? siteDescription
  const includeBreadcrumb = options.includeBreadcrumb ?? true

  const breadcrumbItems = computed(() =>
    options.breadcrumbItems?.length ? options.breadcrumbItems : autoBreadcrumbItems.value
  )

  const breadcrumbSchema = defineBreadcrumb({
    itemListElement: computed(() =>
      breadcrumbItems.value.map((item, index, items) => {
        const isLastItem = index === items.length - 1

        return defineListItem({
          name: item.title,
          position: index + 1,
          item: !isLastItem && item.href ? buildUrl(item.href) : undefined,
        })
      })
    ),
  })

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
      ...(includeBreadcrumb ? [breadcrumbSchema] : []),
    ])

    return
  }

  useSchemaOrg([
    defineWebPage({
      name,
      description,
      url,
    }),
    ...(includeBreadcrumb ? [breadcrumbSchema] : []),
  ])
}
