**元件 `class` Prop 處理規範**

目的：統一元件接收 `class` 型 prop 的處理方式，避免 Tailwind class 衝突、重複或非預期覆蓋。

原則：

- 若元件接收用來控制樣式的 prop（例如 `titleClass`、`buttonClass`、`className`），**必須**使用 `clsx` 先將 prop 轉成字串，然後用 `twMerge` 處理 Tailwind utility 的合併與覆蓋。
- 預設樣式由元件內部定義的常數（或變數）提供，props 傳入的 class 應該被合併（props 的同類別 util 放在後面會勝出）。

為什麼：

- `clsx` 支援 string / array / object 的混合寫法，方便接收多種 class 格式。
- `twMerge` 會針對 Tailwind 的 utility 做智慧合併（例如 `px-4` 與 `px-2` 只會保留最後一個），可避免靠字串拼接導致的衝突。

安裝（若尚未安裝）：

```bash
npm install clsx tailwind-merge
```

實作範例（Vue 3 Composition API, TypeScript）：

```vue
<script setup lang="ts">
import { computed } from 'vue'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

// props 建議使用 camelCase，template 使用 kebab-case 傳入
const { titleClass = '' } = defineProps<{
  titleClass?: string | string[] | Record<string, boolean>
}>()

const DEFAULT_TITLE_CLASS =
  'accordion-btn w-full px-4 py-3 text-left font-medium transition-colors hover:bg-gray-50'

const mergedTitleClass = computed(() =>
  // 先用 clsx 處理可能是陣列或物件的 class，再用 twMerge 處理 Tailwind 衝突
  twMerge(clsx(DEFAULT_TITLE_CLASS, titleClass))
)
</script>

<template>
  <button :class="mergedTitleClass">...</button>
</template>
```

補充建議：

- 若希望 `props` 明確覆蓋某些 util（例如完全清除 padding），可在使用端傳入 Tailwind 的重要符號，例如 `title-class="!p-0"`，`twMerge` 會保留重要符號效果。
- 為效能考量，應將合併結果放在 `computed`，不要在 template 內直接呼叫合併函式。
- 當元件同時支援 `$attrs`（fallthrough attributes）時，可把 `$attrs.class` 與 props 合併：

```ts
import { useAttrs } from 'vue'
const attrs = useAttrs()
const merged = computed(() => twMerge(clsx(DEFAULT_TITLE_CLASS, props.titleClass, attrs.class)))
```

命名慣例（建議）：

- props 使用 `camelCase`（`titleClass`），在 template 傳入使用 `kebab-case`（`title-class`）。

測試與驗證：

- 新增或修改元件後，請執行 `npm run build` / `npm run dev` 驗證樣式行為與編譯無誤。

範例代碼位置：請參考 `app/components/Accordion.vue` 中 `mergedTitleClass` 的實作。

若同意，我可以幫你把專案中其它接收 class 的 prop（若有）逐一改寫成此模式。
