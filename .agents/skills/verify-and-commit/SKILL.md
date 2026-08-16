---
name: verify-and-commit
description: 驗證 repository 或 Git worktree 的變更並建立符合專案規範的 commit。只有使用者明確要求 git commit、提交目前變更、提交全部 worktree，或明確呼叫 $verify-and-commit 時使用；不得因使用者只說完成、好、OK、整理或 review 而自行 stage 或 commit。
---

# 驗證並建立 Commit

只在使用者已明確授權建立 commit 時執行完整的 scope、格式、驗證、diff review、stage 與 commit 流程。不要 push，除非使用者另外明確要求。

## 檢查範圍

1. 讀取目標 repository 的 `AGENTS.md` 與 `docs/git-commit-guidelines.md`。
2. 執行 `git status --short`、確認 branch／worktree，並查看 staged、unstaged 與 untracked files。
3. 以使用者要求決定 commit scope；保留與任務無關的變更，不擅自擴大範圍。
4. 若 scope 不明、包含疑似 secret、`.env`、憑證、衝突、detached HEAD 或其他高風險狀態，先停止並請使用者決定。
5. 若 commit scope 新增或擴充對外功能，執行 feature flag audit：確認功能是否需要可切換啟用；若需要，檢查 `app/config/features.ts` 是否有對應或沿用的 key，並 review UI 入口、page route、server API／資料操作、權限驗證、測試與文件。既有 `account`、`cart` 等 key 的功能擴充必須沿用原 key；若是否需要開關或涵蓋範圍不明，先停止並請使用者決定。

「提交全部變更」可包含目前 worktree 的所有合理變更，但仍須先 review。若使用者要求全部 worktree，逐一檢查並在各自 branch 建立獨立 commit；跳過乾淨的 worktree，不合併不同 worktree 的 diff。

## 格式與驗證

1. 只格式化 commit scope 內的 changed files；不要執行會改寫大量無關檔案的全域格式化。
2. 依 `AGENTS.md` 的驗證矩陣執行適用命令，通常包含 `npm run check`、`npm run check:docs` 與 `git diff --check`。
3. Commit 前執行測試時，確認測試流程是否會修改受 Git 管理、可能納入 commit 的檔案、snapshot、fixture 或其他測試內容；若會修改，先停止並回報命令、受影響檔案與預期變更，等待使用者確認後才可執行。格式化、lint、build 與其他非測試命令的內容變更不受此確認限制；已被 `.gitignore` 排除且不會納入 commit 的暫存 cache、coverage 或 runtime 產物亦不在此限。
4. 新元件、Nuxt config、server route、SSR、build 或 production 行為變更時執行 `npm run build`。
5. 若檢查失敗，修正本次變更造成的問題後重跑；既有或無關失敗必須明確回報，不得假稱通過。
6. 檢查最終 diff，確認沒有 debug code、暫存檔、secret、非預期 generated files 或無關格式變更。

## Stage 與 Commit

1. 使用明確檔案路徑 stage 確認過的 scope；避免在混合 worktree 中盲目執行 `git add -A`。
2. 檢查 `git diff --cached --check`、`git diff --cached --stat` 與 staged diff。
3. 依專案規範產生英文小寫 commit message：`<type>: <imperative verb> <description>`。
4. 使用者已明確要求 commit 時，不因訊息措辭再要求一次確認；但測試內容變更的確認規則與 feature flag audit 例外；scope 或風險有實質歧義時才停下詢問。
5. 建立 commit 後執行 `git status --short`，確認結果並記錄 commit hash。

不得 amend、rebase、reset、刪除 Git lock、push 或改寫歷史，除非使用者明確要求對應操作。遇到 `.git/index.lock` 時，先確認是否有 Git process；不得未經確認直接刪除 lock。

## 回報

列出：

- Commit hash 與 message。
- 實際包含的檔案或 worktree。
- 執行的驗證命令與結果。
- 未執行或失敗的檢查及原因。
- 若涉及對外功能，feature flag audit 的結果與仍未涵蓋的範圍。
- Commit 後仍保留的未提交變更。
