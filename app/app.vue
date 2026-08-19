<script setup lang="ts">
import type { ResolvableLink, ResolvableMeta } from '@unhead/vue'
import { useSiteSchema } from '~/composables/useSiteSchema'
const { locale } = useI18n()
const i18nHead = useLocaleHead()
const { isLoading: isFullPageLoading } = useFullPageLoading()

useHead(() => ({
  htmlAttrs: {
    ...i18nHead.value.htmlAttrs,
    class: [i18nHead.value.htmlAttrs.class, 'no-js'].filter(Boolean).join(' '),
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
    color="var(--color-primary-500)"
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
