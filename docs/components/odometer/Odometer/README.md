# Odometer

以 Vue 3、TypeScript、Tailwind utility 與 CSS transform／transition 實作的受控里程表數字元件。每一位數字都有獨立的 `0–9` 垂直軌道，支援位數增減、最大值提示、程式化重播、SSR 與 reduced motion。

原始碼：[Odometer.vue](../../../../app/components/odometer/Odometer.vue)

Nuxt 自動匯入名稱為 `Odometer`。此元件用於逐位垂直滾動；需要線性數值或字串內隨機數字動畫時，使用 `CountUp`。

## 基本使用

```vue
<script setup lang="ts">
const value = ref(128)
</script>

<template>
  <Odometer :value="value" autoplay />
  <button type="button" @click="value = 5432">更新</button>
</template>
```

`value` 是唯一資料來源。mounted 後改變 `value`，元件會從目前各位數的狀態滾動至新值並 emit `update`、`done`；不提供會建立第二份內部資料的 `update(newValue)` 方法。

## 手動播放與重播

```vue
<script setup lang="ts">
import Odometer, { type TOdometerInstance } from '~/components/odometer/Odometer.vue'

const odometer = useTemplateRef<TOdometerInstance>('odometer')
</script>

<template>
  <Odometer ref="odometer" :value="1000" :start-value="50" />
  <button type="button" @click="odometer?.run()">從 50 播放</button>
</template>
```

`run()` 會先無動畫回到 `startValue`，再滾動至目前的 `value`。動畫尚未完成時再次呼叫會取消舊排程並重新播放，不會留下多組 timer。

## 最大值

```vue
<Odometer :value="100000" :max-count="99999" overflow-text="+" autoplay />
```

當有效 `value` 大於 `maxCount` 時，數字軌道顯示 `maxCount`，尾端顯示 `overflowText`，例如 `99999+`。等於上限時不顯示尾端文字。

## Props

| Prop            | 型別         | 預設值        | 說明                                                                  |
| --------------- | ------------ | ------------- | --------------------------------------------------------------------- |
| `value`         | `number`     | 必填          | 受控目標值，必須是非負整數；其他值顯示為 `0`。                        |
| `startValue`    | `number`     | `0`           | SSR 視覺初始值及 `run()` 的起點，會限制在 `maxCount` 內。             |
| `maxCount`      | `number`     | `99999`       | 最大顯示值，必須是正整數；其他值回復預設值。                          |
| `duration`      | `number`     | `1000`        | 每次滾動時間，單位為毫秒；負值視為 `0`，非有限數字回復預設值。        |
| `easing`        | `string`     | `ease-in-out` | CSS `transition-timing-function`；空字串回復預設值。                  |
| `autoplay`      | `boolean`    | `false`       | mounted 後是否自動呼叫 `run()`；之後從 `false` 改為 `true` 也會播放。 |
| `overflowText`  | `string`     | `+`           | 超過 `maxCount` 時顯示的尾端文字，可傳空字串隱藏。                    |
| `odometerClass` | `ClassValue` | `''`          | 根元素 Tailwind class，經 `cn()` 合併並可覆寫預設 utility。           |

## Expose

| Method  | 說明                                           |
| ------- | ---------------------------------------------- |
| `run()` | 從目前 `startValue` 重新播放至受控的 `value`。 |

## Events

所有事件都以經過非負整數驗證及 `maxCount` 限制後的目標 `number` 作為 payload。

| Event    | 觸發時機                                                        |
| -------- | --------------------------------------------------------------- |
| `run`    | `run()` 或 autoplay 接受播放要求時。                            |
| `update` | mounted 後 `value` 或 `maxCount` 改變時。                       |
| `done`   | transition 時間結束，或零 duration／reduced motion 立即完成時。 |

`run` 或 `update` 後都會在這次動畫完成時 emit `done`。元件沒有需要對外通知的 Vue 初始化狀態，因此不移植 Web Component 的 `init` event。

## 位數變化

- 每一欄以個位、十位、百位等 place 作為穩定 key，更新時由右側對齊。
- 目前值與目標值的位數不同時，會先無動畫增減成目標欄數，再開始數字滾動。
- 位數增加時，新的高位欄以 `0` 建立；位數減少時，多出的高位欄立即移除。
- `run()` 的 `startValue` 與目標位數不同時，也會先補零或移除高位，確保整段動畫維持目標欄數。
- 更新進行中收到新值時會取消舊的完成 timer，先調整欄數並從保留下來的低位數字改往最新目標。

## 無障礙與 reduced motion

- 視覺數字軌道標記為 `aria-hidden`，另提供只包含穩定目標值及 overflow 文字的螢幕閱讀器內容，避免逐位 transition 被反覆朗讀。
- 元件本身沒有可操作控制項；使用端的播放及更新操作應使用原生 `<button>`、`<input>` 或等效鍵盤介面。
- `prefers-reduced-motion: reduce` 啟用時會直接呈現最終值並 emit `done`；動畫中切換此偏好也會立即完成。
- 元件沒有固定的使用者介面文字，因此不需要 i18n key。

## SSR 與清理

- SSR 與 hydration 的視覺軌道都從 `startValue` 建立；`window`、`matchMedia`、animation frame 與 timer 只在 client lifecycle 或 `run()` 中使用。
- `autoplay` 只會在 mounted 後執行，不會在 server render 啟動 transition。
- props 再次更新、重播或 unmount 時會取消準備用 animation frames 與完成 timer；unmount 時也會移除 media query listener。

## 限制

- 僅顯示非負整數，不處理負號、小數點、千分位或任意文字。
- `easing` 直接交給瀏覽器作為 CSS timing function；無效 CSS 值會由瀏覽器忽略。
- `done` 依正規化後的 `duration` 排程，不依賴每個 digit 的 `transitionend`，因此即使某些位數沒有改變也會一致觸發。
