# AGENTS.md

本文件適用於整個 repository，整合專案的 JavaScript、TypeScript、Vue/Nuxt 與 Git commit 規範。

## 專案原則

- 維持 TypeScript strict mode 與 Nuxt 產生的 `tsconfig` references。
- 優先考量型別安全、可維護性與既有專案風格。
- 修改應聚焦需求，避免無關重構。
- 提交前執行適用的 typecheck、測試、lint 或 build；若專案尚未提供對應 script，需明確說明。

## 文件索引

- Nuxt AI 參考文件：[docs/nuxt-ai-context.md](docs/nuxt-ai-context.md)
- JavaScript 與非同步程式：[docs/javascript-async.md](docs/javascript-async.md)
- TypeScript 與型別規範：[docs/typescript-guidelines.md](docs/typescript-guidelines.md)
- Vue 3 與 Nuxt：[docs/vue-nuxt-guidelines.md](docs/vue-nuxt-guidelines.md)
- 錯誤處理：[docs/error-handling.md](docs/error-handling.md)
- Git Commit：[docs/git-commit-guidelines.md](docs/git-commit-guidelines.md)
- 提交前檢查：[docs/pre-commit-checklist.md](docs/pre-commit-checklist.md)
