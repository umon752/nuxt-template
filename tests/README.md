# 測試說明

本專案目前使用 Vitest、Vue Test Utils、happy-dom 與 `@nuxt/test-utils` 建立元件測試。測試先以高互動元件為範圍，目標是驗證元件公開 API、使用者互動、事件、狀態變化、瀏覽器 API 與清理流程；不以 snapshot 或 Tailwind class 細節作為主要驗證方式。

## 目前範圍

### Unit／component tests

測試位置為 `tests/components`，使用 `happy-dom`。目前已建立以下元件的基礎測試：

- `CountUp`：`run`、`stop`、`start`、`reset`、`restart`、完成事件與零秒動畫。
- `Odometer`：執行、完成、數值更新、上限與無效負值正規化。
- `Counter`：增減按鈕、可輸入模式、步進值、上下限與事件來源。
- `Modal`：ARIA 屬性、公開開關方法、關閉按鈕與 Escape 關閉。
- `Toast`：顯示／隱藏事件、關閉方法與自動關閉計時器。
- `Accordion`：單項展開、多項展開與受控狀態事件。
- `SlideTab`：分類切換與 disabled 項目。
- `StickyAnchor`：錨點切換、區段捲動與無效索引的安全處理。
- `BaseSwiper`：初始化、分頁、上一張／下一張與 loop 導覽委派。
- `ImageLazyLoad`、`VideoLazyLoad`、`IframeLazyLoad`：IntersectionObserver 啟用、媒體載入、錯誤與 fallback 狀態。

目前第一批 unit 測試共 10 個測試檔案、24 個測試案例。測試會使用 fake timers、IntersectionObserver、ResizeObserver、`matchMedia`、dialog 與 media API 的測試替身，避免依賴真實瀏覽器環境。

### Nuxt integration tests

測試位置為 `tests/integration`，使用 Nuxt test environment 與 `happy-dom`。目前以 `/sample` page smoke test 為主，確認：

- Nuxt 自動引入的 `CountUp` 與 `Odometer` 可以在實際 Nuxt runtime 掛載。
- CountUp 的 Run、Stop、Start、Reset、Restart 控制仍能更新頁面事件狀態。
- Odometer 可以透過 sample page 的輸入與按鈕更新數值。
- mount 期間的非預期 `console.warn`、`console.error` 會使測試失敗。

目前 integration 測試共 1 個測試檔案、2 個測試案例。`/about` 是 sample 既有示範資料中的未建立路由，因此該筆固定的 Vue Router warning 會被明確排除；其他 warning 或 error 不會被忽略。

## 如何執行

在專案根目錄執行：

```bash
# 執行快速 unit／component tests
npm run test:unit

# 執行 Nuxt integration tests
npm run test:integration

# 依序執行完整 unit 與 integration tests
npm run test

# 開發時監看 unit tests；integration tests 不放入 watch，避免 feedback 過慢
npm run test:watch

# 統一執行格式、lint、typecheck、文件檢查、完整測試與 production build
npm run verify
```

測試設定分成兩份：

- `vitest.config.ts`：`happy-dom` unit／component tests，只包含 `tests/components/**/*.test.ts`。
- `vitest.integration.config.ts`：Nuxt environment integration tests，只包含 `tests/integration/**/*.test.ts`。

共用的瀏覽器 API 測試替身位於 `tests/setup.ts`；unit mount 使用的 i18n 與 `ClientOnly` 測試環境位於 `tests/unit-setup.ts`。

## 開發與 CI 決策

- 開發期間使用 `npm run test:watch`，只監看快速 unit tests。
- PR 或 push 應執行 `npm run test`，包含 unit 與 integration tests。
- `npm run verify` 統一執行 `check`、`check:docs`、Vitest 與 `build`。
- 不在每次 commit 執行完整 build，避免提交流程過慢。
- 目前尚未建立 CI workflow；後續接入 CI 時，直接使用 `npm run test` 作為 PR／push 測試指令。
- 目前不設定 coverage threshold，也尚未加入 coverage plugin。
- 目前先不建立 E2E／Playwright 測試；瀏覽器級視覺與跨瀏覽器驗證留待後續需求。

## 撰寫測試的原則

- 優先驗證使用者可觀察的行為與元件公開 API，不測試私有 implementation detail。
- 測試事件 payload、ARIA 狀態、鍵盤／按鈕互動、計時器、observer 與 unmount cleanup。
- 每個使用 fake timers 的測試自行建立並在結束時還原，避免污染其他測試。
- 功能失敗時修正實作或測試前提，不用 baseline 或永久 skip 掩蓋失敗。
- 新增或修改元件測試後，至少執行 `npm run test:unit`；涉及 Nuxt runtime、auto-import 或 production 行為時，再執行 `npm run test:integration` 與 `npm run build`。
