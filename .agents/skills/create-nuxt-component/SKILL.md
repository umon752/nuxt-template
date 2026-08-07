---
name: create-nuxt-component
description: 在此 Nuxt 4 專案建立新的 Vue 元件與完整交付內容。使用者要求新增、建立、移植或依照附件、舊 Bootstrap／JavaScript 模組、既有資料夾、設計稿或其他參考實作製作 app/components 元件時使用；涵蓋 TypeScript API、單向資料流、SSR、清理、a11y、i18n、樣式 API、transition、sample、文件、索引與驗證。只修改既有元件而未建立新元件時，改用 sync-component-docs。
---

# 建立 Nuxt 元件

建立符合此 repository 慣例且可直接交付的新元件。同步遵循
[sync-component-docs](../sync-component-docs/SKILL.md)，不要把 sample 與文件留到後續補做。

## 1. 釐清目標與參考行為

1. 讀取根目錄 `AGENTS.md`、TypeScript／Vue／class prop 規範及鄰近元件。
2. 檢查使用者提供的附件、舊模組、設計稿或參考資料夾；列出必須保留的功能、狀態、事件、視覺與邊界情況。
3. 區分必要需求、可選改善與參考實作中的歷史限制。不要逐行移植 jQuery、Bootstrap plugin 或舊生命週期寫法。
4. 若使用者要求「先提方案再實作」，先提供 API、資料流、檔案與驗證方案並等待確認；否則依明確需求直接實作。

## 2. 設計公開契約

- 決定元件名稱、目錄、Nuxt 自動匯入名稱與責任邊界。
- 從使用者明確需要的最小公開契約開始；不要預先加入 loading、error、description、size、variant、額外 slots、expose 或大量 class props，除非需求、參考實作或鄰近元件模式能證明必要性。
- 優先採用受控資料流：父層以 props 傳入狀態，元件以 emits 請求更新。只有契約符合時才提供 `v-model`。
- 定義精確的 props、defaults、emits、payload、slots、slot props 與 expose API。
- 依現有慣例使用 `T` 前綴 type、`import type`、明確的公開回傳型別及 `unknown` narrowing。
- 將可重用且不依賴 UI 的複雜邏輯抽成 composable；不要為簡單區域狀態過度抽象。
- 不新增 dependency，除非現有工具確實無法合理完成需求並已取得使用者確認。

## 3. 實作元件

- 使用 Vue Composition API、`<script setup lang="ts">` 與現有 Nuxt 自動匯入模式。
- 保持 SSR／hydration 安全；不要在 module evaluation 期間直接讀取 `window`、`document` 或 DOM。
- 清理 event listeners、observers、timers、pointer capture、scroll lock 與其他 side effects；target 改變與 unmount 都要正確處理。
- 互動元件實作 keyboard、focus、ARIA、disabled、loading、error 與 reduced-motion 行為。
- 使用者可見或輔助科技文字遵循現有 i18n 模式，不硬編碼可重用 UI label。
- 公開 Tailwind class props 遵循 `docs/props-class-guideline.md`，以現有 `cn`／class merge 方式允許使用端覆寫。
- Transition 必須符合實際 mount／unmount 時機，並在適用時支援初次顯示與 reduced motion。
- 處理 HTML、URL、外部導向或第三方內容時，保留必要的 escaping、validation 與安全限制。

## 4. 補齊交付內容

依 `sync-component-docs` 完成：

- `app/components/**/*.vue` 元件實作。
- `app/pages/sample.vue` 的可操作案例，涵蓋主要狀態與互動。
- `docs/components/**/README.md` 的 API、使用方式、a11y、i18n、SSR、清理與限制。
- `docs/components/README.md` 索引。
- 必要的 i18n keys、types、composable 或設定，但不加入無關展示或重構。
- 頁面、元件或其他 TypeScript 邏輯的功能區塊註解遵循 [sync-component-docs](../sync-component-docs/SKILL.md) 的固定三行分隔格式，不限於 sample `<script setup>`。

從目前原始碼推導文件與範例，不得虛構尚未實作的 API。若元件明確是內部實作且使用者要求不提供 demo，記錄此例外。

## 5. 驗證

1. 執行 `npm run check:component-docs`。
2. 執行 `npm run check`。
3. 執行 `npm run build`。
4. 執行 `git diff --check` 並 review 完整 diff。
5. 使用 `rg` 搜尋過期名稱、錯誤自動匯入名稱、hardcoded labels 與遺漏引用。
6. 可使用瀏覽器時，驗證主要互動、responsive、keyboard、focus、ARIA、transition、console 與 hydration；無法執行時明確回報。

## 完成條件

- 元件公開契約與需求一致，沒有不必要的 API 或 dependency。
- sample 可展示主要狀態、互動與 edge cases。
- docs、索引、i18n 與原始碼同步。
- SSR、cleanup、a11y、安全與 reduced motion 已檢查。
- 所有適用驗證已通過，或已明確區分既有問題與未驗證項目。
