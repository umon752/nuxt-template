<script setup lang="ts">
import type { ResolvableLink, ResolvableMeta } from '@unhead/vue'
import { useSiteSchema } from '~/composables/useSiteSchema'
const { locale } = useI18n()
const i18nHead = useLocaleHead()
const { isLoading: isFullPageLoading } = useFullPageLoading()

useServerHead({
  htmlAttrs: {
    class: 'no-js',
  },
})

useHead(() => ({
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs.lang,
  },
  link: [
    ...((i18nHead.value.link || []) as unknown as ResolvableLink[]),
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
  meta: [...((i18nHead.value.meta || []) as unknown as ResolvableMeta[])],
}))

useSiteSchema()
</script>

<template>
  <NuxtLoadingIndicator
    color="var(--color-main-500)"
    error-color="var(--color-error)"
    :height="3"
    :throttle="150"
  />

  <div :inert="isFullPageLoading" :aria-busy="isFullPageLoading">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>

  <LoadingFullPageLoading />
  <ToastStack />
</template>
