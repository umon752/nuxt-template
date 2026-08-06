# useNumberFormat

使用 `Intl.NumberFormat` 共用格式化數字，預設依目前 i18n locale 加上千分位，也提供單位數前綴 `0` 的方法，並支援小數位數、貨幣與其他原生格式選項。

原始碼：[useNumberFormat.ts](../../app/composables/useNumberFormat.ts)

## 基本使用

Composable 會由 Nuxt 自動匯入；也可以從 `~/composables/useNumberFormat` 明確匯入。

```vue
<script setup lang="ts">
const { formatNumber, padNumber } = useNumberFormat()

const formattedTotal = computed(() => formatNumber(1234567.89))
const formattedMonth = computed(() => padNumber(1))
</script>

<template>
  <p>{{ formattedTotal }}</p>
  <p>{{ formattedMonth }}</p>
</template>
```

在目前 `zh-TW` locale 下，結果為 `1,234,567.89`。sample 頁的
`useNumberFormat 數字格式化`區塊也有直接展示。

## API

### `useNumberFormat(options?)`

| Option   | 型別                                    | 預設值     | 說明                                                     |
| -------- | --------------------------------------- | ---------- | -------------------------------------------------------- |
| `locale` | `MaybeRefOrGetter<string \| undefined>` | app locale | 預設格式化語系；未提供時使用目前 `useI18n()` 的 locale。 |

### `formatNumber(value, options?)`

`value` 支援 `number`、`bigint`、可轉成有限數字的 `string`、`null` 與 `undefined`。
第二個參數是 `Intl.NumberFormatOptions`，另加上可單次覆寫的 `locale`。

| 行為                        | 結果                                   |
| --------------------------- | -------------------------------------- |
| 預設格式化                  | 開啟 `useGrouping`，依語系加入千分位。 |
| `null`、`undefined`、空字串 | 回傳空字串。                           |
| 無法轉成有限數字的字串      | 原字串原樣回傳。                       |
| `NaN`、`Infinity`           | 回傳原值的字串表示。                   |
| `-0`                        | 視為 `0` 格式化。                      |

```ts
const { formatNumber } = useNumberFormat()

formatNumber(1234567) // '1,234,567'
formatNumber('1234567.8', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}) // '1,234,567.80'
formatNumber(1234567, { useGrouping: false }) // '1234567'
formatNumber(1234567, { locale: 'en-US' }) // '1,234,567'
formatNumber(1234567, { style: 'currency', currency: 'TWD' })
```

未指定小數位數時，會遵循 `Intl.NumberFormat` 預設的小數位數規則；需要保留固定小數位時，請同時設定
`minimumFractionDigits` 與 `maximumFractionDigits`。超過安全整數範圍的整數請使用 `bigint`，避免先轉成
`number` 造成精度遺失。

### `padNumber(value, length?)`

將非負整數補成指定的總位數，預設為 2 位，適合月份、日期、時間等顯示。`1` 至 `9` 會分別得到
`01` 至 `09`，`10` 以上不會截斷；`0` 會依兩位數規則得到 `00`。

```ts
const { padNumber } = useNumberFormat()

padNumber(1) // '01'
padNumber('9') // '09'
padNumber(10) // '10'
padNumber(1, 3) // '001'
padNumber(-1) // '-1'
```

`null`、`undefined` 會回傳空字串；非數字字串會原樣回傳。`length` 必須是正整數，否則會使用預設的 2 位。

## SSR、效能與限制

- `Intl.NumberFormat` 可在 server 與 client 執行，不使用 `window`、`document` 或其他 browser API。
- formatter 會在每個 composable instance 內依 locale 與 options 快取，不共享跨 request 的全域狀態。
- composable 沒有 timer、listener、observer 或其他需要清理的 side effect。
- 必須在 Vue setup、Nuxt composable 或其他可使用 `useI18n()` 的上下文呼叫。
- `locale` 必須是有效的 BCP 47 locale；其他格式選項遵循瀏覽器／Node.js 的 `Intl.NumberFormat` 契約。
