# useMenu 使用說明

`useMenu` 取得 Header 的遞迴選單資料，依目前 locale 請求 API，負責排序、排除停用項目，並將 API 的 System code 或 slug 轉換成可供 `NuxtLink` 使用的 `href`。

原始碼：[useMenu.ts](../../app/composables/useMenu.ts)

## 使用方式

Nuxt 會自動匯入 `useMenu`：

```ts
const { menuItems, status, error, refresh } = useMenu()
```

目前 Header、Sitemap 與 Breadcrumb 會共用這份轉換後的選單資料。

## API

`useMenu()` 不接受 options，回傳值如下：

| 欄位        | 型別                             | 說明                                 |
| ----------- | -------------------------------- | ------------------------------------ |
| `menuItems` | `ComputedRef<TMenuItem[]>`       | 排序與 route 轉換完成的選單樹。      |
| `status`    | Nuxt `useFetch` status           | API 請求狀態。                       |
| `error`     | Nuxt `useFetch` error            | API 錯誤，沒有錯誤時為 `null`。      |
| `refresh`   | Nuxt `useFetch` refresh function | 依目前 locale 重新取得 `/api/menu`。 |

公開的 `TMenuItem` 包含：

```ts
type TMenuItem = {
  id: string
  title: string
  href: string
  icon: string
  targetId?: string
  slug?: string
  children?: TMenuItem[]
}
```

## 資料來源與轉換

Composable 使用 Nuxt `useFetch<TMenuApiItem[]>('/api/menu', { query: { locale } })` 取得選單。locale 改變時會重新請求；開發期間 `/api/menu` 由 `server/api/menu.get.ts` 提供依 locale 回傳標題的 Mock 資料。正式環境可以替換 endpoint，只要依 locale 回傳符合 `TMenuApiItem[]` 的資料即可。

每一層都會依 `order` 由小到大排序，`enabled: false` 的節點與其整個分支會被排除。

API 的 locale 只接受 `zh-TW` 與 `en`；缺少或不支援的值回退 `zh-TW`。前端也會將不支援的目前 locale 正規化為 `zh-TW`。

### System 選單

System 項目使用 `code` 對應 `app/config/menu.ts` 的固定功能與 icon。若 API 提供有效的 `slug`，則會依目前選單階層組合路徑；一般項目沒有 slug、空字串、空白、`null` 或 `undefined` 時，`href` 會是空字串。固定的 `code: 'home'` 會保留 `/` 供網站 Logo 與 Breadcrumb 使用。

```ts
{
  id: 'examples-button',
  type: 'system',
  code: 'sample',
  slug: 'button',
  title: '按鈕元件',
  enabled: true,
  order: 1,
}
```

當父層依序提供 `examples` 與 `basic` slug 時，結果是：

```text
/examples/basic/button
```

`slug` 只會被當作單一路徑片段，並經過 `encodeURIComponent()` 處理；它不是可以直接注入完整 URL 的欄位。這些 slug 對應的頁面目前未建立，連結出現 404 是預期結果。

### Custom 選單

Custom 項目可以用 `targetId` 對應後台內容資料，使用 `slug` 產生 route：

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

`slug` 會經過 `encodeURIComponent()`，並接在父層 `href` 後方。沒有父層 route 時，結果會從網站根目錄開始，例如 `news` 會產生 `/news`。正式專案仍需提供可以處理該路徑的頁面，例如 `app/pages/content/[slug].vue`，或改成專案定義的內容 route。

沒有 route target 的節點仍可保留 `children`，這類節點會作為展開用的分組項目。

## SSR 與錯誤處理

- `useFetch` 適合在 Nuxt setup context 使用，支援 SSR 初次取得資料與 hydration payload 重用。
- `query` 會反映目前 locale，因此語系切換後 Header、Sitemap 與其他呼叫端會取得對應的選單標題。
- `default: () => []` 讓 API 尚未完成或初始狀態時，`menuItems` 保持空陣列。
- Composable 不會自行顯示錯誤 UI；呼叫端可依 `status` 與 `error` 決定顯示 fallback、重試按鈕或隱藏導覽。
- API 回傳內容目前依 TypeScript 型別描述，沒有 runtime schema 驗證；正式後端串接時仍應驗證 `id`、`code`、`slug` 與 `children`。

## 安全與限制

- System 的 `href` 除固定首頁 `/` 外，只由有效 slug 組合；slug 只作為 path segment，不直接信任 API 傳入的完整 URL。
- `targetId` 與 `slug` 應由後端依使用者權限過濾；前端隱藏選單不能取代後端授權。
- 選單層級只是導覽結構，不一定要與內容頁 URL 層級完全相同。若後台允許移動選單，建議使用穩定的 `targetId` 與內容 canonical slug，避免移動父層造成 URL 改變。
- `TMenuItem` 的 `href` 可能是空字串，Header 會將這類節點渲染為展開按鈕或非連結文字。
