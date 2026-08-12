# Breadcrumb

輸出目前頁面的麵包屑導覽，最後一項會標記 `aria-current="page"`。

原始碼：[Breadcrumb.vue](../../../../app/components/breadcrumb/Breadcrumb.vue)

## 使用方式

```vue
<Breadcrumb
  :items="[
    { title: '首頁', href: '/' },
    { title: '最新消息', href: '/news' },
    { title: '消息內容' },
  ]"
/>
```

| Prop    | 型別                | 預設值 | 說明                                               |
| ------- | ------------------- | ------ | -------------------------------------------------- |
| `items` | `TBreadcrumbItem[]` | `[]`   | 每項包含 `title` 與可選的 `href`；空陣列時不渲染。 |

導覽標籤取自 `components.breadcrumb.ariaLabel` 翻譯。

當第一個項目的 `href` 為 `/` 時，`首頁` 會以 `IconHome` 顯示，並保留螢幕閱讀器可讀的 `首頁` 文字。
