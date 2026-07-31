---
name: sync-composable-docs
description: 維持此 Nuxt 專案的 composable 原始碼、文件、索引與使用範例同步。建立、修改、重構、重新命名、移動或刪除 app/composables 下的 TypeScript 檔案時使用；涵蓋 options、回傳值、公開型別、SSR safety、browser API、事件、observer、timer、side effects、清理與使用方式。
---

# 同步 Composable 文件

在同一個任務中維持 `app/composables` 與 `docs/composables` 一致。完成公開契約、文件、索引與驗證後，才將 composable 任務視為完成。

## 執行流程

1. 讀取根目錄 `AGENTS.md`、目標 composable、呼叫端、現有文件、索引與相關 sample。
2. 列出受影響的 options、預設值、回傳值、公開型別、side effects、SSR、清理與 edge cases。
3. 實作變更並同步文件、索引與必要範例。
4. 搜尋過期名稱、路徑、options、return fields 與使用方式。
5. 執行適用的 docs consistency、format、lint、typecheck、build 與 diff 檢查。

## 文件路徑

將 composable 檔名轉為 kebab-case，放在 `docs/composables`：

- `app/composables/useDrag.ts` → `docs/composables/use-drag.md`
- `app/composables/usePageSeo.ts` → `docs/composables/use-page-seo.md`
- `app/composables/useModalScrollLock.ts` → `docs/composables/use-modal-scroll-lock.md`

所有已文件化的 composable 都必須列在 `docs/composables/README.md`。重新命名或移動時同步處理文件與引用；刪除時，除非使用者明確要求封存，否則移除文件、索引與過期引用。

## 依變更類型同步

### 新增 Composable

- 建立對應 Markdown 文件並更新索引。
- 提供可編譯的使用範例。
- 若功能可在 sample 頁直接展示，加入或更新 `app/pages/sample.vue`。
- 記錄 SSR、browser API、side effects、清理與限制。

### 修改或重構 Composable

- Options、預設值、回傳值、型別、side effects 或支援用法變更時同步更新文件與範例。
- 純內部重構且公開契約與使用方式完全不變時，不製造無意義文件變更；交付時說明已檢查且無需更新。

### 重新命名、移動或刪除 Composable

- 同步處理文件、索引、Nuxt 自動匯入名稱、呼叫端與整個 `docs` 內的引用。
- 刪除前確認使用者要求明確包含目標。

## 文件內容

使用繁體中文並從目前實作推導。依實際情況記錄：

- 用途、原始碼連結與適用情境。
- Options 的精確型別、預設值與正規化規則。
- 回傳值、readonly state、controls 與公開型別。
- Nuxt 自動匯入或明確 import 的使用方式。
- SSR／client-only 行為與 hydration 限制。
- Event listener、observer、timer、watcher 與 DOM reference 的生命週期。
- Target 改變、重複啟動、手動停止及 component unmount 時的清理。
- Error handling、edge cases、效能、安全與 accessibility 影響。
- 可編譯的基本範例及 sample 位置。

移除過期敘述與範例，不得虛構 API 或隱藏必要限制。

## 驗證

1. 執行 `npm run check:composable-docs`。
2. 執行 `npm run check`。
3. 影響 Nuxt、SSR、build 或頁面展示時執行 `npm run build`。
4. 使用 `rg` 搜尋過期名稱、路徑、options、return fields 與使用範例。
5. 執行 `git diff --check` 並檢查完整 diff。

若既有 composable 尚未文件化，遵循 baseline，不藉由無關任務大量補文件；但本次新增或修改的 composable 不得留在 baseline。交付時列出建立或更新的文件與範例。
