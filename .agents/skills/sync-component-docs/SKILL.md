---
name: sync-component-docs
description: 維持此 Nuxt 專案的 Vue 元件、sample 與元件文件同步。建立、修改、重構、重新命名、移動或刪除 app/components 下的檔案時使用；涵蓋 props、事件、插槽、公開方法、渲染與互動、無障礙、i18n、SSR、清理、樣式 API、sample、docs/components 文件及索引。
---

# 同步元件文件與範例

在同一個任務中維持 `app/components`、`app/pages/sample.vue` 與
`docs/components` 一致。完成所有受影響的實作、範例、文件與驗證後，才將元件任務視為完成。

## 執行流程

1. 讀取根目錄 `AGENTS.md`、目標元件、鄰近實作、現有文件、元件索引與 sample 用法。
2. 列出受影響的公開契約：props、預設值、emits、payload、slots、expose、渲染、互動、樣式 API、a11y、i18n、SSR 與清理。
3. 實作變更並同步 sample、文件與索引。
4. 搜尋過期名稱、路徑、API、語系鍵值與使用範例。
5. 執行適用的 docs consistency、format、lint、typecheck、build 與 diff 檢查。

## 文件路徑

在 `docs/components` 下保留元件的原始目錄，再以不含副檔名的 Vue 檔名建立目錄與
`README.md`。

- `app/components/Accordion.vue` → `docs/components/Accordion/README.md`
- `app/components/counter/Counter.vue` → `docs/components/counter/Counter/README.md`
- `app/components/editor/EditorContent.vue` → `docs/components/editor/EditorContent/README.md`

保留大小寫。重新命名或移動時同步移動文件並修正所有引用；刪除時，除非使用者明確要求封存，否則移除文件、索引項目與過期引用。

## 依變更類型同步

### 新增元件

- 建立對應 `README.md`。
- 更新 `docs/components/README.md`。
- 在 `app/pages/sample.vue` 加入可操作且可編譯的展示案例。
- 記錄完整公開契約、限制、a11y、i18n、SSR 與清理行為。

### 修改或重構元件

- 公開 API、渲染、互動、樣式 API、a11y、i18n 或支援用法變更時，同步更新文件與 sample。
- 純內部重構且現有文件與 sample 仍完全正確時，不製造無意義變更；交付時說明已檢查且無需更新。

### 重新命名、移動或刪除元件

- 同步處理文件路徑、索引、sample、Nuxt 自動匯入名稱與整個 `docs` 內的引用。
- 刪除屬於破壞性操作；確認使用者要求明確包含目標後才執行。

## 文件內容

使用繁體中文並從目前原始碼推導，不得虛構 API。依元件實際情況記錄：

- 用途、有效的原始碼連結與實際 Nuxt 自動匯入名稱。
- 可編譯的基本範例與受控資料流。
- Props、預設值、有效值及 controlled／uncontrolled 行為。
- Emits、payload、slots、slot props 與 expose API。
- 渲染結構、fallback、edge cases、timer、observer 與 cleanup。
- Keyboard、focus、ARIA、reduced motion 與相關 i18n keys。
- 公開樣式 props、Tailwind class 合併及覆寫方式。
- SSR、hydration、browser API 與必要的安全限制。

移除過期內容，不要只在文件末端追加修正。只有元件確實實作 `v-model` 契約時，範例才能使用 `v-model`。

## 維護 sample

- 新增元件時一律加入展示，除非使用者明確要求建立內部元件且不提供 demo。
- 公開行為改變時更新既有展示；展示必須能驗證主要互動、狀態與邊界情況。
- 需要使用者可見或輔助科技文字時，使用現有 i18n 模式與語系鍵值。
- 當頁面、元件或其他 TypeScript 檔案的邏輯較複雜、包含多個功能區塊時，依功能區塊整理
  state、handlers、資料與 side effects；不限於 `app/pages/sample.vue`。每個區塊前使用固定三行
  分隔註解，格式如下：

  ```ts
  //----------------------------
  // accordion
  //----------------------------
  ```

  區塊名稱使用簡短、清楚的功能名稱；簡單檔案或單一功能不必強行加入，也不需要為單一變數或單一函式個別加分隔標示。

- 不加入與目標元件無關的展示或格式重構。

## 驗證

1. 執行 `npm run check:component-docs`。
2. 執行 `npm run check`。
3. 新增元件或改變公開、渲染、互動、Nuxt 或 build 行為時執行 `npm run build`。
4. 使用 `rg` 搜尋過期名稱、路徑、props、events、sample 與 i18n keys。
5. 執行 `git diff --check` 並檢查完整 diff。

若檢查失敗，區分本次變更與既有問題。交付時列出建立或更新的文件與 sample；若不需修改，說明已檢查的內容。
