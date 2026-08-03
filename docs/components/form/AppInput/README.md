# AppInput

專案表單輸入 wrapper。頁面使用 `FormAppInput` 的穩定 API，元件內部目前由 Nuxt UI `UInput` 實作，集中處理預設寬度、尺寸與 invalid 顏色。未宣告的原生 attrs 與事件會轉交給內部輸入元件。

原始碼：[AppInput.vue](../../../../app/components/form/AppInput.vue)

Nuxt 自動匯入名稱：`FormAppInput`

## 基本使用

```vue
<script setup lang="ts">
const name = ref('')
</script>

<template>
  <FormAppInput v-model="name" placeholder="請輸入姓名" autocomplete="name" />
</template>
```

## API

| Prop           | 型別                                                          | 預設值  | 說明                                    |
| -------------- | ------------------------------------------------------------- | ------- | --------------------------------------- |
| `modelValue`   | `string \| number \| undefined`                               | —       | 目前輸入值；支援 `v-model`              |
| `type`         | `text \| email \| password \| search \| tel \| url \| number` | `text`  | 輸入類型                                |
| `placeholder`  | `string \| undefined`                                         | —       | placeholder                             |
| `disabled`     | `boolean`                                                     | `false` | 是否停用                                |
| `readonly`     | `boolean`                                                     | `false` | 是否唯讀                                |
| `required`     | `boolean`                                                     | `false` | 是否必填                                |
| `invalid`      | `boolean`                                                     | `false` | 以錯誤色彩呈現並輸出 `aria-invalid`     |
| `size`         | `'sm' \| 'md' \| 'lg'`                                        | `md`    | 專案統一尺寸                            |
| `leadingIcon`  | `string \| undefined`                                         | —       | leading icon 名稱                       |
| `trailingIcon` | `string \| undefined`                                         | —       | trailing icon 名稱                      |
| `inputClass`   | `ClassValue`                                                  | `''`    | 內部輸入 class；會與根元素 `class` 合併 |

`class`、`id`、`name`、`autocomplete`、`aria-*`、`data-*` 與事件等未宣告 attrs 會轉交給 `UInput`。`inputClass` 與 `class` 使用 `cn` 合併，使用端 class 可覆寫預設 utility。

## 可存取性與限制

- 這是單一輸入控制 wrapper；label、description、error 建議搭配 `FormAppFormField`。
- `invalid` 只負責視覺與 `aria-invalid`，不負責驗證資料。
- 元件沒有瀏覽器 API 或 client-only side effect，可安全 SSR。
- 實際 keyboard、focus 與 disabled 行為由內部 `UInput` 與原生 input 提供。

完整展示位於 `app/pages/sample.vue` 的「Nuxt UI wrapper 表單元件」區塊。
