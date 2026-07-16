<script setup lang="ts">
import type { TAccordionInstance } from '~/components/Accordion.vue'

usePageSeo({
  title: $t('pages.sample.meta.title'),
  description: $t('pages.sample.meta.description'),
})

usePageSchema({
  type: 'WebPage',
  name: $t('pages.sample.meta.title'),
  description: $t('pages.sample.meta.description'),
})

const accordionItems = [
  { title: '收合標題 1', content: '內容內容內容 1' },
  { title: '收合標題 2', content: '內容內容內容 2' },
  { title: '收合標題 3', content: '內容內容內容 3' },
]

const handleToggle = (index: number, isActive: boolean) => {
  console.log(`項目 ${index} ${isActive ? '展開' : '收合'}`)
}

const accordionRef = ref<TAccordionInstance | null>(null)
</script>

<template>
  <div>
    <PageHeader />
    <Btn />
    <Card />

    <hr />

    <!-- 基本使用 -->
    <Accordion :items="accordionItems" />

    <hr />

    <!-- 不影響其他收合的展開模式 -->
    <Accordion
      :items="accordionItems"
      :collapse-others="false"
      :default-active="[0]"
      @toggle="handleToggle"
    />

    <hr />

    <!-- 自訂內容 -->
    <Accordion :items="accordionItems">
      <template #title="{ item, isActive }">
        <span>{{ item.title }}</span>
        <span>{{ isActive ? '-' : '+' }}</span>
      </template>
      <template #content="{ item }">
        <div>{{ item.content }}</div>
      </template>
    </Accordion>

    <hr />

    <!-- 程式化控制 -->
    <Accordion ref="accordionRef" :items="accordionItems" />
    <button @click="accordionRef?.expandAll()">全部展開</button>
    <button @click="accordionRef?.collapseAll()">全部收合</button>
    <button @click="accordionRef?.expand(0)">指定第一個展開</button>
    <button @click="accordionRef?.collapse(0)">指定第一個收合</button>
  </div>
</template>

<style></style>
