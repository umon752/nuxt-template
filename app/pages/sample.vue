<script setup lang="ts">
import type { DateValue } from '@internationalized/date'

import type { TCounterChangeSource } from '~/components/counter/Counter.vue'
import type { TCountUpInstance } from '~/components/countup/CountUp.vue'
import type { TEditorModule } from '~/components/editor/EditorModule.vue'
import type { TMarqueeItem } from '~/components/marquee/Marquee.vue'
import type { TModalCloseReason } from '~/components/modal/Modal.vue'
import type { TOdometerInstance } from '~/components/odometer/Odometer.vue'
import type {
  TStickyAnchorInstance,
  TStickyAnchorItem,
} from '~/components/stickyAnchor/StickyAnchor.vue'
import type { TSlideTabItem } from '~/components/slideTab/SlideTab.vue'
import type { TAppComboboxOption } from '~/components/form/AppCombobox.vue'
import type { TAppRadioOption } from '~/components/form/AppRadioGroup.vue'
import type { TAppSelectOption } from '~/components/form/AppSelect.vue'
import type { TFormValidationRules } from '~/composables/useFormValidation'
import GlobalSearchPanel from '~/components/search/GlobalSearchPanel.vue'
import { useToast } from '~/composables/useToast'
import taiwanAddressData from '~/data/taiwan-address.json'

//----------------------------
// page metadata
//----------------------------
usePageSeo({
  title: '範例頁',
  description: '範例頁描述',
})

usePageSchema({
  type: 'WebPage',
  name: '範例頁',
  description: '範例頁描述',
})

//----------------------------
// global search panel
//----------------------------
const globalSearchPanelOpen = ref(false)
const globalSearchSampleQuery = ref('')
const globalSearchSampleSuggestions = ['Nuxt 4', 'Vue 3', 'TypeScript', 'Accordion']

const handleGlobalSearchSampleSubmit = (query: string): void => {
  globalSearchSampleQuery.value = query
  globalSearchPanelOpen.value = false
}

//----------------------------
// i18n and number format
//----------------------------
const { locale } = useI18n()
const { formatNumber, padNumber } = useNumberFormat()

const numberFormatSampleValue = 1234567.89
const numberFormatSample = computed(() => formatNumber(numberFormatSampleValue))
const numberPaddingSample = computed(() => `${padNumber(1)}、${padNumber(9)}、${padNumber(10)}`)

//----------------------------
// accordion data
//----------------------------
const accordionItems = [
  { title: '收合項目 1', content: '內容內容內容 1' },
  { title: '收合項目 2', content: '內容內容內容 2' },
  { title: '收合項目 3', content: '內容內容內容 3' },
]

//----------------------------
// marquee data
//----------------------------
const marqueeItems: TMarqueeItem[] = [
  { id: 1, title: 'Nuxt 4 Starter' },
  { id: 2, title: 'Vue 3 Composition API' },
  { id: 3, title: 'TypeScript Strict Mode' },
  { id: 4, title: 'Tailwind CSS 4' },
  { id: 5, title: 'Responsive Marquee' },
]

//----------------------------
// slide tab data
//----------------------------
const slideTabItems: TSlideTabItem[] = [
  { id: 'all', label: '全部' },
  { id: 'building', label: '大樓公告' },
  { id: 'events', label: '活動宣傳與近期消息' },
  { id: 'maintenance', label: '設施維護' },
  { id: 'security', label: '安全通知' },
  { id: 'community', label: '社區交流與住戶活動' },
  { id: 'transportation', label: '交通資訊' },
  { id: 'service', label: '生活服務' },
  { id: 'rules', label: '管理規章' },
  { id: 'coming-soon', label: '即將開放', disabled: true },
]

//----------------------------
// sticky anchor data
//----------------------------
const stickyAnchorItems: TStickyAnchorItem[] = [
  { id: 'scan', label: '1. 項目一' },
  { id: 'report', label: '2. 項目二' },
  { id: 'notify', label: '3. 項目三' },
  { id: 'consultation', label: '4. 項目四' },
  { id: 'application', label: '5. 項目五' },
]

const stickyAnchorDescriptions = [
  '文字敘述文字敘述文字敘述',
  '文字敘述文字敘述文字敘述',
  '文字敘述文字敘述文字敘述',
  '文字敘述文字敘述文字敘述',
  '文字敘述文字敘述文字敘述',
]

const stickyAnchorActiveId = ref<string | number>('scan')
const stickyAnchorActiveItem = computed(() =>
  stickyAnchorItems.find((item) => Object.is(item.id, stickyAnchorActiveId.value))
)
const stickyAnchor = useTemplateRef<TStickyAnchorInstance>('stickyAnchor')

const scrollToLastStickyAnchorItem = (): void => {
  stickyAnchor.value?.scrollToItem(stickyAnchorItems.length - 1)
}

//----------------------------
// swiper data
//----------------------------
const swiperItems = [
  {
    id: 1,
    image: '/images/demo/test-img.jpg',
    title: '輪播項目一',
    description: '手機顯示一張投影片，並提供上一張、下一張與分頁圓點操作。',
  },
  {
    id: 2,
    image: '/images/demo/test-img.jpg',
    title: '輪播項目二',
    description: '平板尺寸開始同時顯示兩張投影片。',
  },
  {
    id: 3,
    image: '/images/demo/test-img.jpg',
    title: '輪播項目三',
    description: '桌面尺寸同時顯示三張投影片。',
  },
  {
    id: 4,
    image: '/images/demo/test-img.jpg',
    title: '輪播項目四',
    description: '支援滑鼠拖曳、觸控滑動與鍵盤焦點操作。',
  },
  {
    id: 5,
    image: '/images/demo/test-img.jpg',
    title: '輪播項目五',
    description: 'A11y 模組提供輪播區域與控制按鈕的無障礙說明。',
  },
]

const swiperBreakpoints = {
  768: {
    slidesPerView: 2,
  },
  992: {
    slidesPerView: 3,
  },
}

//----------------------------
// marquee state
//----------------------------
const marqueeActiveIndex = ref(0)
const marqueePaused = ref(false)
const reverseMarqueeActiveIndex = ref(0)
const reverseMarqueePaused = ref(false)

//----------------------------
// drag
//----------------------------
const dragTarget = useTemplateRef<HTMLElement>('dragTarget')
const dragButtons = useTemplateRef<HTMLElement[]>('dragButtons')
const lastDragAction = ref('尚未點選項目')
const dragItems = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  title: `拖曳項目 ${index + 1}`,
  description: '按住空白處或卡片左右拖曳，也可以直接點擊卡片。',
}))

const { isDragging } = useDrag({
  target: dragTarget,
  interactiveElements: dragButtons,
})

const handleDragItemClick = (title: string): void => {
  lastDragAction.value = `已點選「${title}」`
}

//----------------------------
// observer fade
//----------------------------
const observerFadeContainer = useTemplateRef<HTMLElement>('observerFadeContainer')
const showDynamicObserverFadeItem = ref(false)

//----------------------------
// nuxt ui wrapper form
//----------------------------
const nuxtUiWrapperForm = reactive({
  name: '',
  email: '',
  phone: '',
  city: undefined as string | number | undefined,
  district: undefined as string | number | undefined,
  address: '',
  idNumber: '',
  taxId: '',
  password: '',
  confirmPassword: '',
  category: undefined as string | number | undefined,
  message: '',
  contactMethod: 'email' as string | number | undefined,
  topic: undefined as string | number | undefined,
  agreeToTerms: false,
  notifications: true,
})
const nuxtUiWrapperDate = shallowRef<DateValue>()
const nuxtUiWrapperCategoryOptions: TAppSelectOption[] = [
  { label: '公告', value: 'announcement' },
  { label: '活動', value: 'event' },
  { label: '設施維護', value: 'maintenance' },
]
const resolveTaiwanAddressLabel = (labels: Record<string, string>): string => {
  const localeCode = locale.value ?? 'zh-TW'
  const language = localeCode.split('-')[0] ?? localeCode

  return labels[localeCode] ?? labels[language] ?? labels['zh-TW'] ?? ''
}
const nuxtUiWrapperAddressCityOptions = computed<TAppSelectOption[]>(() =>
  taiwanAddressData.map(({ value, labels }) => ({
    value,
    label: resolveTaiwanAddressLabel(labels),
  }))
)
const nuxtUiWrapperAddressDistrictOptions = computed<TAppSelectOption[]>(() => {
  const city = nuxtUiWrapperForm.city

  if (typeof city !== 'string') {
    return []
  }

  return (
    taiwanAddressData
      .find(({ value }) => value === city)
      ?.districts.map(({ value, labels }) => ({
        value,
        label: resolveTaiwanAddressLabel(labels),
      })) ?? []
  )
})
const nuxtUiWrapperContactOptions: TAppRadioOption[] = [
  { label: '電子郵件', value: 'email', description: '透過電子郵件回覆' },
  { label: '電話', value: 'phone', description: '由專人電話聯繫' },
  { label: '暫不回覆', value: 'none', disabled: true },
]
const nuxtUiWrapperTopicOptions: TAppComboboxOption[] = [
  { label: '產品公告', value: 'product', description: '產品與服務的最新消息' },
  { label: '活動資訊', value: 'event', description: '活動報名與相關通知' },
  { label: '技術支援', value: 'support', description: '使用與操作問題' },
  { label: '即將開放', value: 'coming-soon', disabled: true },
]
watch(
  () => nuxtUiWrapperForm.city,
  () => {
    nuxtUiWrapperForm.district = undefined
  }
)
const nuxtUiWrapperValidationRules = {
  email: ['required', 'email'],
  phone: ['required', 'phone'],
  idNumber: ['taiwanId'],
  taxId: ['taxId'],
} satisfies Record<'email' | 'phone' | 'idNumber' | 'taxId', TFormValidationRules>
const {
  errors: nuxtUiWrapperErrors,
  isSubmitted: nuxtUiWrapperIsSubmitted,
  validate: validateNuxtUiWrapperForm,
} = useFormValidation({
  state: nuxtUiWrapperForm,
  rules: nuxtUiWrapperValidationRules,
})

const submitNuxtUiWrapperForm = (): void => {
  validateNuxtUiWrapperForm()
}

const nuxtUiWrapperNameError = computed(() =>
  nuxtUiWrapperIsSubmitted.value && !nuxtUiWrapperForm.name ? '請輸入姓名' : undefined
)
const nuxtUiWrapperCategoryError = computed(() =>
  nuxtUiWrapperIsSubmitted.value && nuxtUiWrapperForm.category === undefined
    ? '請選擇分類'
    : undefined
)
const nuxtUiWrapperAgreeError = computed(() =>
  nuxtUiWrapperIsSubmitted.value && !nuxtUiWrapperForm.agreeToTerms ? '請確認同意條款' : undefined
)
const nuxtUiWrapperAddressCityError = computed(() =>
  nuxtUiWrapperIsSubmitted.value && nuxtUiWrapperForm.city === undefined ? '請選擇縣市' : undefined
)
const nuxtUiWrapperAddressDistrictError = computed(() =>
  nuxtUiWrapperIsSubmitted.value &&
  nuxtUiWrapperForm.city !== undefined &&
  nuxtUiWrapperForm.district === undefined
    ? '請選擇區域'
    : undefined
)
const nuxtUiWrapperAddressError = computed(() =>
  nuxtUiWrapperIsSubmitted.value && !nuxtUiWrapperForm.address.trim() ? '請輸入地址' : undefined
)
const nuxtUiWrapperPasswordError = computed(() => {
  if (!nuxtUiWrapperIsSubmitted.value) {
    return undefined
  }

  if (!nuxtUiWrapperForm.password) {
    return '請輸入密碼'
  }

  return nuxtUiWrapperForm.password.length >= 8 ? undefined : '密碼至少需要 8 碼'
})
const nuxtUiWrapperConfirmPasswordError = computed(() => {
  if (!nuxtUiWrapperIsSubmitted.value) {
    return undefined
  }

  if (!nuxtUiWrapperForm.confirmPassword) {
    return '請再次輸入密碼'
  }

  return nuxtUiWrapperForm.password === nuxtUiWrapperForm.confirmPassword
    ? undefined
    : '兩次密碼輸入不一致'
})

//----------------------------
// observer fade controls
//----------------------------
const {
  isActive: isObserverFadeActive,
  observedCount: observerFadeCount,
  start: startObserverFade,
  refresh: refreshObserverFade,
  stop: stopObserverFade,
} = useObserverFade({
  container: observerFadeContainer,
})

//----------------------------
// slide tab state
//----------------------------
const basicSlideTabId = ref<string | number>('all')
const basicSlideTabItem = computed(() =>
  slideTabItems.find((item) => item.id === basicSlideTabId.value)
)
const alignedSlideTabId = ref<string | number>('rules')
const alignedSlideTabItem = computed(() =>
  slideTabItems.find((item) => item.id === alignedSlideTabId.value)
)

//----------------------------
// counter
//----------------------------
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

//----------------------------
// count up
//----------------------------
type TCountUpControlAction = keyof TCountUpInstance

const randomCountUp = useTemplateRef<TCountUpInstance>('randomCountUp')
const sequentialCountUp = useTemplateRef<TCountUpInstance>('sequentialCountUp')
const lastCountUpEvent = ref('尚未執行')

const controlCountUps = (action: TCountUpControlAction): void => {
  randomCountUp.value?.[action]()
  sequentialCountUp.value?.[action]()
}

const handleCountUpEvent = (eventName: string, value: string): void => {
  lastCountUpEvent.value = `${eventName}：${value}`
}

//----------------------------
// odometer
//----------------------------
const odometer = useTemplateRef<TOdometerInstance>('odometer')
const odometerValue = ref(128)
const odometerInput = ref<number | string>(5432)
const lastOdometerEvent = ref('尚未執行')

const updateOdometer = (): void => {
  const nextValue = Number(odometerInput.value)

  odometerValue.value = Number.isInteger(nextValue) && nextValue >= 0 ? nextValue : 0
}

const setOdometerValue = (value: number): void => {
  odometerInput.value = value
  odometerValue.value = value
}

const handleOdometerEvent = (eventName: string, value: number): void => {
  lastOdometerEvent.value = `${eventName}：${value}`
}

//----------------------------
// toast and modal
//----------------------------
const toast = useToast()
const inlineToastVisible = ref(false)
const alertDialogToastVisible = ref(false)
const persistentToastId = ref<string>()
const basicModalVisible = ref(false)
const persistentModalVisible = ref(false)
const alertModalVisible = ref(false)
const lastModalCloseReason = ref<TModalCloseReason>()

//----------------------------
// social share
//----------------------------
const handleSocialShareCopied = (): void => {
  toast.show({
    text: '分享連結已複製到剪貼簿',
    duration: 2500,
  })
}

const handleSocialShareError = (error: unknown): void => {
  const reason = error instanceof Error ? error.message : '未知錯誤'

  toast.show({
    text: `分享操作失敗：${reason}`,
    duration: 4000,
  })
}

const handleModalClose = (reason: TModalCloseReason): void => {
  lastModalCloseReason.value = reason
}

const hasPersistentToast = computed(() => {
  return toast.toasts.value.some((item) => item.id === persistentToastId.value && item.visible)
})

const showAutoHideToast = (): void => {
  toast.show({
    text: '資料儲存成功\n這則通知會在 2.5 秒後自動關閉',
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
    text: '通知內容已動態更新\n現在可以手動關閉',
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
      position: 'relative',
      toastClass: 'left-auto top-auto translate-x-0 translate-y-0',
    })
  })
}

//----------------------------
// card
//----------------------------
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

//----------------------------
// editor
//----------------------------
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

//----------------------------
// accordion state and controls
//----------------------------
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

//----------------------------
// cursor state
//----------------------------
const cursorLastEvent = ref('尚未觸發')

const recordCursorEvent = (eventName: string): void => {
  cursorLastEvent.value = eventName
}

//----------------------------
// pagination
//----------------------------
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

//----------------------------
// query pagination
//----------------------------
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
          展示頁面標題區塊、breadcrumb 與頁首資訊的預設呈現方式，橫幅會預留 3 / 2
          比例避免載入時版面位移。
        </p>
      </header>

      <PageHeader :banner="'/images/demo/test-img.jpg'" />

      <div class="container space-y-2">
        <p class="text-center text-sm text-slate-600">
          PageBanner 可透過外部 class 覆寫比例，例如 aspect-video。
        </p>
        <PageHeaderPageBanner
          banner="/images/demo/test-img.jpg"
          alt="16 比 9 橫幅範例"
          class="aspect-video"
          loading="lazy"
        />
      </div>
    </section>

    <section class="space-y-6 py-4">
      <header class="container space-y-2">
        <h2 class="text-center text-2xl font-bold">GlobalSearchPanel 全站搜尋面板</h2>
        <p class="text-center text-slate-600">
          展示搜尋面板的受控開關、關鍵字標籤、Escape／點擊外部關閉與 submit 事件。
        </p>
      </header>

      <div class="relative container max-w-3xl rounded-2xl bg-slate-50 p-6">
        <div class="flex flex-wrap items-center justify-center gap-4">
          <BtnDefault
            :text="globalSearchPanelOpen ? '關閉搜尋面板' : '開啟搜尋面板'"
            @click="globalSearchPanelOpen = !globalSearchPanelOpen"
          />
          <p class="text-sm text-slate-600" role="status" aria-live="polite">
            最近搜尋：{{ globalSearchSampleQuery || '尚未搜尋' }}
          </p>
        </div>

        <GlobalSearchPanel
          panel-id="sample-global-search-panel"
          :open="globalSearchPanelOpen"
          :initial-query="globalSearchSampleQuery"
          :suggestions="globalSearchSampleSuggestions"
          @close="globalSearchPanelOpen = false"
          @submit="handleGlobalSearchSampleSubmit"
        />
      </div>
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

      <section ref="observerFadeContainer" class="space-y-6 py-4">
        <header class="space-y-2">
          <h2 class="text-center text-2xl font-bold">useObserverFade 捲動淡入</h2>
          <p class="text-center text-slate-600">
            使用 data attribute 設定淡入方式；動態加入的項目也會自動被觀察。
          </p>
        </header>

        <div class="flex flex-wrap justify-center gap-3">
          <BtnDefault
            :text="showDynamicObserverFadeItem ? '移除動態項目' : '新增動態項目'"
            @click="showDynamicObserverFadeItem = !showDynamicObserverFadeItem"
          />
          <BtnDefault text="重新掃描" @click="refreshObserverFade" />
          <BtnDefault
            :text="isObserverFadeActive ? '停止並顯示全部' : '重新啟動'"
            @click="isObserverFadeActive ? stopObserverFade() : startObserverFade()"
          />
        </div>

        <p class="text-center text-sm text-slate-500" aria-live="polite">
          狀態：{{ isObserverFadeActive ? '觀察中' : '已停止' }}，已處理
          {{ observerFadeCount }} 個元素
        </p>

        <div class="grid gap-6 md:grid-cols-3">
          <article
            data-fade="in"
            class="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p class="text-main-700 text-xs font-semibold tracking-wide">#1</p>
            <h3 class="text-lg font-semibold text-slate-900">淡入一次</h3>
            <p class="text-sm leading-6 text-slate-600">進入 viewport 後執行一次 opacity 動畫。</p>
          </article>

          <article
            data-fade="up"
            data-fade-timing='{"duration":800,"delay":150,"easing":"ease-out"}'
            class="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p class="text-main-700 text-xs font-semibold tracking-wide">#2</p>
            <h3 class="text-lg font-semibold text-slate-900">向上淡入</h3>
            <p class="text-sm leading-6 text-slate-600">
              可透過 data-fade-timing 覆寫 duration、delay 與 easing。
            </p>
          </article>

          <article
            data-fade="up"
            data-fade-once="false"
            class="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p class="text-main-700 text-xs font-semibold tracking-wide">#3</p>
            <h3 class="text-lg font-semibold text-slate-900">離開後重播</h3>
            <p class="text-sm leading-6 text-slate-600">
              data-fade-once="false" 會在離開 viewport 時回到起始狀態。
            </p>
          </article>

          <article
            v-if="showDynamicObserverFadeItem"
            data-fade="in"
            class="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p class="text-main-700 text-xs font-semibold tracking-wide">#4</p>
            <h3 class="text-lg font-semibold text-slate-900">動態項目</h3>
            <p class="text-sm leading-6 text-slate-600">
              MutationObserver 會自動偵測並套用動畫，不需手動 refresh。
            </p>
          </article>
        </div>
      </section>

      <section class="space-y-6 py-4">
        <header class="space-y-2">
          <h2 class="text-center text-2xl font-bold">useNumberFormat 數字格式化</h2>
          <p class="text-center text-slate-600">
            共用方法會依目前語系加入千分位，也提供單位數前綴 0 的格式化方法。
          </p>
        </header>

        <article
          class="mx-auto max-w-2xl space-y-3 rounded-2xl border border-slate-200 p-6 text-center shadow-sm"
        >
          <p class="text-sm text-slate-500">原始數值：{{ numberFormatSampleValue }}</p>
          <p class="text-main-500 text-3xl font-bold tabular-nums">{{ numberFormatSample }}</p>
          <code class="block text-sm text-slate-500">formatNumber(1234567.89)</code>
          <p class="text-sm text-slate-500">補零結果（1、9、10）：{{ numberPaddingSample }}</p>
          <code class="block text-sm text-slate-500">padNumber(1) → 01</code>
        </article>
      </section>

      <section class="space-y-6 py-4">
        <header class="space-y-2">
          <h2 class="text-center text-2xl font-bold">Nuxt UI wrapper 表單元件</h2>
          <p class="text-center text-slate-600">
            頁面只使用專案自己的表單
            wrapper，展示地址、身分識別、密碼、選擇、日期、文字區域、核取方塊、單選、開關與
            可搜尋下拉選單。
          </p>
        </header>

        <FormAppForm
          class="mx-auto grid max-w-3xl gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          novalidate
          @submit="submitNuxtUiWrapperForm"
        >
          <FormAppFormField
            label="姓名"
            description="由 FormAppFormField 統一處理 label、description 與 error。"
            :error="nuxtUiWrapperNameError"
            required
          >
            <FormAppInput
              v-model="nuxtUiWrapperForm.name"
              placeholder="請輸入姓名"
              :invalid="!!nuxtUiWrapperNameError"
              autocomplete="name"
            />
          </FormAppFormField>

          <FormAppFormField
            label="Email"
            description="必填，請輸入 name@example.com 格式。"
            :error="nuxtUiWrapperErrors.email"
            required
          >
            <FormAppInput
              v-model="nuxtUiWrapperForm.email"
              type="email"
              placeholder="name@example.com"
              required
              :invalid="!!nuxtUiWrapperErrors.email"
              autocomplete="email"
            />
          </FormAppFormField>

          <FormAppFormField
            label="電話"
            description="必填，支援 0912-345-678 或 02-1234-5678 格式。"
            :error="nuxtUiWrapperErrors.phone"
            required
          >
            <FormAppInput
              v-model="nuxtUiWrapperForm.phone"
              type="tel"
              placeholder="09xx-xxx-xxx"
              required
              :invalid="!!nuxtUiWrapperErrors.phone"
              autocomplete="tel"
            />
          </FormAppFormField>

          <div class="grid gap-5 sm:grid-cols-2">
            <FormAppFormField
              label="縣市"
              description="選擇縣市後，區域選單會更新。"
              :error="nuxtUiWrapperAddressCityError"
              required
            >
              <FormAppSelect
                v-model="nuxtUiWrapperForm.city"
                :options="nuxtUiWrapperAddressCityOptions"
                placeholder="請選擇縣市"
                name="address-city"
                autocomplete="address-level1"
                :invalid="!!nuxtUiWrapperAddressCityError"
              />
            </FormAppFormField>

            <FormAppFormField
              label="區域"
              description="請先選擇縣市。"
              :error="nuxtUiWrapperAddressDistrictError"
              required
            >
              <FormAppSelect
                v-model="nuxtUiWrapperForm.district"
                :options="nuxtUiWrapperAddressDistrictOptions"
                placeholder="請選擇區域"
                name="address-district"
                autocomplete="address-level2"
                :disabled="!nuxtUiWrapperForm.city"
                :invalid="!!nuxtUiWrapperAddressDistrictError"
              />
            </FormAppFormField>

            <FormAppFormField
              class="sm:col-span-2"
              label="地址"
              :error="nuxtUiWrapperAddressError"
              required
            >
              <FormAppInput
                v-model="nuxtUiWrapperForm.address"
                placeholder="請輸入完整地址"
                autocomplete="street-address"
                required
                :invalid="!!nuxtUiWrapperAddressError"
              />
            </FormAppFormField>
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
            <FormAppFormField
              label="身分證字號"
              description="選填；填寫時檢查基本格式。"
              :error="nuxtUiWrapperErrors.idNumber"
            >
              <FormAppInput
                v-model="nuxtUiWrapperForm.idNumber"
                placeholder="A123456789"
                maxlength="10"
                autocomplete="off"
                :invalid="!!nuxtUiWrapperErrors.idNumber"
              />
            </FormAppFormField>

            <FormAppFormField
              label="統一編號"
              description="選填；填寫時需為 8 碼數字。"
              :error="nuxtUiWrapperErrors.taxId"
            >
              <FormAppInput
                v-model="nuxtUiWrapperForm.taxId"
                placeholder="12345678"
                maxlength="8"
                inputmode="numeric"
                autocomplete="off"
                :invalid="!!nuxtUiWrapperErrors.taxId"
              />
            </FormAppFormField>
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
            <FormAppFormField
              label="密碼"
              description="必填，至少 8 碼。"
              :error="nuxtUiWrapperPasswordError"
              required
            >
              <FormAppInput
                v-model="nuxtUiWrapperForm.password"
                type="password"
                placeholder="請輸入密碼"
                minlength="8"
                maxlength="128"
                autocomplete="new-password"
                required
                :invalid="!!nuxtUiWrapperPasswordError"
              />
            </FormAppFormField>

            <FormAppFormField
              label="確認密碼"
              description="請再次輸入相同密碼。"
              :error="nuxtUiWrapperConfirmPasswordError"
              required
            >
              <FormAppInput
                v-model="nuxtUiWrapperForm.confirmPassword"
                type="password"
                placeholder="請再次輸入密碼"
                minlength="8"
                maxlength="128"
                autocomplete="new-password"
                required
                :invalid="!!nuxtUiWrapperConfirmPasswordError"
              />
            </FormAppFormField>
          </div>

          <FormAppFormField label="分類" :error="nuxtUiWrapperCategoryError" required>
            <FormAppSelect
              v-model="nuxtUiWrapperForm.category"
              :options="nuxtUiWrapperCategoryOptions"
              placeholder="請選擇分類"
              :invalid="!!nuxtUiWrapperCategoryError"
            />
          </FormAppFormField>

          <FormAppFormField
            label="日期"
            description="FormAppDatePicker 對外使用 DateValue，內部組合 InputDate、Calendar 與 Popover。"
          >
            <FormAppDatePicker
              v-model="nuxtUiWrapperDate"
              calendar-class="[&_[data-slot=headCell]]:text-main-500 [&_[data-slot=cellTrigger][data-today]]:text-main-500"
            />
          </FormAppFormField>

          <FormAppFormField label="留言" description="AppTextarea 支援原生 attrs 與 autoresize。">
            <FormAppTextarea
              v-model="nuxtUiWrapperForm.message"
              placeholder="請輸入留言"
              :rows="4"
              autoresize
              :maxrows="8"
            />
          </FormAppFormField>

          <FormAppFormField label="偏好的聯絡方式">
            <FormAppRadioGroup
              v-model="nuxtUiWrapperForm.contactMethod"
              :options="nuxtUiWrapperContactOptions"
              orientation="horizontal"
              name="contact-method"
            />
          </FormAppFormField>

          <FormAppFormField label="主題" description="輸入關鍵字搜尋，也可以使用鍵盤選取。">
            <FormAppCombobox
              v-model="nuxtUiWrapperForm.topic"
              :options="nuxtUiWrapperTopicOptions"
              clearable
              search-placeholder="搜尋主題"
            />
          </FormAppFormField>

          <FormAppFormField :error="nuxtUiWrapperAgreeError" required>
            <FormAppCheckbox
              v-model="nuxtUiWrapperForm.agreeToTerms"
              label="我已閱讀並同意服務條款"
              required
              :invalid="!!nuxtUiWrapperAgreeError"
            />
          </FormAppFormField>

          <FormAppSwitch
            v-model="nuxtUiWrapperForm.notifications"
            label="啟用通知"
            description="開啟後會接收與表單相關的後續通知。"
          />

          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="space-y-1 text-sm text-slate-500" aria-live="polite">
              <p>選擇日期：{{ nuxtUiWrapperDate?.toString() ?? '尚未選擇' }}</p>
              <p>
                聯絡方式：{{ nuxtUiWrapperForm.contactMethod ?? '尚未選擇' }}；通知：
                {{ nuxtUiWrapperForm.notifications ? '已啟用' : '已關閉' }}
              </p>
            </div>
            <button
              type="submit"
              class="rounded-md bg-slate-900 px-4 py-2 font-medium text-white transition-colors hover:bg-slate-700"
            >
              送出驗證
            </button>
          </div>
        </FormAppForm>
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
              button-class="bg-slate-900 text-white hover:bg-slate-700 disabled:bg-slate-200 disabled:text-slate-500"
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
          <h2 class="text-center text-2xl font-bold">EmptyState 空資料狀態元件</h2>
          <p class="text-center text-slate-600">
            展示預設空資料訊息，以及透過 class props 調整容器與文字樣式。
          </p>
        </header>

        <div class="grid gap-6 md:grid-cols-2">
          <EmptyState title="目前沒有資料" description="尚未建立任何內容。" />

          <EmptyState
            title="找不到搜尋結果"
            description="請調整關鍵字或清除篩選條件。"
            empty-class="border-main-300 bg-main-50"
            title-class="text-main-700"
            description-class="text-main-800"
          />
        </div>
      </section>

      <section class="space-y-6 py-4">
        <header class="space-y-2">
          <h2 class="text-center text-2xl font-bold">CountUp 數字動畫元件</h2>
          <p class="text-center text-slate-600">
            展示保留符號的隨機數字動畫、順序遞增與千分位格式，以及完整播放控制。
          </p>
        </header>

        <div class="grid gap-6 md:grid-cols-2">
          <article class="space-y-3 rounded-2xl border border-slate-200 p-6 text-center shadow-sm">
            <h3 class="text-lg font-semibold text-slate-900">隨機模式</h3>
            <p class="text-sm text-slate-600">非數字字元會固定，只讓各個數字隨機跳動。</p>
            <CountupCountUp
              ref="randomCountUp"
              value="123,567.98 個"
              :duration="2000"
              :start-time="300"
              :delay="80"
              count-up-class="text-3xl font-bold text-main-500"
              @run="handleCountUpEvent('執行', $event)"
              @stop="handleCountUpEvent('暫停', $event)"
              @start="handleCountUpEvent('繼續', $event)"
              @reset="handleCountUpEvent('重設', $event)"
              @restart="handleCountUpEvent('重新執行', $event)"
              @done="handleCountUpEvent('完成', $event)"
            />
          </article>

          <article class="space-y-3 rounded-2xl border border-slate-200 p-6 text-center shadow-sm">
            <h3 class="text-lg font-semibold text-slate-900">順序模式與千分位</h3>
            <p class="text-sm text-slate-600">從 500 線性遞增至 12,500。</p>
            <CountupCountUp
              ref="sequentialCountUp"
              :value="12500"
              :start-value="500"
              :duration="2000"
              mode="sequential"
              thousand-comma
              count-up-class="text-3xl font-bold text-slate-900"
              @run="handleCountUpEvent('執行', $event)"
              @stop="handleCountUpEvent('暫停', $event)"
              @start="handleCountUpEvent('繼續', $event)"
              @reset="handleCountUpEvent('重設', $event)"
              @restart="handleCountUpEvent('重新執行', $event)"
              @done="handleCountUpEvent('完成', $event)"
            />
          </article>
        </div>

        <div class="flex flex-wrap justify-center gap-3">
          <BtnDefault text="Run（含延遲）" @click="controlCountUps('run')" />
          <BtnDefault text="Stop" @click="controlCountUps('stop')" />
          <BtnDefault text="Start（立即繼續）" @click="controlCountUps('start')" />
          <BtnDefault text="Reset" @click="controlCountUps('reset')" />
          <BtnDefault text="Restart" @click="controlCountUps('restart')" />
        </div>

        <p class="text-center text-sm text-slate-500">最後事件：{{ lastCountUpEvent }}</p>
      </section>

      <section class="space-y-6 py-4">
        <header class="space-y-2">
          <h2 class="text-center text-2xl font-bold">Odometer 里程表數字元件</h2>
          <p class="text-center text-slate-600">
            每一位數字使用獨立的垂直軌道，位數不同時會先切換成目標位數，再開始滾動。
          </p>
        </header>

        <article
          class="mx-auto max-w-3xl space-y-6 rounded-2xl border border-slate-200 p-6 text-center shadow-sm"
        >
          <Odometer
            ref="odometer"
            :value="odometerValue"
            :start-value="0"
            :max-count="99999"
            :duration="1200"
            odometer-class="text-5xl font-bold text-main-500"
            @run="handleOdometerEvent('執行', $event)"
            @update="handleOdometerEvent('更新', $event)"
            @done="handleOdometerEvent('完成', $event)"
          />

          <div class="flex flex-wrap items-end justify-center gap-3">
            <label class="space-y-2 text-left">
              <span class="block text-sm font-medium text-slate-700">目標值</span>
              <input
                v-model.number="odometerInput"
                type="number"
                min="0"
                step="1"
                class="w-48 rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              />
            </label>
            <BtnDefault text="更新數值" @click="updateOdometer" />
            <BtnDefault text="從 0 重播" @click="odometer?.run()" />
          </div>

          <div class="flex flex-wrap justify-center gap-3">
            <BtnDefault text="兩位數 42" @click="setOdometerValue(42)" />
            <BtnDefault text="四位數 1000" @click="setOdometerValue(1000)" />
            <BtnDefault text="超過上限 100000" @click="setOdometerValue(100000)" />
          </div>

          <div class="space-y-1 text-sm text-slate-500">
            <p>父層數值：{{ odometerValue }}；最大顯示值：99999</p>
            <p>最後事件：{{ lastOdometerEvent }}</p>
          </div>
        </article>
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
          <h2 class="text-center text-2xl font-bold">Cursor 使用範例</h2>
          <p class="text-center text-slate-600">
            展示區域跟隨、連結 hover 放大、隱藏原生游標與文字／圖片內容 slot。
          </p>
        </header>

        <div class="grid gap-6 lg:grid-cols-3">
          <Cursor
            trigger-class="block"
            link-hover
            hide-cursor
            @enter="recordCursorEvent('圓形 enter')"
            @move="recordCursorEvent('圓形 move')"
            @leave="recordCursorEvent('圓形 leave')"
          >
            <article
              class="flex min-h-56 flex-col items-center justify-center gap-4 rounded-2xl bg-sky-200 p-6 text-center"
            >
              <h3 class="text-lg font-semibold text-sky-950">圓形游標</h3>
              <p class="text-sm text-sky-900">移入後游標會跟隨指標，原生游標同步隱藏。</p>
              <a
                href="#cursor-demo"
                class="rounded-md bg-sky-950 px-3 py-2 font-medium text-white underline-offset-2 hover:underline"
              >
                Hover 連結
              </a>
            </article>
          </Cursor>

          <Cursor
            trigger-class="block"
            link-hover
            cursor-class="rounded-none bg-rose-500 mix-blend-normal"
            hover-class="size-14 bg-rose-600"
            @enter="recordCursorEvent('方形 enter')"
            @move="recordCursorEvent('方形 move')"
            @leave="recordCursorEvent('方形 leave')"
          >
            <article
              class="flex min-h-56 flex-col items-center justify-center gap-4 rounded-2xl bg-rose-100 p-6 text-center"
            >
              <h3 class="text-lg font-semibold text-rose-950">方形游標</h3>
              <p class="text-sm text-rose-900">透過 `cursor-class` 與 `hover-class` 客製外觀。</p>
              <button
                type="button"
                class="rounded-md border border-rose-900 px-3 py-2 font-medium text-rose-950 transition-colors hover:bg-rose-900 hover:text-white"
              >
                Hover 按鈕
              </button>
            </article>
          </Cursor>

          <Cursor
            trigger-class="block"
            link-hover
            cursor-class="size-auto rounded-none bg-transparent mix-blend-normal"
            hover-class="size-auto mix-blend-screen"
            @enter="recordCursorEvent('圖片 enter')"
            @move="recordCursorEvent('圖片 move')"
            @leave="recordCursorEvent('圖片 leave')"
          >
            <article
              class="relative flex min-h-56 flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl bg-amber-100 p-6 text-center"
            >
              <h3 class="relative text-lg font-semibold text-amber-950">圖片游標</h3>
              <p class="relative text-sm text-amber-900">固定圖片可直接由 `content` slot 提供。</p>
              <a
                href="#cursor-demo"
                class="relative rounded-md bg-amber-950 px-3 py-2 font-medium text-white underline-offset-2 hover:underline"
              >
                Hover 固定圖片
              </a>
            </article>

            <template #content>
              <img
                src="/images/demo/test-img.jpg"
                alt=""
                class="h-24 w-40 rounded-lg object-cover shadow-lg"
              />
            </template>
          </Cursor>

          <Cursor
            trigger-class="block lg:col-span-3"
            link-hover
            cursor-class="size-auto rounded-xl bg-emerald-950 mix-blend-normal"
            hover-class="size-auto bg-emerald-700"
            @enter="recordCursorEvent('文字 enter')"
            @move="recordCursorEvent('文字 move')"
            @leave="recordCursorEvent('文字 leave')"
          >
            <article
              class="flex min-h-44 flex-col items-center justify-center gap-4 rounded-2xl bg-emerald-100 p-6 text-center"
            >
              <h3 class="text-lg font-semibold text-emerald-950">文字游標</h3>
              <p class="text-sm text-emerald-900">
                使用 `isLink` 判斷 hover 目標，移入 link 時切換提示文字。
              </p>
              <a
                href="#cursor-demo"
                class="rounded-md bg-emerald-950 px-3 py-2 font-medium text-white underline-offset-2 hover:underline"
              >
                Hover 文字內容
              </a>
            </article>

            <template #content="{ isLink }">
              <span class="px-4 py-2 text-sm font-semibold whitespace-nowrap text-white">
                {{ isLink ? '查看詳細資訊' : '開啟詳細資訊' }}
              </span>
            </template>
          </Cursor>

          <Cursor
            trigger-class="block lg:col-span-3"
            link-hover
            cursor-class="size-auto rounded-none bg-transparent mix-blend-normal"
            hover-class="size-auto mix-blend-screen"
            @enter="recordCursorEvent('多圖片 enter')"
            @move="recordCursorEvent('多圖片 move')"
            @leave="recordCursorEvent('多圖片 leave')"
          >
            <article class="space-y-4 rounded-2xl bg-violet-100 p-6 text-center">
              <div class="space-y-1">
                <h3 class="text-lg font-semibold text-violet-950">同一個 Cursor 區域切換圖片</h3>
                <p class="text-sm text-violet-900">
                  每個 hover 目標提供不同的 `data-cursor-img`，游標內容會隨指標切換圖片。
                </p>
              </div>

              <div class="grid gap-3 sm:grid-cols-3">
                <a
                  href="#cursor-demo"
                  data-cursor-img="/images/demo/test-img.jpg"
                  class="rounded-xl border border-violet-300 bg-white p-4 font-semibold text-violet-950 transition-colors hover:border-violet-500 hover:bg-violet-50"
                >
                  圖片一：風景
                </a>
                <a
                  href="#cursor-demo"
                  data-cursor-img="/images/nopic.png"
                  class="rounded-xl border border-violet-300 bg-white p-4 font-semibold text-violet-950 transition-colors hover:border-violet-500 hover:bg-violet-50"
                >
                  圖片二：Fallback
                </a>
                <a
                  href="#cursor-demo"
                  data-cursor-img="/images/logo/logo.svg"
                  class="rounded-xl border border-violet-300 bg-white p-4 font-semibold text-violet-950 transition-colors hover:border-violet-500 hover:bg-violet-50"
                >
                  圖片三：Logo
                </a>
              </div>
            </article>

            <template #content="{ imageSrc }">
              <img
                v-if="imageSrc"
                :src="imageSrc"
                alt=""
                class="h-24 w-40 rounded-lg bg-white object-contain p-2 shadow-lg"
              />
            </template>
          </Cursor>
        </div>

        <p id="cursor-demo" class="text-center text-sm text-slate-500">
          最後事件：{{ cursorLastEvent }}
        </p>
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
          <h2 class="text-center text-2xl font-bold">useDrag 水平拖曳捲動</h2>
          <p class="text-center text-slate-600">
            按住下方區域左右拖曳；一般點擊仍會觸發卡片操作，拖曳則不會誤觸。
          </p>
        </header>

        <div class="space-y-3">
          <div
            ref="dragTarget"
            class="touch-pan-y overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-5 select-none"
            :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
            aria-label="可水平拖曳的範例項目"
          >
            <div class="flex w-max gap-4">
              <button
                v-for="item in dragItems"
                :key="item.id"
                ref="dragButtons"
                type="button"
                class="hover:border-main-500 hover:bg-main-50 w-64 shrink-0 space-y-2 rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm"
                @click="handleDragItemClick(item.title)"
              >
                <span class="text-main-700 block text-xs font-semibold tracking-wide">
                  #{{ item.id }}
                </span>
                <span class="block text-lg font-semibold text-slate-900">{{ item.title }}</span>
                <span class="block text-sm leading-6 text-slate-600">{{ item.description }}</span>
              </button>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
            <p>拖曳狀態：{{ isDragging ? '拖曳中' : '待命' }}</p>
            <p aria-live="polite">{{ lastDragAction }}</p>
          </div>
        </div>
      </section>

      <section class="space-y-6 py-4">
        <header class="space-y-2">
          <h2 class="text-center text-2xl font-bold">SlideTab 橫向分類導覽</h2>
          <p class="text-center text-slate-600">
            使用相同分類比較預設定位，以及啟用 align-active-to-start 後盡量靠左的差異。
          </p>
        </header>

        <div class="space-y-8">
          <article class="space-y-3 rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div class="space-y-1">
              <h3 class="text-lg font-semibold text-slate-900">預設：確保 Active 可見</h3>
              <p class="text-sm text-slate-600">
                Active 項目已在 viewport 內時不會額外改變捲動位置。
              </p>
            </div>

            <div class="border-b border-slate-300">
              <SlideTab
                v-model="basicSlideTabId"
                :items="slideTabItems"
                aria-label="預設定位的範例內容分類"
              />
            </div>

            <p class="text-sm text-slate-500" aria-live="polite">
              目前分類：{{ basicSlideTabItem?.label ?? '未選擇' }}
            </p>
          </article>

          <article class="space-y-3 rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div class="space-y-1">
              <h3 class="text-lg font-semibold text-slate-900">
                align-active-to-start：Active 盡量靠左
              </h3>
              <p class="text-sm text-slate-600">
                只要捲動範圍允許，就會將 Active 項目左緣對齊 viewport
                左側；尾端仍受最大捲動距離限制。
              </p>
            </div>

            <div class="border-b border-slate-300">
              <SlideTab
                v-model="alignedSlideTabId"
                :items="slideTabItems"
                aria-label="Active 項目盡量靠左的範例內容分類"
                align-active-to-start
              />
            </div>

            <p class="text-sm text-slate-500" aria-live="polite">
              目前分類：{{ alignedSlideTabItem?.label ?? '未選擇' }}
            </p>
          </article>
        </div>
      </section>

      <section class="space-y-6 py-4">
        <header class="space-y-2">
          <h2 class="text-center text-2xl font-bold">StickyAnchor 區段導覽</h2>
          <p class="text-center text-slate-600">
            捲動內容會同步更新目前區段；手機版導覽可左右拖曳，桌面版會固定在內容左側。
          </p>
        </header>

        <div class="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <p aria-live="polite">目前區段：{{ stickyAnchorActiveItem?.label ?? '未選擇' }}</p>
          <button
            type="button"
            class="rounded-lg border border-slate-300 px-3 py-2 font-medium text-slate-700 transition-colors hover:border-slate-500 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
            @click="scrollToLastStickyAnchorItem"
          >
            直接前往最後一個區段
          </button>
        </div>

        <StickyAnchor
          ref="stickyAnchor"
          v-model="stickyAnchorActiveId"
          :items="stickyAnchorItems"
          :aria-label="$t('pages.sample.a11y.stickyAnchorNavigation')"
          root-class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
          aside-class="bg-white lg:pt-2"
          viewport-class="rounded-xl bg-slate-50 p-2"
          content-class="space-y-10 lg:pl-4"
          section-class="min-h-[24rem] space-y-4 rounded-xl border border-slate-200 p-5"
        >
          <template #content="{ index }">
            <div class="space-y-4">
              <p class="leading-7 text-slate-600">{{ stickyAnchorDescriptions[index] }}</p>
              <img
                src="/images/demo/test-img.jpg"
                :alt="$t('pages.sample.a11y.stickyAnchorImage')"
                class="aspect-video w-full rounded-xl object-cover"
              />
            </div>
          </template>
        </StickyAnchor>
      </section>

      <section class="space-y-6 py-4">
        <header class="space-y-2">
          <h2 class="text-center text-2xl font-bold">Swiper 輪播範例</h2>
          <p class="text-center text-slate-600">
            初始化前先隱藏輪播，避免 SSR 首屏短暫只顯示一張；完成後依螢幕寬度顯示一至三張投影片。
          </p>
        </header>

        <SwiperBaseSwiper
          :items="swiperItems"
          :options="{
            slidesPerView: 1,
            spaceBetween: 24,
            breakpoints: swiperBreakpoints,
          }"
        >
          <template #slide="{ item }">
            <article
              class="h-full w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <LazyloadImageLazyLoad
                :src="item.image"
                :alt="$t('pages.sample.a11y.swiperImage', { number: item.id })"
                aspect-ratio="16 / 9"
              />
              <div class="space-y-2 p-5">
                <h3 class="text-lg font-semibold text-slate-900">{{ item.title }}</h3>
                <p class="text-sm leading-6 text-slate-600">{{ item.description }}</p>
              </div>
            </article>
          </template>

          <template #previous="{ previous, disabled }">
            <BtnDefault text="上一張" :disabled="disabled" @click="previous" />
          </template>

          <template #next="{ next, disabled }">
            <BtnDefault text="下一張" :disabled="disabled" @click="next" />
          </template>
        </SwiperBaseSwiper>
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
                :text="'直接使用 Toast 元件\n這則通知不會自動關閉'"
                :auto-hide="false"
                position="absolute"
              />
            </div>

            <Toast
              v-model="alertDialogToastVisible"
              :text="'這是必須立即處理的重要通知\n可使用 Tab 與 Shift + Tab 測試焦點循環'"
              :auto-hide="false"
              role="alertdialog"
              aria-live="assertive"
              :aria-label="$t('pages.sample.a11y.importantToast')"
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
          <h2 class="text-center text-2xl font-bold">SocialShare 社群分享</h2>
          <p class="text-center text-slate-600">
            分享目前頁面至 Facebook、LINE、X，或將分享連結複製到剪貼簿。
          </p>
        </header>

        <div class="grid gap-6 lg:grid-cols-2">
          <article class="space-y-4 rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div class="space-y-1">
              <h3 class="text-lg font-semibold text-slate-900">預設平台與目前頁網址</h3>
              <p class="text-sm leading-6 text-slate-600">
                未傳入 url 時，點擊當下會使用目前頁面的完整網址。
              </p>
            </div>

            <SocialShare :aria-label="$t('pages.sample.a11y.socialShareBasic')" />
          </article>

          <article class="space-y-4 rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div class="space-y-1">
              <h3 class="text-lg font-semibold text-slate-900">指定內容、平台與自訂 slot</h3>
              <p class="text-sm leading-6 text-slate-600">
                指定分享網址與標題，只顯示 Facebook、LINE、X、複製連結，並自訂複製按鈕內容。
              </p>
            </div>

            <SocialShare
              url="https://example.com/news/social-share"
              title="SocialShare 元件使用範例"
              :platforms="['facebook', 'line', 'x', 'copy']"
              :aria-label="$t('pages.sample.a11y.socialShareCustom')"
              button-class="gap-2 rounded-full px-4"
              @copied="handleSocialShareCopied"
              @error="handleSocialShareError"
            >
              <template #facebook>
                <IconFacebook class="h-6 w-6" aria-hidden="true" />
              </template>
              <template #line>
                <IconLine class="h-6 w-6" aria-hidden="true" />
              </template>
              <template #x>
                <IconX class="h-5 w-5" aria-hidden="true" />
              </template>
              <template #copy="{ label, copied }">
                <span v-if="copied" aria-hidden="true">✓</span>
                <span v-else aria-hidden="true"><IconCopy class="h-4 w-4" /></span>
                <span>{{ label }}</span>
              </template>
            </SocialShare>
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
            <LazyloadImageLazyLoad
              src="/images/demo/test-img.jpg"
              :alt="$t('pages.sample.a11y.imageBasic')"
              class="rounded-xl"
            />
            <h3 class="font-semibold">預設圖片比例 16:9</h3>
          </article>

          <article class="space-y-3">
            <LazyloadImageLazyLoad
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
            </LazyloadImageLazyLoad>
            <h3 class="font-semibold">自訂比例 3:2 與自訂載入中 skeleton 樣式</h3>
          </article>

          <article class="space-y-3 md:col-span-2">
            <LazyloadImageLazyLoad
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
            <LazyloadImageLazyLoad
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
            <LazyloadImageLazyLoad
              src="/images/demo/not-found.jpg"
              :alt="$t('pages.sample.a11y.imageFallback')"
              class="rounded-xl"
            />
            <h3 class="font-semibold">載入失敗顯示預設圖</h3>
          </article>

          <article class="space-y-3">
            <LazyloadImageLazyLoad
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
            <LazyloadVideoLazyLoad
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
            <LazyloadIframeLazyLoad
              src="https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ?autoplay=1&mute=1&playsinline=1"
              :title="$t('pages.sample.a11y.iframeBasic')"
              aspect-ratio-mobile="4 / 3"
              aspect-ratio-desktop="16 / 9"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
              class="rounded-xl"
            >
              <template #skeleton>
                <img
                  src="https://i.ytimg.com/vi/aqz-KE-bpKQ/sddefault.jpg"
                  alt=""
                  class="h-full w-full object-cover"
                />
              </template>
            </LazyloadIframeLazyLoad>
            <div class="space-y-1">
              <h3 class="font-semibold">
                YouTube iframe 延遲載入、靜音自動播放，以及手機 4:3／電腦 16:9 響應式比例
              </h3>
              <p class="text-sm text-slate-600">
                縮圖檔名：default.jpg（預設）、mqdefault.jpg（中等）、hqdefault.jpg（高畫質）、sddefault.jpg（標準解析度，本例使用）、maxresdefault.jpg（最高解析度，部分影片不提供）。src
                使用 autoplay=1、mute=1 與 playsinline=1；瀏覽器通常只允許靜音影片自動播放。
              </p>
            </div>
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
            父層頁面接管 keyword 與 page query，Pagination 只回傳頁碼，篩選條件變更時自動回到第 1
            頁。
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
