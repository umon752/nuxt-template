# usePaginationQuery 使用說明

`usePaginationQuery` 將分頁目前頁碼同步到 Nuxt route query，提供可寫的 `page`、正規化後的 `totalPages` 與保留其他 query 的 `replacePage`。適合列表、搜尋結果或其他需要以網址保存分頁狀態的頁面。

原始碼：[usePaginationQuery.ts](../../app/composables/usePaginationQuery.ts)

## 基本使用

composable 由 Nuxt 自動匯入。將實際總頁數傳入後，可直接讀寫 `page.value`：

```vue
<script setup lang="ts">
const totalPages = computed(() => 12)
const { page, replacePage } = usePaginationQuery({ totalPages })

const goToPage = (nextPage: number): void => {
  page.value = nextPage
}

const resetPage = (): void => {
  void replacePage(1)
}
</script>

<template>
  <p>目前第 {{ page }} 頁</p>
  <button type="button" @click="goToPage(page - 1)">上一頁</button>
  <button type="button" @click="goToPage(page + 1)">下一頁</button>
  <button type="button" @click="resetPage">回到第一頁</button>
</template>
```

預設使用 `page` 作為 query key，且第一頁不會出現在網址中；例如第一頁使用 `/news`，第二頁使用 `/news?page=2`。`replacePage(page, query)` 會保留目前 query，再合併傳入的 query。

## API

### `usePaginationQuery(options)`

| 選項            | 型別                       | 預設值   | 說明                          |
| --------------- | -------------------------- | -------- | ----------------------------- |
| `totalPages`    | `MaybeRefOrGetter<number>` | 必填     | 總頁數，會正規化為至少 `1`。  |
| `pageQueryKey`  | `string`                   | `'page'` | 儲存頁碼的 route query key。  |
| `omitFirstPage` | `boolean`                  | `true`   | 是否省略第一頁的 query 參數。 |

### 回傳值

| 成員          | 型別                              | 說明                                               |
| ------------- | --------------------------------- | -------------------------------------------------- |
| `page`        | `WritableComputedRef<number>`     | 目前頁碼；寫入時會透過 `router.replace` 同步網址。 |
| `totalPages`  | `ComputedRef<number>`             | 正規化後的總頁數，最小值為 `1`。                   |
| `replacePage` | `(page, query?) => Promise<void>` | 將頁碼限制在有效範圍，合併 query 後更新網址。      |

### `getRouteQueryValue(value)`

匯出的輔助函式，將 Nuxt route query 可能出現的 `string`、`null`、陣列或 `undefined` 轉為第一個字串值；沒有值時回傳空字串。

## 行為與限制

- query 中非正整數的頁碼會回到第 `1` 頁，並在 client 端同步為正規化後的網址。
- 頁碼會被限制在 `1` 到 `totalPages` 之間。
- `replacePage` 使用 `router.replace`，不會新增瀏覽器歷史紀錄；導覽失敗時會記錄錯誤。
- route query 的自動校正 watcher 只在 client 端啟用；computed state 可安全參與 SSR。
- 若 `omitFirstPage` 為 `false`，第一頁會以 `?page=1` 保留在網址中。
- 完整使用範例位於 `app/pages/sample.vue` 的「query pagination」區塊。
