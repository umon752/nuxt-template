<script setup lang="ts">
const { t } = useI18n()

usePageSeo({
  title: t('pages.home.meta.title'),
  description: t('pages.home.meta.description'),
})
</script>

<template>
  <div>
    <img src="/images/nopic.png" />

    <ul>
      <li>123</li>
    </ul>

    <button type="button">按鈕</button>
    <input type="submit" />
    <input type="date" placeholder="日期" />
    <input type="checkbox" />
    <input type="search" placeholder="搜尋" />
  </div>
</template>
