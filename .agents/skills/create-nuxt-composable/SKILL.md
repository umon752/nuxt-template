---
name: create-nuxt-composable
description: 在此 Nuxt 4 專案建立新的 Vue composable 與完整交付內容。使用者要求新增、建立、抽離或移植 app/composables 下的可重用狀態或功能邏輯時使用，包括從既有元件、舊 JavaScript 模組或 browser API 封裝 composable；涵蓋 TypeScript API、SSR safety、readonly state、events、watchers、observers、timers、side effects、清理、使用範例、文件、索引與驗證。只修改既有 composable 而未建立新檔案時，改用 sync-composable-docs。
---

# 建立 Nuxt Composable

建立責任清楚、SSR-safe 且能可靠清理 side effects 的 composable。同步遵循
[sync-composable-docs](../sync-composable-docs/SKILL.md)，在同一個任務完成文件、索引與範例。

## 1. 釐清責任與使用情境

1. 讀取根目錄 `AGENTS.md`、TypeScript／Vue 規範、鄰近 composables 與實際呼叫端。
2. 列出輸入、狀態、操作、回傳值、side effects、browser API、生命週期與 edge cases。
3. 確認邏輯是否真的會被重用或需要獨立測試；單一元件的簡單區域狀態留在元件內。
4. 若從舊 JavaScript 或 UI 模組移植，只保留可重用行為；不要把 DOM 結構、樣式或元件渲染責任塞進 composable。
5. 若使用者要求「先提方案再實作」，先提供 API、資料流、SSR boundary、cleanup 與驗證方案並等待確認；否則依明確需求直接實作。

## 2. 設計公開 API

- 使用 `useXxx` 命名，放在 `app/composables/useXxx.ts`。
- 以單一 options object 承載多個或可擴充輸入，並定義明確預設值與正規化規則。
- 依現有慣例使用 `T` 前綴 type；匯出需要被呼叫端引用的 options、result、controls 或 domain types。
- 對外暴露 readonly state；透過命名清楚的 controls 修改內部狀態，不無理由洩漏可寫 ref。
- 對同步與 async 操作提供可預期的回傳值與錯誤語意。只有能恢復、轉換或補充脈絡時才捕捉錯誤。
- 避免隱藏的全域 singleton、跨 request state 或模組層級 browser side effect。
- 不新增 dependency，除非現有 Vue／Nuxt／browser API 無法合理完成需求並已取得使用者確認。

## 3. 實作 SSR 與生命週期

- 不在 module evaluation 期間直接讀取 `window`、`document`、storage、media query 或 DOM。
- 使用 `import.meta.client`、Vue lifecycle 或延後執行的函式界定 client-only 行為。
- 監看 reactive target 時，先解除舊 target 的 listeners／observer，再綁定新 target。
- 以相同 target、event type、handler 與 options 移除 event listener。
- 清理 observers、timers、animation frames、abort controllers、pointer capture 與暫時修改的 DOM state。
- 讓 `stop`／`dispose` 可安全重複呼叫；component unmount 時自動清理。
- 處理快速重啟、target 為空、target 替換、重複排程、競態與 async completion after unmount。
- 只有必要時使用 deep watch、flush option 或全域 listener，並在文件說明原因。

## 4. 補齊交付內容

依 `sync-composable-docs` 完成：

- `app/composables/useXxx.ts` 實作與公開型別。
- `docs/composables/use-xxx.md` 的 API、範例、SSR、side effects、cleanup 與限制。
- `docs/composables/README.md` 索引。
- 新 composable 不得加入 `scripts/docs-consistency-baseline.json`；若任務接手的是 baseline 中的既有檔案，先補文件再移除對應項目。
- 若功能適合視覺或互動展示，在 `app/pages/sample.vue` 加入案例；否則在文件提供最小可編譯範例。
- 更新必要呼叫端，避免建立未使用或無法驗證的抽象。

從實作推導文件，不得省略 timer、listener、observer 或手動停止等實際契約。

## 5. 驗證

1. 執行 `npm run check:composable-docs`。
2. 執行 `npm run check`。
3. 影響 Nuxt、SSR、頁面展示或 build 行為時執行 `npm run build`。
4. 執行 `git diff --check` 並 review 完整 diff。
5. 使用 `rg` 搜尋舊名稱、未清理 side effects、重複實作與錯誤使用方式。
6. 可執行瀏覽器時，驗證 client-only 行為、target 替換、手動停止與 unmount cleanup；無法執行時明確回報。

## 完成條件

- API 責任清楚，型別、defaults、readonly state 與 controls 可預期。
- SSR boundary、target 變更、重複執行、unmount 與所有 side effects cleanup 已處理。
- 文件、索引、範例與呼叫端同步。
- 沒有不必要的 dependency、全域狀態或 UI 責任。
- 所有適用驗證已通過，或已明確區分既有問題與未驗證項目。
