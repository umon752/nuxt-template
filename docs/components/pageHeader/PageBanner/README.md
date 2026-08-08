# PageBanner

頁面標題區使用的橫幅圖片元件。

原始碼：[PageBanner.vue](../../../../app/components/pageHeader/PageBanner.vue)

## 使用方式

```vue
<PageHeaderPageBanner banner="/images/page/news.jpg" alt="最新消息橫幅" class="aspect-[3/2]" />
```

元件預設使用 Tailwind `aspect-[3/2]` 預留圖片比例，並以 `object-cover` 填滿比例區域，以降低載入時的 layout shift。若圖片構圖不同，可透過外部 `class` 傳入其他 Tailwind `aspect-*` utility，例如 `class="aspect-video"`；元件會使用 `cn` 合併並處理 Tailwind class 衝突。

| Prop     | 型別     | 預設值     | 說明                                 |
| -------- | -------- | ---------- | ------------------------------------ |
| `banner` | `string` | `''`       | 圖片網址。                           |
| `alt`    | `string` | `預設橫幅` | 圖片替代文字。裝飾性圖片可傳空字串。 |

## 樣式 API

外部 `class` 會套用到根 `<img>`，並使用 `cn` 合併元件預設的 Tailwind class。比例設定請使用 `aspect-*` utility；其他 HTML attributes（例如 `loading="lazy"`）也會由單一根元素自動轉發：

```vue
<PageHeaderPageBanner
  banner="/images/page/news.jpg"
  alt="最新消息橫幅"
  class="aspect-video rounded-xl"
/>
```

預設 class 為 `block h-auto w-full aspect-[3/2] object-cover`。
