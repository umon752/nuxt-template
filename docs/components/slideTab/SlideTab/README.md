# SlideTab

以原生水平捲動與 `useDrag` 實作的不定寬度分類導覽。支援滑鼠／指標拖曳、觸控操作、前後項目控制、邊緣漸層、受控 active 狀態及自訂項目內容，不依賴 Swiper。

原始碼：[SlideTab.vue](../../../../app/components/slideTab/SlideTab.vue)

## 基本使用

```vue
<script setup lang="ts">
import type { TSlideTabItem } from '~/components/slideTab/SlideTab.vue'

const items: TSlideTabItem[] = [
  { id: 'all', label: '全部' },
  { id: 'news', label: '最新消息' },
  { id: 'events', label: '活動宣傳' },
  { id: 'disabled', label: '尚未開放', disabled: true },
]

const activeId = ref<string | number>('all')
</script>

<template>
  <SlideTab v-model="activeId" :items="items" @change="(item) => console.log(item)" />
</template>
```

`SlideTab` 是受控元件。使用者選擇未停用且非目前 active 的項目時，元件會 emit `update:modelValue` 與 `change`，實際 active 狀態仍由父層更新。若 `modelValue` 沒有對應項目，所有項目都會呈現未選取狀態。

完整操作範例位於 [`app/pages/sample.vue`](../../../../app/pages/sample.vue) 的「SlideTab 橫向分類導覽」區塊。

## 自訂項目

預設項目是具 `aria-pressed` 的按鈕。若分類會切換路由，可使用 `item` slot 改成 `NuxtLink`，並呼叫 slot 提供的 `select()` 同步受控狀態：

```vue
<SlideTab v-model="activeId" :items="items">
  <template #item="{ item, isActive, select }">
    <NuxtLink
      :to="`/news?category=${item.id}`"
      class="block rounded-t-xl px-8 py-5"
      :class="isActive ? 'bg-white text-slate-950' : 'bg-slate-50 text-slate-600'"
      :aria-current="isActive ? 'page' : undefined"
      @click="select"
    >
      {{ item.label }}
    </NuxtLink>
  </template>
</SlideTab>
```

自訂 slot 時，使用端必須自行處理元素語意、active 狀態與 disabled 行為。`select()` 對 disabled 或已 active 的項目不會 emit。

## Props

| Prop                 | 型別                            | 預設值      | 說明                                                           |
| -------------------- | ------------------------------- | ----------- | -------------------------------------------------------------- |
| `items`              | `TSlideTabItem[]`               | 必填        | 分類資料；每筆包含唯一 `id`、`label`，可設定 `disabled`。      |
| `modelValue`         | `string \| number \| undefined` | `undefined` | 目前 active item ID，使用 `v-model`。                          |
| `showControls`       | `boolean`                       | `true`      | 是否在可捲動時顯示前後控制按鈕。                               |
| `alignActiveToStart` | `boolean`                       | `false`     | Active item 更新時是否在捲動範圍允許下盡量靠齊 viewport 左側。 |
| `ariaLabel`          | `string`                        | 翻譯值      | 外層 `<nav>` accessible name。                                 |
| `previousLabel`      | `string`                        | 翻譯值      | 顯示前方項目按鈕的 accessible name。                           |
| `nextLabel`          | `string`                        | 翻譯值      | 顯示後方項目按鈕的 accessible name。                           |
| `rootClass`          | `ClassValue`                    | `''`        | 外層 `<nav>` class。                                           |
| `viewportClass`      | `ClassValue`                    | `''`        | 水平捲動 viewport class。                                      |
| `listClass`          | `ClassValue`                    | `''`        | `<ul>` class。                                                 |
| `itemClass`          | `ClassValue`                    | `''`        | 每個 `<li>` class。                                            |
| `activeClass`        | `ClassValue`                    | `''`        | Active `<li>` class。                                          |
| `disabledClass`      | `ClassValue`                    | `''`        | Disabled `<li>` class。                                        |
| `controlClass`       | `ClassValue`                    | `''`        | 前後控制按鈕共用 class。                                       |

`TSlideTabItem` 型別為：

```ts
type TSlideTabItem = {
  id: string | number
  label: string
  disabled?: boolean
  [key: string]: unknown
}
```

## Slots

- `item`：`{ item, index, isActive, select }`，完整替換預設項目按鈕。
- `previous`：替換前一個控制按鈕的內部圖示，按鈕語意與行為由元件保留。
- `next`：替換下一個控制按鈕的內部圖示，按鈕語意與行為由元件保留。

## Events

| Event               | Payload                                | 觸發時機                           |
| ------------------- | -------------------------------------- | ---------------------------------- |
| `update:modelValue` | `(id: string \| number)`               | 選擇未停用且非目前 active 的項目。 |
| `change`            | `(item: TSlideTabItem, index: number)` | 與 model 更新事件同時觸發。        |

## 公開方法

透過 template ref 可呼叫：

- `scrollPrevious()`：捲動至目前 viewport 前方最近的項目。
- `scrollNext()`：捲動至目前 viewport 後方第一個被遮住的項目。
- `scrollToItem(index, behavior?)`：依索引將項目左緣捲到 viewport 左側；索引不存在時不執行。
- `refresh()`：重新計算是否可向前或向後捲動。

## 行為與無障礙

- 使用原生 `overflow-x-auto`，不載入 Swiper；viewport 隱藏 scrollbar，但仍可透過觸控、拖曳及控制按鈕操作。
- `ResizeObserver` 會監測 viewport 與列表尺寸；不支援時回退至 window resize 事件。
- active item 在外部更新或容器尺寸改變時會自動捲入可視範圍。啟用 `alignActiveToStart` 時會改為嘗試將 active item 左緣對齊 viewport；接近列表尾端而無法繼續向右捲動時，會停在最大 `scrollLeft`，讓項目盡量靠左。
- 平滑捲動會遵循 `prefers-reduced-motion`，啟用 reduced motion 時改用立即捲動。
- 前後按鈕只會在對應方向仍有內容時渲染，兩側漸層也會依捲動邊界更新。
- 外層使用具 accessible name 的 `<nav>` 與 `<ul>`。此元件代表分類導覽，不會輸出 `role="tablist"` 或 `role="tab"`；若內容是真正的 ARIA tabs，應另外實作 tab 與 tabpanel 的鍵盤及關聯契約。
- 預設翻譯鍵值位於 `components.slideTab`：`ariaLabel`、`previous`、`next`。
