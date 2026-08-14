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

需要提供清除按鈕時，可搭配 `clearable`：

```vue
<FormAppInput v-model="name" clearable placeholder="請輸入姓名" />
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
| `clearable`    | `boolean`                                                     | `false` | 有值時是否顯示 `IconClose` 清除按鈕     |
| `clearLabel`   | `string \| undefined`                                         | i18n    | 清除按鈕的 accessible name              |
| `inputClass`   | `ClassValue`                                                  | `''`    | 內部輸入 class；會與根元素 `class` 合併 |

`class`、`id`、`name`、`autocomplete`、`aria-*`、`data-*` 與事件等未宣告 attrs 會轉交給 `UInput`。`inputClass` 與 `class` 使用 `cn` 合併，使用端 class 可覆寫預設 utility。

## 可存取性與限制

- 這是單一輸入控制 wrapper；label、description、error 建議搭配 `FormAppFormField`。
- `invalid` 只負責視覺與 `aria-invalid`，不負責驗證資料。
- `clearable` 只在輸入有值且未設定 `disabled`／`readonly` 時顯示清除按鈕；清除字串值會更新為空字串，`type="number"` 則更新為 `undefined`。
- 清除按鈕預設使用 `components.input.clear` i18n，亦可透過 `clearLabel` 覆寫；按鈕本身可使用鍵盤操作，並會保留輸入框 focus。
- 元件沒有瀏覽器 API 或 client-only side effect，可安全 SSR。
- 實際 keyboard、focus 與 disabled 行為由內部 `UInput` 與原生 input 提供。

完整展示位於 `app/pages/sample.vue` 的「Nuxt UI wrapper 表單元件」區塊。
