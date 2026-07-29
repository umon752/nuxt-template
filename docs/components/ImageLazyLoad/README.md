# ImageLazyLoad

具備固定比例、載入骨架、淡入效果與失敗 fallback 的圖片元件。

原始碼：[ImageLazyLoad.vue](../../../app/components/ImageLazyLoad.vue)

延伸閱讀：[ImageLazyLoad 完整使用說明](lazy-image-guide.md)

## 基本使用

```vue
<ImageLazyLoad
  src="/images/demo/test-img.jpg"
  alt="活動照片"
  aspect-ratio="3 / 2"
  class="rounded-xl"
  @load="handleLoad"
  @error="handleError"
/>
```

| Prop            | 型別                                             | 預設值              | 說明                                       |
| --------------- | ------------------------------------------------ | ------------------- | ------------------------------------------ |
| `src`           | `string`                                         | 必填                | 圖片網址。                                 |
| `alt`           | `string`                                         | `''`                | 替代文字。                                 |
| `fallbackSrc`   | `string`                                         | `/images/nopic.png` | 載入失敗時使用的圖片；空字串會顯示錯誤區。 |
| `aspectRatio`   | `string`                                         | `16 / 9`            | 容器 CSS `aspect-ratio`。                  |
| `objectFit`     | `contain \| cover \| fill \| none \| scale-down` | `cover`             | 圖片縮放方式。                             |
| `loading`       | `eager \| lazy`                                  | `lazy`              | 原生圖片載入策略。                         |
| `decoding`      | `async \| auto \| sync`                          | `async`             | 原生解碼策略。                             |
| `imgClass`      | `ClassValue`                                     | `''`                | `<img>` class。                            |
| `skeletonClass` | `ClassValue`                                     | `''`                | skeleton class。                           |

Slots：`skeleton`、`error`。Events：`load(event)`、`error(event)`。其餘 attrs 會傳到 `<img>`，根節點的 `class`、`style` 則套用到比例容器。
