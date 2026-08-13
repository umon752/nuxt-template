# GlobalSearchPanel

網站共用的全站搜尋展開面板，提供搜尋輸入框、熱門關鍵字、`IconClose` 關閉按鈕、Escape／點擊外部關閉與受控 submit 事件。面板本身不負責呼叫搜尋 API 或導向路由，搜尋資料與導覽由呼叫端處理。

原始碼：[GlobalSearchPanel.vue](../../../../app/components/search/GlobalSearchPanel.vue)

## 使用方式

```vue
<script setup lang="ts">
import { ref } from 'vue'

import GlobalSearchPanel from '~/components/search/GlobalSearchPanel.vue'

const open = ref(false)
const query = ref('')
const suggestions = ['Nuxt 4', 'Vue 3', 'TypeScript']

const submitSearch = (value: string): void => {
  query.value = value
  open.value = false
}
</script>

<template>
  <button type="button" @click="open = true">開啟搜尋</button>
  <GlobalSearchPanel
    panel-id="example-search-panel"
    :open="open"
    :initial-query="query"
    :suggestions="suggestions"
    @close="open = false"
    @submit="submitSearch"
  />
</template>
```

## Props

| Prop           | 型別                | 預設值                | 說明                                         |
| -------------- | ------------------- | --------------------- | -------------------------------------------- |
| `open`         | `boolean`           | 必填                  | 是否顯示搜尋面板。                           |
| `suggestions`  | `readonly string[]` | `[]`                  | 顯示在面板下方的熱門關鍵字按鈕。             |
| `initialQuery` | `string`            | `''`                  | 面板開啟時帶入輸入框的初始關鍵字。           |
| `panelId`      | `string`            | `global-search-panel` | 面板 ID，也會用來產生輸入框與標題的關聯 ID。 |

`panelId` 在同一頁有多個面板時必須保持唯一。元件沒有公開 class props，也不提供 `v-model`；面板開關由 `open` 與 `close` event 形成受控資料流。

## Emits

| Event    | Payload         | 說明                                            |
| -------- | --------------- | ----------------------------------------------- |
| `close`  | —               | 使用者按 Escape、關閉按鈕或點擊面板外部時觸發。 |
| `submit` | `query: string` | 送出非空、已移除首尾空白並合併連續空白的查詢。  |

點擊熱門關鍵字會直接觸發 `submit`；空白查詢不會觸發 submit，只會將焦點留在輸入框。

## 無障礙、SSR 與清理

- 輸入區使用 `role="search"`、label、原生 `type="search"` 與可見 focus 樣式。
- 開啟後在 client 端自動將焦點移到輸入框；Escape、關閉按鈕與面板外部點擊都能關閉。
- document 的 `keydown` 與 `pointerdown` listener 只在面板開啟時註冊，狀態關閉或元件卸載時會移除。
- SSR 不會讀取 `document` 或 DOM；面板的固定背景從 header 的 `--nav-h` CSS variable 下方開始。
- 使用者可見文字取自 `search.panel.*` i18n keys；熱門關鍵字由呼叫端提供，應使用目前語系內容。

## 限制

- 元件只負責呈現與互動，不會自行請求 `/api/search`、處理 loading／error 或更新 URL。
- 呼叫端應在 `submit` 後驗證功能開關、同步 route query，並處理 API 結果與錯誤狀態。
