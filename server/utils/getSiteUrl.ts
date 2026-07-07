export function getSiteUrl(): string {
  const config = useRuntimeConfig()

  return String(config.public.siteUrl).replace(/\/$/, '')
}
