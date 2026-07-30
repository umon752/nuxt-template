# IframeLazyLoad

在接近可視區域時才建立 iframe，並提供響應式來源、固定比例、載入 skeleton 與錯誤狀態。

原始碼：[IframeLazyLoad.vue](../../../app/components/IframeLazyLoad.vue)

## 基本使用

```vue
<IframeLazyLoad
  src="https://www.youtube.com/embed/example"
  title="產品介紹影片"
  allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
  allowfullscreen
/>
```

`title` 為必填，用來提供 iframe 的 accessible name。元件預設在距離可視區域 `200px` 時才建立 `<iframe>`；瀏覽器不支援 `IntersectionObserver` 時會直接載入。

## 手機版與電腦版內容

```vue
<IframeLazyLoad
  src="https://example.com/embed"
  src-mobile="https://example.com/embed/mobile"
  src-desktop="https://example.com/embed/desktop"
  title="互動式地圖"
  aspect-ratio-mobile="4 / 3"
  aspect-ratio-desktop="16 / 9"
  breakpoint="768px"
/>
```

小於 `breakpoint` 使用手機版，大於等於斷點使用電腦版；未提供響應式值時會回退至共用的 `src` 或 `aspectRatio`。已載入後跨越斷點且網址不同時，iframe 會重新載入。

## Props

| Prop                 | 型別            | 預設值      | 說明                                             |
| -------------------- | --------------- | ----------- | ------------------------------------------------ |
| `src`                | `string`        | 必填        | 共用 iframe 網址。                               |
| `srcMobile`          | `string`        | `undefined` | 小於斷點時的 iframe 網址。                       |
| `srcDesktop`         | `string`        | `undefined` | 大於等於斷點時的 iframe 網址。                   |
| `title`              | `string`        | 必填        | iframe 的 accessible name。                      |
| `breakpoint`         | `string`        | `768px`     | 響應式來源與比例使用的 CSS 長度斷點。            |
| `aspectRatio`        | `string`        | `16 / 9`    | 共用容器 CSS `aspect-ratio`。                    |
| `aspectRatioMobile`  | `string`        | `undefined` | 小於斷點時的容器比例。                           |
| `aspectRatioDesktop` | `string`        | `undefined` | 大於等於斷點時的容器比例。                       |
| `loading`            | `eager \| lazy` | `lazy`      | iframe 建立後使用的原生載入策略。                |
| `rootMargin`         | `string`        | `200px`     | `IntersectionObserver` 的提前載入範圍。          |
| `threshold`          | `number`        | `0`         | `IntersectionObserver` 觸發比例，應介於 0 到 1。 |
| `iframeClass`        | `ClassValue`    | `''`        | `<iframe>` class。                               |
| `skeletonClass`      | `ClassValue`    | `''`        | skeleton class。                                 |

Slots：`skeleton`、`error`。Events：`load(event)`、`error(event)`。`class`、`style` 套用於比例容器，其餘 attrs 傳給 `<iframe>`，包含 `allow`、`sandbox`、`referrerpolicy` 與 `allowfullscreen`。

錯誤狀態預設使用 i18n 鍵值 `components.iframe.error`。基於瀏覽器安全限制，iframe 的 `error` 事件無法可靠偵測 HTTP 錯誤、網頁內部錯誤或 `X-Frame-Options`／CSP 阻擋；嵌入外部內容時也應依來源限制 `sandbox`、`allow` 與 `referrerpolicy` 權限。
