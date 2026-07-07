import { getLocale } from '../utils/getLocale'
import { getMessages } from '../utils/getMessages'
import { getSiteUrl } from '../utils/getSiteUrl'

export default defineEventHandler((event) => {
  const siteUrl = getSiteUrl()
  const locale = getLocale(event)
  const message = getMessages(locale)

  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')

  return `# ${message.site.name}

> ${message.site.description}

This website includes multilingual company pages, SEO metadata, sitemap, robots.txt, and structured content for AI assistants.

## Core Pages

- [Home](${siteUrl}/): Main entry point of the website.
- [About](${siteUrl}/about): Company or organization introduction.
- [Sample](${siteUrl}/sample): Example page for this Nuxt starter template.

## SEO Resources

- [Sitemap](${siteUrl}/sitemap.xml): Full list of indexable pages.
- [Robots](${siteUrl}/robots.txt): Crawling rules for search engines and AI agents.

## Optional

- [Manifest](${siteUrl}/site.webmanifest?lang=${locale}): Web app manifest metadata.
`
})
