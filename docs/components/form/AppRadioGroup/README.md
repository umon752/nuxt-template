# AppRadioGroup

單選選項群組 wrapper。頁面使用專案自己的 `FormAppRadioGroup` 與簡化的 `options` API，元件內部由 Nuxt UI `URadioGroup` 實作。

原始碼：[AppRadioGroup.vue](../../../../app/components/form/AppRadioGroup.vue)

Nuxt 自動匯入名稱：`FormAppRadioGroup`

## 基本使用

```vue
<script setup lang="ts">
import type { TAppRadioOption } from '~/components/form/AppRadioGroup.vue'

const contactMethod = ref<string | number>()
const options: TAppRadioOption[] = [
  { label: '電子郵件', value: 'email' },
  { label: '電話', value: 'phone' },
]
</script>

<template>
  <FormAppRadioGroup v-model="contactMethod" :options="options" name="contact-method" />
</template>
```

## API

| Prop          | 型別                            | 預設值     | 說明                                      |
| ------------- | ------------------------------- | ---------- | ----------------------------------------- |
| `options`     | `readonly TAppRadioOption[]`    | 必填       | 單選選項                                  |
| `modelValue`  | `string \| number \| undefined` | —          | 目前選取值；支援 `v-model`                |
| `legend`      | `string \| undefined`           | —          | 群組的 fieldset legend                    |
| `disabled`    | `boolean`                       | `false`    | 是否停用整個群組                          |
| `required`    | `boolean`                       | `false`    | 是否必填                                  |
| `invalid`     | `boolean`                       | `false`    | 以錯誤色彩呈現並輸出 `aria-invalid`       |
| `size`        | `'sm' \| 'md' \| 'lg'`          | `md`       | 專案統一尺寸                              |
| `orientation` | `'vertical' \| 'horizontal'`    | `vertical` | 選項排列方向                              |
| `radioClass`  | `ClassValue`                    | `''`       | 群組根元素 class；會與根元素 `class` 合併 |

`TAppRadioOption` 欄位如下：

```ts
type TAppRadioOption = {
  label: string
  value: string | number
  description?: string
  disabled?: boolean
}
```

未宣告的 `id`、`name`、`aria-*`、`data-*`、事件與 Nuxt UI RadioGroup 支援的 attrs 會轉交給 `URadioGroup`。若使用 `FormAppFormField` 提供欄位標題，可不重複傳入 `legend`；獨立使用時建議提供 `legend`。

## 可存取性與限制

- 群組使用 fieldset／legend 結構；每個選項由 Nuxt UI／Reka UI 處理 label、keyboard 與 focus。
- 啟用狀態的選項 label 會使用 `cursor-pointer`；停用群組或個別 disabled option 時，保留 Nuxt UI 的 `cursor-not-allowed`。
- `invalid` 只負責視覺與 `aria-invalid`，驗證訊息建議由 `FormAppFormField` 顯示。
- `options` 的 `value` 應保持唯一；disabled 選項不應由父層當成有效值送出。
- 元件沒有額外瀏覽器 API 或 cleanup 需求，可安全 SSR。

完整展示位於 `app/pages/sample.vue` 的「Nuxt UI wrapper 表單元件」區塊。
