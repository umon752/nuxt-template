# AppTextarea

專案多行文字輸入 wrapper。頁面使用 `FormAppTextarea` 的穩定 API，元件內部由 Nuxt UI `UTextarea` 實作，集中處理寬度、尺寸與 invalid 顏色。

原始碼：[AppTextarea.vue](../../../../app/components/form/AppTextarea.vue)

Nuxt 自動匯入名稱：`FormAppTextarea`

## 基本使用

```vue
<script setup lang="ts">
const message = ref('')
</script>

<template>
  <FormAppTextarea v-model="message" placeholder="請輸入留言" :rows="4" autoresize />
</template>
```

## API

| Prop            | 型別                   | 預設值  | 說明                                        |
| --------------- | ---------------------- | ------- | ------------------------------------------- |
| `modelValue`    | `string \| undefined`  | —       | 目前文字；支援 `v-model`                    |
| `placeholder`   | `string \| undefined`  | —       | placeholder                                 |
| `disabled`      | `boolean`              | `false` | 是否停用                                    |
| `readonly`      | `boolean`              | `false` | 是否唯讀                                    |
| `required`      | `boolean`              | `false` | 是否必填                                    |
| `invalid`       | `boolean`              | `false` | 以錯誤色彩呈現並輸出 `aria-invalid`         |
| `size`          | `'sm' \| 'md' \| 'lg'` | `md`    | 專案統一尺寸                                |
| `rows`          | `number`               | `3`     | 初始列數                                    |
| `autoresize`    | `boolean`              | `false` | 是否依內容自動調整高度                      |
| `maxrows`       | `number`               | `0`     | 自動調整時的最大列數；`0` 表示不限制        |
| `fixed`         | `boolean`              | `false` | 是否維持行動裝置文字尺寸                    |
| `textareaClass` | `ClassValue`           | `''`    | 內部文字區域 class；會與根元素 `class` 合併 |

`class`、`id`、`name`、`maxlength`、`autocomplete`、`aria-*`、`data-*` 與事件等未宣告 attrs 會轉交給 `UTextarea`。`textareaClass` 與 `class` 使用 `cn` 合併，使用端 class 可覆寫預設 utility。

## 可存取性與限制

- label、description 與 error 建議搭配 `FormAppFormField`。
- `invalid` 只負責視覺與 `aria-invalid`，不負責驗證資料。
- `autoresize` 使用 Nuxt UI 內部的 client-side textarea 尺寸計算；元件本身沒有額外 listener 或 timer 需要清理。
- 元件沒有 module evaluation 期間的瀏覽器 API 使用，可安全 SSR。

完整展示位於 `app/pages/sample.vue` 的「Nuxt UI wrapper 表單元件」區塊。
