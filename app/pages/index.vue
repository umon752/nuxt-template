<script setup lang="ts">
usePageSeo({
  title: $t('pages.home.meta.title'),
  description: $t('pages.home.meta.description'),
})

usePageSchema({
  type: 'WebPage',
  name: $t('pages.home.meta.title'),
  description: $t('pages.home.meta.description'),
})
</script>

<template>
  <div>首頁</div>
</template>
