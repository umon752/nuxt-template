# AppForm

專案表單 wrapper。它集中管理表單 state、schema validation、disabled 與 submit loading 行為，內部目前由 Nuxt UI `UForm` 實作；頁面只需要依賴 `AppForm`，避免直接耦合 `UForm`。

原始碼：[AppForm.vue](../../../../app/components/form/AppForm.vue)

Nuxt 自動匯入名稱：`FormAppForm`

## 基本使用

```vue
<template>
  <FormAppForm :state="formState" @submit="handleSubmit">
    <FormAppFormField label="姓名" required>
      <FormAppInput v-model="formState.name" autocomplete="name" />
    </FormAppFormField>

    <button type="submit">送出</button>
  </FormAppForm>
</template>
```

## API

| Prop          | 型別                                   | 預設值  | 說明                                                 |
| ------------- | -------------------------------------- | ------- | ---------------------------------------------------- |
| `state`       | `Record<string, unknown> \| undefined` | —       | 表單目前狀態，會傳給 Nuxt UI `UForm`                 |
| `schema`      | `FormSchema \| undefined`              | —       | Nuxt UI 支援的 Standard Schema 或 Superstruct schema |
| `disabled`    | `boolean`                              | `false` | 是否停用表單內的控制項                               |
| `loadingAuto` | `boolean`                              | `true`  | submit 時是否由表單自動進入 loading 狀態             |
| `formClass`   | `ClassValue`                           | `''`    | 表單外層 class；會與根元素 `class` 合併              |

元件只有 default slot，並會轉發 Nuxt UI `UForm` 提供的 `errors` 與 `loading` slot props。`class`、`id`、`name`、`aria-*`、`data-*`、原生表單屬性與事件等未宣告 attrs 會轉交給 `UForm`。

`submit` 與 `error` 事件由 `UForm` 轉發；提供 `schema` 時，validation 會依 Nuxt UI 的 schema 行為執行。若未提供 schema，仍可使用原生 submit 流程與 `FormAppFormField` 自行呈現錯誤。

## 可存取性與 SSR

- `UForm` 會保留原生 `<form>` 語意；請使用 `button type="submit"`，並讓每個控制項有對應的 `FormAppFormField` 或可存取名稱。
- `required`、錯誤訊息與欄位關聯由 `FormAppFormField` 及實際控制項共同處理；`FormAppForm` 不會猜測欄位驗證規則。
- 元件沒有瀏覽器 API 或 client-only side effect，可安全 SSR 與 hydration。

完整展示位於 `app/pages/sample.vue` 的「Nuxt UI wrapper 表單元件」區塊。
