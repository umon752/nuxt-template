# AppDatePicker

專案日期選擇 wrapper。Nuxt UI 4.10.0 目前沒有名為 `UDatePicker` 的元件，因此 `AppDatePicker` 由 `UInputDate`、`UCalendar` 與 `UPopover` 組成，將日期輸入、日曆選擇與彈出層行為集中在單一專案 API。

原始碼：[AppDatePicker.vue](../../../../app/components/form/AppDatePicker.vue)

Nuxt 自動匯入名稱：`FormAppDatePicker`

## 基本使用

```vue
<script setup lang="ts">
import type { DateValue } from '@internationalized/date'

const date = ref<DateValue>()
</script>

<template>
  <FormAppDatePicker v-model="date" />
</template>
```

## API

| Prop                | 型別                     | 預設值           | 說明                                           |
| ------------------- | ------------------------ | ---------------- | ---------------------------------------------- |
| `modelValue`        | `DateValue \| undefined` | —                | 目前日期；支援 `v-model`                       |
| `disabled`          | `boolean`                | `false`          | 是否停用輸入與日曆                             |
| `readonly`          | `boolean`                | `false`          | 日期輸入是否唯讀                               |
| `required`          | `boolean`                | `false`          | 是否必填                                       |
| `invalid`           | `boolean`                | `false`          | 以錯誤色彩呈現並輸出 `aria-invalid`            |
| `size`              | `'sm' \| 'md' \| 'lg'`   | `md`             | 輸入尺寸                                       |
| `locale`            | `string \| undefined`    | 目前 i18n locale | 日期顯示語系；未傳入時跟隨目前頁面語系         |
| `minValue`          | `DateValue \| undefined` | —                | 可選最小日期                                   |
| `maxValue`          | `DateValue \| undefined` | —                | 可選最大日期                                   |
| `trailingIcon`      | `string \| Component`    | `IconDate`       | 輸入右側日曆圖示                               |
| `iconClass`         | `ClassValue`             | `''`             | 日曆圖示的 Tailwind class                      |
| `inputClass`        | `ClassValue`             | `''`             | 日期輸入 class                                 |
| `calendarClass`     | `ClassValue`             | `''`             | 彈出日曆 class                                 |
| `calendarCellClass` | `ClassValue`             | `''`             | 日期格按鈕 class，可調整 hover / selected 樣式 |

`DateValue` 來自 `@internationalized/date`，可使用 `CalendarDate`、`CalendarDateTime` 或 `ZonedDateTime` 等符合 Nuxt UI 日期元件契約的值。`class` 會與 `inputClass` 合併；`iconClass` 會直接合併到右側圖示的根節點 class，包含預設的 `IconDate` component，因此可安全覆寫 `size-*` 等 Tailwind utility；`calendarCellClass` 會直接合併到 `UCalendar` 的 `cellTrigger` slot，可用 `hover:not-data-selected:*`、`data-selected:*`、`data-today:*` 等 utility 客製日期格狀態；未宣告的 attrs 與事件會轉交給內部 `UInputDate`。

例如：

```vue
<FormAppDatePicker
  v-model="date"
  calendar-cell-class="hover:not-data-selected:bg-primary-100 data-selected:bg-primary-500 data-selected:text-white"
/>
```

預設日曆圖示為專案的 `IconDate` component；如需使用其他 Nuxt Icon 或自訂 component，可透過 `trailingIcon` 覆寫。

## 行為與限制

- 點擊或聚焦日期輸入會開啟 popover；從日曆選取日期後會更新 model 並關閉 popover。
- 日期格式、分段輸入、月份／年份切換、keyboard navigation、焦點管理與日期 disabled 判斷由 Nuxt UI／Reka UI 提供。
- 目前 wrapper 是單日期版本；日期區間需求應在後續以明確的 `DateRange` API 擴充，不把 Nuxt UI 的 range 泛型直接暴露到頁面。
- `invalid` 只負責視覺與 `aria-invalid`，不負責驗證。
- `DateValue` 不應在 API payload 直接序列化；送出前請由頁面或 domain adapter 轉成專案 API 要求的日期字串與時區格式。
- 元件沒有 SSR 期間的 DOM 讀取；popover、calendar 等互動由 mounted 後處理，可安全 SSR。

完整展示位於 `app/pages/sample.vue` 的「Nuxt UI wrapper 表單元件」區塊。
