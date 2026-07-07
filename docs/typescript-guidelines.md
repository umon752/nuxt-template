## TypeScript 配置

- 保持 `strict`，包含 `noImplicitAny`、`strictNullChecks`、`strictFunctionTypes`、`strictBindCallApply`、`strictPropertyInitialization`、`noImplicitThis` 與 `alwaysStrict`。
- 啟用或遵循 `noUnusedLocals`、`noUnusedParameters`、`noImplicitReturns`、`noFallthroughCasesInSwitch`、`forceConsistentCasingInFileNames`、`resolveJsonModule` 與 `isolatedModules`。
- 使用 `esModuleInterop`；除非有明確相容性理由，不降低型別檢查強度。
- 本專案是 Nuxt 專案，應透過 Nuxt 產生的 `.nuxt/tsconfig.*.json` references 擴充設定，不要以一般 library 的 `rootDir`、`outDir` 或 `declaration` 設定覆蓋它。

## Type 與 Interface

- 預設使用 `type`；type alias 必須使用 PascalCase 並加上 `T` 前綴，例如 `TUser`。
- 只有在 declaration merging、class `implements` 的語意更清楚，或第三方型別擴充要求時才使用 `interface`。
- interface 必須使用 PascalCase 並加上 `I` 前綴，例如 `IUserRepository`。
- 物件資料、union、intersection、mapped type、conditional type、tuple 與函數型別皆優先使用 `type`。
- 擴充自有資料型別時，優先使用 intersection，而不是建立 interface 繼承鏈。

```ts
type TUser = {
  id: string
  name: string
}

type TAdminUser = TUser & {
  permissions: string[]
}

interface IUserRepository {
  findById(id: string): Promise<TUser | undefined>
  save(user: TUser): Promise<void>
}
```

## 型別安全

- 禁止無理由使用 `any`；優先使用 `unknown`、泛型、明確型別與 type guard。
- 必須使用 `any` 時，需以簡短註解說明外部限制或技術原因，並把影響範圍縮到最小。
- 對外匯出的公開函數必須標註回傳型別；私有或內部函數可在型別清楚時依賴推斷。
- 無回傳值的一般函式省略 `: void`；事件型別契約與 async 函式的 `Promise<void>` 應保留。
- 優先使用內建 Utility Types，如 `Partial`、`Pick`、`Omit`、`Record`、`Required` 與 `Readonly`。
- 需要型別斷言前，先考慮 `typeof`、`instanceof`、`in`、`Array.isArray` 或自訂 type guard。
- `as` 只用於程式已驗證或 TypeScript 無法表達、但開發者能證明的型別。
- 謹慎使用 non-null assertion (`!`)；優先以條件縮窄、optional chaining (`?.`) 或明確初始化處理。

```ts
function readValue(input: unknown): string {
  if (
    typeof input === 'object' &&
    input !== null &&
    'value' in input &&
    typeof input.value === 'string'
  ) {
    return input.value
  }

  throw new TypeError('Expected an object with a string value')
}
```

## Undefined 與 Null

- 預設使用 `undefined`，只有外部 API、資料庫或框架契約明確要求時才使用 `null`。
- 可省略的屬性使用 `?`。
- 必須存在但值可能未定義的屬性使用 `T | undefined`。
- Vue reactive state 若受框架或序列化契約限制可使用 `null`，否則仍優先使用 `undefined`。

```ts
type TConfig = {
  timeout?: number
  retries: number | undefined
}

function findUser(id: string): TUser | undefined {
  return users.find((user) => user.id === id)
}
```

## 泛型、守衛與重載

- 簡單泛型可使用慣例名稱 `T`、`K`、`V`、`E`。
- 複雜或多個泛型應使用描述性名稱，如 `ItemType`、`ResultType`。
- 使用 `extends` 約束泛型，避免將不受限制的型別責任推給呼叫端。
- 需要根據輸入提供精確回傳型別時，可使用函數重載；實作簽名仍須涵蓋所有 overload。
- 對 union type 使用 type guard 縮窄後再存取專屬成員。

## 型別匯入、匯出與檔案組織

- 純型別必須使用 `import type` 或 inline `type` import。
- 純型別 re-export 使用 `export type`。
- 共用 domain 型別放在對應的 types 模組，並透過 index 統一匯出。
- 僅供單一元件使用的型別可留在該 `.vue` 檔案。
- 型別與 runtime 實作應保持可辨識的邊界，避免因型別匯入產生不必要的 runtime dependency。

```ts
import { fetchUser, type TUser } from './api'

export type { TProduct } from './product'
```
