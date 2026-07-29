# PageTitle

輸出頁面主要 H1 標題。

原始碼：[PageTitle.vue](../../../../app/components/pageHeader/PageTitle.vue)

## 使用方式

```vue
<PageHeaderPageTitle title="最新消息" class="text-4xl font-bold" />
```

| Prop    | 型別     | 預設值     | 說明      |
| ------- | -------- | ---------- | --------- |
| `title` | `string` | `預設標題` | H1 文字。 |

一般頁面應只保留一個主要 H1；此元件通常由 `PageHeader` 使用。
