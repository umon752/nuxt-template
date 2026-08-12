# AppSelect

專案單選下拉 wrapper。頁面使用 `options` 與專案統一的 model 型別，元件內部目前由 Nuxt UI `USelect` 實作，因此 Nuxt UI 的 `items`、theme 細節不會滲透到頁面。

原始碼：[AppSelect.vue](../../../../app/components/form/AppSelect.vue)

Nuxt 自動匯入名稱：`FormAppSelect`

## 基本使用

```vue
<script setup lang="ts">
import type { TAppSelectOption } from '~/components/form/AppSelect.vue'

const category = ref<string>()
const options: TAppSelectOption[] = [
  { label: '公告', value: 'announcement' },
  { label: '活動', value: 'event' },
]
</script>

<template>
  <FormAppSelect v-model="category" :options="options" placeholder="請選擇分類" />
</template>
```

## API

| Prop          | 型別                            | 預設值   | 說明                                          |
| ------------- | ------------------------------- | -------- | --------------------------------------------- |
| `options`     | `readonly TAppSelectOption[]`   | 必填     | 下拉選項                                      |
| `modelValue`  | `string \| number \| undefined` | —        | 目前選取值；支援 `v-model`                    |
| `placeholder` | `string`                        | `請選擇` | 未選取時的提示                                |
| `disabled`    | `boolean`                       | `false`  | 是否停用                                      |
| `invalid`     | `boolean`                       | `false`  | 以錯誤色彩呈現並輸出 `aria-invalid`           |
| `size`        | `'sm' \| 'md' \| 'lg'`          | `md`     | 專案統一尺寸                                  |
| `selectClass` | `ClassValue`                    | `''`     | 內部下拉控制項 class；會與根元素 `class` 合併 |

`TAppSelectOption` 欄位如下：

```ts
export type TAppSelectOption = {
  label: string
  value: string | number
  description?: string
  disabled?: boolean
}
```

`class`、`id`、`name`、`aria-*`、`data-*` 與事件等未宣告 attrs 會轉交給 `USelect`。目前 wrapper 聚焦單選；多選、搜尋與複合選項若成為專案需求，應另定義明確 API，不直接把 Nuxt UI props 全部暴露出來。

下拉箭頭由 Nuxt UI 全域設定統一使用 `IconChevronDown`；其他使用 `chevronDown` 預設圖示的 Nuxt UI 元件也會套用相同設定。

## 可存取性與限制

- 下拉開啟、關閉、焦點與鍵盤導覽由內部 `USelect`／Reka UI 提供。
- `invalid` 只負責視覺與 `aria-invalid`，驗證訊息建議由 `FormAppFormField` 顯示。
- `options` 的 `label` 應提供可理解的文字；disabled 選項不應再被父層當成有效值送出。
- 元件沒有瀏覽器 API 或 client-only side effect，可安全 SSR。

完整展示位於 `app/pages/sample.vue` 的「Nuxt UI wrapper 表單元件」區塊。
