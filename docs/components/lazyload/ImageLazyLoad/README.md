# ImageLazyLoad

具備可控提前載入、響應式圖片、固定比例、載入骨架、淡入效果與失敗 fallback 的圖片元件。

原始碼：[ImageLazyLoad.vue](../../../../app/components/lazyload/ImageLazyLoad.vue)

Nuxt 自動匯入名稱為 `LazyloadImageLazyLoad`。

延伸閱讀：[ImageLazyLoad 完整使用說明](lazy-image-guide.md)

## 基本使用

```vue
<LazyloadImageLazyLoad
  src="/images/demo/test-img.jpg"
  alt="活動照片"
  aspect-ratio="3 / 2"
  root-margin="400px"
  class="rounded-xl"
  @load="handleLoad"
  @error="handleError"
/>
```

元件預設在距離可視區域 `200px` 時才注入 `src`、`srcset` 與 `<source>`。可使用 `root-margin` 調整提前載入範圍，並以 `threshold` 設定觸發比例；瀏覽器不支援 `IntersectionObserver` 時會直接載入。

## 手機版與電腦版圖片

`src-mobile` 與 `src-desktop` 可在同一元件提供不同構圖的圖片。預設以 `768px`（專案的 `md` 斷點）區分：小於斷點使用手機版，大於等於斷點使用電腦版。未提供其中一種來源時會回退至 `src`。

```vue
<LazyloadImageLazyLoad
  src="/images/banner.jpg"
  src-mobile="/images/banner-mobile.jpg"
  src-desktop="/images/banner-desktop.jpg"
  aspect-ratio-mobile="1 / 1"
  aspect-ratio-desktop="16 / 9"
  alt="活動 Banner"
/>
```

可透過 `breakpoint` 傳入 CSS 長度自訂斷點：

```vue
<LazyloadImageLazyLoad
  src="/images/banner.jpg"
  src-mobile="/images/banner-mobile.jpg"
  src-desktop="/images/banner-desktop.jpg"
  breakpoint="992px"
  alt="活動 Banner"
/>
```

| Prop                 | 型別                                             | 預設值              | 說明                                                       |
| -------------------- | ------------------------------------------------ | ------------------- | ---------------------------------------------------------- |
| `src`                | `string`                                         | 必填                | 共用圖片網址，也是手機版或電腦版未提供時的回退來源。       |
| `srcMobile`          | `string`                                         | `undefined`         | 小於 `breakpoint` 時使用的圖片。                           |
| `srcDesktop`         | `string`                                         | `undefined`         | 大於等於 `breakpoint` 時使用的圖片。                       |
| `alt`                | `string`                                         | `''`                | 替代文字。                                                 |
| `fallbackSrc`        | `string`                                         | `/images/nopic.png` | 載入失敗時使用的圖片；空字串會顯示錯誤區。                 |
| `breakpoint`         | `string`                                         | `768px`             | 手機版與電腦版的 CSS 長度斷點。                            |
| `aspectRatio`        | `string`                                         | `16 / 9`            | 共用容器 CSS `aspect-ratio`。                              |
| `aspectRatioMobile`  | `string`                                         | `undefined`         | 小於 `breakpoint` 時的容器比例；未提供時使用共用比例。     |
| `aspectRatioDesktop` | `string`                                         | `undefined`         | 大於等於 `breakpoint` 時的容器比例；未提供時使用共用比例。 |
| `objectFit`          | `contain \| cover \| fill \| none \| scale-down` | `cover`             | 圖片縮放方式。                                             |
| `loading`            | `eager \| lazy`                                  | `lazy`              | 原生圖片載入策略。                                         |
| `decoding`           | `async \| auto \| sync`                          | `async`             | 原生解碼策略。                                             |
| `rootMargin`         | `string`                                         | `200px`             | `IntersectionObserver` 的提前載入範圍。                    |
| `threshold`          | `number`                                         | `0`                 | `IntersectionObserver` 觸發比例，應介於 0 到 1。           |
| `imgClass`           | `ClassValue`                                     | `''`                | `<img>` class。                                            |
| `skeletonClass`      | `ClassValue`                                     | `''`                | skeleton class。                                           |

Slots：`skeleton`、`error`。Events：`load(event)`、`error(event)`。其餘 attrs 會傳到 `<img>`，根節點的 `class`、`style` 則套用到比例容器。
