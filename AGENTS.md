# AGENTS.md

這是一個使用 Nuxt 4、Vue 3、TypeScript strict mode 與 Tailwind CSS 4 的前端 starter，主要維護可重用元件、composables、sample 與對應文件。

目前沒有 test script；不要宣稱已執行測試。版本相關行為以目前 dependency、現有實作與官方文件為準。

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

- 程式碼變更：`npm run check`
- component、composable 或其文件變更：`npm run check:docs`
- Nuxt config、module、server、元件或 production 行為變更：`npm run build`
- 靜態輸出相關變更：`npm run generate`
- 最後執行 `git diff --check` 並檢查完整 diff

只格式化本次變更的檔案。無法執行或失敗的檢查必須說明原因。
