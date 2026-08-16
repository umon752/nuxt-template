import { DEFAULT_LOCALE, LOCALES } from '~/constants/locales'
import { featureConfig } from '~/config/features'

const nonDefaultLocaleCodes = Object.keys(LOCALES).filter((locale) => locale !== DEFAULT_LOCALE)

const isNonDefaultLocalePath = (path: string): boolean => {
  return nonDefaultLocaleCodes.some(
    (locale) => path === `/${locale}` || path.startsWith(`/${locale}/`)
  )
}

export default defineNuxtRouteMiddleware((to) => {
  if (featureConfig.languageSwitcher || !isNonDefaultLocalePath(to.path)) {
    return
  }

  throw createError({ statusCode: 404, statusMessage: 'Locale route is disabled' })
})
