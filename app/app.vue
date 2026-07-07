<script setup lang="ts">
import { useSiteSchema } from './composables/useSiteSchema'
const { locale } = useI18n()
const i18nHead = useLocaleHead()

useHead(() => ({
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs.lang,
  },
  link: [
    ...(i18nHead.value.link || []),
    {
      rel: 'manifest',
      href: `/site.webmanifest?lang=${locale.value}`,
    },
    {
      rel: 'alternate',
      type: 'text/plain',
      href: `/llms.txt?lang=${locale.value}`,
      title: 'llms.txt',
    },
  ],
  meta: [...(i18nHead.value.meta || [])],
}))

useSiteSchema()
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
