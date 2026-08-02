# useObserverFade 使用說明

`useObserverFade` 使用 `IntersectionObserver` 與 Web Animations API，讓帶有 `data-fade` 的元素進入 viewport 時淡入。它支援單次或重播動畫、個別 timing、動態新增元素、手動控制與指定掃描範圍。

原始碼：[useObserverFade.ts](../../app/composables/useObserverFade.ts)

## 基本使用

```vue
<script setup lang="ts">
const fadeContainer = useTemplateRef<HTMLElement>('fadeContainer')

const { isActive, observedCount, start, refresh, stop } = useObserverFade({
  container: fadeContainer,
})
</script>

<template>
  <section ref="fadeContainer">
    <article data-fade="in">進入 viewport 時淡入一次</article>

    <article
      data-fade="up"
      data-fade-once="false"
      data-fade-timing='{"duration":800,"delay":150,"easing":"ease-out"}'
    >
      向上淡入，離開 viewport 後可再次播放
    </article>

    <p>{{ isActive ? '觀察中' : '已停止' }}，已處理 {{ observedCount }} 個元素</p>
    <button type="button" @click="refresh">重新掃描</button>
    <button type="button" @click="stop">停止並顯示全部</button>
    <button type="button" @click="start">重新啟動</button>
  </section>
</template>
```

composable 會在元件 mounted 後自動執行 `start()`。省略 `container` 時，掃描範圍為 `document.body`。

## Data attributes

| Attribute          | 值／型別                      | 預設值 | 說明                                                                    |
| ------------------ | ----------------------------- | ------ | ----------------------------------------------------------------------- |
| `data-fade`        | `in` \| `up`                  | `in`   | `in` 只改變透明度；`up` 另從 `translateY(20%)` 移動至原位               |
| `data-fade-once`   | `true` \| `false`             | `true` | `false` 會在離開 viewport 時重設動畫，下一次進入時重播                  |
| `data-fade-timing` | `TObserverFadeTiming` 的 JSON | —      | 覆寫該元素的 Web Animations timing；無效欄位會在開發環境警告並 fallback |

`data-fade-timing` 支援以下欄位：

```ts
export type TObserverFadeTiming = {
  duration?: number
  easing?: string
  fill?: FillMode
  delay?: number
  iterations?: number
  direction?: PlaybackDirection
}
```

`duration`、`delay` 與 `iterations` 必須是大於或等於 `0` 的有限數值。`fill` 支援 `none`、`forwards`、`backwards`、`both`、`auto`；`direction` 支援 `normal`、`reverse`、`alternate`、`alternate-reverse`。

## Options

| 選項               | 型別                                              | 預設值          | 說明                                                         |
| ------------------ | ------------------------------------------------- | --------------- | ------------------------------------------------------------ |
| `container`        | `Readonly<Ref<HTMLElement \| null \| undefined>>` | `document.body` | 限制 selector 掃描與 DOM mutation 監聽的容器                 |
| `selector`         | `string`                                          | `[data-fade]`   | 要處理的元素 selector；空字串會改用預設值                    |
| `defaultDuration`  | `number`                                          | `500`           | 預設動畫毫秒數；負值正規化為 `0`，非有限數值改用預設值       |
| `defaultEasing`    | `string`                                          | `ease`          | 預設 easing；空字串改用預設值                                |
| `defaultFill`      | `FillMode`                                        | `both`          | 預設 fill mode；不支援的值改用 `both`                        |
| `rootMargin`       | `string`                                          | `0px`           | 傳給 `IntersectionObserver` 的 root margin                   |
| `threshold`        | `number \| readonly number[]`                     | `0`             | 交集門檻；各數值會限制於 `0` 至 `1`，非有限數值改用 `0`      |
| `observeMutations` | `boolean`                                         | `true`          | 是否用 `MutationObserver` 自動處理容器內動態新增及移除的元素 |

`container` 只限制掃描範圍，不會成為 `IntersectionObserver.root`；交集仍以瀏覽器 viewport 判斷。傳入的 container ref 尚未取得元素時會維持停止狀態；ref 換成其他元素時，舊 observer、animation 與 DOM reference 會先清除，再綁定新容器。

## 回傳值

| 名稱            | 型別                     | 說明                                                                   |
| --------------- | ------------------------ | ---------------------------------------------------------------------- |
| `isActive`      | `Readonly<Ref<boolean>>` | 是否已啟動並綁定有效容器                                               |
| `observedCount` | `Readonly<Ref<number>>`  | 目前已處理且仍位於容器中的元素數量；包含直接顯示的 fallback 元素       |
| `start`         | `() => void`             | 啟動；相同容器已啟動時等同 `refresh()`，停止後可再次呼叫               |
| `refresh`       | `() => void`             | 手動掃描尚未處理的元素；停止狀態下不執行                               |
| `stop`          | `() => void`             | 中止 observer 與 animation、釋放 reference，並讓所有已處理元素保持可見 |

公開型別另包含 `TObserverFadeType`、`TObserverFadeTiming` 與 `TUseObserverFadeControls`。

## SSR 與首屏顯示

此專案在 SSR 時輸出 `<html class="no-js">`，並以 head 中最早執行、由 `nuxt-security` 自動加入 nonce 的 inline script 將它替換成 `js`。全域 CSS 只在 `html.js` 下預先隱藏尚未初始化的 `[data-fade]`；composable 建立暫停於起始影格的 animation 後，才加入 `data-fade-initialized` 交由 Web Animations API 接管。

因此 JavaScript 正常執行時不會先顯示元素再突然隱藏；JavaScript 未執行或 inline script 被阻擋時仍保留 `no-js`，SSR 內容維持可閱讀。請保留 `app/app.vue` 的 server-only `no-js` class、`nuxt.config.ts` 的 head script 與 `app/assets/css/utilities/_observer-fade.css`，否則首屏防閃爍策略不完整。

## Reduced motion、fallback 與無障礙

- `prefers-reduced-motion: reduce` 啟用時，CSS 與 composable 都會直接顯示內容，不建立淡入動畫。
- 使用者在頁面開啟期間切換 reduced motion 時，既有 observer 與 animation 會重建或切換成直接顯示。
- 瀏覽器缺少 `IntersectionObserver`、`Element.animate` 或動畫建立失敗時，內容會直接顯示。
- 無效 selector 或 `rootMargin` 不會讓頁面中斷；開發環境會輸出帶有 composable 名稱與元素 context 的警告。
- 動畫只影響視覺呈現，不改變 DOM 順序、可存取名稱或鍵盤焦點順序。

## 動態內容與清理

預設會建立一個 `MutationObserver` 監看指定容器。新增的 matching element 會自動初始化；被移除的 subtree 會取消 animation、disconnect observer 並從內部 Map 移除。若關閉 `observeMutations`，動態內容加入後需手動呼叫 `refresh()`。

元件卸載與 `stop()` 時會清除 `IntersectionObserver`、`MutationObserver`、media query listener、animation 與 DOM reference。`stop()` 會保留 `data-fade-initialized`，確保停止功能後內容不會被全域初始 CSS 再次隱藏；後續呼叫 `start()` 仍可重新建立動畫。

完整頁面範例位於 `app/pages/sample.vue` 的「useObserverFade 捲動淡入」區塊。
