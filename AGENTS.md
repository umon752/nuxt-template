# AGENTS.md

這是一個使用 Nuxt 4、Vue 3、TypeScript strict mode 與 Tailwind CSS 4 的前端 starter，主要維護可重用元件、composables、sample 與對應文件。

目前提供 `test:unit`、`test:integration` 與 `test` scripts；不要宣稱未實際執行的測試。版本相關行為以目前 dependency、現有實作與官方文件為準。

## 程式碼風格

- 優先使用 guard clause 與 early return，避免過度巢狀的條件判斷。
- 保持主要流程能清楚表達意圖；當實作細節使主要流程不易理解時，請將其抽離。
- 使用 Tailwind CSS class 時，優先採用 Tailwind 內建的 utility class（例如 `p-2`），避免使用 arbitrary value（例如 `p-[8px]`）產生額外 class；只有在 Tailwind 沒有對應的預設 class 時才使用 arbitrary value。
- 當元素的寬度與高度一致時，優先使用 Tailwind `size-*` utility，例如 `size-6`；只有寬高不同或需要個別控制時，才使用 `w-*` 與 `h-*`。
- 當程式碼較複雜且包含多個功能區塊時，依功能區塊整理 `state`、`handlers`、資料與 `side effects`；每個區塊前使用固定三行分隔註解，格式如下：

  ```ts
  //----------------------------
  // cursor state
  //----------------------------
  ```

  此規範適用於 component、page、composable、utils、scripts 等程式碼。區塊名稱使用簡短、清楚的功能名稱；簡單檔案或單一功能不必強行加入，也不需要為單一變數或單一函式個別加上分隔標示。

## 規範路由

只在變更涉及對應領域時讀取：

- TypeScript 型別、API 或共用邏輯：`docs/typescript-guidelines.md`
- Vue component、composable、page 或 Nuxt 設定：`docs/vue-nuxt-guidelines.md`
- 錯誤處理、API failure 或 logging：`docs/error-handling.md`
- 接收 Tailwind class 的 component props：`docs/props-class-guideline.md`
- 明確要求建立 commit：`docs/git-commit-guidelines.md`

若文件與目前程式碼、設定或 dependency 版本不一致，指出差異並以可驗證的 repository 狀態為準。

## Skills

- 建立新元件：使用 `$create-nuxt-component`
- 修改、移動、重新命名或刪除既有元件：使用 `$sync-component-docs`
- 建立新 composable：使用 `$create-nuxt-composable`
- 修改、移動、重新命名或刪除既有 composable：使用 `$sync-composable-docs`
- 使用者明確要求 commit：使用 `$verify-and-commit`

建立類 Skill 會自行載入對應的同步文件 Skill，不需要重複指定。

## 驗證

依變更風險採用最小充分驗證。迭代期間預設不要每次都執行完整測試或 production build，因為這些指令可能啟動 Nuxt runtime 並消耗較多 CPU 與記憶體。

- 快速驗證（迭代預設）：只格式化本次變更檔案，並執行受影響的 docs consistency、targeted unit／component test 或 targeted integration test。純文件、sample 文字或不影響行為的樣式變更，不必啟動整合測試。
- TypeScript、公開 API、SSR、hydration 或 browser API 變更：依風險補跑 typecheck、lint 與受影響測試。
- 完整驗證（交付前、使用者要求，或新增元件／公開契約／Nuxt runtime／production 行為變更）：依適用範圍執行 `npm run check`、`npm run check:docs`、`npm run test` 與 `npm run build`。整合測試也可先以 `npm run test:integration -- <test-file>` targeted 執行，避免迭代時啟動整個 suite。
- Commit 前執行測試時，若測試流程會修改受 Git 管理、可能納入 commit 的檔案、snapshot、fixture 或其他測試內容，必須先停止，回報命令、受影響檔案與預期變更，等待使用者確認後才可執行。格式化、lint、build 與其他非測試命令的內容變更不受此確認規則限制；已被 `.gitignore` 排除且不會納入 commit 的暫存 cache、coverage 或 runtime 產物亦不在此限。
- 靜態輸出相關變更：`npm run generate`
- 最後一律執行 `git diff --check` 並檢查完整 diff

只格式化本次變更的檔案。無法執行或失敗的檢查必須說明原因。

## Process cleanup

- 若啟動 dev server、watcher、test server 或暫時性 Node process，完成任務前停止由 agent 啟動的 process。
- 優先使用一次性 command；除非使用者要求，不使用 watch mode。
- 不終止由 editor 管理的 TypeScript Server、Vue Language Server 或 ESLint process。
- 交付前確認沒有由 agent 啟動的背景 process 殘留。
