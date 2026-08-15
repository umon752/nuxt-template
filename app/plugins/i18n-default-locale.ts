import { LOCALES } from '~/constants/locales'

const defaultLocale = 'zh-TW'

function hasExplicitLocalePath(path: string): boolean {
  return Object.keys(LOCALES).some((locale) => {
    if (locale === defaultLocale) {
      return false
    }

    return path === `/${locale}` || path.startsWith(`/${locale}/`)
  })
}

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = nuxtApp.$i18n
  const router = nuxtApp.$router

  nuxtApp.hook('i18n:beforeLocaleSwitch', (data) => {
    if (!data.initialSetup || i18n.getLocaleCookie()) {
      return
    }

    if (hasExplicitLocalePath(router.currentRoute.value.path)) {
      return
    }

    data.newLocale = defaultLocale
  })
})
