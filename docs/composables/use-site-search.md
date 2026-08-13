# useSiteSearch 使用說明

`useSiteSearch` 封裝 `/api/search` 的 SSR-safe 查詢狀態，供搜尋結果頁或其他搜尋介面共用。它負責將 query、page、limit 轉成 API request，並提供結果、總數、分頁、request status、error 與 refresh；不負責呈現 UI 或修改 route。

原始碼：[useSiteSearch.ts](../../app/composables/useSiteSearch.ts)

公開型別：`TUseSiteSearchOptions`、`TUseSiteSearchReturn`。

## 基本使用

```vue
<script setup lang="ts">
const route = useRoute()
const query = computed(() => String(route.query.q ?? ''))
const page = ref(1)

const { results, total, totalPages, status, error, refresh } = useSiteSearch({
  query,
  page,
})
</script>
```

## Options

| 選項    | 型別                                    | 預設值                  | 說明                                   |
| ------- | --------------------------------------- | ----------------------- | -------------------------------------- |
| `query` | `MaybeRefOrGetter<string \| undefined>` | `''`                    | 搜尋關鍵字；會 trim 並限制最大長度。   |
| `page`  | `MaybeRefOrGetter<number>`              | `1`                     | 目前頁碼；非正整數會正規化為 `1`。     |
| `limit` | `number`                                | `searchConfig.pageSize` | 每頁筆數，最多使用設定檔的 page size。 |

## 回傳值

| 名稱         | 說明                                                             |
| ------------ | ---------------------------------------------------------------- |
| `query`      | 正規化後的唯讀 computed query。                                  |
| `page`       | 正規化後的唯讀 computed page。                                   |
| `limit`      | 實際送給 API 的每頁筆數。                                        |
| `results`    | `TSearchResult[]`，包含 `id`、`title`、`description` 與 `href`。 |
| `total`      | 符合查詢的結果總數。                                             |
| `totalPages` | API 回傳的總頁數；沒有結果時為 `1`，方便搭配 Pagination。        |
| `status`     | Nuxt `useFetch` 的 request status。                              |
| `error`      | API request error，沒有錯誤時為 `undefined`。                    |
| `refresh`    | 重新請求搜尋資料的 async function。                              |

## API 與搜尋規則

- 呼叫 `GET /api/search?q=<keyword>&page=<page>&limit=<limit>`。
- server 端從目前 starter 的首頁、範例頁、隱私權政策、網站導覽與元件關鍵字索引搜尋。
- 搜尋會以 Unicode NFKC、大小寫與連續空白正規化；查詢以空白分隔時，每個 token 都必須命中。
- 標題完全相同、標題開頭、標題包含、關鍵字與描述命中會依序加權排序。
- query 為空時回傳空結果，不會把整站內容全部載入到 client。

## SSR、錯誤與清理

- composable 使用 Nuxt `useFetch`，有 query 或 page 改變時重新請求，首次 render 可在 SSR 取得結果。
- 不讀取 `window`、`document`、storage 或其他 browser API，沒有需要手動清理的 listener、timer 或 observer。
- API 錯誤會保留在 `error` 與 `status`，呼叫端必須呈現可理解的錯誤狀態，不應靜默忽略。
- API 受 `featureConfig.search` 控制；功能關閉時直接存取 endpoint 會回傳 404。
