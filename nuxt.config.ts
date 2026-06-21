// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  typescript: {
    strict: true,
    typeCheck: true,
  },

  modules: ['@nuxt/eslint', '@nuxtjs/i18n'],
  i18n: {
    locales: [
      { code: 'zh-TW', language: 'zh-Hant' },
      { code: 'en', language: 'en-US' },
      { code: 'ja', language: 'ja' },
    ],
    defaultLocale: 'zh-TW',
  },
  runtimeConfig: {
    public: {
      siteUrl: '',
      i18n: {
        baseUrl: '',
      },
    },
  },

  app: {
    head: {
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          name: 'robots',
          content: 'index,follow',
        },
      ],

      link: [
        {
          rel: 'icon',
          href: '/images/favicon/favicon.ico',
        },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/images/favicon/favicon.svg',
        },
        {
          rel: 'apple-touch-icon',
          href: '/images/favicon/apple-touch-icon.png',
        },
      ],
    },
  },
})
