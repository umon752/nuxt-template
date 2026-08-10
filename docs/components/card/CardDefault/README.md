# CardDefault

包含延遲載入圖片、標題、摘要及可選整卡連結的基本卡片。

原始碼：[CardDefault.vue](../../../../app/components/card/CardDefault.vue)

## 使用方式

```vue
<CardDefault
  image="/images/demo/test-img.jpg"
  title="文章標題"
  content="文章摘要"
  link="/news/example"
  img-loaded-class="group-hover:scale-105"
/>
```

| Prop              | 型別         | 預設值 | 說明                                    |
| ----------------- | ------------ | ------ | --------------------------------------- |
| `image`           | `string`     | 必填   | 圖片網址。                              |
| `title`           | `string`     | 必填   | 卡片標題及整卡連結的 accessible name。  |
| `content`         | `string`     | `''`   | 摘要；空字串時不渲染段落。              |
| `link`            | `string`     | `''`   | NuxtLink 目的地；空字串時卡片不可點擊。 |
| `imgDefaultClass` | `ClassValue` | `''`   | LazyloadImageLazyLoad 容器 class。      |
| `imgLoadedClass`  | `ClassValue` | `''`   | 圖片本體 class。                        |
| `titleClass`      | `ClassValue` | `''`   | 標題 class。                            |
| `contentClass`    | `ClassValue` | `''`   | 摘要 class。                            |

卡片圖片目前使用空 `alt`，適合圖片僅為裝飾、文字已完整表達內容的情境。
