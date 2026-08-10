# Pagination

純 UI 分頁元件。元件負責頁碼與無障礙標記，資料切頁及 URL query 由父層處理。

原始碼：[Pagination.vue](../../../../app/components/pagination/Pagination.vue)

## 基本使用

```vue
<Pagination
  v-model:current-page="page"
  :total-pages="12"
  aria-label="文章列表分頁"
  @change="loadPage"
/>
```

| Prop                                          | 型別         | 預設值 | 說明                       |
| --------------------------------------------- | ------------ | ------ | -------------------------- |
| `currentPage`                                 | `number`     | 必填   | 目前頁碼。                 |
| `totalPages`                                  | `number`     | 必填   | 總頁數。                   |
| `displayRange`                                | `number`     | `2`    | 目前頁前後顯示範圍。       |
| `firstLastDisplayRange`                       | `number`     | `4`    | 接近首尾時展開的頁碼範圍。 |
| `showArrow`                                   | `boolean`    | `true` | 顯示上一頁、下一頁。       |
| `showFirstLastArrow`                          | `boolean`    | `true` | 顯示第一頁、最後一頁。     |
| `ariaLabel`                                   | `string`     | 翻譯值 | `<nav>` 標籤。             |
| `firstLabel` / `lastLabel`                    | `string`     | 翻譯值 | 首頁與末頁按鈕標籤。       |
| `prevLabel` / `nextLabel`                     | `string`     | 翻譯值 | 上一頁與下一頁按鈕標籤。   |
| `navClass` / `listClass`                      | `ClassValue` | `''`   | 導覽與列表 class。         |
| `itemClass` / `activeClass` / `disabledClass` | `ClassValue` | `''`   | 按鈕狀態 class。           |

Events：`update:currentPage(page)`、`change(page)`。Slots：`first`、`prev`、`page`、`ellipsis`、`next`、`last`。
