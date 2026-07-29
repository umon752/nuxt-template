# PageBanner

頁面標題區使用的橫幅圖片元件。

原始碼：[PageBanner.vue](../../../../app/components/pageHeader/PageBanner.vue)

## 使用方式

```vue
<PageHeaderPageBanner banner="/images/page/news.jpg" alt="最新消息橫幅" />
```

| Prop     | 型別     | 預設值     | 說明                                 |
| -------- | -------- | ---------- | ------------------------------------ |
| `banner` | `string` | `''`       | 圖片網址。                           |
| `alt`    | `string` | `預設橫幅` | 圖片替代文字。裝飾性圖片可傳空字串。 |
