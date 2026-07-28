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
  { title: '收合項目 1', content: '內容內容內容 1' },
  { title: '收合項目 2', content: '內容內容內容 2' },
  { title: '收合項目 3', content: '內容內容內容 3' },
]

const handleToggle = (index: number, isActive: boolean) => {
  console.log(`項目 ${index} ${isActive ? '展開' : '收合'}`)
}

const accordionRef = ref<TAccordionInstance | null>(null)

const articleItems = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  title: `文章標題 ${index + 1}`,
  description: `這是第 ${index + 1} 筆示範資料，用來展示 Pagination 元件在一般網站列表上的切頁效果。`,
}))

const articlePageSize = 9
const baseArticlePage = ref(1)

const articleTotalPages = computed(() => Math.ceil(articleItems.length / articlePageSize))

const paginatedArticleItems = computed(() => {
  const startIndex = (baseArticlePage.value - 1) * articlePageSize

  return articleItems.slice(startIndex, startIndex + articlePageSize)
})

const compactPage = ref(6)

const queryPageSize = 6

const searchableArticleItems = Array.from({ length: 36 }, (_, index) => {
  const categories = ['Nuxt', 'Vue', 'SEO', 'Design'] as const
  const category = categories[index % categories.length] ?? 'Nuxt'

  return {
    id: index + 1,
    category,
    title: `${category} 實戰筆記 ${index + 1}`,
    description: `這是一筆與 ${category} 相關的範例資料，可用來展示關鍵字篩選、分頁與 query 同步的整合方式。`,
  }
})

const route = useRoute()
const keywordQueryValue = computed(() => getRouteQueryValue(route.query.keyword))

const filteredArticleItems = computed(() => {
  const keyword = keywordQueryValue.value.trim().toLowerCase()

  if (!keyword) {
    return searchableArticleItems
  }

  return searchableArticleItems.filter((item) => {
    return (
      item.title.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword) ||
      item.category.toLowerCase().includes(keyword)
    )
  })
})

const filteredArticleTotalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredArticleItems.value.length / queryPageSize))
})

const { page: queryPage, replacePage } = usePaginationQuery({
  totalPages: filteredArticleTotalPages,
})

const handleQueryNavigationError = (error: unknown) => {
  console.error('Failed to update the sample list query.', error)
}

const keywordQuery = computed({
  get: () => keywordQueryValue.value,
  set: (value: string) => {
    const normalizedKeyword = value.trim()

    void replacePage(1, {
      keyword: normalizedKeyword || undefined,
    }).catch(handleQueryNavigationError)
  },
})

const queryPaginatedItems = computed(() => {
  const startIndex = (queryPage.value - 1) * queryPageSize

  return filteredArticleItems.value.slice(startIndex, startIndex + queryPageSize)
})
</script>

<template>
  <div class="space-y-10 py-6">
    <section class="space-y-6 py-4">
      <header class="container space-y-2">
        <h2 class="text-center text-2xl font-bold">PageHeader 基本使用</h2>
        <p class="text-center text-slate-600">
          展示頁面標題區塊、breadcrumb 與頁首資訊的預設呈現方式。
        </p>
      </header>

      <PageHeader />
    </section>

    <div class="container">
      <section class="space-y-6 py-4">
        <header class="space-y-2">
          <h2 class="text-center text-2xl font-bold">Btn 基本使用</h2>
          <p class="text-center text-slate-600">
            顯示按鈕元件目前的預設樣式，作為其他互動元件的按鈕基礎參考。
          </p>
        </header>

        <div class="flex justify-center">
          <BtnDefault />
        </div>
      </section>

      <section class="space-y-6 py-4">
        <header class="space-y-2">
          <h2 class="text-center text-2xl font-bold">Card 基本使用</h2>
          <p class="text-center text-slate-600">
            展示資訊卡片元件的預設版型，方便比對內容區塊、留白與邊框表現。
          </p>
        </header>

        <div class="flex gap-4">
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </section>

      <section class="space-y-6 py-4">
        <header class="space-y-2">
          <h2 class="text-center text-2xl font-bold">ImageLazyLoad 圖片骨架載入</h2>
          <p class="text-center text-slate-600">
            圖片載入完成前顯示 skeleton，並透過固定比例避免載入前後的版面位移。
          </p>
        </header>

        <div class="grid gap-4 md:grid-cols-3">
          <article class="space-y-3">
            <ImageLazyLoad
              src="/images/demo/test-img.jpg"
              alt="ImageLazyLoad 基本範例"
              class="rounded-xl"
            />
            <h3 class="font-semibold">基本 16:9 圖片</h3>
          </article>

          <article class="space-y-3">
            <ImageLazyLoad
              src="/images/demo/test-img.jpg"
              alt="ImageLazyLoad 自訂比例範例"
              aspect-ratio="3 / 2"
              class="rounded-xl"
              skeleton-class="bg-main-100"
            >
              <template #skeleton>
                <span class="text-main-700 flex h-full items-center justify-center text-sm">
                  圖片載入中
                </span>
              </template>
            </ImageLazyLoad>
            <h3 class="font-semibold">自訂比例與 skeleton</h3>
          </article>

          <article class="space-y-3">
            <ImageLazyLoad
              src="/images/demo/not-found.jpg"
              alt="圖片載入失敗的 fallback 範例"
              aspect-ratio="3 / 2"
              class="rounded-xl"
            />
            <h3 class="font-semibold">載入失敗時使用 fallback</h3>
          </article>
        </div>
      </section>

      <section class="py-4">
        <header class="space-y-2">
          <h2 class="text-center text-2xl font-bold">Accordion 基本使用</h2>
          <p class="text-center text-slate-600">以單一項目展開模式示範最基本的手風琴互動效果。</p>
        </header>

        <Accordion :items="accordionItems" />
      </section>

      <section class="py-4">
        <header class="space-y-2">
          <h2 class="text-center text-2xl font-bold">Accordion 多項展開 + 預設展開項目</h2>
          <p class="text-center text-slate-600">
            :collapse-others="false" 關閉自動收合其他項目的行為，:default-active="[0]"
            設定預設展開第幾個項目，並透過事件回呼（@toggle）觀察展開與收合狀態。
          </p>
        </header>

        <Accordion
          :items="accordionItems"
          :collapse-others="false"
          :default-active="[0]"
          @toggle="handleToggle"
        />
      </section>

      <section class="py-4">
        <header class="space-y-2">
          <h2 class="text-center text-2xl font-bold">Accordion 客製化使用</h2>
          <p class="text-center text-slate-600">
            示範 slots 與 class props，調整標題排版與內容呈現方式。
          </p>
        </header>

        <div class="mt-2 space-y-2">
          <Accordion
            :items="accordionItems"
            accordion-class="rounded-md border border-slate-200 bg-slate-50 transition-colors hover:border-slate-400 hover:bg-slate-50"
            title-class="flex justify-between"
            content-class=""
          >
            <template #title="{ item, isActive }">
              <span>{{ item.title }}</span>
              <span>{{ isActive ? '-' : '+' }}</span>
            </template>
            <template #content="{ item }">
              <div>{{ item.content }}</div>
            </template>
          </Accordion>
        </div>
      </section>

      <section class="py-4">
        <header class="space-y-2">
          <h2 class="text-center text-2xl font-bold">Accordion 程式化控制</h2>
          <p class="text-center text-slate-600">
            透過元件 ref 呼叫 expose 出來的方法，示範程式控制展開與收合。
          </p>
        </header>

        <Accordion ref="accordionRef" :items="accordionItems" />
        <div class="flex flex-wrap justify-center gap-3">
          <BtnDefault text="全部展開" @click="accordionRef?.expandAll()" />
          <BtnDefault text="全部收合" @click="accordionRef?.collapseAll()" />
          <BtnDefault text="指定第一個展開" @click="accordionRef?.expand(0)" />
          <BtnDefault text="指定第一個收合" @click="accordionRef?.collapse(0)" />
        </div>
      </section>

      <section class="space-y-6 py-4">
        <header class="space-y-2">
          <h2 class="text-center text-2xl font-bold">Pagination 基本使用</h2>
          <p class="text-center text-slate-600">
            純 UI 分頁元件只接收 currentPage 與 totalPages，頁碼切換後由父層決定資料如何分頁。
          </p>
        </header>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="item in paginatedArticleItems"
            :key="item.id"
            class="rounded-xl border border-slate-200 p-4 shadow-sm"
          >
            <p class="mb-2 text-sm text-slate-500">#{{ item.id }}</p>
            <h3 class="mb-2 text-lg font-semibold text-slate-900">{{ item.title }}</h3>
            <p class="text-sm leading-6 text-slate-600">{{ item.description }}</p>
          </article>
        </div>

        <Pagination
          v-model:current-page="baseArticlePage"
          :total-pages="articleTotalPages"
          aria-label="文章列表分頁"
        />
      </section>

      <section class="space-y-6 py-4">
        <header class="space-y-2">
          <h2 class="text-center text-2xl font-bold">Pagination 客製化使用</h2>
          <p class="text-center text-slate-600">
            直接傳入總頁數，並透過 class props 與 slots 客製分頁按鈕的外觀與內容。
          </p>
        </header>

        <Pagination
          v-model:current-page="compactPage"
          :total-pages="24"
          :display-range="1"
          :first-last-display-range="2"
          nav-class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5"
          item-class="rounded-full border-slate-200 bg-white text-slate-600 shadow-sm"
          active-class="border-main-500 bg-main-500 text-white"
          disabled-class="opacity-60"
          aria-label="客製樣式分頁"
        >
          <template #first>
            <span class="px-1 text-xs font-semibold tracking-wide">FIRST</span>
          </template>
          <template #prev>
            <span class="px-1 text-xs font-semibold tracking-wide">PREV</span>
          </template>
          <template #page="{ page, isActive }">
            <span :class="isActive ? 'font-semibold' : ''">{{ page }}</span>
          </template>
          <template #next>
            <span class="px-1 text-xs font-semibold tracking-wide">NEXT</span>
          </template>
          <template #last>
            <span class="px-1 text-xs font-semibold tracking-wide">LAST</span>
          </template>
          <template #ellipsis>
            <span class="text-slate-400">•••</span>
          </template>
        </Pagination>
      </section>

      <section class="space-y-6 py-4">
        <header class="space-y-2">
          <h2 class="text-center text-2xl font-bold">關鍵字篩選 + 分頁 + Query 同步</h2>
          <p class="text-center text-slate-600">
            父層頁面接管 `keyword` 與 `page` query，Pagination 只回傳頁碼，篩選條件變更時自動回到第
            1 頁。
          </p>
        </header>

        <div class="mx-auto max-w-3xl space-y-4 rounded-2xl border border-slate-200 p-5 shadow-sm">
          <label class="block space-y-2">
            <span class="text-sm font-medium text-slate-700">關鍵字</span>
            <input
              v-model="keywordQuery"
              type="search"
              placeholder="可輸入 Nuxt、Vue、SEO、Design"
              class="w-full rounded-md border border-slate-300 px-4 py-3 text-sm transition-colors outline-none focus:border-slate-500"
            />
          </label>

          <div class="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
            <p>目前 query：page={{ queryPage }} / keyword={{ keywordQuery || '全部' }}</p>
            <p>共 {{ filteredArticleItems.length }} 筆，{{ filteredArticleTotalPages }} 頁</p>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <article
              v-for="item in queryPaginatedItems"
              :key="item.id"
              class="rounded-xl border border-slate-200 p-4"
            >
              <p class="mb-2 text-xs font-semibold tracking-wide text-slate-500">
                {{ item.category }} / #{{ item.id }}
              </p>
              <h3 class="mb-2 text-lg font-semibold text-slate-900">{{ item.title }}</h3>
              <p class="text-sm leading-6 text-slate-600">{{ item.description }}</p>
            </article>
          </div>

          <p
            v-if="!queryPaginatedItems.length"
            class="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-slate-500"
          >
            查無資料，請調整關鍵字。
          </p>

          <Pagination
            v-model:current-page="queryPage"
            :total-pages="filteredArticleTotalPages"
            aria-label="篩選結果分頁"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<style></style>
