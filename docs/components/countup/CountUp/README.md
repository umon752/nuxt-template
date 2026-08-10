# CountUp

以 Vue 3、TypeScript 與 `requestAnimationFrame` 實作的數字動畫。支援保留非數字字元的隨機模式、線性數值模式、暫停／繼續、延遲啟動、千分位、SSR 與 reduced motion。

原始碼：[CountUp.vue](../../../../app/components/countup/CountUp.vue)

Nuxt 自動匯入名稱為 `CountupCountUp`。此元件負責數值顯示動畫，與用來輸入及增減數量的 `Counter` 不同。

## 基本使用

```vue
<CountupCountUp value="NT$ 123,567.98" :duration="2000" autoplay />
```

預設 `random` 模式會在動畫期間替換每個數字字元，其他字元保持不變，結束時顯示完整的 `value`。

## 順序模式

```vue
<CountupCountUp
  :value="12500"
  :start-value="500"
  :duration="2000"
  mode="sequential"
  thousand-comma
  autoplay
/>
```

`sequential` 模式接受有限數字或可轉為有限數字的字串，可遞增、遞減並保留目標值的小數位數。無法轉為有限數字時會安全改用 `random` 模式；`thousandComma` 只影響有效的順序模式。

## 程式化控制

```vue
<script setup lang="ts">
import type { TCountUpInstance } from '~/components/countup/CountUp.vue'

const countUp = useTemplateRef<TCountUpInstance>('countUp')
</script>

<template>
  <CountupCountUp ref="countUp" :value="1000" mode="sequential" @done="console.log" />
  <button type="button" @click="countUp?.run()">Run</button>
  <button type="button" @click="countUp?.stop()">Stop</button>
  <button type="button" @click="countUp?.start()">Start</button>
  <button type="button" @click="countUp?.reset()">Reset</button>
  <button type="button" @click="countUp?.restart()">Restart</button>
</template>
```

- `run()`：從目前進度執行，套用 `startTime`；完成後再次呼叫會先回到初始值。
- `stop()`：取消等待或暫停目前動畫並保留進度。
- `start()`：從目前進度立即開始或繼續，不套用 `startTime`；完成後再次呼叫會重新開始。
- `reset()`：取消所有排程並回到 `startValue`。
- `restart()`：重設後重新執行，會套用 `startTime`。

動畫執行中重複呼叫 `run()` 或 `start()` 不會建立第二組動畫。

## Props

| Prop            | 型別                   | 預設值   | 說明                                                        |
| --------------- | ---------------------- | -------- | ----------------------------------------------------------- |
| `value`         | `number \| string`     | 必填     | 動畫完成後的目標內容。                                      |
| `startValue`    | `number`               | `0`      | 初始值；非有限數字會改用 `0`。                              |
| `duration`      | `number`               | `1000`   | 動畫時間，單位為毫秒；負值視為 `0`。                        |
| `startTime`     | `number`               | `0`      | `run()` 開始前的延遲，單位為毫秒；負值視為 `0`。            |
| `delay`         | `number`               | `0`      | 最短畫面更新間隔，單位為毫秒；不改變總動畫時間。            |
| `mode`          | `random \| sequential` | `random` | 動畫模式。                                                  |
| `thousandComma` | `boolean`              | `false`  | 順序模式是否插入固定的英文逗號千分位。                      |
| `autoplay`      | `boolean`              | `false`  | Client mounted 後是否自動呼叫 `run()`。                     |
| `countUpClass`  | `ClassValue`           | `''`     | 根元素 Tailwind class，經 `cn()` 合併並可覆寫預設 utility。 |

`duration`、`startTime` 或 `delay` 若不是有限數字，會分別回復為 `1000`、`0`、`0`。動畫設定或 `value` 改變時會取消舊排程、回到新的初始值；若 `autoplay` 為 `true`，會以新設定重新執行。

## Events

所有事件都以目前顯示字串作為唯一 payload。

| Event     | 觸發時機                                                  |
| --------- | --------------------------------------------------------- |
| `run`     | `run()` 接受執行要求時。                                  |
| `stop`    | `stop()` 實際取消等待或暫停動畫時。                       |
| `start`   | `start()` 接受立即開始或繼續要求時。                      |
| `reset`   | 呼叫 `reset()` 後。                                       |
| `restart` | 呼叫 `restart()` 並完成內部重設後、重新執行前。           |
| `done`    | 到達動畫終點，或 reduced motion／零 duration 直接完成時。 |

`restart()` 會依序 emit `restart`、`run`，最後在完成時 emit `done`。

## 無障礙與 reduced motion

- 動畫中的視覺文字標記為 `aria-hidden`，另提供只包含穩定目標值的螢幕閱讀器文字，避免隨機數字或逐幀數值被反覆朗讀。
- 元件本身沒有控制按鈕或可聚焦互動；使用端提供控制項時，必須使用原生 `<button>` 或等效鍵盤操作。
- mounted 時會讀取 `prefers-reduced-motion`。偏好 reduced motion 時，執行要求會立即顯示目標值並 emit `done`；動畫進行中切換此偏好也會立即完成。
- 元件沒有使用者可見的固定文案，因此不需要 i18n key。

## SSR 與清理

- SSR 與 hydration 初始輸出都是 `startValue`；`window`、`matchMedia`、timer 與 `requestAnimationFrame` 僅在 client lifecycle 或公開控制方法中使用。
- `autoplay` 只會在 mounted 後啟動，不會造成 server render 隨機值。
- 元件卸載、props 改變或重設時會取消 animation frame 與啟動延遲，並在卸載時移除 media query listener。

## 限制

- `thousandComma` 使用固定 `,`，不是 locale-aware formatter。
- `delay` 是畫面更新節流，不會讓動畫逐次累加延遲。
- 元件不監看是否進入 viewport；需要進入畫面才播放時，應由父層決定何時呼叫 `run()`。
