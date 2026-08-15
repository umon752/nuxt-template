# useLocaleSwitcher 使用說明

`useLocaleSwitcher` 提供共用的語系狀態、語系選項、localized route 與命令式切換方法。它不處理下拉選單、focus、click outside 或其他 UI 狀態，因此可以被 Header 下拉選單、select、radio 或 button 共用。

原始碼：[useLocaleSwitcher.ts](../../app/composables/useLocaleSwitcher.ts)

## 使用方式

Nuxt 會自動匯入 `useLocaleSwitcher`。

### 使用連結

```vue
<script setup lang="ts">
const { localeOptions } = useLocaleSwitcher()
</script>

<template>
  <nav aria-label="語系切換">
    <NuxtLink v-for="option in localeOptions" :key="option.code" :to="option.to">
      {{ option.label }}
    </NuxtLink>
  </nav>
</template>
```

### 使用 button 或 select

```vue
<script setup lang="ts">
const { switchLocale } = useLocaleSwitcher()

const handleLocaleChange = (targetLocale: string): void => {
  void switchLocale(targetLocale)
}
</script>

<template>
  <button type="button" @click="handleLocaleChange('en')">English</button>
</template>
```

## API

### `useLocaleSwitcher()`

| 成員            | 型別                                                 | 說明                                                              |
| --------------- | ---------------------------------------------------- | ----------------------------------------------------------------- |
| `currentLocale` | `ComputedRef<TLocaleCode>`                           | 目前語系；無效值會回退 `zh-TW`。                                  |
| `localeOptions` | `ComputedRef<ReadonlyArray<TLocalizedLocaleOption>>` | 目前語系下的選項、名稱、localized route 與目前狀態。              |
| `getLocalePath` | `(targetLocale: TLocaleCode) => string`              | 取得目標語系 route。                                              |
| `switchLocale`  | `(targetLocale: string) => Promise<boolean>`         | 命令式切換語系；成功導覽回傳 `true`，無效或目前語系回傳 `false`。 |

`TLocalizedLocaleOption` 的欄位如下：

```ts
type TLocalizedLocaleOption = {
  code: TLocaleCode
  labelKey: string
  label: string
  to: string
  isCurrent: boolean
}
```

## Route 與切換行為

- `getLocalePath` 優先使用 `useSwitchLocalePath()`，因此會保留目前頁面可對應的 route、query 與 hash。
- 目標語系沒有對應目前頁面的 route 時，回退到該語系首頁；若仍無法產生 route，最後回傳 `/`。
- `switchLocale` 使用 Nuxt `navigateTo`，正常切換會建立一般瀏覽紀錄。
- 傳入無效語系或目前語系時不會導覽，並回傳 `false`。
- 語系選項目前由 `app/constants/locales.ts` 的 `LOCALE_OPTIONS` 定義，名稱使用 `header.language.names.*` 翻譯鍵。

## SSR 與責任邊界

- composable 只使用 Nuxt i18n、route 與 navigation composables，不直接讀取 `window`、`document` 或 storage，可安全參與 SSR。
- `localeOptions` 與 `currentLocale` 是 readonly computed state；呼叫端只能透過 `switchLocale` 進行切換。
- composable 不管理 dropdown 開關、focus 還原、click outside、Transition 或 overlay 協調；這些行為應由各 UI 元件自行處理。
- `LanguageSwitcher` 使用連結呈現選項；其他 UI 若使用 button、select 或 radio，可使用 `switchLocale`。
