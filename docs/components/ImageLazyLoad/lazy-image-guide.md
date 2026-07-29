# ImageLazyLoad 使用說明

`ImageLazyLoad` 是圖片專用的 lazy-loading 元件。圖片載入完成前會顯示灰底反光 skeleton，載入後則以淡入效果顯示圖片。

## 基本使用

```vue
<ImageLazyLoad src="/images/demo/test-img.jpg" alt="範例圖片" class="w-full rounded-xl" />
```

元件預設使用 `loading="lazy"`、`decoding="async"` 與 `16 / 9` 圖片比例。建議依照實際圖片設定 `aspect-ratio`，避免圖片載入前後產生版面位移。

## 自訂圖片與 skeleton

```vue
<ImageLazyLoad
  src="/images/demo/test-img.jpg"
  alt="產品照片"
  aspect-ratio="4 / 3"
  object-fit="contain"
  class="rounded-xl"
  img-class="p-4"
  skeleton-class="bg-main-100"
>
  <template #skeleton>
    <span class="flex h-full items-center justify-center">圖片載入中</span>
  </template>
</ImageLazyLoad>
```

`class` 與 `style` 會套用至外層容器；`srcset`、`sizes`、`fetchpriority` 等原生圖片屬性會傳給內部的 `<img>`。

## 載入失敗

圖片載入失敗時預設改載入 `/images/nopic.png`。可使用 `fallback-src` 更換路徑，或傳入空字串停用 fallback：

```vue
<ImageLazyLoad src="/missing.jpg" alt="產品照片" fallback-src="">
  <template #error>目前無法顯示圖片</template>
</ImageLazyLoad>
```

元件會在原始圖片或 fallback 載入失敗時觸發 `error` 事件，任何圖片成功載入時則觸發 `load` 事件。

## Props

| Prop            | 預設值              | 說明                                 |
| --------------- | ------------------- | ------------------------------------ |
| `src`           | 必填                | 圖片路徑                             |
| `alt`           | `''`                | 圖片替代文字；裝飾性圖片可保留空字串 |
| `fallbackSrc`   | `/images/nopic.png` | 原始圖片失敗後使用的圖片             |
| `aspectRatio`   | `16 / 9`            | CSS `aspect-ratio` 值                |
| `objectFit`     | `cover`             | 圖片在容器中的縮放方式               |
| `loading`       | `lazy`              | 原生圖片 loading 行為                |
| `decoding`      | `async`             | 原生圖片 decoding 行為               |
| `imgClass`      | `''`                | 圖片 class                           |
| `skeletonClass` | `''`                | skeleton class                       |
