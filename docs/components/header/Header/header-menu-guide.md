# Header 選單開發與使用說明

本文件說明目前 Header 選單的架構、資料格式、Mock API、前端轉換流程，以及新增或調整選單時的操作方式。

## 架構概覽

目前選單採用「後端提供資料，前端控制功能對照與呈現」的方式：

1. `server/api/menu.get.ts` 依 query locale 模擬後端回傳選單資料。
2. `app/types/menu.ts` 定義前後端共同使用的資料格式。
3. `app/config/menu.ts` 保存固定系統功能與前端 icon 的對照。
4. `app/composables/useMenu.ts` 呼叫 API，並將 API 資料轉換成 Header 可使用的格式。
5. `app/components/header/Header.vue` 顯示桌面版與手機版選單。

資料流程如下：

```text
GET /api/menu?locale=zh-TW
    ↓
TMenuApiItem[]
    ↓
useMenu()
    ↓
依 locale 取得標題、排序、過濾停用項目、組合 slug route 與 icon
    ↓
TMenuItem[]
    ↓
Header.vue
```

## 相關檔案

| 檔案                                                  | 用途                               |
| ----------------------------------------------------- | ---------------------------------- |
| `app/config/menu.ts`                                  | 固定系統功能的 code 與 icon 對照   |
| `app/types/menu.ts`                                   | API 選單與子選單的 TypeScript 型別 |
| `app/composables/useMenu.ts`                          | 呼叫 API 並轉換選單資料            |
| `server/api/menu.get.ts`                              | 依 locale 回傳標題的 Mock Menu API |
| `app/components/header/Header.vue`                    | Header 與選單畫面                  |
| `app/components/header/DesktopSingleDropdownMenu.vue` | 桌面版遞迴子選單                   |
| `app/components/header/MobileMenuList.vue`            | 手機版遞迴子選單                   |

## 選單類型

目前選單分成 `system` 與 `custom` 兩種類型。

### System 選單

`system` 代表前端已經存在的固定系統功能，例如首頁、會員管理或內容管理。

```ts
{
  id: 'members',
  type: 'system',
  code: 'members',
  slug: 'members',
  title: '會員管理',
  enabled: true,
  order: 3,
}
```

欄位說明：

| 欄位       | 說明                                            |
| ---------- | ----------------------------------------------- |
| `id`       | 選單唯一識別值                                  |
| `type`     | 固定為 `system`                                 |
| `code`     | 對應 `systemMenuConfig` 的功能代碼              |
| `slug`     | 可選的 URL path segment，會接在父層 `href` 後方 |
| `title`    | 畫面顯示名稱                                    |
| `enabled`  | 是否顯示                                        |
| `order`    | 同一層選單的排序值，數字越小越前面              |
| `children` | 可選的子選單陣列                                |

`systemMenuConfig` 提供固定系統功能的 code 與 icon 對照：

```ts
export const systemMenuConfig = {
  members: {
    icon: 'users',
  },
} as const
```

如果 API 提供 `slug`，`useMenu()` 會將它當作單一路徑片段，接在父層 `href` 後方；這讓後台可以建立多層選單，而前端不需要為每個選單項目維護 route 對照：

```text
父層 /examples + slug basic + slug button
→ /examples/basic/button
```

沒有提供 `slug` 時，一般 System 項目的 `href` 會是空字串，不會渲染成連結；固定的 `code: 'home'` 會保留 `/` 供網站 Logo 與 Breadcrumb 使用。`slug` 會經過 `encodeURIComponent()` 處理，不接受完整 URL；正式後端仍應限制 slug 的格式與長度，並依權限回傳可見的選單。

`slug` 為空、空白或省略時，代表該項目沒有連結；父層仍可保留 `children` 作為純分組節點。Header 會依轉換後的 `href` 判斷是否渲染連結。

### Custom 選單

`custom` 代表由後台使用者新增的內容型子選單。

```ts
{
  id: 'news',
  type: 'custom',
  targetId: 'content-news',
  slug: 'news',
  title: '最新消息',
  enabled: true,
  order: 1,
}
```

Custom 選單不需要加入 `systemMenuConfig`。`targetId` 可用來對應後台內容資料，`slug` 則由 `useMenu()` 接在父選單路徑後方；若沒有父層路徑，則從網站根目錄開始：

```text
{parentHref}/{slug}
```

例如父層路徑為 `/content`、`slug` 為 `news` 時會轉換成：

```text
/content/news
```

`slug` 會經過 `encodeURIComponent()` 處理，但正式後端仍應限制 slug 的格式與長度。

## API 型別

型別定義位於 `app/types/menu.ts`。

```ts
type TMenuApiItemBase = {
  id: string
  title: string
  enabled: boolean
  order: number
  targetId?: string
  slug?: string | null
  children?: TMenuApiItem[]
}

type TSystemMenuApiItem = TMenuApiItemBase & {
  type: 'system'
  code: SystemMenuCode
}

type TCustomMenuApiItem = TMenuApiItemBase & { type: 'custom' }

type TMenuApiItem = TSystemMenuApiItem | TCustomMenuApiItem
```

`type` 是辨識欄位。當 `type` 是 `system` 時必須提供 `code`；`slug` 可用來產生目前選單階層的路徑，省略時 `href` 為空字串。當 `type` 是 `custom` 時，可用 `targetId` 對應後台內容，並以 `slug` 產生內容路徑。沒有目標的父層節點可以省略 `slug`。

## Mock API

開發期間由 `server/api/menu.get.ts` 提供資料：

```text
GET /api/menu
```

可使用 `locale` query 指定回傳語系：

```text
GET /api/menu?locale=zh-TW
GET /api/menu?locale=en
```

缺少或不支援的 locale 會回退 `zh-TW`。正式 API 也應依請求 locale 回傳已翻譯的 `title`，不應讓 Header 自行猜測後端內容語系。

Nuxt 開發伺服器啟動後，可直接在瀏覽器開啟：

```text
http://localhost:3000/api/menu
```

Starter 預設回傳首頁、範例頁，以及用來展示遞迴結構的「多層選單」。示範選單包含三層子選單，葉節點使用階層 slug 組合路徑：

```ts
{
  id: 'examples-pagination',
  type: 'system',
  code: 'sample',
  slug: 'pagination',
  title: 'Pagination',
  enabled: true,
  order: 1,
}
```

示範選單會依各節點提供的 slug 組合出 `/examples/basic/card`、`/examples/interactive/navigation/pagination` 等路徑；`examples-button` 的 slug 為空，因此不會渲染成連結。這些頁面尚未建立，因此目前點擊有效連結後出現 404 是預期結果；正式專案應由頁面檔案或動態路由處理這些路徑。

正式 API 完成後，可以將 `useMenu.ts` 的 endpoint 換成正式網址；只要回傳格式符合 `TMenuApiItem[]`，Header 不需要重新實作。

## useMenu 資料轉換

`useMenu()` 負責：

- 依目前 locale 呼叫 `/api/menu?locale={locale}`。
- 將未啟用的項目排除。
- 依照 `order` 進行各層排序。
- 將 System code、slug 與父層路徑組合成 route，並從 System code 取得 icon。
- 保留 Custom 的 `targetId`，並依 `slug` 與父層路徑產生 route。
- 提供載入狀態、錯誤與重新取得資料的方法。

使用方式：

```ts
const { menuItems, status: menuStatus, error: menuError, refresh } = useMenu()
```

回傳值：

| 回傳值       | 說明                         |
| ------------ | ---------------------------- |
| `menuItems`  | 已轉換完成、可直接顯示的選單 |
| `menuStatus` | Nuxt `useFetch` 的請求狀態   |
| `menuError`  | API 請求錯誤                 |
| `refresh()`  | 重新取得選單資料             |

## Header 顯示行為

`Header.vue` 目前提供：

- 桌面版水平主選單。
- 桌面版以 hover 展開、可遞迴的下拉子選單。
- 手機版展開／收合按鈕。
- 手機版可遞迴的展開／收合子選單。
- 使用 `NuxtLink` 進行站內導航。
- 有 `href` 的父層同時提供父層 `NuxtLink` 與獨立的子選單切換按鈕；沒有 `href` 的父層只提供切換按鈕。
- 路由變更後自動關閉桌面與手機選單。
- 桌面版 trigger 提供 `aria-expanded`、`aria-controls`，鍵盤 focus 也能展開，並支援 Escape 關閉與焦點返回。
- `featureConfig.languageSwitcher` 開啟時，右側工具列提供 `HeaderLanguageSwitcher`，可在 `zh-TW` 與 `en` 間切換並保留目前 route、query 與 hash；關閉時不渲染語系切換入口，直接進入非預設語系路徑也會回傳 404。

API 型別與桌面、手機選單元件都允許遞迴的 `children`。選單資料仍應控制合理深度，避免過深的導覽結構影響操作性。

## 新增固定系統選單

假設要新增「訂單管理」：

### 1. 建立頁面

```text
app/pages/orders.vue
```

### 2. 加入系統功能對照

在 `app/config/menu.ts` 加入：

```ts
orders: {
  icon: 'orders',
},
```

加入後，`SystemMenuCode` 會自動包含 `orders`。

### 3. 讓 API 回傳選單

```ts
{
  id: 'orders',
  type: 'system',
  code: 'orders',
  slug: 'orders',
  title: '訂單管理',
  enabled: true,
  order: 5,
}
```

不需要修改 `Header.vue`。

## 新增後台自訂子選單

如果要在「內容管理」下新增「活動資訊」，只需要讓 API 在 `children` 加入：

```ts
{
  id: 'events',
  type: 'custom',
  slug: 'events',
  title: '活動資訊',
  enabled: true,
  order: 3,
}
```

若父層 route 是 `/content`，前端會自動產生：

```text
/content/events
```

仍需確保前端存在能處理此路徑的動態頁面，例如：

```text
app/pages/content/[slug].vue
```

建立 Custom 選單前必須先提供對應頁面；starter 預設不回傳 Custom 選單。

## 停用與排序

停用選單：

```ts
enabled: false
```

`useMenu()` 會將該項目排除。

調整排序：

```ts
order: 1
```

排序在每一層分別執行。若多個項目使用相同的 `order`，建議後端提供穩定的次要排序規則，避免順序不明確。

## 權限注意事項

選單是否顯示不等於功能是否有權限。

正式系統仍應在後端驗證：

- 使用者是否能取得該選單。
- 使用者是否能存取對應 API。
- 使用者是否能讀取或修改指定內容。

前端隱藏選單只能改善使用體驗，不能作為安全機制。

如果正式 API 需要回傳權限代碼，可以在 API 型別加入：

```ts
permission?: string
```

但最終權限驗證仍必須由後端執行。

## 正式 API 串接建議

正式上線前建議補上以下項目：

1. 使用 runtime schema 驗證 API 回傳內容，避免 TypeScript 泛型被誤認為執行階段驗證。
2. 限制 slug 可接受的字元與長度，沒有頁面連結的分組節點省略 slug。
3. 確保每個 `id` 在整棵選單中唯一。
4. 定義相同 `order` 的次要排序方式。
5. 根據登入者權限由後端過濾選單。
6. 規劃 API 失敗時的 fallback 或重試行為。
7. 先建立實際頁面，再讓 API 回傳對應選單，避免導覽連向 404。

## 常見問題

### 選單有顯示，但點擊後出現 404

確認 slug 組合出的路徑是否有對應 Nuxt 頁面。目前 Mock 的多層 slug 頁面尚未建立，因此會連到 404；Custom route 也需要建立對應的動態頁面。

### 為什麼父層有 children 時仍可以有連結

父層的 `slug` 會產生自己的 `href`，例如 `examples` 會產生 `/examples`。Header 會將父層標題渲染為 `NuxtLink`，另外提供按鈕控制子選單；若父層沒有 `href`，則只渲染展開／收合按鈕。

### API 已增加 System code，但 TypeScript 報錯

先在 `app/config/menu.ts` 加入對應項目。`SystemMenuCode` 由該物件的 key 自動產生。

### Custom 選單需要加入 systemMenuConfig 嗎

不需要。Custom 選單使用 `slug`，由 `useMenu()` 組成內容頁路徑。

### 修改 Mock API 後選單沒有更新

重新整理頁面，或呼叫 `useMenu()` 回傳的 `refresh()`。如果仍未更新，可重新啟動 Nuxt 開發伺服器。

### 為什麼不能直接讓 API 回傳任意 component

Vue component 屬於前端可執行程式碼。後端應控制資料與權限，不應任意指定前端執行內容。固定功能應透過受控的 system code 對照。

## 提交前檢查

選單相關修改完成後，建議執行：

```bash
npx prettier --check \
  app/config/menu.ts \
  app/types/menu.ts \
  app/composables/useMenu.ts \
  app/components/header/Header.vue \
  server/api/menu.get.ts

npx eslint \
  app/config/menu.ts \
  app/types/menu.ts \
  app/composables/useMenu.ts \
  app/components/header/Header.vue \
  server/api/menu.get.ts

npx nuxt typecheck
```
