# AppSwitch

布林值開關 wrapper。頁面使用 `FormAppSwitch` 的專案 API，元件內部由 Nuxt UI `USwitch` 實作。

原始碼：[AppSwitch.vue](../../../../app/components/form/AppSwitch.vue)

Nuxt 自動匯入名稱：`FormAppSwitch`

## 基本使用

```vue
<script setup lang="ts">
const enabled = ref(true)
</script>

<template>
  <FormAppSwitch v-model="enabled" label="啟用通知" description="接收相關通知" />
</template>
```

## API

| Prop          | 型別                   | 預設值  | 說明                                  |
| ------------- | ---------------------- | ------- | ------------------------------------- |
| `modelValue`  | `boolean \| undefined` | —       | 目前開關狀態；支援 `v-model`          |
| `label`       | `string \| undefined`  | —       | 開關標籤                              |
| `description` | `string \| undefined`  | —       | 輔助說明                              |
| `disabled`    | `boolean`              | `false` | 是否停用                              |
| `required`    | `boolean`              | `false` | 是否必填                              |
| `invalid`     | `boolean`              | `false` | 以錯誤色彩呈現並輸出 `aria-invalid`   |
| `size`        | `'sm' \| 'md' \| 'lg'` | `md`    | 專案統一尺寸                          |
| `loading`     | `boolean`              | `false` | 顯示載入狀態並暫停互動                |
| `switchClass` | `ClassValue`           | `''`    | 根元素 class；會與根元素 `class` 合併 |

未宣告的 `id`、`name`、`aria-*`、`data-*`、事件與 Nuxt UI Switch 支援的 attrs 會轉交給 `USwitch`。`switchClass` 與 `class` 使用 `cn` 合併。

## 可存取性與限制

- 優先提供清楚的 `label`；label 由 Nuxt UI 綁定到實際 switch 控制項。
- `invalid` 只負責視覺與 `aria-invalid`，驗證訊息建議由 `FormAppFormField` 顯示。
- `loading` 由內部元件停用互動並顯示載入圖示。
- keyboard、focus 與 disabled 行為由 Nuxt UI／Reka UI 提供，元件沒有額外 client-side side effect，可安全 SSR。

完整展示位於 `app/pages/sample.vue` 的「Nuxt UI wrapper 表單元件」區塊。
