# EmptyState

呈現列表、搜尋結果或其他區塊的空資料狀態，包含標題、可選說明及三個可覆寫預設 Tailwind utility 的 class props。

原始碼：[EmptyState.vue](../../../../app/components/emptyState/EmptyState.vue)

Nuxt 自動匯入名稱為 `EmptyState`。

## 使用方式

```vue
<EmptyState title="目前沒有資料" description="尚未建立任何內容。" />
```

父層負責判斷 loading、error、empty 與 success 狀態；`EmptyState` 只呈現傳入的空資料文字。

```vue
<EmptyState
  v-if="!pending && !error && items.length === 0"
  title="找不到搜尋結果"
  description="請調整關鍵字或清除篩選條件。"
  empty-class="border-main-300 bg-main-50"
  title-class="text-main-700"
  description-class="text-main-600"
/>
```

## Props

| Prop               | 型別         | 預設值 | 說明                                                        |
| ------------------ | ------------ | ------ | ----------------------------------------------------------- |
| `title`            | `string`     | 必填   | 空狀態標題。                                                |
| `description`      | `string`     | `''`   | 補充說明；空字串時不渲染說明段落。                          |
| `emptyClass`       | `ClassValue` | `''`   | 根元素 class，經 `cn()` 合併並可覆寫預設 Tailwind utility。 |
| `titleClass`       | `ClassValue` | `''`   | 標題 class，經 `cn()` 合併並可覆寫預設 Tailwind utility。   |
| `descriptionClass` | `ClassValue` | `''`   | 說明 class，經 `cn()` 合併並可覆寫預設 Tailwind utility。   |

元件沒有 events、slots 或公開方法。

## 無障礙與 i18n

- 根元素使用 `role="status"`，非同步載入完成後出現時可由輔助技術以一般狀態訊息讀出。
- 標題與說明使用文字段落，不建立可能干擾頁面 heading outline 的固定標題層級。
- 元件沒有內建文字；`title` 與 `description` 應由使用端傳入 i18n 翻譯結果。
- 錯誤狀態不應使用此元件；需要立即通知的錯誤應使用適合的 error／alert 呈現。

## SSR 與限制

- 元件只依 props 產生 HTML，沒有 browser API、side effect 或需要清理的資源，SSR 與 hydration 安全。
- `title` 與 `description` 以 Vue 文字插值輸出，不解析 HTML。
- loading、error、資料判斷與操作按鈕不屬於此元件責任。
