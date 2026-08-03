# AppFormField

專案表單欄位 wrapper。它集中管理 label、description、hint、help、required 與 error 的版面與狀態，內部目前由 Nuxt UI `UFormField` 實作，欄位控制項透過 default slot 傳入。

原始碼：[AppFormField.vue](../../../../app/components/form/AppFormField.vue)

Nuxt 自動匯入名稱：`FormAppFormField`

## 基本使用

```vue
<template>
  <FormAppFormField
    label="電子郵件"
    description="我們會使用此地址寄送通知。"
    :error="emailError"
    required
  >
    <FormAppInput v-model="email" type="email" autocomplete="email" :invalid="!!emailError" />
  </FormAppFormField>
</template>
```

## API

| Prop          | 型別                   | 預設值  | 說明                                      |
| ------------- | ---------------------- | ------- | ----------------------------------------- |
| `label`       | `string \| undefined`  | —       | 欄位標籤                                  |
| `description` | `string \| undefined`  | —       | 欄位說明                                  |
| `help`        | `string \| undefined`  | —       | 輔助文字                                  |
| `hint`        | `string \| undefined`  | —       | 欄位提示                                  |
| `error`       | `string \| boolean`    | —       | 錯誤訊息；`true` 可表示有錯誤但不顯示文字 |
| `required`    | `boolean`              | `false` | 是否必填標示                              |
| `size`        | `'sm' \| 'md' \| 'lg'` | `md`    | 與欄位控制項搭配的尺寸                    |
| `fieldClass`  | `ClassValue`           | `''`    | 欄位外層 class；會與根元素 `class` 合併   |

元件只有 default slot，slot 內容通常是 `FormAppInput`、`FormAppSelect` 或 `FormAppDatePicker`。`class`、`id`、`name`、`aria-*`、`data-*` 與事件等未宣告 attrs 會轉交給 `UFormField`。

## 可存取性與限制

- 使用 `label` 時，應搭配實際表單控制項；若使用自訂 slot，請確保控制項有可關聯的 label 或 aria-label。
- `required` 只呈現欄位必填狀態，不會代替瀏覽器或 schema validation。
- `error` 應由父層驗證狀態控制，元件不持有表單驗證狀態。
- 元件沒有瀏覽器 API 或 client-only side effect，可安全 SSR。

完整展示位於 `app/pages/sample.vue` 的「Nuxt UI wrapper 表單元件」區塊。
