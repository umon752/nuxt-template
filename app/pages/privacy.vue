<script setup lang="ts">
import { siteConfig } from '~/config/site'
import type { TBreadcrumbItem } from '~/types/breadcrumb'

const { t } = useI18n()
const pageTitle = t('pages.privacy.meta.title')
const pageDescription = t('pages.privacy.meta.description')
const breadcrumbItems: TBreadcrumbItem[] = [
  { title: t('pages.home.meta.title'), href: '/' },
  { title: pageTitle },
]

usePageSeo({
  title: pageTitle,
  description: pageDescription,
})

usePageSchema({
  type: 'WebPage',
  name: pageTitle,
  description: pageDescription,
  breadcrumbItems,
})
</script>

<template>
  <div>
    <PageHeader :title="pageTitle" :breadcrumb-items="breadcrumbItems" />

    <article class="container max-w-4xl space-y-10 py-10">
      <div class="space-y-2">
        <p>{{ $t('pages.privacy.intro') }}</p>
        <p class="text-sm text-gray-600">{{ $t('pages.privacy.lastUpdated') }}</p>
      </div>

      <section class="space-y-3">
        <h2 class="text-2xl font-bold">{{ $t('pages.privacy.sections.collection.title') }}</h2>
        <p>{{ $t('pages.privacy.sections.collection.description') }}</p>
        <ul class="list-disc space-y-2 pl-6">
          <li>{{ $t('pages.privacy.sections.collection.items.provided') }}</li>
          <li>{{ $t('pages.privacy.sections.collection.items.technical') }}</li>
          <li>{{ $t('pages.privacy.sections.collection.items.cookies') }}</li>
        </ul>
      </section>

      <section class="space-y-3">
        <h2 class="text-2xl font-bold">{{ $t('pages.privacy.sections.usage.title') }}</h2>
        <p>{{ $t('pages.privacy.sections.usage.description') }}</p>
        <ul class="list-disc space-y-2 pl-6">
          <li>{{ $t('pages.privacy.sections.usage.items.service') }}</li>
          <li>{{ $t('pages.privacy.sections.usage.items.communication') }}</li>
          <li>{{ $t('pages.privacy.sections.usage.items.improvement') }}</li>
        </ul>
      </section>

      <section class="space-y-3">
        <h2 class="text-2xl font-bold">{{ $t('pages.privacy.sections.sharing.title') }}</h2>
        <p>{{ $t('pages.privacy.sections.sharing.description') }}</p>
      </section>

      <section class="space-y-3">
        <h2 class="text-2xl font-bold">{{ $t('pages.privacy.sections.cookies.title') }}</h2>
        <p>{{ $t('pages.privacy.sections.cookies.description') }}</p>
      </section>

      <section class="space-y-3">
        <h2 class="text-2xl font-bold">{{ $t('pages.privacy.sections.security.title') }}</h2>
        <p>{{ $t('pages.privacy.sections.security.description') }}</p>
      </section>

      <section class="space-y-3">
        <h2 class="text-2xl font-bold">{{ $t('pages.privacy.sections.rights.title') }}</h2>
        <p>{{ $t('pages.privacy.sections.rights.description') }}</p>
      </section>

      <section class="space-y-3">
        <h2 class="text-2xl font-bold">{{ $t('pages.privacy.sections.children.title') }}</h2>
        <p>{{ $t('pages.privacy.sections.children.description') }}</p>
      </section>

      <section class="space-y-3">
        <h2 class="text-2xl font-bold">{{ $t('pages.privacy.sections.updates.title') }}</h2>
        <p>{{ $t('pages.privacy.sections.updates.description') }}</p>
      </section>

      <section class="space-y-3">
        <h2 class="text-2xl font-bold">{{ $t('pages.privacy.sections.contact.title') }}</h2>
        <p>
          {{ $t('pages.privacy.sections.contact.description') }}
          <a :href="`mailto:${siteConfig.email}`" class="underline underline-offset-4">
            {{ siteConfig.email }}
          </a>
        </p>
      </section>

      <aside class="rounded-md bg-slate-50 p-4 text-sm text-gray-600">
        {{ $t('pages.privacy.notice') }}
      </aside>
    </article>
  </div>
</template>
