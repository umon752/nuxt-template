# Nuxt Starter Template

以 Nuxt 4、Vue 3、TypeScript strict mode 與 Tailwind CSS 4 建立的網站起始樣板。

內建功能包括：

- `@nuxtjs/i18n` 正體中文語系基礎設定
- sitemap、robots.txt、Schema.org 與 SEO meta
- `nuxt-security` 安全標頭與 CSP
- 響應式導覽、Breadcrumb、Accordion、Pagination 與 Loading 等基礎元件
- 動態 `/site.webmanifest` 與 `/llms.txt`

## 環境需求

- Node.js：以目前 Nuxt 版本要求為準
- 套件管理器：npm（repository 包含 `package-lock.json`）

## 安裝與啟動

```bash
npm install
cp .env.example .env
npm run dev
```

開發伺服器預設位於 `http://localhost:3000`。

請將 `.env` 的 `NUXT_PUBLIC_SITE_URL` 設為部署站台的正式公開網址。執行 production
build 時不要使用 localhost，否則 sitemap、canonical URL、OG URL 與 Schema.org URL 會不正確。

## 常用指令

```bash
npm run dev          # 啟動開發伺服器
npm run build        # 建立 production server bundle
npm run generate     # 產生靜態站台
npm run preview      # 預覽 production build
npm run format       # 寫入 Prettier 格式
npm run format:check # 唯讀檢查格式
npm run lint         # 執行 ESLint
npm run typecheck    # 執行 Nuxt TypeScript 檢查
npm run check        # 依序執行格式、lint 與 typecheck
npm run test:unit    # 執行 unit／component tests
npm run test         # 執行 unit 與 Nuxt integration tests
npm run verify       # 執行完整檢查、測試與 production build
```

目前已導入 Vitest，測試範圍、執行方式與後續 CI 決策請參考
[測試說明](tests/README.md)。

## 專案位置

- `app/pages/`：頁面路由
- `app/components/`：共用 Vue 元件
- `app/composables/`：共用狀態與頁面 SEO／Schema 邏輯
- `app/i18n/locales/`：語系訊息
- `server/api/`：Nitro API
- `server/routes/`：manifest、llms.txt 等 server routes
- `public/`：不經 Vite 處理的公開檔案
- `docs/`：專案程式與 Git 規範

## Starter placeholder

`app/config/site.ts`、翻譯檔、logo、favicon 與 OG image 都是範例內容，建立新專案後應優先替換。預設選單包含桌面與手機版的多層結構示範，所有可點擊項目只連向目前確實存在的 `/` 與 `/sample`；新增頁面時再同步擴充 `server/api/menu.get.ts`。
