# AppCheckbox

單一核取方塊 wrapper。頁面使用 `FormAppCheckbox` 的專案 API，元件內部由 Nuxt UI `UCheckbox` 實作。

原始碼：[AppCheckbox.vue](../../../../app/components/form/AppCheckbox.vue)

Nuxt 自動匯入名稱：`FormAppCheckbox`

## 基本使用

```vue
<script setup lang="ts">
const accepted = ref(false)
</script>

<template>
  <FormAppCheckbox v-model="accepted" label="我同意服務條款" required />
</template>
```

## API

| Prop            | 型別                                      | 預設值  | 說明                                  |
| --------------- | ----------------------------------------- | ------- | ------------------------------------- |
| `modelValue`    | `boolean \| 'indeterminate' \| undefined` | —       | 目前勾選狀態；支援 `v-model`          |
| `label`         | `string \| undefined`                     | —       | 核取方塊標籤                          |
| `description`   | `string \| undefined`                     | —       | 輔助說明                              |
| `disabled`      | `boolean`                                 | `false` | 是否停用                              |
| `required`      | `boolean`                                 | `false` | 是否必填                              |
| `invalid`       | `boolean`                                 | `false` | 以錯誤色彩呈現並輸出 `aria-invalid`   |
| `size`          | `'sm' \| 'md' \| 'lg'`                    | `md`    | 專案統一尺寸                          |
| `checkboxClass` | `ClassValue`                              | `''`    | 根元素 class；會與根元素 `class` 合併 |

未宣告的 `id`、`name`、`aria-*`、`data-*`、事件與 Nuxt UI Checkbox 支援的 attrs 會轉交給 `UCheckbox`。`checkboxClass` 與 `class` 使用 `cn` 合併。

## 可存取性與限制

- 優先提供清楚的 `label`；沒有 label 時應由外層可見文字或欄位結構提供名稱。
- `invalid` 只負責視覺與 `aria-invalid`，驗證訊息建議由 `FormAppFormField` 顯示。
- 啟用狀態的 label 會使用 `cursor-pointer`，停用時保留 Nuxt UI 的 `cursor-not-allowed`。
- 支援 `indeterminate` model value；若不需要此狀態，使用一般 `boolean` 即可。
- 核取、鍵盤 focus 與 disabled 行為由 Nuxt UI／Reka UI 提供，元件沒有額外 client-side side effect，可安全 SSR。

完整展示位於 `app/pages/sample.vue` 的「Nuxt UI wrapper 表單元件」區塊。
