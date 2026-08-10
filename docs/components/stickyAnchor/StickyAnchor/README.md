# StickyAnchor

提供頁面區段的 sticky 錨點導覽。手機版導覽列可水平捲動與拖曳，桌面版會固定在內容左側；頁面捲動時會依 viewport 中線同步 active 區段，點擊項目則平滑捲動到對應內容。

原始碼：[StickyAnchor.vue](../../../../app/components/stickyAnchor/StickyAnchor.vue)

## 基本使用

```vue
<script setup lang="ts">
import type { TStickyAnchorItem } from '~/components/stickyAnchor/StickyAnchor.vue'

const items: TStickyAnchorItem[] = [
  { id: 'overview', label: '總覽' },
  { id: 'features', label: '功能特色' },
  { id: 'faq', label: '常見問題' },
]

const activeId = ref<string | number>('overview')
</script>

<template>
  <StickyAnchor v-model="activeId" :items="items">
    <template #content="{ item, index }">
      <p>{{ item.label }} 的內容（第 {{ index + 1 }} 區）</p>
    </template>
  </StickyAnchor>
</template>
```

`StickyAnchor` 以 `items` 驅動導覽與內容區段。元件會自動輸出每個區段的標題，`content` slot 用來放入該區段的其他內容。完整操作範例位於 [`app/pages/sample.vue`](../../../../app/pages/sample.vue) 的「StickyAnchor 區段導覽」區塊。

## Props

| Prop                | 型別                            | 預設值                  | 說明                                                                    |
| ------------------- | ------------------------------- | ----------------------- | ----------------------------------------------------------------------- |
| `items`             | `TStickyAnchorItem[]`           | 必填                    | 導覽項目；每筆需要唯一 `id` 與 `label`。                                |
| `modelValue`        | `string \| number \| undefined` | 第一筆項目 ID（非受控） | 目前 active 項目，可使用 `v-model`；傳入後由父層負責更新受控狀態。      |
| `ariaLabel`         | `string \| undefined`           | i18n                    | `<nav>` 的 accessible name。                                            |
| `scrollOffset`      | `number`                        | `0`                     | 點擊導覽後，內容區段頂端要保留的頁面捲動偏移量，通常用於 fixed header。 |
| `rootClass`         | `ClassValue`                    | `''`                    | 最外層 layout class。                                                   |
| `asideClass`        | `ClassValue`                    | `''`                    | sticky 導覽容器 class。                                                 |
| `viewportClass`     | `ClassValue`                    | `''`                    | 導覽列捲動 viewport class。                                             |
| `listClass`         | `ClassValue`                    | `''`                    | 導覽 `<ol>` class。                                                     |
| `itemClass`         | `ClassValue`                    | `''`                    | 每個導覽項目 `<li>` class。                                             |
| `buttonClass`       | `ClassValue`                    | `''`                    | 導覽按鈕共用 class。                                                    |
| `activeButtonClass` | `ClassValue`                    | `''`                    | active 導覽按鈕 class。                                                 |
| `contentClass`      | `ClassValue`                    | `''`                    | 內容區容器 class。                                                      |
| `sectionClass`      | `ClassValue`                    | `''`                    | 每個內容 `<section>` class。                                            |
| `headingClass`      | `ClassValue`                    | `''`                    | 元件自動輸出的區段標題 class。                                          |

`TStickyAnchorItem` 型別為：

```ts
type TStickyAnchorItem = {
  id: string | number
  label: string
  [key: string]: unknown
}
```

所有 class prop 會透過 `cn` 合併，使用端傳入的 Tailwind utility 可覆寫預設樣式。

## Slots

- `item`：替換導覽按鈕的內容，slot props 為 `item`、`index`、`isActive` 與 `select`。slot 只應提供按鈕內部內容，不要再放入另一個 `<button>`。
- `content`：放入區段內容，slot props 為 `item`、`index` 與 `isActive`。區段標題由元件自動輸出。

## Events

| Event               | Payload                  | 觸發時機                          |
| ------------------- | ------------------------ | --------------------------------- |
| `update:modelValue` | `(id: string \| number)` | active 項目改變時。               |
| `change`            | `(item, index)`          | active 項目改變時，同步回傳項目。 |

未傳入 `modelValue` 時，元件內部會以第一筆項目作為初始 active，並自行更新；傳入 `v-model` 後則採受控資料流，父層應處理 `update:modelValue`。

## 公開方法

透過 template ref 可呼叫：

- `scrollToItem(index, behavior?)`：捲動至指定區段；`behavior` 預設依 `prefers-reduced-motion` 在 `smooth` 與 `auto` 間選擇。
- `refresh()`：重新依目前頁面捲動位置判斷 active 區段。

```vue
<script setup lang="ts">
import type { TStickyAnchorInstance } from '~/components/stickyAnchor/StickyAnchor.vue'

const stickyAnchor = useTemplateRef<TStickyAnchorInstance>('stickyAnchor')

const goToFaq = (): void => {
  stickyAnchor.value?.scrollToItem(2)
}
</script>

<template>
  <StickyAnchor ref="stickyAnchor" v-model="activeId" :items="items" />
  <button type="button" @click="goToFaq">前往常見問題</button>
</template>
```

## 行為、無障礙與限制

- 導覽使用具 accessible name 的 `<nav>`、有序清單與原生按鈕；目前項目會標記 `aria-current="location"`，每個按鈕也會透過 `aria-controls` 關聯到對應 `<section>`。
- 元件自動輸出區段標題並以 `aria-labelledby` 關聯內容區段。原生按鈕保留 Enter、Space 與 focus 操作；自訂 `item` slot 時不要移除按鈕語意。
- 捲動 active 判斷以 viewport 垂直中線為基準，採用目前中線前最後一個區段。初始捲動位置在第一個區段之前時，第一筆仍是 active。
- active 項目變更時只會在導覽 viewport 內以 `inline: nearest`／`block: nearest` 將按鈕維持在可視範圍，不會因此改變頁面內容捲動位置；桌面版導覽項目過多時 viewport 也可垂直捲動。
- 手機版導覽 viewport 支援水平觸控、滑鼠與 Pointer 拖曳；拖曳超過門檻時會抑制按鈕誤點擊。桌面版預設改為垂直排列。
- `prefers-reduced-motion: reduce` 啟用時，程式化捲動會改用立即捲動；按鈕 transition 也會停用。
- DOM、`window`、`ResizeObserver` 與事件 listener 只在 mounted 後使用；元件卸載時會移除捲動／resize listener、取消 pending animation frame 並 disconnect observer。
- 點擊導覽會對目標區段使用 `scrollIntoView`；`--nav-h` 或 `scrollOffset` 會透過 `scroll-margin-top` 保留 fixed header 間距。active scroll spy 仍監聽 window page scroll。
- 元件的 active scroll spy 監聽 window page scroll，不會將任意內層 scroll container 當成 active 狀態來源。
- `items` 的 `id` 必須唯一；空陣列時元件不輸出內容。項目 label 若需要翻譯，應由使用端先取得目前語系的翻譯文字。

## i18n

`ariaLabel` 未傳入時使用 `components.stickyAnchor.ariaLabel`。導覽項目本身沒有內建文字，請由使用端提供已翻譯的 `items[].label`。
