// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'
const siteUrl = import.meta.env.NUXT_PUBLIC_SITE_URL ?? ''

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

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    'nuxt-schema-org',
    'nuxt-security',
  ],

  ui: {
    colorMode: false,
  },

  i18n: {
    baseUrl: siteUrl,
    langDir: '../app/i18n/locales',
    locales: [
      {
        code: 'zh-TW',
        language: 'zh-Hant',
        file: 'zh-TW.json',
      },
      {
        code: 'en',
        language: 'en-US',
        file: 'en.json',
      },
      // {
      //   code: 'ja',
      //   language: 'ja',
      //   file: 'ja.json',
      // },
    ],
    defaultLocale: 'zh-TW',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      fallbackLocale: 'zh-TW',
      redirectOn: 'root',
    },
  },

  site: {
    url: siteUrl,
  },

  runtimeConfig: {
    public: {
      siteUrl,
    },
  },

  app: {
    head: {
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
      ],

      link: [
        {
          rel: 'icon',
          href: '/images/favicon/favicon.ico',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&display=swap',
        },
      ],

      script: [
        {
          innerHTML: "document.documentElement.classList.replace('no-js', 'js')",
        },
      ],
    },
  },

  security: {
    headers: {
      contentSecurityPolicy: {
        // 預設
        'default-src': ["'self'"],

        // HTML <base>
        'base-uri': ["'self'"],

        // object/embed
        'object-src': ["'none'"],

        // iframe
        'frame-src': [
          "'self'",
          'https://www.youtube.com',
          'https://www.youtube-nocookie.com',
          'https://www.google.com', // Google Maps Embed
        ],

        // 圖片
        'img-src': [
          "'self'",
          'data:',
          'blob:',
          'https:',
          'https://www.google-analytics.com',
          'https://www.googletagmanager.com',
          'https://maps.gstatic.com',
        ],

        // CSS
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],

        // Font
        'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'],

        // Script
        'script-src': [
          "'self'",
          "'strict-dynamic'",
          "'nonce-{{nonce}}'",
          'https://www.googletagmanager.com',
          'https://www.google-analytics.com',
          'https://maps.googleapis.com',
        ],

        // XHR / fetch / websocket
        'connect-src': [
          "'self'",
          'https://www.google-analytics.com',
          'https://www.googletagmanager.com',
          'https://maps.googleapis.com',
          'https://maps.gstatic.com',
        ],

        // Video / Audio
        'media-src': ["'self'", 'blob:'],

        // form submit
        'form-action': ["'self'"],

        // 防止 Clickjacking
        'frame-ancestors': ["'self'"],
      },
    },
  },
})
