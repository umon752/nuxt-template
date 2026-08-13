# ImageLazyLoad 使用說明

`ImageLazyLoad` 是圖片專用的 lazy-loading 元件。圖片載入完成前會顯示灰底反光 skeleton，載入後則以淡入效果顯示圖片。

## 基本使用

```vue
<LazyloadImageLazyLoad src="/images/demo/test-img.jpg" alt="範例圖片" class="w-full rounded-xl" />
```

元件預設在距離可視區域 `200px` 時才注入圖片來源，接著使用 `loading="lazy"`、`decoding="async"` 與 `16 / 9` 圖片比例。建議依照實際圖片設定 `aspect-ratio`，避免圖片載入前後產生版面位移。

## 提前載入範圍

`root-margin` 與 `threshold` 對應 `IntersectionObserver` 選項：

```vue
<LazyloadImageLazyLoad
  src="/images/demo/test-img.jpg"
  alt="範例圖片"
  root-margin="400px"
  :threshold="0.1"
/>
```

預設 `rootMargin` 為 `200px`、`threshold` 為 `0`。瀏覽器不支援 `IntersectionObserver` 時會直接注入圖片來源。來源注入後仍會套用原生 `loading`；若需要在進入 `rootMargin` 後立即交由瀏覽器請求，可設定 `loading="eager"`。

## 響應式圖片

當手機版與電腦版使用不同構圖時，可分別提供 `src-mobile` 與 `src-desktop`。元件透過原生 `<picture>` 選擇圖片，不會監聽視窗 resize 後重新建立圖片。

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

預設斷點為 `768px`，對應專案的 `md`：小於斷點使用手機版，大於等於斷點使用電腦版。`src-mobile`、`src-desktop` 或響應式比例未提供時，會分別回退到共用的 `src`、`aspect-ratio`。

外層可傳入 CSS 長度調整斷點：

```vue
<LazyloadImageLazyLoad
  src="/images/banner.jpg"
  src-mobile="/images/banner-mobile.jpg"
  src-desktop="/images/banner-desktop.jpg"
  breakpoint="992px"
  alt="活動 Banner"
/>
```

如果只是同一構圖的不同解析度，仍建議使用原生 `srcset` 與 `sizes`，不必提供兩套圖片來源。

## 自訂圖片與 skeleton

```vue
<LazyloadImageLazyLoad
  src="/images/demo/test-img.jpg"
  alt="產品照片"
  aspect-ratio="4 / 3"
  object-fit="contain"
  class="rounded-xl"
  img-class="p-4"
  skeleton-class="bg-primary-100"
>
  <template #skeleton>
    <span class="flex h-full items-center justify-center">圖片載入中</span>
  </template>
</LazyloadImageLazyLoad>
```

`class` 與 `style` 會套用至外層容器；`srcset`、`sizes`、`fetchpriority` 等原生圖片屬性會傳給內部的 `<img>`。`src`、`srcset` 與響應式 `<source>` 會等到元件進入 observer 範圍才注入。

## 載入失敗

圖片載入失敗時預設改載入 `/images/nopic.png`。響應式圖片失敗時，元件會停用 `<source>`、`srcset` 與 `sizes`，避免它們覆蓋 fallback。可使用 `fallback-src` 更換路徑，或傳入空字串停用 fallback：

```vue
<LazyloadImageLazyLoad src="/missing.jpg" alt="產品照片" fallback-src="">
  <template #error>目前無法顯示圖片</template>
</LazyloadImageLazyLoad>
```

元件會在原始圖片或 fallback 載入失敗時觸發 `error` 事件，任何圖片成功載入時則觸發 `load` 事件。

## Props

| Prop                 | 預設值              | 說明                                         |
| -------------------- | ------------------- | -------------------------------------------- |
| `src`                | 必填                | 共用圖片路徑與響應式來源的回退值             |
| `srcMobile`          | `undefined`         | 小於斷點時的圖片路徑                         |
| `srcDesktop`         | `undefined`         | 大於等於斷點時的圖片路徑                     |
| `alt`                | `''`                | 圖片替代文字；裝飾性圖片可保留空字串         |
| `fallbackSrc`        | `/images/nopic.png` | 原始圖片失敗後使用的圖片                     |
| `breakpoint`         | `768px`             | 手機版與電腦版圖片及比例的 CSS 長度斷點      |
| `aspectRatio`        | `16 / 9`            | 共用 CSS `aspect-ratio` 值                   |
| `aspectRatioMobile`  | `undefined`         | 小於斷點時的容器比例；未提供時使用共用值     |
| `aspectRatioDesktop` | `undefined`         | 大於等於斷點時的容器比例；未提供時使用共用值 |
| `objectFit`          | `cover`             | 圖片在容器中的縮放方式                       |
| `loading`            | `lazy`              | 原生圖片 loading 行為                        |
| `decoding`           | `async`             | 原生圖片 decoding 行為                       |
| `rootMargin`         | `200px`             | `IntersectionObserver` 的提前載入範圍        |
| `threshold`          | `0`                 | observer 觸發比例，應介於 0 到 1             |
| `imgClass`           | `''`                | 圖片 class                                   |
| `skeletonClass`      | `''`                | skeleton class                               |
