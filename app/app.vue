<script setup lang="ts">
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
  ],
  meta: [...(i18nHead.value.meta || [])],
}))
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
