# PageHeader

整合頁面橫幅、H1 標題與 Breadcrumb 的標題區元件，可自動從目前 route 計算麵包屑與標題。

原始碼：[PageHeader.vue](../../../../app/components/pageHeader/PageHeader.vue)

提供 `banner` 時，內部 `PageHeaderPageBanner` 預設使用 `aspect-[3/2]` 比例預留橫幅空間；需要不同構圖比例時，可直接使用 `PageHeaderPageBanner` 並傳入 `class="aspect-video"`。

## 使用方式

```vue
<!-- 使用自動 breadcrumb 與 route 標題 -->
<PageHeader />

<!-- 完整覆寫 -->
<PageHeader
  banner="/images/page/news.jpg"
  banner-alt="最新消息"
  title="最新消息"
  :breadcrumb-items="[{ title: '首頁', href: '/' }, { title: '最新消息' }]"
/>
```

| Prop              | 型別                | 預設值          | 說明                                                   |
| ----------------- | ------------------- | --------------- | ------------------------------------------------------ |
| `banner`          | `string`            | `''`            | 橫幅圖片；空字串時不渲染橫幅。                         |
| `bannerAlt`       | `string`            | 自動標題        | 橫幅替代文字。                                         |
| `title`           | `string`            | 自動標題        | 頁面 H1；未提供時依 breadcrumb 最後一項或 route 產生。 |
| `breadcrumbItems` | `TBreadcrumbItem[]` | 自動 breadcrumb | 自訂麵包屑；空陣列時使用 `useBreadcrumb()`。           |
