# AppCombobox

可搜尋的單選下拉 wrapper。頁面使用簡化的 `options` 與 `v-model` API，元件內部以 Nuxt UI `USelectMenu` 的 Combobox 行為實作。

原始碼：[AppCombobox.vue](../../../../app/components/form/AppCombobox.vue)

Nuxt 自動匯入名稱：`FormAppCombobox`

## 基本使用

```vue
<script setup lang="ts">
import type { TAppComboboxOption } from '~/components/form/AppCombobox.vue'

const topic = ref<string | number>()
const options: TAppComboboxOption[] = [
  { label: '公告', value: 'announcement' },
  { label: '活動', value: 'event' },
]
</script>

<template>
  <FormAppCombobox v-model="topic" :options="options" clearable />
</template>
```

## API

| Prop                | 型別                            | 預設值   | 說明                                                  |
| ------------------- | ------------------------------- | -------- | ----------------------------------------------------- |
| `options`           | `readonly TAppComboboxOption[]` | 必填     | 下拉選項                                              |
| `modelValue`        | `string \| number \| undefined` | —        | 目前選取值；支援 `v-model`                            |
| `placeholder`       | `string`                        | `請選擇` | 未選取時的提示                                        |
| `searchPlaceholder` | `string \| undefined`           | i18n     | 搜尋輸入框提示；預設使用 `components.combobox.search` |
| `searchInput`       | `boolean`                       | `true`   | 是否顯示搜尋輸入框                                    |
| `clearable`         | `boolean`                       | `false`  | 是否顯示清除選取值的按鈕                              |
| `disabled`          | `boolean`                       | `false`  | 是否停用                                              |
| `required`          | `boolean`                       | `false`  | 是否必填                                              |
| `invalid`           | `boolean`                       | `false`  | 以錯誤色彩呈現並輸出 `aria-invalid`                   |
| `size`              | `'sm' \| 'md' \| 'lg'`          | `md`     | 專案統一尺寸                                          |
| `comboboxClass`     | `ClassValue`                    | `''`     | 根元素 class；會與根元素 `class` 合併                 |

`TAppComboboxOption` 欄位如下：

```ts
type TAppComboboxOption = {
  label: string
  value: string | number
  description?: string
  disabled?: boolean
}
```

目前 wrapper 固定為單選，並以 `value` 作為 model value；未宣告的 `id`、`name`、`aria-*`、`data-*` 與事件會轉交給 `USelectMenu`。不包含多選、建立新項目或遠端搜尋 API，這些需求應另訂明確 API。

## 可存取性與限制

- 搜尋、選項篩選、鍵盤導覽、focus 與 disabled 行為由 Nuxt UI／Reka UI 提供。
- `options` 的 `value` 應保持唯一；disabled 選項不應由父層當成有效值送出。
- `searchInput` 開啟時，預設搜尋提示來自 `components.combobox.search`，可用 `searchPlaceholder` 覆寫。
- 元件沒有自有 browser API 或 cleanup 需求，可安全 SSR；下拉內容由 Nuxt UI 以 portal 管理。

完整展示位於 `app/pages/sample.vue` 的「Nuxt UI wrapper 表單元件」區塊。
