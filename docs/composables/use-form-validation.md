# useFormValidation 使用說明

`useFormValidation` 集中管理常用表單欄位的驗證規則與錯誤文字。目前提供 `required`、Email、電話、身分證字號與統一編號驗證，規則可以依表單需求組合，讓同一個欄位在不同表單中彈性選填或必填。composable 以整個表單的 state 與 rules 為輸入，統一管理錯誤狀態與驗證時機。

原始碼：[useFormValidation.ts](../../app/composables/useFormValidation.ts)

## 基本使用

composable 由 Nuxt 自動匯入。規則陣列中沒有 `required` 時，空值會直接通過；有值時仍會執行格式驗證：

```vue
<script setup lang="ts">
import type { TFormValidationRules } from '~/composables/useFormValidation'

const form = reactive({
  email: '',
  phone: '',
  idNumber: '',
  taxId: '',
})
const validationRules = {
  email: ['email'],
  phone: ['required', 'phone'],
  idNumber: ['taiwanId'],
  taxId: ['taxId'],
} satisfies Record<'email' | 'phone' | 'idNumber' | 'taxId', TFormValidationRules>

const { errors, validate } = useFormValidation({
  state: form,
  rules: validationRules,
  validateOn: 'submit',
})

const submit = (): void => {
  if (!validate()) return

  // 送出 form
}
</script>

<template>
  <form @submit.prevent="submit">
    <p v-if="errors.email">{{ errors.email }}</p>
    <p v-if="errors.phone">{{ errors.phone }}</p>
    <p v-if="errors.idNumber">{{ errors.idNumber }}</p>
    <p v-if="errors.taxId">{{ errors.taxId }}</p>
  </form>
</template>
```

如果 Email 也要改成必填，只需要改規則陣列：

```ts
const requiredEmailRules = ['required', 'email'] as const
```

在實際表單中，可將回傳值直接傳給 `FormAppFormField` 的 `error`，並以同一個錯誤值控制輸入元件的 `invalid`：

```vue
<FormAppFormField label="Email" :error="errors.email">
  <FormAppInput
    v-model="form.email"
    type="email"
    :invalid="!!errors.email"
    autocomplete="email"
  />
</FormAppFormField>
```

正式表單通常在 submit event 中呼叫 `validate()`；驗證失敗時，`errors` 會包含各欄位的共用錯誤文字。也可以依需求選擇 `validateOn: 'blur'` 或 `validateOn: 'input'`，再把 `handleFieldBlur('email')`、`handleFieldInput('email')` 綁定到欄位事件。

## API

### `TFormValidationRuleName`

目前支援的規則名稱：`required`、`email`、`phone`、`taiwanId`、`taxId`。

### `TFormValidationRules`

```ts
type TFormValidationRules = readonly TFormValidationRuleName[]
```

規則可以組合使用：

| 規則陣列                   | 行為                                      |
| -------------------------- | ----------------------------------------- |
| `['email']`                | Email 選填；有輸入時檢查格式              |
| `['required', 'email']`    | Email 必填，且有輸入時檢查格式            |
| `['phone']`                | 電話選填；有輸入時檢查格式                |
| `['required', 'phone']`    | 電話必填，且有輸入時檢查格式              |
| `['taiwanId']`             | 身分證字號選填；有輸入時檢查基本格式      |
| `['required', 'taiwanId']` | 身分證字號必填，且有輸入時檢查基本格式    |
| `['taxId']`                | 統一編號選填；有輸入時檢查 8 碼數字格式   |
| `['required', 'taxId']`    | 統一編號必填，且有輸入時檢查 8 碼數字格式 |
| `['required']`             | 只檢查不可為空                            |

### `useFormValidation(options)`

| 選項         | 型別                                    | 說明                          |
| ------------ | --------------------------------------- | ----------------------------- |
| `state`      | `TState`                                | 表單目前的 reactive state     |
| `rules`      | `TFormValidationSchema<TState>`         | 欄位名稱與規則陣列的對應      |
| `validateOn` | `'submit' \| 'blur' \| 'input'`（選填） | 欄位驗證時機，預設為 `submit` |

### 回傳值

| 成員                     | 說明                                                                    |
| ------------------------ | ----------------------------------------------------------------------- |
| `errors`                 | `ComputedRef`；已進入驗證狀態且失敗的欄位錯誤，透過 `errors.email` 讀取 |
| `isSubmitted`            | 是否曾呼叫 `validate()`                                                 |
| `isValid`                | 表單目前所有已設定規則的欄位是否通過驗證；不受錯誤是否已顯示影響        |
| `validate()`             | 驗證整個表單、顯示所有欄位錯誤並回傳 `boolean`                          |
| `validateField(name)`    | 標記單一欄位進入驗證狀態並回傳該欄位錯誤                                |
| `handleFieldBlur(name)`  | `validateOn` 為 `blur` 時，供欄位 blur event 呼叫                       |
| `handleFieldInput(name)` | `validateOn` 為 `input`、表單已 submit 或欄位已驗證時重新驗證           |
| `reset()`                | 清除 submit／欄位驗證狀態與錯誤；不修改表單欄位值                       |

### `validateField`

| 參數        | 型別                               | 說明                                                         |
| ----------- | ---------------------------------- | ------------------------------------------------------------ |
| `fieldName` | `TFormValidationFieldName<TState>` | 要驗證的欄位名稱；值與規則由初始化時的 `state`、`rules` 取得 |

回傳 `string | undefined`：通過驗證時為 `undefined`，失敗時回傳共用錯誤文字。規則依陣列順序檢查，回傳第一個錯誤。

## 固定錯誤文字與格式

| 規則       | 錯誤文字                     | 格式／行為                                                                     |
| ---------- | ---------------------------- | ------------------------------------------------------------------------------ |
| `required` | `此欄位為必填`               | 空字串或只包含空白時失敗                                                       |
| `email`    | `請輸入有效的 Email 格式`    | 基本 `name@example.com` 格式；空值由 `required` 決定                           |
| `phone`    | `請輸入有效的電話格式`       | 台灣手機／市話，連字號可有可無，例如 `0912-345-678`、`02-1234-5678`            |
| `taiwanId` | `請輸入有效的身分證字號格式` | 英文字母加身分別碼與 8 碼數字，例如 `A123456789`；目前檢查基本格式，不含檢查碼 |
| `taxId`    | `請輸入 8 碼統一編號`        | 8 碼數字；目前檢查基本格式，不含統一編號檢查碼                                 |

## SSR 與限制

- 驗證只使用字串處理與正規表示式，不讀取 `window`、`document` 或其他 browser API，可安全用於 SSR。
- composable 不建立 watcher、listener 或 timer；只保存驗證狀態，表單欄位值仍由呼叫端的 `state` 管理。
- 空值預設視為可接受；需要必填時將 `required` 放入規則陣列。
- `taiwanId` 與 `taxId` 目前檢查固定格式，不包含身分證或統一編號檢查碼。
- 這是基本格式驗證，不代表 Email、電話、身分證或統一編號一定存在，也不取代後端驗證。
- 完整使用範例位於 `app/pages/sample.vue` 的「Nuxt UI wrapper 表單元件」區塊。
