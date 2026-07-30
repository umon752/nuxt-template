<script setup lang="ts">
import Counter, { type TCounterChangeSource } from '~/components/counter/Counter.vue'
import EditorModule, { type TEditorModule } from '~/components/editor/EditorModule.vue'
import Marquee, { type TMarqueeItem } from '~/components/marquee/Marquee.vue'
import Modal, { type TModalCloseReason } from '~/components/modal/Modal.vue'
import Toast from '~/components/toast/Toast.vue'
import Tooltip from '~/components/tooltip/Tooltip.vue'

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

const marqueeItems: TMarqueeItem[] = [
  { id: 1, title: 'Nuxt 4 Starter' },
  { id: 2, title: 'Vue 3 Composition API' },
  { id: 3, title: 'TypeScript Strict Mode' },
  { id: 4, title: 'Tailwind CSS 4' },
  { id: 5, title: 'Responsive Marquee' },
]

const marqueeActiveIndex = ref(0)
const marqueePaused = ref(false)
const reverseMarqueeActiveIndex = ref(0)
const reverseMarqueePaused = ref(false)
const basicCounterValue = ref(0)
const editableCounterValue = ref(2)
const steppedCounterValue = ref(10)
const lastCounterEvent = ref('尚未操作')

const handleCounterChange = (value: number, source: TCounterChangeSource): void => {
  const sourceLabels: Record<TCounterChangeSource, string> = {
    decrement: '減少',
    increment: '增加',
    input: '輸入',
  }

  lastCounterEvent.value = `${sourceLabels[source]}至 ${value}`
}

const toast = useToast()
const inlineToastVisible = ref(false)
const alertDialogToastVisible = ref(false)
const persistentToastId = ref<string>()
const basicModalVisible = ref(false)
const persistentModalVisible = ref(false)
const alertModalVisible = ref(false)
const lastModalCloseReason = ref<TModalCloseReason>()

const handleModalClose = (reason: TModalCloseReason): void => {
  lastModalCloseReason.value = reason
}

const hasPersistentToast = computed(() => {
  return toast.toasts.value.some((item) => item.id === persistentToastId.value && item.visible)
})

const showAutoHideToast = (): void => {
  toast.show({
    text: '資料儲存成功<br>這則通知會在 2.5 秒後自動關閉',
    duration: 2500,
  })
}

const showPersistentToast = (): void => {
  if (persistentToastId.value) {
    toast.remove(persistentToastId.value)
  }

  persistentToastId.value = toast.show({
    text: '這是一則不會自動關閉的通知',
    autoHide: false,
  })
}

const updatePersistentToast = (): void => {
  if (!persistentToastId.value || !hasPersistentToast.value) {
    return
  }

  toast.update(persistentToastId.value, {
    text: '通知內容已動態更新<br>現在可以手動關閉',
  })
}

const hidePersistentToast = (): void => {
  if (!persistentToastId.value) {
    return
  }

  toast.hide(persistentToastId.value)
}

const showStackedToasts = (): void => {
  const messages = ['第一則堆疊通知', '第二則堆疊通知', '第三則堆疊通知']

  messages.forEach((text, index) => {
    toast.show({
      text,
      duration: 2000 + index * 750,
    })
  })
}

const cardItems = [
  {
    image: '/images/demo/test-img.jpg',
    title: '卡片標題範例一',
    content: '內連',
    link: '/about',
  },
  {
    image: '/images/demo/test-img.jpg',
    title: '卡片標題範例二',
    content: '外連',
    link: 'https://nuxt.com',
  },
  {
    image: '/images/demo/test-img.jpg',
    title: '卡片標題範例三',
    content: '無連結',
    link: '',
  },
  {
    image: '/images/demo/test-img.jpg',
    title: '卡片標題範例四',
    content: '',
    link: '/sample',
  },
]

const editorContentHtml = `
  <h2>h2 編輯器標題</h2>
  <h3>h3 編輯器標題</h3>
  <h4>h4 編輯器標題</h4>
  <h5>h5 編輯器標題</h5>
  <h6>h6 編輯器標題</h6>
  <p>
    <a href="#!">連結文字</a>
    <b>粗體文字</b>
    <i>斜體文字</i>
  </p>
  <ul>
    <li>項目文字
      <ul>
        <li>第二層項目文字</li>
        <li>第二層項目文字</li>
      </ul>
    </li>
    <li>項目文字</li>
  </ul>
  <ol>
    <li>編號文字</li>
    <li>編號文字</li>
  </ol>
  <p>文字敘述文字敘述文字敘述文字敘述文字敘述文字敘述文字敘述文字敘述。</p>
`

const editorModules: TEditorModule[] = [
  {
    id: 'T1',
    type: 'text',
    html: editorContentHtml,
  },
  {
    id: 'T2',
    type: 'image-left',
    html: editorContentHtml,
    image: {
      src: '/images/demo/test-img.jpg',
      alt: $t('pages.sample.a11y.editorImageLeft'),
    },
  },
  {
    id: 'T3',
    type: 'image-right',
    html: editorContentHtml,
    image: {
      src: '/images/demo/test-img.jpg',
      alt: $t('pages.sample.a11y.editorImageRight'),
    },
  },
  {
    id: 'T4',
    type: 'image',
    image: {
      src: '/images/demo/test-img.jpg',
      alt: $t('pages.sample.a11y.editorImageSingle'),
    },
  },
  {
    id: 'T5',
    type: 'code',
    code: `const greeting = 'Hello, Nuxt!'\nconsole.log(greeting)`,
  },
  {
    id: 'T6',
    type: 'images',
    images: [
      {
        src: '/images/demo/test-img.jpg',
        alt: $t('pages.sample.a11y.editorImagesLeft'),
      },
      {
        src: '/images/demo/test-img.jpg',
        alt: $t('pages.sample.a11y.editorImagesRight'),
      },
    ],
  },
]

const handleToggle = (index: number, isActive: boolean) => {
  console.log(`項目 ${index} ${isActive ? '展開' : '收合'}`)
}

const basicAccordionActiveItems = ref<number[]>([])
const multipleAccordionActiveItems = ref<number[]>([0])
const customAccordionActiveItems = ref<number[]>([])
const controlledAccordionActiveItems = ref<number[]>([])

const expandAllAccordionItems = (): void => {
  controlledAccordionActiveItems.value = accordionItems.map((_, index) => index)
}

const collapseAllAccordionItems = (): void => {
  controlledAccordionActiveItems.value = []
}

const expandFirstAccordionItem = (): void => {
  controlledAccordionActiveItems.value = [0]
}

const collapseFirstAccordionItem = (): void => {
  controlledAccordionActiveItems.value = controlledAccordionActiveItems.value.filter(
    (index) => index !== 0
  )
}

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
        </header>

        <div class="flex justify-center">
          <BtnDefault />
        </div>
      </section>

      <section class="space-y-6 py-4">
        <header class="space-y-2">
          <h2 class="text-center text-2xl font-bold">Counter 計數器元件</h2>
          <p class="text-center text-slate-600">
            展示基本加減、直接輸入、自訂增減幅度，以及由父層透過 v-model 管理數值。
          </p>
        </header>

        <div class="grid gap-6 md:grid-cols-3">
          <article class="space-y-4 rounded-2xl border border-slate-200 p-5 text-center shadow-sm">
            <div class="space-y-1">
              <h3 class="text-lg font-semibold text-slate-900">基本計數器</h3>
              <p class="text-sm text-slate-600">範圍 0～5</p>
            </div>

            <Counter
              v-model="basicCounterValue"
              :min="0"
              :max="5"
              :aria-label="$t('pages.sample.a11y.counterBasic')"
              @change="handleCounterChange"
            />

            <p class="text-sm text-slate-500">父層數值：{{ basicCounterValue }}</p>
          </article>

          <article class="space-y-4 rounded-2xl border border-slate-200 p-5 text-center shadow-sm">
            <div class="space-y-1">
              <h3 class="text-lg font-semibold text-slate-900">可直接輸入</h3>
              <p class="text-sm text-slate-600">輸入值會限制在 0～10</p>
            </div>

            <Counter
              v-model="editableCounterValue"
              :min="0"
              :max="10"
              editable
              :aria-label="$t('pages.sample.a11y.counterEditable')"
              @change="handleCounterChange"
            />

            <p class="text-sm text-slate-500">父層數值：{{ editableCounterValue }}</p>
          </article>

          <article class="space-y-4 rounded-2xl border border-slate-200 p-5 text-center shadow-sm">
            <div class="space-y-1">
              <h3 class="text-lg font-semibold text-slate-900">自訂 Step 與 Slot</h3>
              <p class="text-sm text-slate-600">範圍 0～20，每次增減 5</p>
            </div>

            <Counter
              v-model="steppedCounterValue"
              :min="0"
              :max="20"
              :step="5"
              :aria-label="$t('pages.sample.a11y.counterStep')"
              button-class="bg-slate-900 text-white hover:bg-slate-700 disabled:bg-slate-100"
              @change="handleCounterChange"
            >
              <template #decrement>減</template>
              <template #value="{ value }">{{ value }} 件</template>
              <template #increment>加</template>
            </Counter>

            <p class="text-sm text-slate-500">父層數值：{{ steppedCounterValue }}</p>
          </article>
        </div>

        <p class="text-center text-sm text-slate-500">最後事件：{{ lastCounterEvent }}</p>
      </section>

      <section class="space-y-6 py-4">
        <header class="space-y-2">
          <h2 class="text-center text-2xl font-bold">Tooltip 使用範例</h2>
          <p class="text-center text-slate-600">
            支援四向定位、鍵盤焦點、延遲顯示、停用及自訂提示樣式。
          </p>
        </header>

        <div class="flex flex-wrap items-center justify-center gap-4 py-12">
          <Tooltip text="顯示在上方" placement="top">
            <BtnDefault text="Top" />
          </Tooltip>

          <Tooltip text="顯示在右側" placement="right">
            <BtnDefault text="Right" />
          </Tooltip>

          <Tooltip text="顯示在下方" placement="bottom">
            <BtnDefault text="Bottom" />
          </Tooltip>

          <Tooltip text="顯示在左側，空間不足時依序改到上方或下方" placement="left">
            <BtnDefault text="Left" />
          </Tooltip>

          <Tooltip text="延遲 800ms 顯示" :show-delay="800">
            <BtnDefault text="延遲顯示" />
          </Tooltip>

          <Tooltip text="不會顯示" disabled>
            <BtnDefault text="已停用" />
          </Tooltip>

          <Tooltip placement="bottom" tooltip-class="bg-main-700 text-white">
            <BtnDefault text="自訂樣式" />

            <template #content>
              <span class="font-semibold">自訂 Tooltip 內容</span>
            </template>
          </Tooltip>
        </div>
      </section>

      <section class="space-y-6 py-4">
        <header class="space-y-2">
          <h2 class="text-center text-2xl font-bold">Marquee 跑馬燈元件</h2>
          <p class="text-center text-slate-600">
            展示無縫循環、左右方向、hover／focus 暫停、拖曳及父層狀態控制。
          </p>
        </header>

        <div class="space-y-8">
          <article class="space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <h3 class="text-lg font-semibold">向左移動與控制按鈕</h3>
              <p class="text-sm text-slate-500">
                Active：{{ marqueeItems[marqueeActiveIndex]?.title }}
              </p>
            </div>

            <Marquee
              v-model:active-index="marqueeActiveIndex"
              v-model:paused="marqueePaused"
              :items="marqueeItems"
              :speed="55"
              :gap="16"
              pause-on-hover
              draggable
              :aria-label="$t('pages.sample.a11y.marqueeLeft')"
              marquee-class="rounded-xl border border-slate-200 bg-slate-50 py-4"
              item-class="w-56 sm:w-64"
              active-class="rounded-xl ring-2 ring-main-500"
            >
              <template #item="{ item, index, isActive }">
                <div
                  class="flex h-28 items-center justify-center rounded-xl border px-5 text-center font-semibold transition-colors"
                  :class="
                    isActive
                      ? 'border-main-500 bg-main-500 text-white'
                      : 'border-slate-200 bg-white text-slate-700'
                  "
                >
                  {{ index + 1 }}. {{ item.title }}
                </div>
              </template>

              <template #controls="{ paused, start, stop, prev, next }">
                <div class="mt-4 flex flex-wrap justify-center gap-3">
                  <BtnDefault text="上一個" @click="prev" />
                  <BtnDefault :text="paused ? '播放' : '暫停'" @click="paused ? start() : stop()" />
                  <BtnDefault text="下一個" @click="next" />
                </div>
              </template>
            </Marquee>
          </article>

          <article class="space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <h3 class="text-lg font-semibold">向右移動與不同寬度項目</h3>
              <p class="text-sm text-slate-500">
                Active：{{ marqueeItems[reverseMarqueeActiveIndex]?.title }}
              </p>
            </div>

            <Marquee
              v-model:active-index="reverseMarqueeActiveIndex"
              v-model:paused="reverseMarqueePaused"
              :items="marqueeItems"
              :speed="45"
              :gap="12"
              direction="right"
              pause-on-hover
              draggable
              :aria-label="$t('pages.sample.a11y.marqueeRight')"
              marquee-class="rounded-xl border border-slate-200 bg-slate-950 py-4"
              active-class="opacity-100"
            >
              <template #item="{ item, index, isActive }">
                <div
                  class="flex h-20 items-center justify-center rounded-lg border px-6 text-center font-medium whitespace-nowrap transition-opacity"
                  :class="[
                    index % 2 === 0 ? 'w-52' : 'w-72',
                    isActive
                      ? 'border-main-400 bg-main-500 text-white opacity-100'
                      : 'border-slate-600 bg-slate-800 text-slate-200 opacity-65',
                  ]"
                >
                  {{ item.title }}
                </div>
              </template>
            </Marquee>
          </article>
        </div>
      </section>

      <section class="space-y-6 py-4">
        <header class="space-y-2">
          <h2 class="text-center text-2xl font-bold">Modal 使用範例</h2>
          <p class="text-center text-slate-600">
            展示基本 Modal、不可由背景關閉的流程，以及需要立即處理的 alertdialog。
          </p>
        </header>

        <div class="flex flex-wrap justify-center gap-3">
          <BtnDefault text="顯示基本 Modal" @click="basicModalVisible = true" />
          <BtnDefault text="顯示固定 Modal" @click="persistentModalVisible = true" />
          <BtnDefault text="顯示 alertdialog Modal" @click="alertModalVisible = true" />
        </div>

        <p class="text-center text-sm text-slate-500">
          最後關閉原因：{{ lastModalCloseReason ?? '尚未關閉 Modal' }}
        </p>

        <Modal
          v-model="basicModalVisible"
          title="基本 Modal"
          aria-describedby="basic-modal-description"
          @close="handleModalClose"
        >
          <p id="basic-modal-description">
            可使用右上角按鈕、Escape、點擊背景或下方按鈕關閉此 Modal。
          </p>

          <template #footer="{ close }">
            <BtnDefault text="取消" @click="close" />
            <BtnDefault text="確認" autofocus @click="close" />
          </template>
        </Modal>

        <Modal
          v-model="persistentModalVisible"
          title="資料處理流程"
          :close-on-escape="false"
          :close-on-backdrop="false"
          :show-close-button="false"
          aria-describedby="persistent-modal-description"
          @close="handleModalClose"
        >
          <p id="persistent-modal-description">
            Escape 與背景點擊不會關閉視窗，只能使用指定操作完成流程。
          </p>

          <template #footer="{ close }">
            <BtnDefault text="完成流程" autofocus @click="close" />
          </template>
        </Modal>

        <Modal
          v-model="alertModalVisible"
          title="重要操作確認"
          role="alertdialog"
          aria-describedby="alert-modal-description"
          :close-on-backdrop="false"
          @close="handleModalClose"
        >
          <p id="alert-modal-description">
            此操作可能影響既有資料，請確認後再繼續。可使用 Tab 與 Shift + Tab 測試焦點循環。
          </p>

          <template #footer="{ close }">
            <BtnDefault text="返回" @click="close" />
            <BtnDefault text="確認執行" autofocus @click="close" />
          </template>
        </Modal>
      </section>

      <section class="space-y-6 py-4">
        <header class="space-y-2">
          <h2 class="text-center text-2xl font-bold">Toast 使用範例</h2>
          <p class="text-center text-slate-600">
            展示單一元件、全域呼叫、自動關閉、動態更新與多筆堆疊通知。
          </p>
        </header>

        <div class="grid gap-6 lg:grid-cols-2">
          <article class="space-y-4 rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div class="space-y-1">
              <h3 class="text-lg font-semibold text-slate-900">單一 Toast 元件</h3>
              <p class="text-sm leading-6 text-slate-600">
                使用 v-model 控制顯示狀態，並將 Toast 定位在指定容器中。
              </p>
            </div>

            <div
              class="relative flex min-h-64 flex-wrap items-start justify-center gap-3 overflow-hidden rounded-xl bg-slate-100 p-5"
            >
              <BtnDefault text="顯示容器內 Toast" @click="inlineToastVisible = true" />
              <BtnDefault text="顯示 alertdialog Toast" @click="alertDialogToastVisible = true" />

              <Toast
                v-model="inlineToastVisible"
                text="直接使用 Toast 元件<br>這則通知不會自動關閉"
                :auto-hide="false"
                position="absolute"
                x="50%"
                y="50%"
                toast-class="-translate-x-1/2 -translate-y-1/2"
              />
            </div>

            <Toast
              v-model="alertDialogToastVisible"
              text="這是必須立即處理的重要通知<br>可使用 Tab 與 Shift + Tab 測試焦點循環"
              :auto-hide="false"
              role="alertdialog"
              aria-live="assertive"
              :aria-label="$t('pages.sample.a11y.importantToast')"
              position="fixed"
              x="50%"
              y="50%"
              toast-class="-translate-x-1/2 -translate-y-1/2 border-2 border-error"
            >
              <template #actions="{ hide }">
                <div class="flex flex-wrap justify-center gap-3">
                  <BtnDefault text="稍後處理" @click="hide" />
                  <BtnDefault text="確認處理" @click="hide" />
                </div>
              </template>
            </Toast>
          </article>

          <article class="space-y-4 rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div class="space-y-1">
              <h3 class="text-lg font-semibold text-slate-900">全域 Toast API</h3>
              <p class="text-sm leading-6 text-slate-600">
                透過 useToast 建立通知，可依 ID 更新、關閉或同時堆疊多筆內容。
              </p>
            </div>

            <div class="flex flex-wrap gap-3">
              <BtnDefault text="自動關閉" @click="showAutoHideToast" />
              <BtnDefault text="建立常駐通知" @click="showPersistentToast" />
              <BtnDefault
                text="更新常駐通知"
                :disabled="!hasPersistentToast"
                @click="updatePersistentToast"
              />
              <BtnDefault
                text="關閉常駐通知"
                :disabled="!hasPersistentToast"
                @click="hidePersistentToast"
              />
              <BtnDefault text="顯示三則堆疊通知" @click="showStackedToasts" />
            </div>
          </article>
        </div>
      </section>

      <section class="space-y-6 py-4">
        <header class="space-y-2">
          <h2 class="text-center text-2xl font-bold">Card 基本使用</h2>
        </header>

        <div class="grid gap-4 md:grid-cols-4">
          <CardDefault
            v-for="card in cardItems"
            :key="card.title"
            :image="card.image"
            :title="card.title"
            :content="card.content"
            :link="card.link"
            img-default-class="rounded-xl"
          />
          <CardDefault
            image="/images/demo/test-img.jpg"
            title="卡片標題範例五"
            content="自訂樣式"
            img-default-class="rounded-none"
            img-loaded-class="rounded-none border-4 border-main-500 border-solid"
          />
        </div>
      </section>

      <section class="space-y-6 py-4">
        <header class="space-y-2">
          <h2 class="text-center text-2xl font-bold">ImageLazyLoad 圖片骨架載入</h2>
          <p class="text-center text-slate-600">
            圖片載入完成前顯示 skeleton，並透過固定比例避免載入前後的版面位移。
          </p>
        </header>

        <div class="grid gap-4 md:grid-cols-4">
          <article class="space-y-3">
            <ImageLazyLoad
              src="/images/demo/test-img.jpg"
              :alt="$t('pages.sample.a11y.imageBasic')"
              class="rounded-xl"
            />
            <h3 class="font-semibold">預設圖片比例 16:9</h3>
          </article>

          <article class="space-y-3">
            <ImageLazyLoad
              src="/images/demo/test-img.jpg"
              :alt="$t('pages.sample.a11y.imageCustomRatio')"
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
            <h3 class="font-semibold">自訂比例 3:2 與自訂載入中 skeleton 樣式</h3>
          </article>

          <article class="space-y-3 md:col-span-2">
            <ImageLazyLoad
              src="/images/demo/test-img.jpg"
              src-mobile="/images/nopic.png"
              src-desktop="/images/demo/test-img.jpg"
              :alt="$t('pages.sample.a11y.imageResponsive')"
              aspect-ratio-mobile="1 / 1"
              aspect-ratio-desktop="16 / 9"
              class="rounded-xl"
            />
            <h3 class="font-semibold">
              手機版圖片比例 1:1，電腦版圖片比例 16:9（預設 768px md 斷點）
            </h3>
          </article>

          <article class="space-y-3">
            <ImageLazyLoad
              src="/images/demo/test-img.jpg"
              :alt="$t('pages.sample.a11y.imageRootMargin')"
              root-margin="0px"
              :threshold="0.5"
              loading="eager"
              class="rounded-xl"
            />
            <h3 class="font-semibold">
              自訂 rootMargin 0px 與 threshold 0.5，圖片進入畫面一半後才載入
            </h3>
          </article>

          <article class="space-y-3">
            <ImageLazyLoad
              src="/images/demo/not-found.jpg"
              :alt="$t('pages.sample.a11y.imageFallback')"
              class="rounded-xl"
            />
            <h3 class="font-semibold">載入失敗顯示預設圖</h3>
          </article>

          <article class="space-y-3">
            <ImageLazyLoad
              src="/images/demo/not-found.jpg"
              :alt="$t('pages.sample.a11y.imageErrorSlot')"
              fallback-src=""
              class="rounded-xl"
            />
            <h3 class="font-semibold">載入失敗顯示 fallback</h3>
          </article>
        </div>
      </section>

      <section class="space-y-6 py-4">
        <header class="space-y-2">
          <h2 class="text-center text-2xl font-bold">VideoLazyLoad 與 IframeLazyLoad</h2>
          <p class="text-center text-slate-600">
            媒體接近可視區域時才載入，並在載入期間顯示固定比例的 skeleton。
          </p>
        </header>

        <div class="grid gap-6 md:grid-cols-2">
          <article class="space-y-3">
            <VideoLazyLoad
              src="/videos/demo.mp4"
              poster="/images/demo/test-img.jpg"
              poster-mobile="/images/nopic.png"
              poster-desktop="/images/demo/test-img.jpg"
              aspect-ratio-mobile="1 / 1"
              aspect-ratio-desktop="16 / 9"
              :aria-label="$t('pages.sample.a11y.videoBasic')"
              controls
              loop
              class="rounded-xl"
            />
            <h3 class="font-semibold">
              影片延遲載入、原生播放控制，以及手機 1:1／電腦 16:9 響應式封面
            </h3>
          </article>

          <article class="space-y-3">
            <IframeLazyLoad
              src="https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ"
              :title="$t('pages.sample.a11y.iframeBasic')"
              aspect-ratio-mobile="4 / 3"
              aspect-ratio-desktop="16 / 9"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
              class="rounded-xl"
            />
            <h3 class="font-semibold">
              YouTube iframe 延遲載入，以及手機 4:3／電腦 16:9 響應式比例
            </h3>
          </article>
        </div>
      </section>

      <section class="py-4">
        <header class="space-y-2">
          <h2 class="text-center text-2xl font-bold">Accordion 基本使用</h2>
          <p class="text-center text-slate-600">以單一項目展開模式示範最基本的手風琴互動效果。</p>
        </header>

        <Accordion v-model:active-items="basicAccordionActiveItems" :items="accordionItems" />
      </section>

      <section class="py-4">
        <header class="space-y-2">
          <h2 class="text-center text-2xl font-bold">Accordion 多項展開 + 預設展開項目</h2>
          <p class="text-center text-slate-600">
            :collapse-others="false" 關閉自動收合其他項目的行為，由父層將 activeItems 初始為 [0]
            設定預設展開項目，並透過事件回呼（@toggle）觀察展開與收合狀態。
          </p>
        </header>

        <Accordion
          v-model:active-items="multipleAccordionActiveItems"
          :items="accordionItems"
          :collapse-others="false"
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
            v-model:active-items="customAccordionActiveItems"
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
          <h2 class="text-center text-2xl font-bold">Accordion 父層狀態控制</h2>
          <p class="text-center text-slate-600">
            父層直接更新 activeItems，資料再透過 props 傳入 Accordion。
          </p>
        </header>

        <Accordion
          v-model:active-items="controlledAccordionActiveItems"
          :items="accordionItems"
          :collapse-others="false"
        />
        <div class="flex flex-wrap justify-center gap-3">
          <BtnDefault text="全部展開" @click="expandAllAccordionItems" />
          <BtnDefault text="全部收合" @click="collapseAllAccordionItems" />
          <BtnDefault text="指定第一個展開" @click="expandFirstAccordionItem" />
          <BtnDefault text="指定第一個收合" @click="collapseFirstAccordionItem" />
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
          :aria-label="$t('pages.sample.a11y.articlePagination')"
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
          :aria-label="$t('pages.sample.a11y.customPagination')"
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
            :aria-label="$t('pages.sample.a11y.filteredPagination')"
          />
        </div>
      </section>

      <section class="space-y-6 py-4">
        <header class="space-y-2">
          <h2 class="text-center text-2xl font-bold">Editor 編輯器模組</h2>
          <p class="text-center text-slate-600">
            展示文字段落、圖文排列、單張圖片、程式碼與雙圖等六種內容版型。
          </p>
        </header>

        <EditorModule :modules="editorModules" />
      </section>
    </div>
  </div>
</template>

<style></style>
