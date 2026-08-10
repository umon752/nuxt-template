# VideoLazyLoad

在接近可視區域時才載入影片，並提供響應式來源、固定比例、載入 skeleton 與錯誤狀態。

原始碼：[VideoLazyLoad.vue](../../../../app/components/lazyload/VideoLazyLoad.vue)

Nuxt 自動匯入名稱為 `LazyloadVideoLazyLoad`。

## 基本使用

```vue
<LazyloadVideoLazyLoad
  src="/videos/demo.mp4"
  poster="/images/video-cover.jpg"
  controls
  aria-label="產品介紹影片"
/>
```

元件預設在距離可視區域 `200px` 時注入影片來源，並於 `loadedmetadata` 後隱藏 skeleton、觸發 `load(event)`。瀏覽器不支援 `IntersectionObserver` 時會直接載入。使用 `preload="none"` 時，元件注入來源後會先隱藏 skeleton，讓使用者能操作原生控制介面；之後收到 `loadedmetadata` 仍會正常觸發 `load(event)`。

## 手機版與電腦版影片

```vue
<LazyloadVideoLazyLoad
  src="/videos/demo.mp4"
  src-mobile="/videos/demo-mobile.mp4"
  src-desktop="/videos/demo-desktop.mp4"
  poster-mobile="/images/video-cover-mobile.jpg"
  poster-desktop="/images/video-cover-desktop.jpg"
  aspect-ratio-mobile="1 / 1"
  aspect-ratio-desktop="16 / 9"
  breakpoint="768px"
  controls
/>
```

小於 `breakpoint` 使用手機版，大於等於斷點使用電腦版；未提供響應式值時會回退至共用的 `src`、`poster` 或 `aspectRatio`。已載入後跨越斷點且來源不同時，影片會重新載入。

## 字幕

default slot 會渲染在 `<video>` 內，可加入 `<track>`：

```vue
<LazyloadVideoLazyLoad src="/videos/demo.mp4" controls>
  <track
    kind="captions"
    src="/captions/demo.vtt"
    srclang="zh-TW"
    label="繁體中文"
    default
  />
</LazyloadVideoLazyLoad>
```

## Props

| Prop                 | 型別                                             | 預設值      | 說明                                             |
| -------------------- | ------------------------------------------------ | ----------- | ------------------------------------------------ |
| `src`                | `string`                                         | 必填        | 共用影片來源。                                   |
| `srcMobile`          | `string`                                         | `undefined` | 小於斷點時的影片來源。                           |
| `srcDesktop`         | `string`                                         | `undefined` | 大於等於斷點時的影片來源。                       |
| `poster`             | `string`                                         | `''`        | 共用封面圖片。                                   |
| `posterMobile`       | `string`                                         | `undefined` | 小於斷點時的封面圖片。                           |
| `posterDesktop`      | `string`                                         | `undefined` | 大於等於斷點時的封面圖片。                       |
| `breakpoint`         | `string`                                         | `768px`     | 響應式來源與比例使用的 CSS 長度斷點。            |
| `aspectRatio`        | `string`                                         | `16 / 9`    | 共用容器 CSS `aspect-ratio`。                    |
| `aspectRatioMobile`  | `string`                                         | `undefined` | 小於斷點時的容器比例。                           |
| `aspectRatioDesktop` | `string`                                         | `undefined` | 大於等於斷點時的容器比例。                       |
| `controls`           | `boolean`                                        | `false`     | 是否顯示原生播放控制。                           |
| `autoplay`           | `boolean`                                        | `false`     | 是否在來源載入後嘗試自動播放。                   |
| `muted`              | `boolean`                                        | `false`     | 是否靜音。多數瀏覽器要求自動播放影片必須靜音。   |
| `loop`               | `boolean`                                        | `false`     | 是否循環播放。                                   |
| `playsinline`        | `boolean`                                        | `true`      | 是否允許行動裝置行內播放。                       |
| `preload`            | `auto \| metadata \| none`                       | `metadata`  | 注入來源後使用的原生預載策略。                   |
| `objectFit`          | `contain \| cover \| fill \| none \| scale-down` | `cover`     | 影片在容器中的縮放方式。                         |
| `rootMargin`         | `string`                                         | `200px`     | `IntersectionObserver` 的提前載入範圍。          |
| `threshold`          | `number`                                         | `0`         | `IntersectionObserver` 觸發比例，應介於 0 到 1。 |
| `videoClass`         | `ClassValue`                                     | `''`        | `<video>` class。                                |
| `skeletonClass`      | `ClassValue`                                     | `''`        | skeleton class。                                 |

Slots：default、`skeleton`、`error`。Events：`load(event)`、`error(event)`。`class`、`style` 套用於比例容器，其餘 attrs 傳給 `<video>`。

錯誤狀態預設使用 i18n 鍵值 `components.video.error`。自動播放是否成功仍由瀏覽器政策決定。
