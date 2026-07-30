# Counter

受控式數量計數器，支援增加、減少、直接輸入、數值範圍、step、客製 slots 與 Tailwind class。數值由父層持有，元件透過 `update:modelValue` 請求更新。

原始碼：[Counter.vue](../../../../app/components/counter/Counter.vue)

## 基本使用

```vue
<script setup lang="ts">
const quantity = ref(0)
</script>

<template>
  <Counter v-model="quantity" :min="0" :max="5" />
  <p>目前數量：{{ quantity }}</p>
</template>
```

到達 `min` 或 `max` 時，對應按鈕會使用原生 `disabled` 屬性停用。

## 可直接輸入

```vue
<Counter
  v-model="quantity"
  :min="0"
  :max="10"
  editable
  aria-label="購買數量"
  @change="handleChange"
/>
```

輸入值超出範圍時會限制在 `min`～`max`。空值或無效值不會更新父層，input 在 change 或 blur 時會恢復目前有效值。

## 自訂 step、樣式與內容

```vue
<Counter v-model="quantity" :min="0" :max="20" :step="5" button-class="bg-slate-900 text-white">
  <template #decrement>減</template>
  <template #value="{ value }">{{ value }} 件</template>
  <template #increment>加</template>
</Counter>
```

## Props

| Prop             | 型別         | 預設值     | 說明                                               |
| ---------------- | ------------ | ---------- | -------------------------------------------------- |
| `modelValue`     | `number`     | 必填       | 目前數值；使用 `v-model`。                         |
| `min`            | `number`     | `0`        | 最小值。                                           |
| `max`            | `number`     | `Infinity` | 最大值；小於 `min` 時會正規化為 `min`。            |
| `step`           | `number`     | `1`        | 每次增加或減少的數值；非正數或非有限數時使用 `1`。 |
| `disabled`       | `boolean`    | `false`    | 停用整個計數器。                                   |
| `editable`       | `boolean`    | `false`    | 使用 number input 取代純文字數值。                 |
| `ariaLabel`      | `string`     | 翻譯值     | 計數器群組 accessible name。                       |
| `valueLabel`     | `string`     | 翻譯值     | 可輸入數值欄位 accessible name。                   |
| `decrementLabel` | `string`     | 翻譯值     | 減少按鈕 accessible name。                         |
| `incrementLabel` | `string`     | 翻譯值     | 增加按鈕 accessible name。                         |
| `counterClass`   | `ClassValue` | `''`       | 根元素 Tailwind class。                            |
| `buttonClass`    | `ClassValue` | `''`       | 增加與減少按鈕 Tailwind class。                    |
| `valueClass`     | `ClassValue` | `''`       | 非 editable 數值區 Tailwind class。                |
| `inputClass`     | `ClassValue` | `''`       | editable input Tailwind class。                    |
| `disabledClass`  | `ClassValue` | `''`       | 個別按鈕停用時額外套用的 Tailwind class。          |

預設無障礙文字來自：

- `components.counter.ariaLabel`
- `components.counter.valueLabel`
- `components.counter.decrementLabel`
- `components.counter.incrementLabel`

傳入對應 prop 時會覆寫翻譯預設值。

## Slots

- `decrement`：提供 `disabled`、`decrement()`。
- `value`：提供正規化後的 `value`；只在 `editable="false"` 時使用。
- `increment`：提供 `disabled`、`increment()`。

Slot 內容不需要自行處理 click；按鈕事件已由元件根據 min、max 與 disabled 狀態管理。

## Events

- `update:modelValue(value)`：請求父層更新數值。
- `decrement(value)`：使用減少按鈕成功更新時觸發。
- `increment(value)`：使用增加按鈕成功更新時觸發。
- `change(value, source)`：任何有效更新時觸發；`source` 型別為 `decrement | increment | input`。

可匯入事件來源型別：

```ts
import type { TCounterChangeSource } from '~/components/counter/Counter.vue'
```

## 單向資料流

Counter 不維護另一份權威數值。按鈕或輸入操作會先依 min、max、step 正規化，再 emit 下一個值；真正的狀態仍由父層 `v-model` 持有。父層未接收 `update:modelValue` 時，元件不會永久改變數值。

## 無障礙

- 根元素使用 `role="group"` 與可翻譯的 accessible name。
- 增加、減少使用原生 button 與 disabled 語意。
- editable 模式使用 `input type="number"`，並設定 min、max、step。
- 非 editable 模式使用 `output` 與 `aria-live="polite"` 宣告更新值。
- 若同一頁有多個 Counter，建議依使用情境傳入不同的 `ariaLabel`。
