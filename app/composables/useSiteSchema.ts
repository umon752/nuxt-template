import { usePageMeta } from './usePageMeta'

export function useSiteSchema() {
  const { siteName, siteUrl, siteDescription } = usePageMeta()

  useSchemaOrg([
    defineOrganization({
      name: siteName,
      url: siteUrl,
      description: siteDescription,
      // logo: `${siteUrl}${siteConfig.logo}`,
      // email: siteConfig.email,
      // telephone: siteConfig.telephone,
      // sameAs: Object.values(siteConfig.social).filter(Boolean),
    }),

    defineWebSite({
      name: siteName,
      url: siteUrl,
    }),
  ])
}
